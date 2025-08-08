
"use client";

import { usePathname } from "next/navigation"; // Hook to get current URL path
import ResetPasswordModal from "./ResetPasswordModal";

export default function ResetPasswordWrapper() {
  const pathname = usePathname(); // Get current route path

  // Matches "/reset-password/{token}"
  const match = pathname.match(/^\/reset-password\/([^/]+)$/);
  const token = match?.[1] ?? null;

  // Only render the modal when we have a token
  return token ? <ResetPasswordModal token={token} /> : null;
}