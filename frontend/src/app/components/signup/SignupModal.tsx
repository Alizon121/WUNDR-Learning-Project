import { useModal } from "@/app/context/modal"
import { FormErrors } from "@/types/forms"
import React, { useState } from "react"

const SignupModal = () => {
    const { closeModal } = useModal()

    const [ errors, setErrors ] = useState<FormErrors>({})
    const [serverError, setServerError] = useState<string | null>(null)
    const [showAdditionalModal1, setShowAdditionalModal1] = useState<boolean>(false)
    const [showAdditionalModal2, setShowAdditionalModal2] = useState<boolean>(false)
    const [form1, setForm1] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
    })
    const [form2, setForm2] = useState({
        city: "",
        state: "",
        zipcode: ""
    })
    const [form3List, setForm3List] = useState([{
        childFirstName: '',
        childLastName: '',
        homeschool: false,
        childAge: ''
    }])

    const handleChange = (e:React.ChangeEvent<HTMLInputElement>, childIndex: number | null = null) => {
        const { name, value, type, checked } = e.target

        if (name in form1) {
            console.log('NAME', name)
            console.log('FORM', form1)
            setForm1(prev => ({ ...prev, [name]: value}))
        } else if (name in form2) {
            setForm2(prev => ({ ...prev, [name]: value}))
        } else if (childIndex !== null) {
            setForm3List(prev =>
                prev.map((child, index) =>
                    index === childIndex ? { ...child, [name]: type === 'checkbox' ? checked : value }
                    : child
                )
            )
        }

        setErrors(prev => ({ ...prev, [name]: undefined}))
        setServerError(null)
    }

    const addAnotherChild = () => {
        setForm3List((prev) => [
            ...prev,
            {childFirstName: "", childLastName: "", homeschool: false, childAge: ""}
        ])
    }

    const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setErrors({})
        setServerError(null)

        const filteredChildren = form3List.filter(child => child.childFirstName || child.childLastName)

        const data = {
            "firstName": form1.firstName,
            "lastName": form1.lastName,
            "email": form1.email,
            "password": form1.password,
            "role": "parent",
            "avatar": "https://example.com/",
            "city": form2.city,
            "state": form2.state,
            "zipCode": parseInt(form2.zipcode, 10),
            "children": filteredChildren,
            // event: []
        }

//  const data = {
//   "firstName": "oneMoreUser",
//   "lastName": "string",
//   "email": "5dIy.4LexW1WW3vDTmhmbd82BSfBRcQhP.Skh5-k1dKT4tv9i2ZTDk%ccIT3rUGqhFLiqFl.KV4KPiEciX8H1fMAuXk.@aV3RHAVPipmFQkPt0ZmzNGekcRbbwdj54bUOsnjH.RZbWmvq",
//   "password": "string",
//   "role": "parent",
//   "avatar": "https://example.com/",
//   "city": "string",
//   "state": "string",
//   "zipCode": 0,
//   "children": []
// }

// [ {
//       "firstName": "string",
//       "lastName": "string",
//       "homeschool": false,
//       "birthday": "2025-07-28T23:15:24.235Z",
//       "createdAt": "2025-07-28T23:15:24.235Z",
//       "updatedAt": "2025-07-28T23:15:24.236Z"
//     },
//     {
//       "firstName": "string",
//       "lastName": "string",
//       "homeschool": false,
//       "birthday": "2025-07-28T23:15:24.235Z",
//       "createdAt": "2025-07-28T23:15:24.235Z",
//       "updatedAt": "2025-07-28T23:15:24.236Z"
//     }
//   ]

        console.log("DATA", data)
        try {
            const signupRes = await fetch("http://localhost:8000/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });


            if (!signupRes.ok) {
                const errorBody = await signupRes.json()
                setServerError(errorBody.message || "Sign up failed")
                return
            }

            const userResult = await signupRes.json();
            console.log('SIGN RESPONSE', userResult)

            // if (filteredChildren.length > 0) {
            //     const childRes = await fetch("http://localhost:8000/child", {
            //         method: "POST",
            //         headers: { "Content-Type": "application/json" },
            //         body: JSON.stringify({ children: filteredChildren})
            //     })

            //     if (!childRes.ok) {
            //         const errorBody = await childRes.json()
            //         setServerError(errorBody.message || "adding child failed")
            //         return
            //     }
            // }

            closeModal()
        } catch (err) {
            setServerError("An error occurred. Please try again later.");
        }

    }

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-16 p-8 bg-white rounded shadow">
            {!showAdditionalModal1 && (
                <>
                    <h2 className="text-2xl font-bold mb-8 text-center">Sign Up</h2>

                    <input
                        type="text"
                        name="firstName"
                        autoComplete="given-name"
                        placeholder="First Name"
                        value={form1.firstName}
                        onChange={handleChange}
                        className="mb-4 p-2 border rounded w-full"
                        required
                        maxLength={50}
                        autoFocus
                    />

                    <input
                        type="text"
                        name="lastName"
                        autoComplete="family-name"
                        placeholder="Last Name"
                        value={form1.lastName}
                        onChange={handleChange}
                        className="mb-4 p-2 border rounded w-full"
                        required
                        maxLength={50}
                    />

                    <input
                        type="email"
                        name="email"
                        autoComplete="email"
                        placeholder="Email"
                        value={form1.email}
                        onChange={handleChange}
                        className="mb-4 p-2 border rounded w-full"
                        required
                        maxLength={100}
                    />

                    <input
                        type="password"
                        name="password"
                        autoComplete="new-password"
                        placeholder="Password"
                        value={form1.password}
                        onChange={handleChange}
                        className="mb-4 p-2 border rounded w-full"
                        required
                        minLength={6}
                        maxLength={32}
                    />

                    <input
                        type="password"
                        name="confirmPassword"
                        autoComplete="new-password"
                        placeholder="Confirm Your Password"
                        value={form1.confirmPassword}
                        onChange={handleChange}
                        className="mb-4 p-2 border rounded w-full"
                        required
                        minLength={6}
                        maxLength={32}
                    />



                    <button
                        type="button"
                        onClick={() => setShowAdditionalModal1(true)}
                        className="bg-green-600 text-white p-2 rounded w-full hover:bg-green-700 transition disabled:opacity-60"
                    >Next
                    </button>
                </>
            )}

            {showAdditionalModal1 && !showAdditionalModal2 && (
                <>
                    <h2 className="text-2xl font-bold mb-8 text-center">Where do you live?</h2>
                    <p>TEMP TEXT: This program is only for our Westcliffe community.</p>

                    <input
                        type="text"
                        name="city"
                        autoComplete="city"
                        placeholder="City"
                        value={form2.city}
                        onChange={handleChange}
                        className="mb-4 p-2 border rounded w-full"
                        required
                        maxLength={50}
                        autoFocus
                    />

                    <input
                        type="text"
                        name="state"
                        autoComplete="state"
                        placeholder="State"
                        value={form2.state}
                        onChange={handleChange}
                        className="mb-4 p-2 border rounded w-full"
                        required
                        maxLength={50}
                        autoFocus
                    />

                    <input
                        type="text"
                        name="zipcode"
                        autoComplete="zipcode"
                        placeholder="Zipcode"
                        value={form2.zipcode}
                        onChange={handleChange}
                        className="mb-4 p-2 border rounded w-full"
                        required
                        maxLength={50}
                        autoFocus
                    />

                    <button
                        type="button"
                        onClick={() => setShowAdditionalModal1(false)}
                        className="bg-green-600 text-white p-2 rounded w-full hover:bg-green-700 transition disabled:opacity-60"
                    >Back
                    </button>

                    <button
                        type="button"
                        onClick={() => setShowAdditionalModal2(true)}
                        className="bg-green-600 text-white p-2 rounded w-full hover:bg-green-700 transition disabled:opacity-60"
                    >Next
                    </button>
                </>
            )}

            {showAdditionalModal2 && (
                <>
                    <h2 className="text-2xl font-bold mb-8 text-center">Join your child</h2>
                    <p>If you want to complete your child's information later, that's okay. We can go ahead and create your account.</p>

                    {form3List.map((child, idx) => (
                        <div key={idx} className="border p-4 mb-4 rounded">
                            <input
                                name="childFirstName"
                                placeholder="Child's First Name"
                                value={child.childFirstName}
                                onChange={(e) => handleChange(e, idx)}
                                className="mb-4 p-2 border rounded w-full"
                                maxLength={50}
                                autoFocus
                            />

                            <input
                                name="childLastName"
                                placeholder="Child's Last Name"
                                value={child.childLastName}
                                onChange={(e) => handleChange(e, idx)}
                                className="mb-4 p-2 border rounded w-full"
                                maxLength={50}
                                autoFocus
                            />

                            <input
                                type="date"
                                name="childAge"
                                value={child.childAge}
                                max={new Date().toISOString().split("T")[0]}
                                onChange={(e) => handleChange(e, idx)}
                                className="mb-4 p-2 border rounded w-full"
                            />

                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    name="homeschool"
                                    checked={child.homeschool}
                                    onChange={(e) => handleChange(e, idx)}
                                    className="mb-4 p-2 border rounded w-full"
                                /><span>Homeschool?</span>
                            </label>
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={addAnotherChild}
                        className="mb-4 w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                    >
                        Add Another Child
                    </button>

                    <button
                        type="button"
                        className="bg-green-600 text-white p-2 rounded w-full hover:bg-green-700 transition disabled:opacity-60"
                        onClick={() => {
                            setShowAdditionalModal2(false)
                            setShowAdditionalModal1(true)
                        }}
                    >Back</button>
                    <button
                        type="submit"
                        className="bg-green-600 text-white p-2 rounded w-full hover:bg-green-700 transition disabled:opacity-60"
                    >Sign Up</button>
                </>
            )}
        </form>
    )
}

export default SignupModal
