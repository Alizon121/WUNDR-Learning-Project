'use client'

import { useState } from "react";

export default function SignupPage(){
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    function handleSubmit(e) {
        e.preventDefault();
        if (form.password !== form.confirmPassword) {
            alert("Пароли не совпадают!");
            return; // <-- Не забывай return!
        }
        console.log(form);
    }

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-10 p-8 bg-white rounded shadow">
            <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>

            <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value = {form.firstName}
                onChange={handleChange}
                className="mb-2 p-2 border rounded w-full"
                required
            />

            <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={form.lastName}
                onChange={handleChange}
                className="mb-2 p-2 border rounded w-full"
                required
            />

            <input 
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                className="mb-2 p-2 border rounded w-full"
                required
            />

            <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="mb-2 p-2 border rounded w-full"
                required
            />

            <input
                type="password"  
                name="confirmPassword"
                placeholder="Confirm Your Password"
                value={form.confirmPassword} 
                onChange={handleChange}
                className="mb-2 p-2 border rounded w-full"
                required
            />

            <button
                type="submit"
                className="bg-green-600 text-white p-2 rounded w-full hover:bg-green-700 transition"
            >
                Sign Up
            </button>
        </form>
    )
}
