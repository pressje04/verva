import os
import requests
import openai 
import json

def call_ollama(prompt: str) -> str:
    response = requests.post(
        "http://localhost:11434/api/generate",
        json={"model": "mistral", "prompt": prompt, "stream": True},
        stream=True
    )
    final_response = ""
    for line in response.iter_lines():
        if line:
            chunk = json.loads(line.decode("utf-8"))
            final_response += chunk.get("response", "")
    return final_response

def get_model_response(prompt: str) -> str:
    provider = os.getenv("MODEL_PROVIDER", "ollama")
    if provider == "ollama":
        return call_ollama(prompt)

def stream_ollama_response(prompt: str):
    response = requests.post(
        "http://localhost:11434/api/generate",
        json={"model": "mistral", "prompt": prompt, "stream": True},
        stream=True,
    )

    for line in response.iter_lines():
        if line:
            chunk = json.loads(line.decode("utf-8"))
            yield chunk.get("response", "")