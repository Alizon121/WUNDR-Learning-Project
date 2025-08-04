import { useModal } from "@/app/context/modal"
import React, { useEffect, useState } from "react"

const LoginModal = () => {
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [errors, setErrors] = useState<{ [key: string]: string}>({})
    const [serverError, setServerError] = useState<string | null>(null)

    const {closeModal} = useModal()

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
    }

    useEffect(() => {
        const newErrors: { [key: string]: string} = {}

        if (email && !validateEmail(email)) newErrors.email = "Please provide a valid email address"
        setErrors(newErrors)
    }, [email])

    const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target

        if (name === 'email') setEmail(value)
        if (name === 'password') setPassword(value)

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: ""}))
        }
        setServerError(null)
    }

    const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setErrors({})

        const formData = new URLSearchParams()
        formData.append("username", email)
        formData.append("password", password)
        // const userInfo = { email, password }

        console.log('login user info', formData)

        try {
            const res = await fetch("http://localhost:8000/auth/token", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded"},
                body: formData.toString()
            })

            if (!res.ok) {
                const errorBody = await res.json()
                setServerError(errorBody.message || "Login failed")
                return
            }

            await res.json()
            closeModal()
        } catch (err) {
            setServerError("Error occurred when atttempting to login")
        }
    }

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-16 p-8 bg-white rounded shadow">
            <h2 className="text-2xl font-bold mb-8 text-center">Login</h2>

            <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email
            </label>
            <input
                type="text"
                name="email"
                value={email}
                onChange={handleChange}
                className="mb-4 p-2 border rounded w-full"
                required
                autoFocus
            />

            <label htmlFor="email" className="block text-sm font-medium mb-1">
            Password
            </label>
            <input
                type="password"
                name="password"
                value={password}
                onChange={handleChange}
                className="mb-4 p-2 border rounded w-full"
                required
            />

            <button
                type="submit"
                disabled={!email || !password || !!errors.email}
                className="bg-green-600 text-white p-2 rounded w-full hover:bg-green-700 transition disabled:opacity-60"
            >Submit
            </button>
        </form>
    )
}

export default LoginModal
