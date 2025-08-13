import Link from "next/link"

export default function Navbar({variant="dark"}: {variant?: "light" | "dark"}) {
    //Have a textColor variable for navbars that appear on white pages and thus make the 
    //text invisible. The prop allows for changing to match the theme
    const textColor = variant === "light" ? "text-black" : "text-white"
    return (
        <nav className={`fixed w-full bg-white/10 px-2 py-2 flex ${textColor} items-center flex-row`}>
            <Link href="/" className="text-xl">
                <div className="ml-2 flex flex-row items-center">
                    <h1>Verva</h1>
                <img 
                    src="./ava-orb.png"
                    alt="Ava orb"
                    className="w-14 h-14"
                />
                </div>

            </Link>
            <div className="ml-auto flex space-x-6">
                <Link href="/about" className="hover:font-bold hover:bg-white/10 px-3 py-1 rounded-md transition-all duration-200">
                    About
                </Link>

                <Link href="/interviews" className="hover:font-bold hover:bg-white/10 px-3 py-1 rounded-md transition-all duration-200">
                    Interviews
                </Link>

                <Link href="/ava" className="hover:font-bold hover:bg-white/10 px-3 py-1 rounded-md transition-all duration-200">
                    Ava AI
                </Link>

                <Link href="/signup" className="hover:font-bold hover:bg-white/10 px-3 py-1 rounded-md transition-all duration-200">
                    Sign Up
                </Link>
            </div>
        </nav>
    )
}