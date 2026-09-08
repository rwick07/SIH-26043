import os
import json
import logging
from google import genai
from google.genai import types
from dotenv import load_dotenv

load_dotenv()
logger = logging.getLogger(__name__)
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

ALLOWED_CATEGORIES = [
    "roads", "water", "electricity", "sanitation",
    "public_safety", "environment", "healthcare", "education", "other"
]
ALLOWED_PRIORITIES = ["low", "medium", "high", "critical"]

SYSTEM_PROMPT = f"""You are a civic problem triage assistant for JanSetu, a platform where citizens in India report community problems.

Return ONLY valid JSON matching this schema:
{{
  "category": one of {ALLOWED_CATEGORIES},
  "priority": one of {ALLOWED_PRIORITIES},
  "summary": a neutral one-sentence summary (max 25 words),
  "keywords": a list of 3-6 short keywords,
  "reason": a short explanation (max 20 words) for the priority chosen
}}

Rules:
- Use only the exact category/priority values listed above.
- Base priority on urgency and safety risk, not on how dramatically it's written.
- Reports may be in Hindi, Hinglish, or a regional language — still classify correctly, respond in English.
- Never invent facts not present in the report."""


def classify_problem(title: str, description: str) -> dict | None:
    """Returns a dict matching the schema above, or None if the call fails."""
    try:
        response = client.models.generate_content(
            model="gemini-3.6-flash",
            contents=f"Title: {title}\n\nDescription: {description}",
            config=types.GenerateContentConfig(
                system_instruction=SYSTEM_PROMPT,
                response_mime_type="application/json",
                temperature=0.2,
            ),
        )
        data = json.loads(response.text)

        if data.get("category") not in ALLOWED_CATEGORIES:
            data["category"] = "other"
        if data.get("priority") not in ALLOWED_PRIORITIES:
            data["priority"] = "medium"

        return data
    except Exception as e:
        logger.error(f"AI classification failed: {e}")
        return None


def get_embedding(text: str) -> list[float] | None:
    """Returns a 768-dimension embedding vector, or None if the call fails."""
    try:
        response = client.models.embed_content(
            model="gemini-embedding-001",
            contents=text,
            config=types.EmbedContentConfig(output_dimensionality=768),
        )
        return response.embeddings[0].values
    except Exception as e:
        logger.error(f"Embedding failed: {e}")
        return None


def generate_solution(current_problem: dict, similar_problems: list[dict]) -> dict | None:
    """
    current_problem: {"title": str, "description": str, "category": str}
    similar_problems: list of {"title": str, "description": str, "status": str}
    Returns {"pattern_note": str, "solution": str} or None if the call fails.
    """
    try:
        similar_text = "\n".join(
            f"- {p['title']}: {p['description'][:150]}" for p in similar_problems
        ) or "No similar past reports found."

        prompt = f"""Current report:
Title: {current_problem['title']}
Description: {current_problem['description']}
Category: {current_problem['category']}

Similar past reports in this category:
{similar_text}

Respond with ONLY JSON:
{{
  "pattern_note": "one sentence: is this recurring/widespread or isolated, and why (max 30 words)",
  "solution": "a concrete, practical action for the responsible department (max 40 words)"
}}"""

        response = client.models.generate_content(
            model="gemini-3.6-flash",
            contents=prompt,
            config=types.GenerateContentConfig(
                system_instruction="You are a civic infrastructure problem-solving assistant. Be specific, not generic.",
                response_mime_type="application/json",
                temperature=0.3,
            ),
        )
        return json.loads(response.text)
    except Exception as e:
        logger.error(f"Solution generation failed: {e}")
        return None