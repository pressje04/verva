import ConfigClientWrapper from '@/components/ConfigClientWrapper';
import Navbar from '@/components/Navbar';

export default function InterviewConfigPage({ params }: { params: { id: string } }) {
  return (
    <>
    <Navbar variant='light'/>
    <div className="min-h-screen flex items-center justify-center bg-white">
      <ConfigClientWrapper outlineId={params.id} />
    </div>
    </>
  );
}
