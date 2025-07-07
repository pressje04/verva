import Link from "next/link"

export default function Navbar() {
    return (
        <nav className="fixed w-full bg-white/10 px-4 py-4 flex flex-row">
            <h1 className="font-bold text-xl">Verva</h1>
            <div className="ml-auto flex space-x-6 font-semibold">
                <Link href="/about" className="text-white hover:font-bold hover:bg-white/10 px-3 py-1 rounded-md transition-all duration-200">
                    About
                </Link>

                <Link href="/interviews" className="text-white hover:font-bold hover:bg-white/10 px-3 py-1 rounded-md transition-all duration-200">
                    Interviews
                </Link>

                <Link href="/ava" className="text-white hover:font-bold hover:bg-white/10 px-3 py-1 rounded-md transition-all duration-200">
                    Ava AI
                </Link>
            </div>
        </nav>
    )
}