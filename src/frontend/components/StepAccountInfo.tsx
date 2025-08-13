'use client';

import { useState } from 'react';

type Props = {
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  next: () => void;
  back: () => void;
};

export default function StepAccountInfo({ formData, setFormData, next, back }: Props) {
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = () => {
    const { username, fullName, email, password, confirmPassword } = formData;
    if (!username || !fullName || !email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setError('');
    next();
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-black">Create your account</h2>

      <input
        name="username"
        placeholder="Username"
        value={formData.username}
        onChange={handleChange}
        className="w-full px-4 py-2 text-black border rounded"
      />
      <input
        name="fullName"
        placeholder="Full Name"
        value={formData.fullName}
        onChange={handleChange}
        className="w-full px-4 py-2 border rounded"
      />
      <input
        name="email"
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        className="w-full px-4 py-2 border rounded"
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        className="w-full px-4 py-2 border rounded"
      />
      <input
        name="confirmPassword"
        type="password"
        placeholder="Confirm Password"
        value={formData.confirmPassword}
        onChange={handleChange}
        className="w-full px-4 py-2 border rounded"
      />

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="flex justify-between mt-4">
        <button onClick={back} className="text-gray-600">Back</button>
        <button onClick={handleNext} className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
          Next
        </button>
      </div>
    </div>
  );
}
