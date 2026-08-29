"""
================================================================================
File: voice_agent/test_voice_agent.py
Description: Unit Test Suite for Aasra Voice Agent and Groq Multimodal Feedback Engine.
Validates spoken response adaptation, distress scoring, and threat escalation.
================================================================================
"""

import unittest
from voice_agent.voice_engine import voice_engine


class TestVoiceAgentEngine(unittest.TestCase):
    """
    Unit tests verifying the Groq AI voice processing and distress evaluation loop.
    """

    def test_routine_voice_turn(self):
        """
        Validates that routine conversation yields empathetic response and low/moderate distress.
        """
        transcript = "I am feeling peaceful today and my family is supporting me well."
        result = voice_engine.process_voice_turn(
            transcript=transcript,
            baseline_dds=30.0,
            language="en"
        )
        self.assertIn("spoken_response", result)
        self.assertTrue(len(result["spoken_response"]) > 10)
        self.assertIn(result["risk_tier"], ["Low", "Moderate"])
        self.assertLessEqual(result["dds_score"], 45.0)

    def test_threat_escalation_and_response_modification(self):
        """
        Validates that reported threats trigger high/critical distress and protection recommendations.
        """
        transcript = "Unknown people came to our house yesterday giving threats to withdraw the complaint. I feel terrified."
        result = voice_engine.process_voice_turn(
            transcript=transcript,
            baseline_dds=34.0,
            reported_threat=True,
            language="en"
        )
        self.assertIn("spoken_response", result)
        self.assertIn(result["risk_tier"], ["High", "Critical"])
        self.assertGreaterEqual(result["dds_score"], 60.0)
        has_protection = any("Protection" in r["service"] or "15A" in r["service"] for r in result["recommended_interventions"])
        self.assertTrue(has_protection)


if __name__ == "__main__":
    unittest.main()
