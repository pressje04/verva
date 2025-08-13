'use client';

import { useState } from 'react';

type Props = {
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  next: () => void;
  back: () => void;
};

const levels = ['Novice', 'Intermediate', 'Advanced'];

export default function StepSkillsInput({ formData, setFormData, next, back }: Props) {
  const [skillName, setSkillName] = useState('');
  const [skillLevel, setSkillLevel] = useState('Intermediate');

  const addSkill = () => {
    if (!skillName) return;
    setFormData({
      ...formData,
      skills: [...formData.skills, { name: skillName, level: skillLevel }],
    });
    setSkillName('');
    setSkillLevel('Intermediate');
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-gray-900">Add Your Skills</h2>

      <div className="flex flex-col md:flex-row gap-2">
        <input
          type="text"
          placeholder="e.g. JavaScript"
          value={skillName}
          onChange={(e) => setSkillName(e.target.value)}
          className="flex-1 px-4 py-2 border rounded"
        />
        <select
          value={skillLevel}
          onChange={(e) => setSkillLevel(e.target.value)}
          className="px-4 py-2 border rounded"
        >
          {levels.map((lvl) => (
            <option key={lvl} value={lvl}>{lvl}</option>
          ))}
        </select>
        <button
          type="button"
          onClick={addSkill}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Add
        </button>
      </div>

      <ul className="list-disc pl-6">
        {formData.skills.map((s: any, i: number) => (
          <li key={i}>{s.name} — <span className="text-sm text-gray-500">{s.level}</span></li>
        ))}
      </ul>

      <div className="flex justify-between mt-4">
        <button onClick={back} className="text-gray-600">Back</button>
        <button onClick={next} className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
          Next
        </button>
      </div>
    </div>
  );
}
