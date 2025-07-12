import os
import requests
import openai 

def call_ollama(prompt: str, model="mistral") -> str:
    response = requests.post('http://localhost:11434/api/generate', json={
        "model": model,
        "prompt": prompt, 
        "stream": False
    })
    return response.json()['response']

def get_model_response(prompt: str) -> str:
    provider = os.getenv("MODEL_PROVIDER", "ollama")
    if provider == "ollama":
        return call_ollama(prompt)