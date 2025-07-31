'use client'

import { useState } from 'react'
import ChatMessage from './ChatMessage'
import ChatInput from './ChatInput'
import Navbar from '@/components/Navbar'
import ReactMarkdown from 'react-markdown'

export default function AvaChatPage() {
  const [messages, setMessages] = useState<{ role: 'user' | 'ava'; text: string }[]>([])
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [text, setText] = useState("")
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [streamedText, setStreamedText] = useState("")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!resumeFile && !text.trim()) return

    setLoading(true)
    setStreamedText("")
    setMessages([{ role: 'user', text: "Here’s my resume and the job I’m applying to." }])

    const formData = new FormData()
    if (resumeFile) {
      formData.append("file", resumeFile)
    }
    formData.append("user_text", text)
    formData.append("history", JSON.stringify(messages))
    //setMessages(prev => [...prev, {role: "ava", text: fullText}])

    let fullText = ""
    try {
      const res = await fetch("http://localhost:8000/chat", {
        method: "POST",
        body: formData,
      })

      if (!res.body) throw new Error("No response body")

      const reader = res.body.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        fullText += chunk
        setStreamedText((prev) => {
          const updated = prev + chunk
          // Live update the last Ava message
          setMessages((prevMessages) => {
            const updatedMessages = [...prevMessages]
            const lastIndex = updatedMessages.findLastIndex((msg) => msg.role === "ava")
            if (lastIndex !== -1) {
              updatedMessages[lastIndex] = { role: "ava", text: updated }
            } else {
              updatedMessages.push({ role: "ava", text: updated })
            }
            return updatedMessages
          })
          return updated
        })
      }

      setSubmitted(true)
    } catch (err) {
      console.error("Error streaming response:", err)
      setMessages(prev => [...prev, { role: "ava", text: "Something went wrong during analysis." }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <div className="flex-1 space-y-6 overflow-y-auto max-w-4xl mx-auto py-10">
  {messages.map((msg, idx) => (
    <ChatMessage key={idx} role={msg.role} text={msg.text} />
  ))}
  {loading && (
    <div className="bg-gray-800 text-white px-4 py-3 rounded-md animate-pulse">
      <ReactMarkdown>{streamedText}</ReactMarkdown>
    </div>
  )}
</div>

{/* Chat Input Area */}
<div className="fixed bottom-0 left-0 right-0  bg-black px-6 py-4">
  <div className="max-w-4xl mx-auto flex items-center gap-4">
    {/* Upload button */}
    <label className="px-4 py-2 rounded-full cursor-pointer bg-gray-800 p-3 rounded-full hover:bg-gray-700 transition">
      <input
        type="file"
        accept=".pdf"
        className="hidden"
        onChange={handleFileChange}
      />
      <span className="text-white text-xl font-bold">+</span>
    </label>

    {/* Textarea */}
    <textarea
      value={text}
      onChange={(e) => setText(e.target.value)}
      placeholder="Type your message here..."
      className="flex-grow resize-none bg-gray-800 text-white p-3 rounded-md h-14"
    />

    {/* Send button */}
    <button
      onClick={handleSubmit}
      disabled={loading || (!resumeFile && !text.trim())}
      className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-md transition disabled:opacity-50"
    >
      Send
    </button>
  </div>
</div>
</>
  )
}
