'use client'

import Image from "next/image";
import Link from "next/link";
import { useModal } from "@/app/context/modal";
import SignupModal from "../signup/SignupModal"
import LoginModal from '../login/LoginModal'
import React from "react";

export default function Navbar() {
  const {setModalContent} = useModal()

  const handleSignup = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    console.log('OPENING MODAL....')
    setModalContent(<SignupModal/>)
  }

  const handleLogin = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    setModalContent(<LoginModal/>)
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
          <li><div className="hover:underline" onClick={handleLogin}>Login</div></li>
          <li><div className="hover:underline" onClick={handleSignup}>Signup</div></li>
          {/* <li><a href="/signup" className="hover:underline" onClick={handleSignup}>Signup</a></li> */}
          <li><a href="#profile" className="hover:underline">Profile</a></li>
        </ul>
      </div>
    </nav>
  );
}
