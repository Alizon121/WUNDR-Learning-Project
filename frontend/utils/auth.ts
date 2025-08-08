import { makeApiRequest } from "./api";

// ! Signup ===================================================

export interface ChildPayload {
  firstName: string;
  lastName: string;
  homeschool?: boolean;
  birthday: string; // update once we know correct format
}

export interface SignupPayload {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: "parent" | "admin" | "instructor"
    avatar: string;
    city: string;
    state: string;
    zipCode: number;
    children?: ChildPayload[];
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
    console.log("✅ Token stored after signup");
  }

  return response;
}

// ! Login  ===================================================

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

// ! Logout ===================================================

export function handleLogout() {
  localStorage.removeItem("token");
  console.log("👋 Logged out");
}
