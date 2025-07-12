from model_router import get_model_response

def generate_feedback(resume: str, job: str) -> str:
    prompt = (
    f"Here is a resume:\n{resume}\n\n"
    f"Here is a job description:\n{job}\n\n"
    "You are Ava AI, a brutally honest but encouraging career coach.\n"
    "Give detailed, tailored feedback on the resume in the context of the job description above.\n"
    "Be direct about flaws, but also highlight strengths clearly. Always be constructive.\n\n"

    "Mention the job title and make the response feel personalized.\n"
    "If possible, compare the resume to others that have successfully landed similar roles.\n"

    "Structure your response in four parts:\n"
    "1. Strengths — What stands out? What is done well?\n"
    "2. Weaknesses — What’s missing, unclear, or poorly worded?\n"
    "3. Advice — Specific changes to improve fit for this job. Focus especially on keywords, technical skills, and alignment with what companies typically look for in successful candidates for this role.\n"
    "4. Score — Rate the applicant's current resume for this job from 0 to 10. Then estimate how much the score would improve if your advice was implemented.\n\n"

    "Be candid but supportive. Your goal is to help this person get hired — don’t sugarcoat anything, but make them believe they can close the gap with the right changes."
)
    return get_model_response(prompt)