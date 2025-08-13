'use client';

import { useState } from 'react';

type Props = {
  formData: any;
  onClose: () => void;
  back: () => void;
};

export default function StepConfirm({ formData, onClose, back }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    const body = new FormData();
    body.append('username', formData.username);
    body.append('fullName', formData.fullName);
    body.append('email', formData.email);
    body.append('password', formData.password);
    body.append('resume', formData.resumeFile);
    body.append('skills', JSON.stringify(formData.skills));

    const res = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({
        username: formData.username,
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        resumeUrl: null, // you'll update this with resume storage
        skills: formData.skills,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || 'Something went wrong');
    } else {
      onClose(); // Close modal
    }

    setLoading(false);
  };

  return (
    <div className="space-y-4 text-center">
      <h2 className="text-2xl font-bold text-gray-900">Ready to go?</h2>
      <p className="text-gray-600">We’ll set up your profile and get you started with AI-powered interview prep.</p>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="flex justify-between mt-6">
        <button onClick={back} className="text-gray-600">Back</button>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700"
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>
      </div>
    </div>
  );
}
