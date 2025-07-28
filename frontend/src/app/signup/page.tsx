'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FormErrors } from "@/types/forms";

export default function SignupPage() {
    const router = useRouter();

    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [serverError, setServerError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    // Handle input changes
    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setForm({ ...form, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: undefined });
        setServerError(null);
    }

    // Submit form
    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setServerError(null);
        setSuccess(false);
        setIsSubmitting(true);

        let tempErrors: FormErrors = {};

        // Validation
        if (!form.firstName) tempErrors.firstName = "First Name is required";
        if (!form.lastName) tempErrors.lastName = "Last Name is required";

        // Checking email
        if (!form.email) tempErrors.email = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
            tempErrors.email = "Invalid email address";

        // Password: min/max, letter, number
        if (!form.password) tempErrors.password = "Password is required";
        else if (form.password.length > 32)
            tempErrors.password = "Password too long (max 32)";
        else if (
            !/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+=-]{6,}$/.test(form.password)
        ) {
            tempErrors.password = "Password must be at least 6 characters and contain a letter and a number";
        }

        if (!form.confirmPassword)
            tempErrors.confirmPassword = "Confirm your password";
        else if (form.password !== form.confirmPassword)
            tempErrors.confirmPassword = "Passwords do not match";

        setErrors(tempErrors);
        if (Object.keys(tempErrors).length > 0) {
            setIsSubmitting(false);
            return;
        }

        // fetch
        const { confirmPassword, ...dataToSend } = form;

        try {
            const res = await fetch("http://localhost:8000/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dataToSend),
            });

            const result = await res.json();
            if (!res.ok) {
                // Check if there is a field with an email error from the server (for example, already registered)
                if (result?.fieldErrors?.email) {
                    setErrors({ ...tempErrors, email: result.fieldErrors.email });
                } else {
                    setServerError(result.detail || "Registration failed");
                }
            } else {
                setSuccess(true);
                if (result.user) {
                    localStorage.setItem("user", JSON.stringify(result.user));
                }
                
                setForm({
                    firstName: "",
                    lastName: "",
                    email: "",
                    password: "",
                    confirmPassword: "",
                });
                setTimeout(() => router.push("/profile"), 2000);
            }
        } catch (err) {
            setServerError("An error occurred. Please try again later.");
        }
        setIsSubmitting(false);
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="max-w-md mx-auto mt-16 p-8 bg-white rounded shadow"
        >
            <h2 className="text-2xl font-bold mb-8 text-center">Sign Up</h2>
            {serverError && (
                <div className="text-red-600 text-center mb-4">{serverError}</div>
            )}
            {success && (
                <div className="text-green-600 text-center mb-4">
                    🎉 Registration successful!
                </div>
            )}

            <input
                type="text"
                name="firstName"
                autoComplete="given-name"
                placeholder="First Name"
                value={form.firstName}
                onChange={handleChange}
                className="mb-4 p-2 border rounded w-full"
                required
                maxLength={50}
                autoFocus
            />
            {errors.firstName && (
                <div className="text-red-600 text-sm mb-2">{errors.firstName}</div>
            )}

            <input
                type="text"
                name="lastName"
                autoComplete="family-name"
                placeholder="Last Name"
                value={form.lastName}
                onChange={handleChange}
                className="mb-4 p-2 border rounded w-full"
                required
                maxLength={50}
            />
            {errors.lastName && (
                <div className="text-red-600 text-sm mb-2">{errors.lastName}</div>
            )}

            <input
                type="email"
                name="email"
                autoComplete="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                className="mb-4 p-2 border rounded w-full"
                required
                maxLength={100}
            />
            {errors.email && (
                <div className="text-red-600 text-sm mb-2">{errors.email}</div>
            )}

            <input
                type="password"
                name="password"
                autoComplete="new-password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="mb-4 p-2 border rounded w-full"
                required
                minLength={6}
                maxLength={32}
            />
            {errors.password && (
                <div className="text-red-600 text-sm mb-2">{errors.password}</div>
            )}

            <input
                type="password"
                name="confirmPassword"
                autoComplete="new-password"
                placeholder="Confirm Your Password"
                value={form.confirmPassword}
                onChange={handleChange}
                className="mb-4 p-2 border rounded w-full"
                required
                minLength={6}
                maxLength={32}
            />
            {errors.confirmPassword && (
                <div className="text-red-600 text-sm mb-2">{errors.confirmPassword}</div>
            )}

            <button
                type="submit"
                className="bg-green-600 text-white p-2 rounded w-full hover:bg-green-700 transition disabled:opacity-60"
                disabled={isSubmitting}
            >
                {isSubmitting ? "Submitting..." : "Sign Up"}
            </button>
        </form>
    );
}
