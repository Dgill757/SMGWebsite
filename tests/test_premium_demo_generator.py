import unittest
import asyncio
from unittest.mock import AsyncMock, patch

from premium_website_generator_v2 import generate_world_class_roofing_site, validate_demo_html
from ava_demo_studio_api import deploy_to_vercel


def _brand(**overrides):
    data = {
        "company_name": "Summit Roofing",
        "city": "Tulsa",
        "state": "OK",
        "phone": "(918) 555-0188",
        "services": ["Roof Replacement", "Storm Damage Repair", "Roof Inspections"],
        "source_images": ["https://assets.example.com/real-roof.webp"],
        "testimonials": [],
    }
    data.update(overrides)
    return data


class PremiumDemoGeneratorTests(unittest.TestCase):
    def test_vercel_returns_public_production_domain_not_protected_deployment_url(self):
        response = AsyncMock()
        response.status_code = 200
        response.content = b'{}'
        response.json = lambda: {"url": "summit-demo-acme-randomhash.vercel.app"}
        client = AsyncMock()
        client.__aenter__.return_value.post.return_value = response
        with patch("ava_demo_studio_api.httpx.AsyncClient", return_value=client):
            url = asyncio.run(deploy_to_vercel("acme", "<html></html>"))
        self.assertEqual(url, "https://summit-demo-acme.vercel.app")
    def test_demo_passes_quality_gate_without_invented_proof(self):
        brand = _brand()
        document = generate_world_class_roofing_site(brand)
        result = validate_demo_html(document, brand)
        self.assertTrue(result["passed"])
        self.assertEqual(result["score"], 100)
        for forbidden in ("A+ BBB", "$50K Guarantee", "Michael T.", "Licensed & Insured", "within 1 hour"):
            self.assertNotIn(forbidden, document)

    def test_demo_uses_real_assets_logo_and_verified_testimonial(self):
        brand = _brand(
            logo_url="https://assets.example.com/company-logo.png",
            testimonials=[{"quote": "They kept the site clean.", "name": "Verified customer"}],
        )
        document = generate_world_class_roofing_site(brand)
        self.assertIn("company-logo.png", document)
        self.assertIn("real-roof.webp", document)
        self.assertIn("They kept the site clean.", document)
        self.assertIn("Verified customer", document)

    def test_demo_supports_all_design_directions_and_accessibility_controls(self):
        for direction in ("premium-modern", "bold-editorial", "heritage-trust"):
            document = generate_world_class_roofing_site(_brand(design_direction=direction))
            self.assertIn(f'<body class="{direction}">', document)
            self.assertIn("prefers-reduced-motion", document)
            self.assertIn('aria-controls="mobileMenu"', document)
            self.assertIn("Concept mode: this form does not transmit", document)
