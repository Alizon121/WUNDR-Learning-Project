import React, { useState } from "react"
import { ChildPayload } from "../../../../utils/auth";
import { makeApiRequest } from "../../../../utils/api";

type Props = {
    showForm: boolean
    onSuccess: (createdChild: any) => void
}

type FormErrors = Partial<Record<"firstName" | "lastName" | "birthday", string>>

const JoinChildForm: React.FC<Props> = ({ showForm, onSuccess }) => {
    const [errors, setErrors] = useState<FormErrors>({})
    const [serverError, setServerError] = useState<string | null>(null)
    const [submitting, setSubmitting] = useState(false)
    const [child, setChild] = useState<ChildPayload>({
        firstName: '',
        lastName: '',
        homeschool: true,
        birthday: ''
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, childIndex: number | null = null) => {
        const { name, value, type, checked } = e.target
        setChild(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }))
        setServerError(null)
    }

    const calculateAge = (birthdayDate: string) => {
        const d = new Date(birthdayDate)
        let age = new Date().getFullYear() - d.getFullYear()
        const m = new Date().getMonth() - d.getMonth()

        if (m < 0 || (m === 0 && new Date().getDate() - d.getDate())) age --
        return age
    }

    const validations = () => {
        const newErrors: FormErrors = {}
        if (!child.firstName?.trim()) newErrors.firstName = "Required"
        if (!child.lastName?.trim()) newErrors.lastName = "Required"
        if (!child.birthday) newErrors.birthday = "Required"

        const age = child.birthday ? calculateAge(child.birthday) : NaN
        if (Number.isNaN(age) || age < 10 || age > 18) {
            newErrors.birthday = "Child's age must be between 10 and 18 years old."
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setServerError(null)
        if (!validations()) return

        const payload: ChildPayload = {
            firstName: child.firstName,
            lastName: child.lastName,
            homeschool: true,
            birthday: new Date(child.birthday).toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }

        try {
            setSubmitting(true)
            const response = await makeApiRequest("http://localhost:8000/child", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: payload
            })

            onSuccess((response as any).child ?? payload)
            setChild({
                firstName: "",
                lastName: "",
                homeschool: true,
                birthday: ""
            })
            setErrors({})
        } catch (err) {
            setServerError("A network error occurred. Please try again later.")
        } finally {
            showForm = false
            setSubmitting(false)
        }
    }

    if (!showForm) return null

    return (
        <form className="border border-gray-200 p-4 rounded-lg bg-gray-50" onSubmit={handleSubmit} noValidate>
            <h2 className="flex flex-col text-xl mt-4 mb-6 text-center">
                Add your child's information.
                <span className="mt-1">Child must be between 10–18 years old.</span>
            </h2>
            {serverError && <div className="mb-4 rounded bg-red-50 text-red-700 p-3">{serverError}</div>}

            <div className="space-y-3">
                <div className="flex flex-row gap-3 w-full">
                    <div>
                        <input
                        name="firstName"
                        placeholder="First Name"
                        value={child.firstName}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        maxLength={50}
                        required
                        />
                            {errors.firstName && <p className="text-sm text-red-600 mt-1">{String(errors.firstName)}</p>}
                    </div>

                    <div>
                        <input
                        name="lastName"
                        placeholder="Last Name"
                        value={child.lastName}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        maxLength={50}
                        required
                        />
                            {errors.lastName && <p className="text-sm text-red-600 mt-1">{String(errors.lastName)}</p>}
                    </div>
                </div>

                    <div>
                        <input
                        type="date"
                        name="birthday"
                        value={child.birthday}
                        max={new Date().toISOString().split("T")[0]}
                        onChange={handleChange}
                        className="w-1/2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent mx-auto"
                        required
                        />
                            {errors.birthday && <p className="text-sm text-red-600 mt-1">{String(errors.birthday)}</p>}
                    </div>

                    <label className="inline-flex items-center gap-2">
                        <input
                        type="checkbox"
                        name="homeschool"
                        checked={child.homeschool ?? false}
                        onChange={handleChange}
                        className="h-4 w-4"
                        />
                            <span>Homeschool program</span>
                    </label>

            </div>

            <div className="mt-6">
                <button
                type="submit"
                disabled={submitting}
                className="w-full bg-blue-100 text-white p-3 rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-60"
                >
                    {submitting ? "Saving…" : "Save"}
                </button>
            </div>
        </form>
    )
}

export default JoinChildForm
