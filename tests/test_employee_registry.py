import unittest

from summitos_employee_registry import COMPANY_CONTEXT, EMPLOYEE_REGISTRY, employee_system_prompt


class EmployeeRegistryTests(unittest.TestCase):
    def test_every_employee_has_complete_operating_profile(self):
        required = {"title", "department", "reports_to", "mission", "responsibilities", "metrics", "certifications", "decision_rights", "team", "employment_type", "human_employee"}
        self.assertGreaterEqual(len(EMPLOYEE_REGISTRY), 25)
        for employee_id, profile in EMPLOYEE_REGISTRY.items():
            self.assertTrue(required.issubset(profile), employee_id)
            self.assertGreaterEqual(len(profile["responsibilities"]), 3, employee_id)
            self.assertGreaterEqual(len(profile["metrics"]), 3, employee_id)
            self.assertGreaterEqual(len(profile["certifications"]), 2, employee_id)
            self.assertFalse(profile["human_employee"], employee_id)

    def test_executive_cabinet_and_company_context_are_complete(self):
        for role in ("ceo", "cro", "cmo", "coo", "cto", "cfo", "client_success"):
            self.assertIn(role, EMPLOYEE_REGISTRY)
            self.assertTrue(EMPLOYEE_REGISTRY[role]["team"])
        self.assertIn("Dan Gill III", COMPANY_CONTEXT["principal"])
        self.assertIn("roofing", COMPANY_CONTEXT["icp"].lower())
        self.assertIn("50,000", COMPANY_CONTEXT["goal"])
        self.assertIn("paused", COMPANY_CONTEXT["operating_rule"].lower())

    def test_each_employee_prompt_enforces_identity_truth_and_safety(self):
        for employee_id, profile in EMPLOYEE_REGISTRY.items():
            prompt = employee_system_prompt(employee_id, profile)
            self.assertIn(profile["title"], prompt)
            self.assertIn(profile["mission"], prompt)
            self.assertIn("Dan Gill III", prompt)
            self.assertIn("ICP:", prompt)
            self.assertIn("Automated outreach is paused", prompt)
            self.assertIn("Never pretend to be human", prompt)
