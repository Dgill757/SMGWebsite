"""Provider-neutral model routing for SummitOS Jarvis.

The router tries explicitly configured providers in order. It never embeds keys,
and it only retries another provider for availability/rate-limit failures.
"""

from __future__ import annotations

import json
import os
from dataclasses import dataclass
from typing import Any

import httpx


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
        "JARVIS_PROVIDER_ORDER", "openrouter,groq,anthropic,ollama"
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
        "temperature": 0.25,
        "max_tokens": max_tokens,
    }
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
        try:
            if provider == "openrouter" and os.getenv("OPENROUTER_API_KEY"):
                return await _openai_compatible(
                    provider=provider,
                    base_url="https://openrouter.ai/api/v1",
                    api_key=os.environ["OPENROUTER_API_KEY"],
                    model=os.getenv("JARVIS_OPENROUTER_MODEL", "openrouter/auto"),
                    system=system, messages=messages, max_tokens=max_tokens,
                )
            if provider == "groq" and os.getenv("GROQ_API_KEY"):
                return await _openai_compatible(
                    provider=provider,
                    base_url="https://api.groq.com/openai/v1",
                    api_key=os.environ["GROQ_API_KEY"],
                    model=os.getenv("JARVIS_GROQ_MODEL", "llama-3.3-70b-versatile"),
                    system=system, messages=messages, max_tokens=max_tokens,
                )
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
                return JarvisModelResult(
                    text=text, provider=provider,
                    model=getattr(result, "model", os.getenv("JARVIS_ANTHROPIC_MODEL", "claude-sonnet-4-6")),
                )
            if provider == "ollama" and os.getenv("OLLAMA_BASE_URL"):
                return await _openai_compatible(
                    provider=provider,
                    base_url=f"{os.environ['OLLAMA_BASE_URL'].rstrip('/')}/v1",
                    api_key="ollama",
                    model=os.getenv("JARVIS_OLLAMA_MODEL", "qwen3:4b"),
                    system=system, messages=messages, max_tokens=max_tokens,
                )
            attempts.append(f"{provider}: not configured")
        except (httpx.HTTPError, RuntimeError, KeyError, ValueError, json.JSONDecodeError) as exc:
            attempts.append(f"{provider}: {exc.__class__.__name__}")
            continue
        except Exception as exc:  # provider SDK errors vary; fail over safely
            attempts.append(f"{provider}: {exc.__class__.__name__}")
            continue
    raise JarvisProvidersUnavailable(attempts)
