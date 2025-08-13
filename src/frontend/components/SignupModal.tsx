'use client';

import { useState } from 'react';
import StepWelcome from './StepWelcome';
import StepAccountInfo from './StepAccountInfo';
import StepResumeUpload from './StepResumeUpload';
import StepSkillsInput from './StepSkillsInput';
import StepConfirm from './StepConfirm';

export default function SignupModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0);

  // Shared form data across steps
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    resumeFile: null as File | null,
    skills: [] as { name: string; level: string }[],
  });

  const next = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const steps = [
    <StepWelcome next={next} />,
    <StepAccountInfo formData={formData} setFormData={setFormData} next={next} back={back} />,
    <StepResumeUpload formData={formData} setFormData={setFormData} next={next} back={back} />,
    <StepSkillsInput formData={formData} setFormData={setFormData} next={next} back={back} />,
    <StepConfirm formData={formData} onClose={onClose} back={back} />,
  ];

  return (
    <div className="fixed bg-white inset-0 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl p-8 w-full max-w-xl shadow-xl">
        {steps[step]}
      </div>
    </div>
  );
}
