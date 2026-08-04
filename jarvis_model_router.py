"""Provider-neutral model routing for SummitOS Jarvis.

The router tries explicitly configured providers in order. It never embeds keys,
and it only retries another provider for availability/rate-limit failures.
"""

from __future__ import annotations

import json
import os
import time
from dataclasses import dataclass
from typing import Any

import httpx

_provider_health: dict[str, dict[str, Any]] = {}


def provider_health_snapshot() -> dict[str, dict[str, Any]]:
    now = time.time()
    return {
        name: {
            **state,
            "circuit_open": state.get("cooldown_until", 0) > now,
            "cooldown_seconds": max(0, round(state.get("cooldown_until", 0) - now)),
        }
        for name, state in _provider_health.items()
    }


def _available(provider: str) -> bool:
    return _provider_health.get(provider, {}).get("cooldown_until", 0) <= time.time()


def _success(provider: str, latency_ms: int):
    _provider_health[provider] = {
        "status": "healthy", "failures": 0, "latency_ms": latency_ms,
        "last_success": time.time(), "cooldown_until": 0,
    }


def _failure(provider: str, error: Exception):
    state = _provider_health.setdefault(provider, {"failures": 0})
    state["failures"] = state.get("failures", 0) + 1
    state["status"] = "degraded"
    state["last_error"] = error.__class__.__name__
    state["last_failure"] = time.time()
    if state["failures"] >= int(os.getenv("JARVIS_CIRCUIT_FAILURES", "2")):
        state["cooldown_until"] = time.time() + int(os.getenv("JARVIS_CIRCUIT_COOLDOWN", "60"))


@dataclass
class JarvisModelResult:
    text: str
    provider: str
    model: str


class JarvisProvidersUnavailable(RuntimeError):
    def __init__(self, attempts: list[str]):
        super().__init__("No configured Jarvis model provider was available")
        self.attempts = attempts


def configured_provider_names() -> list[str]:
    requested = os.getenv(
        "JARVIS_PROVIDER_ORDER", "openai,gemini,groq,openrouter,anthropic,ollama"
    )
    return [item.strip().lower() for item in requested.split(",") if item.strip()]


def _openai_messages(system: str, messages: list[dict[str, str]]) -> list[dict[str, str]]:
    return [{"role": "system", "content": system}, *messages]


async def _openai_compatible(
    *, provider: str, base_url: str, api_key: str, model: str,
    system: str, messages: list[dict[str, str]], max_tokens: int,
) -> JarvisModelResult:
    headers = {"Content-Type": "application/json"}
    if api_key:
        headers["Authorization"] = f"Bearer {api_key}"
    if provider == "openrouter":
        headers["HTTP-Referer"] = "https://avastudio.summitvoiceai.com"
        headers["X-Title"] = "SummitOS Jarvis"
    payload = {
        "model": model,
        "messages": _openai_messages(system, messages),
    }
    if provider == "openai":
        payload["max_completion_tokens"] = max_tokens
    else:
        payload["temperature"] = 0.25
        payload["max_tokens"] = max_tokens
    async with httpx.AsyncClient(timeout=75) as client:
        response = await client.post(
            f"{base_url.rstrip('/')}/chat/completions", headers=headers, json=payload
        )
        response.raise_for_status()
        data = response.json()
    text = data["choices"][0]["message"]["content"].strip()
    if not text:
        raise RuntimeError(f"{provider} returned an empty response")
    return JarvisModelResult(text=text, provider=provider, model=model)


async def ask_jarvis_model(
    *, anthropic_client: Any, system: str, messages: list[dict[str, str]],
    max_tokens: int = 1400,
) -> JarvisModelResult:
    attempts: list[str] = []
    for provider in configured_provider_names():
        if not _available(provider):
            attempts.append(f"{provider}: circuit open")
            continue
        started = time.perf_counter()
        try:
            if provider == "openai" and os.getenv("OPENAI_API_KEY"):
                result = await _openai_compatible(
                    provider=provider,
                    base_url="https://api.openai.com/v1",
                    api_key=os.environ["OPENAI_API_KEY"],
                    model=os.getenv("JARVIS_OPENAI_MODEL", "gpt-5-mini"),
                    system=system, messages=messages, max_tokens=max_tokens,
                ); _success(provider, round((time.perf_counter() - started) * 1000)); return result
            if provider == "gemini" and os.getenv("GEMINI_API_KEY"):
                result = await _openai_compatible(
                    provider=provider,
                    base_url="https://generativelanguage.googleapis.com/v1beta/openai",
                    api_key=os.environ["GEMINI_API_KEY"],
                    model=os.getenv("JARVIS_GEMINI_MODEL", "gemini-3.6-flash"),
                    system=system, messages=messages, max_tokens=max_tokens,
                ); _success(provider, round((time.perf_counter() - started) * 1000)); return result
            if provider == "openrouter" and os.getenv("OPENROUTER_API_KEY"):
                result = await _openai_compatible(
                    provider=provider,
                    base_url="https://openrouter.ai/api/v1",
                    api_key=os.environ["OPENROUTER_API_KEY"],
                    model=os.getenv("JARVIS_OPENROUTER_MODEL", "openrouter/auto"),
                    system=system, messages=messages,
                    max_tokens=min(max_tokens, int(os.getenv("JARVIS_OPENROUTER_MAX_TOKENS", "600"))),
                ); _success(provider, round((time.perf_counter() - started) * 1000)); return result
            if provider == "groq" and os.getenv("GROQ_API_KEY"):
                result = await _openai_compatible(
                    provider=provider,
                    base_url="https://api.groq.com/openai/v1",
                    api_key=os.environ["GROQ_API_KEY"],
                    model=os.getenv("JARVIS_GROQ_MODEL", "llama-3.3-70b-versatile"),
                    system=system, messages=messages, max_tokens=max_tokens,
                ); _success(provider, round((time.perf_counter() - started) * 1000)); return result
            if provider == "anthropic" and os.getenv("ANTHROPIC_API_KEY"):
                result = await __import__("asyncio").to_thread(
                    anthropic_client.messages.create,
                    model=os.getenv("JARVIS_ANTHROPIC_MODEL", os.getenv("JARVIS_MODEL", "claude-sonnet-4-6")),
                    max_tokens=max_tokens,
                    system=system,
                    messages=messages,
                )
                text = "".join(
                    block.text for block in result.content
                    if getattr(block, "type", "") == "text"
                ).strip()
                if not text:
                    raise RuntimeError("anthropic returned an empty response")
                output = JarvisModelResult(
                    text=text, provider=provider,
                    model=getattr(result, "model", os.getenv("JARVIS_ANTHROPIC_MODEL", "claude-sonnet-4-6")),
                ); _success(provider, round((time.perf_counter() - started) * 1000)); return output
            if provider == "ollama" and os.getenv("OLLAMA_BASE_URL"):
                result = await _openai_compatible(
                    provider=provider,
                    base_url=f"{os.environ['OLLAMA_BASE_URL'].rstrip('/')}/v1",
                    api_key="ollama",
                    model=os.getenv("JARVIS_OLLAMA_MODEL", "llama3.2:3b"),
                    system=system, messages=messages, max_tokens=max_tokens,
                ); _success(provider, round((time.perf_counter() - started) * 1000)); return result
            attempts.append(f"{provider}: not configured")
        except (httpx.HTTPError, RuntimeError, KeyError, ValueError, json.JSONDecodeError) as exc:
            _failure(provider, exc)
            attempts.append(f"{provider}: {exc.__class__.__name__}")
            continue
        except Exception as exc:  # provider SDK errors vary; fail over safely
            _failure(provider, exc)
            attempts.append(f"{provider}: {exc.__class__.__name__}")
            continue
    raise JarvisProvidersUnavailable(attempts)
