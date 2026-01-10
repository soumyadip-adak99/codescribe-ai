from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
import google.generativeai as genai
import re
import os
from dotenv import load_dotenv
import logging
import time  # Import time for sleep

load_dotenv()

app = FastAPI()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

API_KEY = os.getenv("GEMINI_API_KEY")
if not API_KEY:
    logger.error("GEMINI_API_KEY is not set in environment variables")
    raise RuntimeError("GEMINI_API_KEY is not set in environment variables")

genai.configure(api_key=API_KEY)

default_prompt = (
    "Please analyze the following paragraph and detect any offensive, inappropriate, or slang words. "
    "For each detected word, provide:\n"
    "1. The word\n"
    "2. A short explanation of why it's inappropriate\n"
    "Do not suggest any alternatives.\n"
    "If no such content is found, simply reply with: 'All clear. No inappropriate content found.'\n\n"
    "Here is the paragraph:\n\n"
)

@app.get("/")
async def home():
    return {"message": "OK"}

@app.post("/chat")
async def chat(request: Request):
    try:
        data = await request.json()
        user_input = data.get("prompt", "").strip()
        if not user_input:
            raise HTTPException(status_code=400, detail="Prompt is required")

        max_retries = 3
        retry_delay_seconds = 1

        for attempt in range(max_retries):
            try:
                model = genai.GenerativeModel("gemini-1.5-flash")
                full_prompt = default_prompt + user_input
                response = model.generate_content(full_prompt)
                result_text = response.text.strip()

                is_inappropriate = not (
                            "all clear" in result_text.lower() or "no inappropriate content" in result_text.lower())
                words_info = []

                if is_inappropriate:
                    matches = re.findall(
                        r"(?i)(?:word)[:\-]?\s*['\"]?([\w\-]+)['\"]?\s*[\n\-]*.*?explanation[:\-]?\s*(.*?)(?:\n|$)",
                        result_text
                    )
                    for word, explanation in matches:
                        words_info.append({
                            "word": word.strip(),
                            "explanation": explanation.strip()
                        })

                return {
                    "input": user_input,
                    "moderation_result": result_text,
                    "is_inappropriate": is_inappropriate,
                    "flagged_words": words_info
                }

            except Exception as e:
                logger.error(f"Attempt {attempt + 1} failed for chat request: {e}")
                if "503 The model is overloaded" in str(e) or "Timeout" in str(e) and attempt < max_retries - 1:
                    time.sleep(retry_delay_seconds * (2 ** attempt))  # Exponential backoff
                    continue
                raise HTTPException(status_code=500, detail="Internal server error")
        
        raise HTTPException(status_code=500, detail="Failed to process chat request after multiple retries")

    except Exception as e:
        logger.error(f"Unexpected error in chat endpoint: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

if __name__ == '__main__':
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host='0.0.0.0', port=port)