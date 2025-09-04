import { Child } from "./child";

export type User = {
    firstName: string
    lastName: string
    email: string
    phoneNumber: string;
    avatar?: string;
    city: string;
    state: string
    zipCode: string;
    children: Child[]
}
