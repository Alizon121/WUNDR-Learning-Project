import { FormErrors } from "@/types/forms"
import React, { useState } from "react"

const JoinChild = () => {
    const [errors, setErrors] = useState<FormErrors>({})
    const [serverError, setServerError] = useState<string | null>(null)
    const [form3List, setForm3List] = useState([{
        childFirstName: '',
        childLastName: '',
        homeschool: true,
        childAge: ''
    }])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, childIndex: number | null = null) => {
        const { name, value, type, checked } = e.target

        if (childIndex !== null) {
            setForm3List(prev =>
                prev.map((child, index) =>
                    index === childIndex ? { ...child, [name]: type === 'checkbox' ? "checked" : value }
                    : child
                )
            )
        }

        setErrors(prev => ({ ...prev, [name]: undefined }))
        setServerError(null)
    }

    const addAnotherChild = () => {
        setForm3List((prev) => [
            ...prev,
            {childFirstName: "", childLastName: "", homeschool: true, childAge: ""}
        ])
    }

    const removeChild = (index: number) => {
        if (form3List.length > 1) {
            setForm3List(prev => prev.filter((_, i) => i !== index))
        }
    }

    return (
        <form className="border border-gray-200 p-4 rounded-lg bg-gray-50">
            <h2 className="flex flex-col text-xl text-gray-600 mb-8">
                Add your children's information below.
                <span className="mt-1">All children must be between 10-18 years old.</span>
            </h2>

            {form3List.map((child, idx) => (
                <div key={idx} className="p-5 border-t">
                    <div className="flex justify-between items-center mb-3">
                        <h4 className="font-medium text-gray-700">Child {idx + 1}</h4>
                        {form3List.length > 1 && (
                            <button
                                type="button"
                                onClick={() => removeChild(idx)}
                                className="text-red-500 hover:text-red-700 text-sm"
                            >
                                Remove
                            </button>
                        )}
                    </div>

                    <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                            <input
                                name="childFirstName"
                                placeholder="First Name"
                                value={child.childFirstName}
                                onChange={(e) => handleChange(e, idx)}
                                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                maxLength={50}
                                required
                            />
                            <input
                                name="childLastName"
                                placeholder="Last Name"
                                value={child.childLastName}
                                onChange={(e) => handleChange(e, idx)}
                                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                maxLength={50}
                                required
                            />
                        </div>

                        <input
                            type="date"
                            name="childAge"
                            value={child.childAge}
                            max={new Date().toISOString().split("T")[0]}
                            onChange={(e) => handleChange(e, idx)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            required
                        />
                    </div>
                </div>
            ))}

            <button
                type="button"
                onClick={addAnotherChild}
                className="w-full bg-blue-100 text-blue-700 p-3 rounded-lg hover:bg-blue-200 transition-colors font-medium border border-blue-300"
            >
                + Add Another Child
            </button>
        </form>
    )
}

export default JoinChild
