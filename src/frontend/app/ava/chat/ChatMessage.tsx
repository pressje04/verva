import ReactMarkdown from 'react-markdown'

export default function ChatMessage({ role, text }: { role: "ava" | "user"; text: string }) {
    const isUser = role === "user"
    return (
      <div className={`flex mt-8 ${isUser ? "justify-end" : "justify-start"}`}>
        <div className={`max-w-xl ${isUser ? "px-4 py-2 rounded-lg bg-indigo-500 text-white" : "text-white"}`}>
          {isUser ? text : <ReactMarkdown>{text}</ReactMarkdown>}
        </div>
      </div>
    )
  }
  