import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-wonderbg shadow-md px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo + name */}
        <Link href="/" className="flex items-center space-x-3">
          <Image
            src="/logo.png"
            alt="WonderHood logo"
            width={50}
            height={50}
            className="cursor-pointer"
          />
          <span className="text-2xl text-wondergreen font-bold">
            WonderHood
          </span>
        </Link>

        <ul className="flex space-x-6 text-lg text-wondergreen font-medium gap-12">
          <li><a href="#about" className="hover:underline">About Us</a></li>
          <li><a href="#activities" className="hover:underline">Support Us</a></li>
          <li><a href="#events" className="hover:underline">Events</a></li>
          <li><a href="#events" className="hover:underline">Contact Us</a></li>
          <li><a href="#contact" className="hover:underline">Login / logout</a></li>
          <li><a href="#contact" className="hover:underline">Profile</a></li>
        </ul>
      </div>
    </nav>
  );
}
