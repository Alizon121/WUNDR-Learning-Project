'use client'

import { useState } from "react";
import { FormErrors } from "@/types/forms";

export default function SignupPage() {
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [errors, setErrors] = useState<FormErrors>({});

    // Handle input changes and reset errors
    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    // Validate form fields on submit
    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        let tempErrors: FormErrors = {};

        // Validate required fields
        if (!form.firstName) tempErrors.firstName = "First Name is required";
        if (!form.lastName) tempErrors.lastName = "Last Name is required";
        if (!form.email) tempErrors.email = "Email is required";
        if (!form.password) tempErrors.password = "Password is required";
        if (!form.confirmPassword) tempErrors.confirmPassword = "Confirm your password";

        // Check if passwords match
        if (form.password !== form.confirmPassword) {
            tempErrors.confirmPassword = "Passwords do not match";
        }
        // Check password strength (at least 6 chars, one letter and one number)
        if (
            form.password &&
            !/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+=-]{6,}$/.test(form.password)
        ) {
            tempErrors.password = "Password must be at least 6 characters and contain a letter and a number";
        }

        setErrors(tempErrors);

        // Stop submission if errors exist
        if (Object.keys(tempErrors).length > 0) return;

        // If everything is valid, clear errors and send data (here: just log)
        setErrors({});
        console.log(form);
    }

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-16 p-8 bg-white rounded shadow">
            <h2 className="text-2xl font-bold mb-8 text-center">Sign Up</h2>

            <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={form.firstName}
                onChange={handleChange}
                className="mb-4 p-2 border rounded w-full"
                required
            />
            {errors.firstName && <div className="text-red-600 text-sm mb-2">{errors.firstName}</div>}

            <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={form.lastName}
                onChange={handleChange}
                className="mb-4 p-2 border rounded w-full"
                required
            />
            {errors.lastName && <div className="text-red-600 text-sm mb-2">{errors.lastName}</div>}

            <input 
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                className="mb-4 p-2 border rounded w-full"
                required
            />
            {errors.email && <div className="text-red-600 text-sm mb-2">{errors.email}</div>}

            <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="mb-4 p-2 border rounded w-full"
                required
            />
            {errors.password && <div className="text-red-600 text-sm mb-2">{errors.password}</div>}

            <input
                type="password"  
                name="confirmPassword"
                placeholder="Confirm Your Password"
                value={form.confirmPassword} 
                onChange={handleChange}
                className="mb-4 p-2 border rounded w-full"
                required
            />
            {errors.confirmPassword && <div className="text-red-600 text-sm mb-2">{errors.confirmPassword}</div>}

            <button
                type="submit"
                className="bg-green-600 text-white p-2 rounded w-full hover:bg-green-700 transition"
            >
                Sign Up
            </button>
        </form>
    )
}
