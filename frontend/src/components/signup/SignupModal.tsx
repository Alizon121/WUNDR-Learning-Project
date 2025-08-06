import { useModal } from "@/app/context/modal"
import { FormErrors } from "@/types/forms"
import React, { useState } from "react"
import { useAuth } from "@/app/context/auth";

const SignupModal = () => {
    const { closeModal } = useModal()
    const { loginWithToken } = useAuth();

    const [errors, setErrors] = useState<FormErrors>({})
    const [serverError, setServerError] = useState<string | null>(null)
    const [currentStep, setCurrentStep] = useState(1)
    const [selectedRole, setSelectedRole] = useState<'parent' | 'volunteer' | null>(null)
    const [hasHomeschoolChild, setHasHomeschoolChild] = useState<boolean | null>(null)
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [passwordTouched, setPasswordTouched] = useState(false);
    


    
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
        homeschool: true,
        childAge: ''
    }])

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setForm1(prev => ({ ...prev, password: value }));

    // Check min 6 symbols
    if (value.length < 6) {
        setPasswordError("Password must be at least 6 characters.");
    } else if (!/[A-Za-z]/.test(value)) {
        setPasswordError("Password must include at least one letter.");
    } else if (!/[0-9]/.test(value)) {
        setPasswordError("Password must include at least one number.");
    } else {
        setPasswordError(null);
    }
};


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, childIndex: number | null = null) => {
        const { name, value, type, checked } = e.target

        if (name in form1) {
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
            {childFirstName: "", childLastName: "", homeschool: true, childAge: ""}
        ])
    }

    const removeChild = (index: number) => {
        if (form3List.length > 1) {
            setForm3List(prev => prev.filter((_, i) => i !== index))
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrors({});
        setServerError(null);

        //array with type
        let filteredChildren: {
            firstName: string;
            lastName: string;
            homeschool: boolean;
            birthday: string;
        }[] = [];

        // Validation for parents without homeschool children
        if (selectedRole === 'parent' && hasHomeschoolChild === false) {
            setServerError("This program is currently only available for homeschool families. We'd love to expand in the future!");
            return;
        }

        // Prepare children data (only if parent with homeschool children)
        filteredChildren = [];
        if (selectedRole === 'parent' && hasHomeschoolChild === true) {
            filteredChildren = form3List
                .filter(child => child.childFirstName || child.childLastName)
                .map(child => ({
                    firstName: child.childFirstName,
                    lastName: child.childLastName,
                    homeschool: child.homeschool,
                    birthday: child.childAge,
                }));

            // Validate children's age
            for (let child of filteredChildren) {
                if (!child.birthday) {
                    setServerError("Please enter your child's date of birth.");
                    return;
                }
                const birthYear = new Date(child.birthday).getFullYear();
                const currentYear = new Date().getFullYear();
                const age = currentYear - birthYear;
                if (age < 10 || age > 18) {
                    setServerError("Child's age must be between 10 and 18 years old.");
                    return;
                }
            }

            if (filteredChildren.length === 0) {
                setServerError("Please add at least one child's information.");
                return;
            }
        }

        // Prepare user data
        const userInfo = {
            firstName: form1.firstName,
            lastName: form1.lastName,
            email: form1.email,
            password: form1.password,
            role: selectedRole,
            city: form2.city,
            state: form2.state,
            zipCode: parseInt(form2.zipcode, 10),
        };

        console.log("userInfo before signup:", userInfo);

        try {
            // Signup request
            const signupRes = await fetch("http://localhost:8000/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userInfo),
            });

            const signupBody = await signupRes.json();

            if (!signupRes.ok) {
                // Pydantic can return errors as an array
                if (Array.isArray(signupBody.detail)) {
                    signupBody.detail.map((err: { msg: string }) => err.msg).join(" ")
                } else if (typeof signupBody.detail === 'object' && signupBody.detail.msg) {
                    setServerError(signupBody.detail.msg);
                } else {
                    setServerError(signupBody.detail || signupBody.message || "Registration failed.");
                }
                return;
            }


            const token = signupBody.token;
            const user = signupBody.user;
            if (!token) {
                setServerError("No token received after registration.");
                return;
            }

            loginWithToken(token, user); 

            // Add children if any
            if (filteredChildren.length > 0) {
                const childrenRes = await fetch("http://localhost:8000/child", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                    body: JSON.stringify(filteredChildren),
                });

                const childrenBody = await childrenRes.json();
                if (!childrenRes.ok) {
                    setServerError(childrenBody.message || "Failed to add child information.");
                    return;
                }
            }

            closeModal();
        } catch (err) {
            setServerError("A network error occurred. Please try again later.");
            console.error(err);
        }
    };

    const nextStep = () => {
        if (currentStep === 1) {
            if (!form1.firstName || !form1.lastName || !form1.email || !form1.password || !form1.confirmPassword) {
                setServerError("Please fill in all required fields.");
                return;
            }
            if (form1.password !== form1.confirmPassword) {
                setServerError("Passwords do not match.");
                return;
            }
            if (passwordError) {
                setServerError(passwordError);
                return;
            }
        }
        setCurrentStep(prev => prev + 1);
        setServerError(null);
    }

    const prevStep = () => {
        setCurrentStep(prev => prev - 1);
        setServerError(null);
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                <form onSubmit={handleSubmit} className="p-6">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800 text-green-600 w-full text-center">Join WonderHood</h2>
                        <button 
                            type="button" 
                            onClick={closeModal}
                            className="text-gray-400 hover:text-gray-600 text-2xl"
                        >
                            ×
                        </button>
                    </div>

                    {/* Error Message */}
                    {serverError && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                            {serverError}
                        </div>
                    )}

                    {/* Step 1: Basic Info */}
                    {currentStep === 1 && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-700 mb-4">Tell us about yourself</h3>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    name="firstName"
                                    placeholder="First Name"
                                    value={form1.firstName}
                                    onChange={handleChange}
                                    className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    required
                                    maxLength={50}
                                />
                                <input
                                    type="text"
                                    name="lastName"
                                    placeholder="Last Name"
                                    value={form1.lastName}
                                    onChange={handleChange}
                                    className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    required
                                    maxLength={50}
                                />
                            </div>

                            <input
                                type="email"
                                name="email"
                                placeholder="Email Address"
                                value={form1.email}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                required
                                maxLength={100}
                            />

                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={form1.password}
                                onChange={handlePasswordChange}
                                onBlur={() => setPasswordTouched(true)}   
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                required
                                minLength={6}
                                maxLength={32}
                            />

                            <input
                                type="password"
                                name="confirmPassword"
                                placeholder="Confirm Password"
                                value={form1.confirmPassword}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                required
                                minLength={6}
                                maxLength={32}
                            />
                            {passwordError && passwordTouched && (
                                <div className="text-red-500 text-sm mt-1">{passwordError}</div>
                            )}

                            {/* Progress indicator */}
                            <div className="flex justify-center mb-6">
                                <div className="flex space-x-2">
                                    {[1, 2, 3, 4].map((step) => (
                                        <div 
                                            key={step}
                                            className={`w-3 h-3 rounded-full transition-colors ${
                                                step <= currentStep ? 'bg-green-500' : 'bg-gray-300'
                                            }`}
                                        />
                                    ))}
                                </div>
                            </div>


                            <button
                                type="button"
                                onClick={nextStep}
                                className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
                            >
                                Continue
                            </button>
                        </div>
                    )}

                    {/* Step 2: Role Selection */}
                    {currentStep === 2 && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-700 mb-4">What brings you to WonderHood?</h3>
                            
                            <div className="space-y-3">
                                <button
                                    type="button"
                                    onClick={() => setSelectedRole('parent')}
                                    className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                                        selectedRole === 'parent' 
                                            ? 'border-green-500 bg-green-50 text-green-700' 
                                            : 'border-gray-300 hover:border-gray-400'
                                    }`}
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className={`w-4 h-4 rounded-full border-2 ${
                                            selectedRole === 'parent' ? 'border-green-500 bg-green-500' : 'border-gray-300'
                                        }`}>
                                            {selectedRole === 'parent' && <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>}
                                        </div>
                                        <div>
                                            <div className="font-medium">I'm a Parent</div>
                                            <div className="text-sm text-gray-600">Looking for activities for my child</div>
                                        </div>
                                    </div>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setSelectedRole('volunteer')}
                                    className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                                        selectedRole === 'volunteer' 
                                            ? 'border-green-500 bg-green-50 text-green-700' 
                                            : 'border-gray-300 hover:border-gray-400'
                                    }`}
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className={`w-4 h-4 rounded-full border-2 ${
                                            selectedRole === 'volunteer' ? 'border-green-500 bg-green-500' : 'border-gray-300'
                                        }`}>
                                            {selectedRole === 'volunteer' && <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>}
                                        </div>
                                        <div>
                                            <div className="font-medium">I'm a Volunteer</div>
                                            <div className="text-sm text-gray-600">Want to help or earn service hours</div>
                                        </div>
                                    </div>
                                </button>
                            </div>

                            <div className="flex space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={prevStep}
                                    className="flex-1 bg-gray-200 text-gray-700 p-3 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                                >
                                    Back
                                </button>
                                <button
                                    type="button"
                                    onClick={nextStep}
                                    disabled={!selectedRole}
                                    className="flex-1 bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50"
                                >
                                    Continue
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Location */}
                    {currentStep === 3 && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-700 mb-4">Where are you located?</h3>
                            <p className="text-sm text-gray-600 mb-4">This program is currently available in the Westcliffe, Colorado area.</p>

                            <input
                                type="text"
                                name="city"
                                placeholder="City"
                                value={form2.city}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                required
                                maxLength={50}
                            />

                            <input
                                type="text"
                                name="state"
                                placeholder="State"
                                value={form2.state}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                required
                                maxLength={50}
                            />

                            <input
                                type="text"
                                name="zipcode"
                                placeholder="ZIP Code"
                                value={form2.zipcode}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                required
                                maxLength={10}
                            />

                            <div className="flex space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={prevStep}
                                    className="flex-1 bg-gray-200 text-gray-700 p-3 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                                >
                                    Back
                                </button>
                                <button
                                    type={selectedRole === 'volunteer' ? "submit" : "button"}
                                    onClick={selectedRole === 'volunteer' ? undefined : nextStep}
                                    className="flex-1 bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
                                    >
                                    {selectedRole === 'volunteer' ? 'Create Account' : 'Continue'}
                                </button>

                            </div>
                        </div>
                    )}

                    {/* Step 4: Children (Only for Parents) */}
                    {currentStep === 4 && selectedRole === 'parent' && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-700 mb-4">Tell us about your children</h3>
                            
                            {/* Homeschool question */}
                            <div className="bg-blue-50 p-4 rounded-lg mb-4">
                                <p className="font-medium text-gray-700 mb-3">Do you have children who are homeschooled?</p>
                                <div className="space-y-2">
                                    <button
                                        type="button"
                                        onClick={() => setHasHomeschoolChild(true)}
                                        className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                                            hasHomeschoolChild === true 
                                                ? 'border-green-500 bg-green-50 text-green-700' 
                                                : 'border-gray-300 hover:border-gray-400 bg-white'
                                        }`}
                                    >
                                        Yes, I have homeschooled children (ages 10-18)
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setHasHomeschoolChild(false)}
                                        className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                                            hasHomeschoolChild === false 
                                                ? 'border-red-500 bg-red-50 text-red-700' 
                                                : 'border-gray-300 hover:border-gray-400 bg-white'
                                        }`}
                                    >
                                        No, my children attend traditional school
                                    </button>
                                </div>
                            </div>

                            {hasHomeschoolChild === false && (
                                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                                    <p className="text-yellow-800 text-sm">
                                        Currently, WonderHood is designed specifically for homeschool families. We hope to expand to include all families in the future!
                                    </p>
                                </div>
                            )}

                            {hasHomeschoolChild === true && (
                                <>
                                    <p className="text-sm text-gray-600 mb-4">Add your children's information below. All children must be between 10-18 years old.</p>
                                    
                                    {form3List.map((child, idx) => (
                                        <div key={idx} className="border border-gray-200 p-4 rounded-lg bg-gray-50">
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
                                </>
                            )}

                            <div className="flex space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={prevStep}
                                    className="flex-1 bg-gray-200 text-gray-700 p-3 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                                >
                                    Back
                                </button>
                                <button
                                    type="submit"
                                    disabled={hasHomeschoolChild === null || (hasHomeschoolChild === true && form3List.some(child => !child.childFirstName || !child.childLastName || !child.childAge))}
                                    className="flex-1 bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50"
                                >
                                    Create Account
                                </button>
                            </div>
                        </div>
                    )}
                </form>
            </div>
        </div>
    )
}

export default SignupModal