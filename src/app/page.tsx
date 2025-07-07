import Navbar from "@/components/Navbar";
import Image from "next/image";

export default function Home() {
  return (
    <div className="landing-background h-screen w-full flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col px-16 text-center justify-center items-center">
        <h1 className="font-medium text-center text-6xl mb-6 mx-auto max-w-l">
          Change the way you prepare for interviews forever 
        </h1>
        <p className="font-semibold mx-auto max-w-xl mb-8 text-gray-300">Verva is eliminating the barriers to your dream job.
           No overpriced coaches. No elite networks. Just smart, 
           personalized interview prep and career guidance built for everyone. 
        </p>

        <div className="flex flex-row justify-between">
          <button className="flex bg-black border-black btn-primary">
            Reinvent your career
          </button>
        </div>
      </div>

        <section className="bg-white py-12">
          <div className="flex flex-col items-center text-center justify-center">
            <h2 className="text-gray-500 text-xl mb-4">We're leaving mindless applications behind</h2>
            <h1 className="flex mb-8 text-center text-black text-4xl justify-center">
                Feel the difference and get hired
            </h1>

            <h3 className="text-gray-500 font-semibold">

            </h3>
          </div>

        </section>
    </div>
  );
}
