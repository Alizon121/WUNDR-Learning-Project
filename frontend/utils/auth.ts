import { makeApiRequest } from "./api";

// * Signup ===================================================

export interface ChildPayload {
  firstName: string;
  lastName: string;
  homeschool?: boolean;
  birthday: string;
}

export interface SignupPayload {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: "parent" | "admin" | "instructor" | "volunteer"
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

// & Example Body for handleSignup:

const payload: SignupPayload = {
  firstName: "Jane",
  lastName: "Doe",
  email: "jane.doe@example.com",
  password: "securePassword123",
  role: "parent",
  avatar: "https://example.com/avatar.jpg",
  city: "Austin",
  state: "TX",
  zipCode: 78701,
  children: [
    {
      firstName: "Ella",
      lastName: "Doe",
      homeschool: false,
      birthday: new Date("2015-06-15").toISOString(), // "2015-06-15T00:00:00.000Z"
    },
    {
      firstName: "Max",
      lastName: "Doe",
      homeschool: true,
      birthday: new Date("2018-09-22").toISOString(),
    },
  ],
};

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

// * Logout ===================================================

export function handleLogout() {
  localStorage.removeItem("token");
  console.log("👋 Logged out");
}
