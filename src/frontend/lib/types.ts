/* Reusable types*/

//Mainly for interview config
export type InterviewSettings = {
    difficulty: 'easy' | 'medium' | 'hard';
    persona: 'friendly' | 'neutral' | 'challenging' | 'blunt';
    language: 'english' | 'spanish' | 'french';
    cameraEnabled: boolean;
    jobRole?: string;
  };
  