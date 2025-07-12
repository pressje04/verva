import Link from "next/link"

export default function Navbar({variant="dark"}: {variant?: "light" | "dark"}) {
    //Have a textColor variable for navbars that appear on white pages and thus make the 
    //text invisible. The prop allows for changing to match the theme
    const textColor = variant === "light" ? "text-black" : "text-white"
    return (
        <nav className={`fixed w-full bg-white/10 px-4 py-4 flex ${textColor} flex-row`}>
            <h1 className="font-bold text-xl">Verva</h1>
            <div className="ml-auto flex space-x-6 font-semibold">
                <Link href="/about" className="hover:font-bold hover:bg-white/10 px-3 py-1 rounded-md transition-all duration-200">
                    About
                </Link>

                <Link href="/interviews" className="hover:font-bold hover:bg-white/10 px-3 py-1 rounded-md transition-all duration-200">
                    Interviews
                </Link>

                <Link href="/ava" className="hover:font-bold hover:bg-white/10 px-3 py-1 rounded-md transition-all duration-200">
                    Ava AI
                </Link>
            </div>
        </nav>
    )
}