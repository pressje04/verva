import AdminInterviewForm from "@/components/AdminInterviewForm";
import InterviewList from "@/components/InterviewList";
import Navbar from "@/components/Navbar";

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