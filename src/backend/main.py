from fastapi import FastAPI, UploadFile, Form
from resume_parser import parse_pdf
from feedback_generator import generate_feedback
from dotenv import load_dotenv

load_dotenv()
app = FastAPI()

@app.post("/analyze")
async def analyze_resume(file: UploadFile, job: str = Form(...)):
    resume_text = parse_pdf(file)
    feedback = generate_feedback(resume_text, job)
    return {"feedback": feedback}