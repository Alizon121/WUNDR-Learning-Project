'use client'

import Image from "next/image";
import Link from "next/link";
import { useModal } from "@/app/context/modal";
import SignupModal from "../signup/SignupModal"
import React from "react";

export default function Navbar() {
  const {setModalContent} = useModal()

  const handleSignup: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
    e.preventDefault()
    setModalContent(<SignupModal/>)
  }

  return (
    <nav className="bg-wonderbg shadow-md px-32 py-4">
      <div className="max-w-full mx-auto flex justify-between items-center">
        {/* Logo + name */}
        <Link href="/" className="flex items-center space-x-3 shrink-0">
          <Image
            src="/logo.png"
            alt="WonderHood logo"
            width={60}
            height={55}
            className="cursor-pointer"
          />
          <span className="text-[27px] text-wondergreen font-bold">
            WonderHood
          </span>
        </Link>

        <ul className="flex space-x-16 text-[22px] font-bold text-wondergreen">
          <li><Link href="/about" className="hover:underline">About</Link></li>
          <li><a href="#events" className="hover:underline">Events</a></li>
          <li><a href="#events" className="hover:underline">Support Us</a></li>
          <li><a href="#login" className="hover:underline">Enroll</a></li>
          <li><a href="#login" className="hover:underline">Login</a></li>
          <li><a href="/signup" className="hover:underline" onClick={handleSignup}>Signup</a></li>
          <li><a href="#profile" className="hover:underline">Profile</a></li>
        </ul>
      </div>
    </nav>
  );
}
