import { User } from "@/types/user"
import React, { useEffect, useMemo, useState } from "react"
import { makeApiRequest } from "../../../../utils/api"
import { ok } from "assert"

type Props = {
    currUser: User | null
    setEditing: (val: boolean) => void;
}

const UpdateUserForm: React.FC<Props> = ({ currUser, setEditing }) => {
    const [avatar, setAvatar] = useState<string>("")
    const [firstName, setFirstName] = useState<string>("")
    const [lastName, setLastName] = useState<string>("")
    const [email, setEmail] = useState<string>("")
    const [city, setCity] = useState<string>("")
    const [state, setState] = useState<string>("")
    const [zipCode, setZipCode] = useState<number | null>(null)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        setAvatar(currUser?.avatar ?? "")
        setFirstName(currUser?.firstName ?? "")
        setLastName(currUser?.lastName ?? "")
        setEmail(currUser?.email ?? "")
        setCity(currUser?.city ?? "")
        setState(currUser?.state ?? "")
        setZipCode(currUser?.zipCode ?? null)
    }, [currUser])

    const isValid = useMemo(() => {
        const ok =
            !!firstName?.trim() &&
            !!lastName?.trim() &&
            !!email?.trim() &&
            !!city?.trim() &&
            !!state?.trim()

        return ok
    }, [firstName, lastName, email, city, state])

    // const updateAvatar
    const updateFirstName = (e: React.ChangeEvent<HTMLInputElement>) => setFirstName(e.target.value)
    const updateLastName = (e: React.ChangeEvent<HTMLInputElement>) => setLastName(e.target.value)
    const updateEmail = (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)
    const updateCity = (e: React.ChangeEvent<HTMLInputElement>) => setCity(e.target.value)
    const updateState = (e: React.ChangeEvent<HTMLInputElement>) => setState(e.target.value)
    // const updateZipCode = (e: React.ChangeEvent<HTMLInputElement>) => setZipCode(e.target.value)

    const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!isValid || saving) return

        const payload = {
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.trim(),
            city: city.trim(),
            state: state.trim()
        }

        console.log('updateUser', payload)

        try {
            setSaving(true)
            await makeApiRequest(`http://localhost:8000/user`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: payload
            })
            setEditing(false)
        } catch (err) {
            console.error("update user failed", err)
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="bg-white shadow rounded-lg max-w-md mx-auto p-10">
            <div className="space-y-2">
                <div className="flex flex-row justify-around">
                    {currUser?.avatar ? (
                        <img className='h-24 w-24 rounded-full object-cover' src={currUser.avatar} alt={`Profile Image of ${currUser.firstName}`}/>
                    ): (
                        <img className='h-24 w-24' src="./profile-picture.png" alt="Default profile"/>
                    )}

                    <div className="flex flex-col text-center">
                        <div className="flex flex-row mb-2">
                            <input
                                type="text"
                                value={firstName}
                                onChange={updateFirstName}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wondergreen focus:border-transparent"
                                disabled={saving}
                            />

                            <input
                                type="text"
                                value={lastName}
                                onChange={updateLastName}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wondergreen focus:border-transparent"
                                disabled={saving}
                            />
                        </div>

                        <div className="mb-2">
                            <input
                                type="email"
                                value={email}
                                onChange={updateEmail}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wondergreen focus:border-transparent"
                                disabled={saving}
                            />
                        </div>

                        <div className="flex flex-row">
                            <input
                                type="text"
                                value={city}
                                onChange={updateCity}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wondergreen focus:border-transparent"
                                disabled={saving}
                            />

                            <input
                                type="text"
                                value={state}
                                onChange={updateState}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wondergreen focus:border-transparent"
                                disabled={saving}
                            />
                        </div>

                        <div>{currUser?.zipCode}</div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default UpdateUserForm
