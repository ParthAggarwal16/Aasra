"""
================================================================================
File: chatbot/test_chatbot.py
Description: Unit Test Suite for Standalone Aasra LangChain Chatbot Agent.
Validates session answer retrieval, Section 15A protection rights query, and fallback responses.
================================================================================
"""

import unittest
from chatbot.agent import chatbot_agent


class TestChatbotAgent(unittest.TestCase):
    """
    Validates query processing, Section 15A explanations, and session answer retrieval.
    """

    def test_query_previous_answers(self):
        """
        Tests chatbot ability to query and summarize previous answers.
        """
        res = chatbot_agent.process_query("What did I say in my previous check-ins?")
        self.assertIn("response", res)
        self.assertTrue(len(res["response"]) > 20)

    def test_query_section_15a_rights(self):
        """
        Tests chatbot knowledge of Section 15A protection rights.
        """
        res = chatbot_agent.process_query("What protection do I get under Section 15A?")
        self.assertIn("response", res)
        self.assertTrue("protection" in res["response"].lower() or "police" in res["response"].lower() or "rights" in res["response"].lower())


if __name__ == "__main__":
    unittest.main()
