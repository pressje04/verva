'use client'

import { useState } from 'react'

export default function AvaForm() {
  const [file, setFile] = useState<File | null>(null)
  const [job, setJob] = useState('')
  const [feedback, setFeedback] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (!file || !job.trim()) {
      setError('Please upload a resume and enter a job description.')
      return
    }

    const formData = new FormData()
    formData.append('file', file)
    formData.append('job', job)

    setLoading(true)
    setError('')
    setFeedback('')

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/analyze`, {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        throw new Error(`Request failed: ${res.status}`)
      }

      const data = await res.json()
      setFeedback(data.feedback || 'No feedback returned.')
    } catch (err) {
      console.error(err)
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-xl rounded-xl space-y-5">
      <h1 className="text-2xl font-bold text-center text-gray-800">Ava AI – Resume Analyzer</h1>

      <input
        type="file"
        accept=".pdf"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="block w-full text-sm text-gray-600"
      />

      <textarea
        value={job}
        onChange={(e) => setJob(e.target.value)}
        rows={6}
        placeholder="Paste the job description here..."
        className="w-full p-3 border border-gray-300 rounded-md text-sm"
      />

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-black text-white font-semibold py-2 px-4 rounded hover:bg-gray-800"
      >
        {loading ? 'Analyzing with Ava...' : 'Analyze with Ava'}
      </button>

      {feedback && (
        <div className="mt-6 p-4 bg-gray-50 border rounded-md whitespace-pre-wrap text-sm text-gray-800">
          <h2 className="text-lg font-semibold mb-2">Ava’s Feedback</h2>
          <pre>{feedback}</pre>
        </div>
      )}
    </div>
  )
}
