'use client'

import { useState } from "react"

export default function ChatInput({ onSend }: { onSend: (msg: string) => void }) {
  const [input, setInput] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    onSend(input)
    setInput("")
  }

  return (
    <form onSubmit={handleSubmit} className="fixed bottom-0 w-full px-4 py-3 bg-background border-t border-gray-800">
      <div className="max-w-4xl mx-auto flex gap-2">
        <input
          type="text"
          className="flex-1 px-4 py-2 rounded-md bg-gray-800 text-white outline-none"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Ava anything..."
        />
        <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition">
          Send
        </button>
      </div>
    </form>
  )
}
