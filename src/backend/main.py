from fastapi import FastAPI, UploadFile, Form, File, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from feedback_generator import generate_response, build_chat_prompt
from resume_parser import parse_pdf
import json
from typing import List, Optional
from model_router import stream_ollama_response

import io

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or ["http://localhost:3000"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/chat")
async def chat(
    request: Request,
    file: Optional[UploadFile] = File(None),
    user_text: str = Form(""),
):
    form = await request.form()
    history_raw = form.get("history", "[]")
    try:
        history = json.loads(history_raw)
    except json.JSONDecodeError:
        history = []

    resume_text = ""
    if file:
        resume_text = parse_pdf(file)

    # Append resume if uploaded
    if resume_text:
        user_text += f"\n\n(Resume Context):\n{resume_text}"

    history.append({"role": "user", "text": user_text})
    prompt = build_chat_prompt(history)

    def markdown_stream():
        for chunk in stream_ollama_response(prompt):
            yield chunk

    return StreamingResponse(markdown_stream(), media_type="text/markdown")