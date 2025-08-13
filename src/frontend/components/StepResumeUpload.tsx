'use client';

type Props = {
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  next: () => void;
  back: () => void;
};

export default function StepResumeUpload({ formData, setFormData, next, back }: Props) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFormData({ ...formData, resumeFile: e.target.files[0] });
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-gray-900">Upload Your Resume</h2>
      <p className="text-gray-600 text-sm">PDF or DOCX files only. This will help us recommend interviews later!</p>

      <input
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={handleFileChange}
        className="w-full"
      />

      {formData.resumeFile && (
        <p className="text-green-600 text-sm">Selected: {formData.resumeFile.name}</p>
      )}

      <div className="flex justify-between mt-4">
        <button onClick={back} className="text-gray-600">Back</button>
        <button onClick={next} className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
          Next
        </button>
      </div>
    </div>
  );
}
