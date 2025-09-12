import { Role } from "@/types/user";
import { makeApiRequest } from "./api";
import { useRouter } from "next/navigation";
import { EmergencyContact } from "@/types/emergencyContact";

// * Signup ===================================================

export interface ChildPayload {
  firstName: string;
  lastName: string;
  preferredName?: string | null
  homeschool?: boolean;
  // homeschoolProgram?: string | null
  grade?: number | null
  birthday: string;
  allergiesMedical?: string | null
  notes?: string | null
  photoConsent: boolean
  waiver: boolean
  createdAt?: string;
  updatedAt?: string;
  emergencyContacts: EmergencyContact[]
}

export interface SignupPayload {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber: string;
    avatar?: string;
    address: string
    city: string;
    state: string;
    zipCode: string;
    // children?: ChildPayload[];
    role: Role;
}

export async function handleSignup(payload: SignupPayload) {
  const response = await makeApiRequest<{
    user: Record<string, any>;
    token: string;
    message: string;
  }>("http://localhost:8000/auth/signup", {
    method: "POST",
    body: payload,
  });

  if (response.token) {
    localStorage.setItem("token", response.token);
    // console.log("✅ Token stored after signup");
  }

  return response;
}

// & Example Body for handleSignup:

// const payload: SignupPayload = {
//   firstName: "Jane",
//   lastName: "Doe",
//   email: "jane.doe@example.com",
//   password: "securePassword123",
//   role: "parent",
//   avatar: "https://example.com/avatar.jpg",
//   city: "Austin",
//   state: "TX",
//   zipCode: 78701,
//   children: [
//     {
//       firstName: "Ella",
//       lastName: "Doe",
//       homeschool: false,
//       birthday: new Date("2015-06-15").toISOString(), // "2015-06-15T00:00:00.000Z",
//       createdAt: new Date().toISOString(),
//       updatedAt: new Date().toISOString(),
//     },
//     {
//       firstName: "Max",
//       lastName: "Doe",
//       homeschool: true,
//       birthday: new Date("2018-09-22").toISOString(),
//       createdAt: new Date().toISOString(),
//       updatedAt: new Date().toISOString(),
//     },
//   ],
// };

// & Example function call:

// const response = await handleSignup(payload);

// * Login  ===================================================

export async function handleLogin(email: string, password: string) {

    const formData = new URLSearchParams();

    formData.append("username", email);
    formData.append("password", password);

    const response = await fetch("http://localhost:8000/auth/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.detail || "Login Failed");
    }

    if (result.access_token) {
        localStorage.setItem("token", result.access_token);
    }

    return result;
}

// & Example Implementation

// import { handleLogin } from "@/lib/api"; // adjust path as needed

// function SomeComponent() {
//   const loginUser = async () => {
//     try {
//       const result = await handleLogin("user@example.com", "securePassword123");
//       console.log("Logged in!", result);
//     } catch (error) {
//       console.error("Login failed:", error);
//     }
//   };

//   return <button onClick={loginUser}>Login</button>;
// }

// * Logout ===================================================

export function handleLogout() {
  const router = useRouter()

  localStorage.removeItem("token");
  // console.log("👋 Logged out");
  router.push('/')
}

// GetToken  =================================================
//!Get the token from localStorage (client-side only).

export const TOKEN_KEY = 'token';

export function setToken(token: string) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

//! Quick UI check: does a token exist? (not a security check)
export function isLoggedIn(): boolean {
  return !!getToken();
}


