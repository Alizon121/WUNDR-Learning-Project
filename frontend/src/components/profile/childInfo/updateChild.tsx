import { Child } from "@/types/child"
import React, { useEffect, useMemo, useState } from "react"
import { makeApiRequest } from "../../../../utils/api"

type Props = {
    currChild: Child
    setIsEditing: (val: boolean) => void
}

const UpdateChildForm: React.FC<Props> = ({ currChild, setIsEditing }) => {
    const [firstName, setFirstName] = useState<string>("")
    const [lastName, setLastName] = useState<string>("")
    const [birthday, setBirthday] = useState<string>("")
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        setFirstName(currChild.firstName ?? "")
        setLastName(currChild.lastName ?? "")
        setBirthday(currChild.birthday ?? "")
    }, [currChild.id])

    const isValid = useMemo(() => Boolean(firstName?.trim() && lastName?.trim()), [firstName, lastName])

    const updateFirstName = (e: React.ChangeEvent<HTMLInputElement>) => setFirstName(e.target.value)
    const updateLastName = (e: React.ChangeEvent<HTMLInputElement>) => setLastName(e.target.value)

    const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!isValid || saving) return

        const payload = {
            firstName: firstName?.trim(),
            lastName: lastName?.trim(),
            birthday: new Date(birthday).toISOString()
        }

        try {
            setSaving(true)
            await makeApiRequest(`http://localhost:8000/child/${currChild.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: payload
            })
            setIsEditing(false)
        } catch (err) {
            console.error("update failed", err)
        } finally {
            setSaving(false)
        }
    }

    const resetAndClose = () => {
        setFirstName(currChild.firstName ?? "")
        setLastName(currChild.lastName ?? "")
        setIsEditing(false)
    }

    return (
        <></>
    )
}

export default UpdateChildForm
