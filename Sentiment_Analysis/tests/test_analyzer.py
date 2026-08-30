import unittest
from app.schemas import LLMExtractedSignals, AnalyzeResponse
from app.scorer import calculate_distress_score
from app.intervention import generate_intervention_recommendation

class TestMentalHealthAnalyzer(unittest.TestCase):

    def test_scoring_positive_sentiment(self):
        signals = LLMExtractedSignals(
            sentiment="positive",
            emotions=["joy", "calm", "gratitude"],
            distress_indicators=[],
            crisis_signals=[],
            context_summary="User had a great weekend and feels refreshed."
        )
        score, breakdown, risk_level, crisis_flag = calculate_distress_score(signals)
        
        self.assertLessEqual(score, 10)
        self.assertEqual(risk_level, "low")
        self.assertFalse(crisis_flag)
        self.assertEqual(breakdown.sentiment_component, 0)
        self.assertLessEqual(breakdown.emotions_component, 0)

    def test_scoring_moderate_stress(self):
        signals = LLMExtractedSignals(
            sentiment="negative",
            emotions=["anxiety", "nervousness"],
            distress_indicators=["academic stress", "overthinking"],
            crisis_signals=[],
            context_summary="User is nervous about impending college exams."
        )
        score, breakdown, risk_level, crisis_flag = calculate_distress_score(signals)
        
        self.assertTrue(26 <= score <= 75)
        self.assertIn(risk_level, ["moderate", "high"])
        self.assertFalse(crisis_flag)
        self.assertEqual(breakdown.sentiment_component, 20)
        self.assertGreater(breakdown.emotions_component, 0)
        self.assertGreater(breakdown.indicators_component, 0)

    def test_scoring_high_distress(self):
        signals = LLMExtractedSignals(
            sentiment="negative",
            emotions=["sadness", "anxiety", "hopelessness"],
            distress_indicators=["social withdrawal", "insomnia", "feelings of worthlessness"],
            crisis_signals=[],
            context_summary="User feeling isolated, unable to sleep, and hopeless."
        )
        score, breakdown, risk_level, crisis_flag = calculate_distress_score(signals)
        
        self.assertGreaterEqual(score, 70)
        self.assertIn(risk_level, ["high", "critical"])
        self.assertFalse(crisis_flag)

    def test_crisis_override(self):
        signals = LLMExtractedSignals(
            sentiment="negative",
            emotions=["hopelessness", "despair"],
            distress_indicators=["wanting to disappear"],
            crisis_signals=["self_harm_ideation"],
            context_summary="User expressed thoughts of self-harm."
        )
        score, breakdown, risk_level, crisis_flag = calculate_distress_score(signals)
        
        self.assertGreaterEqual(score, 80)
        self.assertEqual(risk_level, "critical")
        self.assertTrue(crisis_flag)
        self.assertEqual(breakdown.crisis_bonus, 50)

    def test_intervention_recommendation_tiers(self):
        # Low risk
        rec_low, help_low = generate_intervention_recommendation("low", False, [])
        self.assertTrue("wellness" in rec_low.lower() or "mindfulness" in rec_low.lower())
        self.assertIsNone(help_low)

        # Moderate risk
        rec_mod, help_mod = generate_intervention_recommendation("moderate", False, ["academic stress"])
        self.assertTrue("supportive check-in" in rec_mod.lower() or "peer" in rec_mod.lower())
        self.assertIsNone(help_mod)

        # High risk
        rec_high, help_high = generate_intervention_recommendation("high", False, ["social withdrawal"])
        self.assertIn("counsellor intervention recommended", rec_high.lower())
        self.assertIsNotNone(help_high)

        # Critical risk
        rec_crit, help_crit = generate_intervention_recommendation("critical", True, ["self-harm"])
        self.assertTrue("crisis" in rec_crit.lower() or "immediate" in rec_crit.lower())
        self.assertIsNotNone(help_crit)
        self.assertIn("Tele-MANAS", str(help_crit))

if __name__ == "__main__":
    unittest.main()
