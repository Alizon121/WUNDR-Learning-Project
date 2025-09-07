import React, { useState } from "react"
import { ChildPayload } from "../../../../utils/auth";
import { makeApiRequest } from "../../../../utils/api";
import { calculateAge } from "../../../../utils/calculateAge";
import { gradeOptions } from "../../../../utils/displayGrade";

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
        preferredName: "",
        homeschool: true,
        homeschoolProgram: "",
        grade: null,
        birthday: '',
        allergiesMedical: "",
        notes: "",
        photoConsent: false
    })

    const handleChange: React.ChangeEventHandler<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> = (e) => {
        const { name } = e.currentTarget
        const value = e.currentTarget.value

        if ((e.currentTarget as HTMLInputElement).type === "checkbox") {
            const checked = (e.currentTarget as HTMLInputElement).checked
            setChild(prev => ({ ...prev, [name]: checked }))
            setServerError(null)
            return
        }

        if (name === "grade") {
            setChild(prev => ({ ...prev, grade: value === "" ? null : Number(value) }))
            setServerError(null)
            return
        }

        setChild(prev => ({ ...prev, [name]: value }))
        setServerError(null)
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
            firstName: child.firstName?.trim(),
            lastName: child.lastName?.trim(),
            preferredName: child.preferredName === "" ? null : child.preferredName?.trim(),
            homeschool: child.homeschool,
            homeschoolProgram: child.homeschoolProgram === "" ? null : child.homeschoolProgram?.trim(),
            grade: child.grade,
            birthday: new Date(child.birthday).toISOString(),
            allergiesMedical: child.allergiesMedical === "" ? null : child.allergiesMedical?.trim(),
            notes: child.notes === "" ? null : child.notes?.trim(),
            photoConsent: child.photoConsent,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }

        console.log('PAYLOAD', payload)

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
                preferredName: "",
                homeschool: true,
                homeschoolProgram: "",
                grade: null,
                birthday: "",
                allergiesMedical: "",
                notes: "",
                photoConsent: false,
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
                            placeholder="Legal First Name"
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
                            placeholder="Legal Last Name"
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
                        name="preferredName"
                        placeholder="Preferred Name"
                        value={child.preferredName ?? ""}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        maxLength={50}
                        required
                    />
                </div>

                <div>
                    <div className="font-bold mb-2">BIRTHDAY</div>
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
                        <span>Homeschool?</span>
                </label>

                <input
                    name="homeschoolProgram"
                    placeholder="Homeschool Program"
                    value={child.homeschoolProgram ?? ""}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    maxLength={50}
                    required
                />

                <div className="font-bold mb-2">GRADE (OPTIONAL)</div>
                <select
                    name="grade"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wondergreen focus:border-transparent"
                    value={child.grade ?? ""}
                    onChange={handleChange}
                >
                    <option value="">N/A</option>
                    {gradeOptions.map(o => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                </select>

                <div className="font-bold mb-2">PHOTO CONSENT</div>
                <input
                    name="photoConsent"
                    type="checkbox"
                    checked={child.photoConsent}
                    onChange={handleChange}
                />

                <div className="font-bold">MEDICAL ACCOMMODATIONS</div>
                <textarea
                    name="allergiesMedical"
                    value={child.allergiesMedical ?? ""}
                    onChange={handleChange}
                    placeholder="List any allergies or medical accommodations"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wondergreen focus:border-transparent"
                />

                <div className="font-bold">ADDITIONAL NOTES</div>
                <textarea
                    name="notes"
                    value={child.notes ?? ""}
                    onChange={handleChange}
                    placeholder="Optional: Please note any information that would be beneficial for instructor"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wondergreen focus:border-transparent"
                />
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
