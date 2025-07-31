import Navbar from "@/components/Navbar";

export default function AvaLandingPage() {
  return (
    <>
        <div className="relative z-20">
            <Navbar/>
        </div>
      <div className="min-h-screen landing-background text-white flex items-center justify-center relative z-0 px-32">
  <div className="max-w-6xl w-full flex flex-col md:flex-row items-center justify-between">
    {/* Left side */}
    <div className="flex-1">
      <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
        Let Ava Guide Your Career
      </h1>
      <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-lg">
        The only AI coach that gives you honest, actionable feedback — no fluff.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <a
          href="/ava/chat"
          className="px-6 py-3 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition"
        >
          Chat with Ava
        </a>
        <button className="px-6 py-3 border border-white rounded-lg hover:bg-white/10 transition">
          Learn more
        </button>
      </div>
    </div>

    {/* Right orb */}
    <div className="flex-1 hidden md:flex justify-center">
      <img
        src="/ava-orb.png"
        alt="Ava Orb"
        className="animate-pulse opacity-80 rounded-full object-contain 
        animate-pulse drop-shadow-[0_0_30px_rgba(131,58,180,0.5)] 
        hover:scale-105 hover:drop-shadow-[0_0_50px_rgba(253,29,29,0.5)] 
        transition-transform duration-500 ease-in-out" 
        style={{width: "512px", height: "512px"}}
      />
    </div>
  </div>
</div>

    </>
  );
}
