// components/TestSignup.tsx
"use client";

import { handleSignup, SignupPayload } from "../../../utils/auth";

export default function TestSignup() {
  const testPayload: SignupPayload = {
    firstName: "Blaidd",
    lastName: "String",
    email: "totallyrandomemail@example.com", // Use a unique email for testing
    password: "SecurePass123!",
    role: "parent",
    avatar: "https://example.com/avatar.png",
    city: "Devine",
    state: "TX",
    zipCode: 78016,
  };

  console.log("HERE IS THE PAYLOAD", testPayload);

  const onSignup = async () => {
    const response = await handleSignup(testPayload);
    console.log("🆕 Signup response:", response);
  };

  return <button onClick={onSignup}>Test Signup</button>;
}
