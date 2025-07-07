import Navbar from "@/components/Navbar"

export default function AboutPage() {
    return (
        <>
        <Navbar />
        <div className="landing-background w-full h-screen flex flex-col">
            <div className="flex-1 mt-24 text-center justify-center">
                <h1 className="flex justify-center text-4xl items-center text-center"></h1>
            </div>
        </div>

        <section className="bg-white py-20">
            <h1 className="flex mb-8 text-center text-black text-4xl justify-center">
                Feel the difference and get hired
            </h1>

            <p className="text-gray-500 font-semibold">

            </p>

        </section>
        </>
    )
}