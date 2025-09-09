// import { EmergencyContact } from "@/types/emergencyContact"
// import { useState } from "react"

// const EmergencyContactForm = () => {
//     const [currentStep, setCurrentStep] = useState(1)
//     const [ec, setEC] = useState<EmergencyContact>({
//         firstName: '',
//         lastName: '',
//         phoneNumber: '',
//         relationship: ''
//     })

//     const nextStep = () => {
//         if (currentStep === 1) {
//             if (!child.firstName || !child.lastName || !child.email || !child.password || !form1.confirmPassword) {
//                 setServerError("Please fill in all required fields.");
//                 return;
//             }
//             if (form1.password !== form1.confirmPassword) {
//                 setServerError("Passwords do not match.");
//                 return;
//             }
//             if (passwordError) {
//                 setServerError(passwordError);
//                 return;
//             }
//         }
//         setCurrentStep(prev => prev + 1);
//         setServerError(null);
//     }

//     const prevStep = () => {
//         setCurrentStep(prev => prev - 1);
//         setServerError(null);
//     }

//     return (
//         <></>
//     )
// }

// export default EmergencyContactForm
