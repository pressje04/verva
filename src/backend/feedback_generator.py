from model_router import get_model_response

"""
Function that generates a response using a set prompt depending on input
"""
def generate_response(user_text: str = "", file_text: str = "", return_prompt: bool = False) -> str:
    if file_text and user_text:
        prompt = (
    f"You are Ava AI, a brutally honest but encouraging career coach.\n\n"
    f"Here is a document the user provided:\n{file_text}\n\n"
    f"The user asks:\n{user_text}\n\n"
    "Generate your response using GitHub-flavored markdown.\n"
    "Follow this **exact structure** with emoji headers and two newlines between each section:\n\n"
    "✅ **Strengths**\n"
    "- [Write one strength per line as a bullet]\n\n"
    "❌ **Weaknesses**\n"
    "- [Write one weakness per line as a bullet]\n\n"
    "📝 **Advice**\n"
    "- [Write one actionable tip per line. Use 'Add', 'Improve', 'Tailor', etc.]\n\n"
    "📊 **Score**\n"
    "**Current Fit**: X/10  \n"
    "**With Improvements**: Y/10\n\n"
    "Stick to this format. Do not include any additional commentary or sections."
)



    elif file_text:
        prompt = (
            f"You are Ava AI, a brutally honest but encouraging career coach.\n\n"
            f"Please analyze this document:\n{file_text}\n\n"
            "Provide detailed, constructive feedback as if reviewing a resume or job description.\n"
            "Format your entire response using valid GitHub-flavored Markdown.\n"
                "- Use `**bold**` for emphasis.\n"
                "- Use `*` for bullet points (not `-`).\n"
                "- Use proper headers like `##` or `###` for section titles.\n"
                "- Use line breaks (`\n`) between bullets and paragraphs.\n"
                "- Avoid raw HTML or inline styles.\n"
        )

    elif user_text:
        prompt = (
            f"You are Ava AI, a brutally honest but encouraging career coach.\n\n"
            f"The user asks:\n{user_text}\n\n"
            "Give thoughtful, specific advice — no fluff.\n"
            "Format your entire response using valid GitHub-flavored Markdown.\n"
                "- Use `**bold**` for emphasis.\n"
                "- Use `*` for bullet points (not `-`).\n"
                "- Use proper headers like `##` or `###` for section titles.\n"
                "- Use line breaks (`\n`) between bullets and paragraphs.\n"
                "- Avoid raw HTML or inline styles.\n"
        )

    else:
        return "Please upload a file or enter a message."

    if return_prompt:
        return prompt

    return get_model_response(prompt)

"""
Function to help build out message history for the chatbot
"""
def build_chat_prompt(messages: list[dict]) -> str:
    prompt = "You are Ava AI, a brutally honest but encouraging career coach.\n\n"
    for msg in messages:
        role = "User" if msg["role"] == "user" else "Ava"
        prompt += f"{role}: {msg['text']}\n"
    prompt += "Ava:"
    return prompt
