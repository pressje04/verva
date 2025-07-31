'use client';

import InterviewConfigForm from './InterviewConfigForm';

export default function InterviewConfigWrapper({ outlineId }: { outlineId: string }) {
  return <InterviewConfigForm outlineId={outlineId} />;
}
