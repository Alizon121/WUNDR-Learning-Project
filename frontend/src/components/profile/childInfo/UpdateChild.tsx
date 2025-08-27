import { Child } from "@/types/child"
import React, { useEffect, useMemo, useState } from "react"
import { makeApiRequest } from "../../../../utils/api"
import { FaCheck } from "react-icons/fa"
import { FaX } from "react-icons/fa6"

type Props = {
    currChild: Child
    setEditingChildId: (id: string | null) => void
}

const UpdateChildForm: React.FC<Props> = ({ currChild, setEditingChildId }) => {
    const [firstName, setFirstName] = useState<string>("")
    const [lastName, setLastName] = useState<string>("")
    const [birthday, setBirthday] = useState<string>("")
    const [notes, setNotes] = useState<string>("")
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        setFirstName(currChild.firstName ?? "")
        setLastName(currChild.lastName ?? "")
        setNotes(currChild.notes ?? "")

        if (currChild.birthday) {
            const date = new Date(currChild.birthday)
            const formattedDate = date.toISOString().split("T")[0]
            setBirthday(formattedDate)
        } else {
            setBirthday("")
        }
    }, [currChild.id])

    const isValid = useMemo(() => Boolean(firstName?.trim() && lastName?.trim()), [firstName, lastName])

    const updateFirstName = (e: React.ChangeEvent<HTMLInputElement>) => setFirstName(e.target.value)
    const updateLastName = (e: React.ChangeEvent<HTMLInputElement>) => setLastName(e.target.value)
    const updateBirthday = (e: React.ChangeEvent<HTMLInputElement>) => setBirthday(e.target.value)
    const updateNotes = (e: React.ChangeEvent<HTMLTextAreaElement>) => setNotes(e.target.value)

    const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!isValid || saving) return

        const payload = {
            firstName: firstName?.trim(),
            lastName: lastName?.trim(),
            birthday: new Date(birthday).toISOString(),
            notes: notes?.trim()
        }

        console.log('look here', payload)

        try {
            setSaving(true)
            await makeApiRequest(`http://localhost:8000/child/${currChild.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: payload
            })
            setEditingChildId(null)
        } catch (err) {
            console.error("update failed", err)
        } finally {
            setSaving(false)
        }
    }

    const resetAndClose = () => {
        setFirstName(currChild.firstName ?? "")
        setLastName(currChild.lastName ?? "")
        setBirthday(currChild.birthday ?? "")
        setEditingChildId(null)
    }

    return (
        <div className="bg-white rounded-lg p-6">
            <form onSubmit={handleUpdate}>
                <div className="flex justify-between items-center mb-6 w-fit">
                    <div className="flex gap-2 flex-1 max-w-[280px]">
                        <input
                            type="text"
                            value={firstName}
                            onChange={updateFirstName}
                            placeholder="First Name"
                            className="flex-1 px-3 py-2 max-w-[140px] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wondergreen focus:border-transparent"
                            disabled={saving}
                        />
                        <input
                            type="text"
                            value={lastName}
                            onChange={updateLastName}
                            placeholder="Last Name"
                            className="flex-1 px-3 py-2 max-w-[140px] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wondergreen focus:border-transparent"
                            disabled={saving}
                        />
                    </div>

                    <div className="flex flex-row gap-2 ml-4">
                        <button
                            type="submit"
                            disabled={!isValid || saving}
                            className="p-2 text-green-600 hover:text-green-700 disabled:text-gray-400 disabled:cursor-not-allowed"
                        >
                            <FaCheck className="w-4 h-4" />
                        </button>
                        <button
                            type="button"
                            onClick={resetAndClose}
                            disabled={saving}
                            className="p-2 text-red-600 hover:text-red-700 disabled:text-gray-400 disabled:cursor-not-allowed"
                        >
                            <FaX className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="mb-4">
                    <div className="font-bold mb-2">BIRTHDAY</div>
                    <input
                        type="date"
                        value={birthday}
                        onChange={updateBirthday}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wondergreen focus:border-transparent"
                        disabled={saving}
                    />
                </div>

                <div className="mb-4">
                    <div className="font-bold">HOMESCHOOL PROGRAM</div>
                    <div className="text-gray-500 text-sm mt-1">Coming soon...</div>
                </div>

                <div className="mb-4 border-t pt-4">
                    <div className="font-bold">NOTES/ACCOMMODATIONS</div>
                    <textarea
                        value={notes}
                        onChange={updateNotes}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wondergreen focus:border-transparent"
                        disabled={saving}
                    />
                </div>
            </form>
        </div>
    )
}

export default UpdateChildForm
