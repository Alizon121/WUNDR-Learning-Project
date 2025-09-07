import { Child } from "@/types/child"
import React, { useEffect, useMemo, useState } from "react"
import { makeApiRequest } from "../../../../utils/api"
import { FaCheck } from "react-icons/fa"
import { FaX } from "react-icons/fa6"

type Props = {
    currChild: Child
    setEditingChildId: (id: string | null) => void
}

const gradeOptions = [
    { value: -1, label: "Pre-K" },
    { value: 0,  label: "Kindergarten" },
    ...Array.from({ length: 12 }, (_, i) => {
        const g = i + 1;
        return { value: g, label: g };
    }),
]

const UpdateChildForm: React.FC<Props> = ({ currChild, setEditingChildId }) => {
    const [firstName, setFirstName] = useState<string>("")
    const [preferredName, setPreferredName] = useState<string>("")
    const [lastName, setLastName] = useState<string>("")
    const [birthday, setBirthday] = useState<string>("")
    const [grade, setGrade] = useState<number | null>(null)
    const [photoConsent, setPhotoConsent] = useState(false)
    const [allergiesMedical, setAllergiesMedical] = useState<string>("")
    const [notes, setNotes] = useState<string>("")
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        setFirstName(currChild.firstName ?? "")
        setPreferredName(currChild.preferredName ?? "")
        setLastName(currChild.lastName ?? "")
        setGrade(currChild.grade ?? null)
        setPhotoConsent(currChild.photoConsent)
        setAllergiesMedical(currChild.allergiesMedical ?? "")
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
    const updatePreferredName = (e: React.ChangeEvent<HTMLInputElement>) => setPreferredName(e.target.value)
    const updateLastName = (e: React.ChangeEvent<HTMLInputElement>) => setLastName(e.target.value)
    const updateBirthday = (e: React.ChangeEvent<HTMLInputElement>) => setBirthday(e.target.value)
    const updateAllergiesMedical = (e: React.ChangeEvent<HTMLTextAreaElement>) => setAllergiesMedical(e.target.value)
    const updateNotes = (e: React.ChangeEvent<HTMLTextAreaElement>) => setNotes(e.target.value)
    const updateGrade: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
        const n = e.currentTarget.value
        if (n === "") return setGrade(null)
        setGrade(Number(n))
    }

    const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!isValid || saving) return

        const payload = {
            firstName: firstName?.trim(),
            preferredName: preferredName === "" ? null : preferredName?.trim(),
            lastName: lastName?.trim(),
            birthday: new Date(birthday).toISOString(),
            grade,
            photoConsent,
            allergiesMedical: allergiesMedical === "" ? null : allergiesMedical?.trim(),
            notes: notes === "" ? null : notes?.trim()
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

    return (
        <div className="bg-white rounded-lg p-6">
            <form onSubmit={handleUpdate}>
                <div className="mb-6">
                    <div className="flex items-start justify-between">
                        <div className="w-[300px]">
                            <div className="grid grid-cols-2 gap-2">
                                <input
                                    type="text"
                                    value={firstName}
                                    onChange={updateFirstName}
                                    placeholder="Legal First Name"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wondergreen focus:border-transparent"
                                    disabled={saving}
                                />

                                <input
                                    type="text"
                                    value={lastName}
                                    onChange={updateLastName}
                                    placeholder="Legal Last Name"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wondergreen focus:border-transparent"
                                    disabled={saving}
                                />

                                <input
                                    type="text"
                                    value={preferredName}
                                    onChange={updatePreferredName}
                                    placeholder="OPTIONAL: Preferred Name"
                                    className="col-span-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wondergreen focus:border-transparent"
                                    disabled={saving}
                                />
                            </div>
                        </div>

                        <div className="flex gap-2 ml-4">
                            <button
                                type="submit"
                                disabled={!isValid || saving}
                                className="p-2 text-green-600 hover:text-green-700 disabled:text-gray-400 disabled:cursor-not-allowed"
                            >
                                <FaCheck className="w-4 h-4" />
                            </button>

                            <button
                                type="button"
                                onClick={() => setEditingChildId(null)}
                                disabled={saving}
                                className="p-2 text-red-600 hover:text-red-700 disabled:text-gray-400 disabled:cursor-not-allowed"
                            >
                                <FaX className="w-4 h-4" />
                            </button>
                        </div>
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
                    <div className="font-bold">PARENT/GUARDIANS</div>
                    <div className="text-gray-500 text-sm mt-1 ml-2">{currChild.parents.map((p) => `${p.firstName} ${p.lastName}`)}</div>
                </div>

                <div className="mb-4">
                    <div className="font-bold">HOMESCHOOL PROGRAM</div>
                    <div className="text-gray-500 text-sm mt-1 ml-2">Coming soon...</div>
                </div>

                <div className="flex flex-row justify-between mb-4">
                    <div>
                        <div className="font-bold mb-2">GRADE (OPTIONAL)</div>
                        <select
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wondergreen focus:border-transparent"
                            value={grade ?? ""}
                            onChange={updateGrade}
                        >
                            <option value="">N/A</option>
                            {gradeOptions.map(o => (
                                <option key={o.value} value={o.value}>{o.label}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <div className="font-bold mb-2">PHOTO CONSENT</div>
                        <input
                            type="checkbox"
                            checked={photoConsent}
                            onChange={(e) => setPhotoConsent(e.currentTarget.checked)}
                            disabled={saving}
                        />
                    </div>
                </div>

                <div className="mb-4 border-t pt-4">
                    <div className="font-bold">MEDICAL ACCOMMODATIONS</div>
                    <textarea
                        value={allergiesMedical}
                        onChange={updateAllergiesMedical}
                        placeholder="List any allergies or medical accommodations"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wondergreen focus:border-transparent"
                        disabled={saving}
                    />
                </div>

                <div className="mb-4 border-t pt-4">
                    <div className="font-bold">ADDITIONAL NOTES</div>
                    <textarea
                        value={notes}
                        onChange={updateNotes}
                        placeholder="Optional: Please note any information that would be beneficial for instructor"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wondergreen focus:border-transparent"
                        disabled={saving}
                    />
                </div>
            </form>
        </div>
    )
}

export default UpdateChildForm
