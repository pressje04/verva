import AdminInterviewForm from "@/frontend/components/AdminInterviewForm";
import InterviewList from "@/frontend/components/InterviewList";
import Navbar from "@/frontend/components/Navbar";

export default function InterviewsPage() {
    return (
        <div className="bg-white h-screen">
            <Navbar variant="light" />
            <div className="flex flex-center justify-center text-center">
                <InterviewList/>
            </div>
        </div>
    )
}