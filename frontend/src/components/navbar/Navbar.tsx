'use client'

import Image from "next/image";
import Link from "next/link";
import { useModal } from "@/app/context/modal";
import SignupModal from "../signup/SignupModal";
import LoginModal from '../login/LoginModal';
import React from "react";
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const { setModalContent } = useModal();
  const pathname = usePathname();

  // ! ВРЕМЕННО: состояние логина
  const isLoggedIn = false; // Подключи auth-контекст в будущем

  const handleSignup = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setModalContent(<SignupModal />);
  }

  const handleLogin = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setModalContent(<LoginModal />);
  }

  // Ссылки для навигации
  const navLinks = [
    { href: '/about', label: 'About' },
    { href: '/events', label: 'Events' },
    { href: '/support', label: 'Support Us' },
    { href: '/get-involved', label: 'Get Involved' }
  ];

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
          {navLinks.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className={`hover:underline ${
                  pathname === href
                    ? "border-b-4 border-green-500 pb-1" // Подчеркиваем активный
                    : ""
                }`}
              >
                {label}
              </Link>
            </li>
          ))}

          {!isLoggedIn && (
            <>
              <li>
                <div className="hover:underline cursor-pointer" onClick={handleLogin}>
                  Login
                </div>
              </li>
              <li>
                <div className="hover:underline cursor-pointer" onClick={handleSignup}>
                  Signup
                </div>
              </li>
            </>
          )}

          {isLoggedIn && (
            <li>
              <Link
                href="/profile"
                className={`hover:underline ${
                  pathname === "/profile"
                    ? "border-b-4 border-green-500 pb-1"
                    : ""
                }`}
              >
                Profile
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}
