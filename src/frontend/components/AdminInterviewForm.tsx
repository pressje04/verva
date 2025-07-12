/*This form is for admin (me) to add new interviews to the database

More or less an outline for the AI to go off of. 
*/
'use client';
import {useState} from 'react';

export default function AdminInterviewForm() {
    const [form, setForm] = useState({
        title: "",
        role: "",
        type: "Behavioral",
        difficulty: "Medium",
        timeEstimate: "15 min",
        description: "",
        tags: "",
      });

      const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const {name, value} = e.target;
        setForm((prev) => ({...prev, [name]: value}));
      }

      const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        //Essentially our "body" for the api req which contains relevant fields
        //Just have to format our tags a little bit
        const payload = {
            ...form,
            tags: form.tags.split(',').map((tag) => tag.trim())
        };

        const res = await fetch("api/interviews", {
            method: "POST",
            headers: {
                "Content-Type": "application.json",
            },
            body: JSON.stringify(payload),
        });

        //If all is good, reset the form
        if (res.ok) {
            alert("Interview Created")
            setForm({
                title: "",
                role: "", 
                type: "",
                difficulty: "",
                timeEstimate: "",
                description: "",
                tags: "",
            });
        } else {
            alert("Something is missing/went wrong with creation")
        }
      }
      
      return (
        <form onSubmit={handleSubmit} className="text-black max-w-xl mx-auto space-y-4 p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold">📋 Create Interview</h2>
    
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Title"
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
    
          <input
            name="role"
            value={form.role}
            onChange={handleChange}
            placeholder="Role (iOS Dev, SWE Intern, etc)"
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
    
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="Behavioral">Behavioral</option>
            <option value="System Design">System Design</option>
            <option value="Leadership">Leadership</option>
            <option value="Cultural Fit">Cultural Fit</option>
          </select>
    
          <select
            name="difficulty"
            value={form.difficulty}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
    
          <input
            name="timeEstimate"
            value={form.timeEstimate}
            onChange={handleChange}
            placeholder="Time Estimate (15 min, 1 hr)"
            className="w-full p-2 border border-gray-300 rounded"
          />
    
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            rows={4}
            className="w-full p-2 border border-gray-300 rounded"
          />
    
          <input
            name="tags"
            value={form.tags}
            onChange={handleChange}
            placeholder="Tags (comma-separated)"
            className="w-full p-2 border border-gray-300 rounded"
          />
    
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition transform hover:scale-105"
          >
            🚀 Create Interview
          </button>
        </form>
      );
}