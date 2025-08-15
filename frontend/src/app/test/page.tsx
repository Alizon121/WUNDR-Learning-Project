// frontend/src/app/test/page.tsx
"use client";

import TestLogin from "@/components/test/TestLogin";
import TestProtectedRoute from "@/components/test/TestProtectedRoute";
import TestLogout from "@/components/test/TestLogout";
import TestSignup from "@/components/test/TestSignup";

export default function TestPage() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>🧪 Test Page</h1>
      <TestLogin />
      <br />
      <TestProtectedRoute />
      <br />
      <TestLogout />
      <br />
      <TestSignup />
    </div>
  );
}
