'use client';

import Link from "next/link";
import Navbar from "./Navbar";

export default function StepWelcome({ next }: { next: () => void }) {
  return (
    <>
      <div className="flex flex-col items-center text-center space-y-6">
        <h2 className="text-3xl font-bold text-gray-900">Welcome to Verva 👋</h2>
        <p className="text-gray-600 max-w-md">
          We're here to help you prepare for interviews, track your growth, and get the job you deserve — powered by AI.
        </p>
        <p className="text-gray-500 text-sm">
          Let's get started by creating your profile. It only takes a minute.
        </p>

        <button
          onClick={next}
          className="mt-6 px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
        >
          Begin
        </button>

        <div className="text-center text-black flex space-x-2">
        <p className="text-gray">Already have an account? </p>
        <Link 
          href="/login"
          className="text-blue-500 hover:underline"
        >Log in here</Link>
        </div>
      </div>
    </>
  );
}
