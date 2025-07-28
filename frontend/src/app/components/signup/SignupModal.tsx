import { useModal } from "@/app/context/modal"
import { useState } from "react"

const SignupModal = () => {
    const { closeModal } = useModal()

    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [avatar, setAvatar] = useState("")
    const [city, setCity] = useState("")
    const [state, setState] = useState("")
    const [zipcode, setZipcode] = useState()

    const [childFirstName, setChildFirstName] = useState()
    const [childLastName, setChildLastName] = useState()
    const [homeschool, setHomeschool] = useState(false)
    const [childAge, setChildAge] = useState()

    return (
        <>Modal info</>
    )
}

export default SignupModal
