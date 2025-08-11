'use client';

import Link from 'next/link';
import { useAuth } from "@/app/context/auth";

export default function UserDropdown({ onLogout }: { onLogout: () => void }) {
  const { user } = useAuth();

  return (
    <div className="absolute right-0 mt-2 w-52 bg-white border border-wonderleaf/40 rounded-xl shadow-lg z-50">
      <div className="px-4 py-2 text-wondergreen font-bold border-b border-wonderleaf/20">
        {user?.firstName} {user?.lastName}
        <div className="text-xs text-wonderleaf font-normal">{user?.role}</div>
      </div>
      <Link
        href="/profile"
        className="block px-4 py-2 hover:bg-wonderleaf/10 text-wondergreen"
      >
        Profile
      </Link>
      {/* Можно добавить еще ссылки! */}
      <button
        className="block w-full text-left px-4 py-2 hover:bg-wonderorange/10 text-wonderorange font-semibold rounded-b-xl"
        onClick={onLogout}
      >
        Logout
      </button>
    </div>
  );
}
