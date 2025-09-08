import { Child } from "./child";

export type Role = "parent" | "volunteer" | "admin" | "instructor"

export interface User {
    id: string
    firstName: string
    lastName: string
    email: string
    phoneNumber: string;
    avatar?: string | null;
    address: string;
    city: string;
    state: string
    zipCode: string;
    children: Child[]
    role: Role
}
