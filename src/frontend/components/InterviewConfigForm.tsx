'use client';

import {useState} from 'react';
import { useRouter } from 'next/navigation';
import type { InterviewSettings } from '@/lib/types';

export default function InterviewConfigForm(
  {outlineId}: {outlineId: string}
) {
    const router = useRouter();

    const [formData, setFormData] = useState<InterviewSettings>({
        difficulty: 'medium',
        persona: 'neutral',
        language: 'english',
        cameraEnabled: false,
        jobRole: "",
    });

    const [loading, setLoading] = useState(false);

    //What happens when the user clicks a new field? Re-render
    const handleChange = (field: keyof InterviewSettings, value: any) => {
        setFormData((prev) => ({...prev, [field]: value}));
    }

    //When user submits the form
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/interviews/create', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                  outlineId,
                  settings: formData
                }),
            });

            if (!res.ok) {
                throw new Error('Failed to create an interview session from form');
            }

            const {sessionId} = await res.json();
            router.push(`/interviews/${sessionId}`);
        } catch (error) {
            console.error('Error:', error);
            alert("Something went wrong. Please try again")
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="text-black space-y-6 max-w-lg mx-auto mt-8 bg-white backdrop-blur p-6 rounded-2xl border border-white/20 shadow-md">
          <h2 className="text-2xl font-semibold text-center">Customize Your Interview</h2>
    
          {/* Difficulty */}
          <label className="block">
            <span className="text-sm font-medium">Difficulty</span>
            <select
              value={formData.difficulty}
              onChange={(e) => handleChange('difficulty', e.target.value as InterviewSettings['difficulty'])}
              className="w-full mt-1 p-2 rounded bg-white/5 border border-white/20"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </label>
    
          {/* Persona */}
          <label className="block">
            <span className="text-sm font-medium">Interviewer Style</span>
            <select
              value={formData.persona}
              onChange={(e) => handleChange('persona', e.target.value as InterviewSettings['persona'])}
              className="w-full mt-1 p-2 rounded bg-white/5 border border-white/20"
            >
              <option value="friendly">Friendly</option>
              <option value="neutral">Neutral</option>
              <option value="challenging">Challenging</option>
              <option value="blunt">Blunt</option>
            </select>
          </label>
    
          {/* Language */}
          <label className="block">
            <span className="text-sm font-medium">Language</span>
            <select
              value={formData.language}
              onChange={(e) => handleChange('language', e.target.value as InterviewSettings['language'])}
              className="w-full mt-1 p-2 rounded bg-white/5 border border-white/20"
            >
              <option value="english">English</option>
              <option value="spanish">Spanish</option>
              <option value="french">French</option>
            </select>
          </label>
    
          {/* Job Role */}
          <label className="block">
            <span className="text-sm font-medium">Job Role (optional)</span>
            <input
              type="text"
              value={formData.jobRole}
              onChange={(e) => handleChange('jobRole', e.target.value)}
              placeholder="e.g. Software Engineer at Google"
              className="w-full text-black mt-1 p-2 rounded bg-white/5 border border-white/20"
            />
          </label>
    
          {/* Camera Toggle */}
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={formData.cameraEnabled}
              onChange={(e) => handleChange('cameraEnabled', e.target.checked)}
              className="h-4 w-4"
            />
            <span>Enable camera (may affect score)</span>
          </label>
    
          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition"
          >
            {loading ? 'Starting Interview...' : 'Start Interview'}
          </button>
        </form>
      );
}