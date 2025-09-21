import { useModal } from "@/app/context/modal";
import React, { useState } from "react";
import { makeApiRequest } from "../../../utils/api";
import { NotificationPayload } from "../../../utils/auth";

type ModalErrors = Partial<Record<
    "subject" |
    "time" |
    "content", string
>>

export function BlastNotificationModal() {
    const { closeModal } = useModal();
    const [isNotifying, setIsNotifying] = useState(false);
    const [subject, setSubject] = useState<string>("")
    const [content, setContent] = useState<string>("")
    const [time, setTime] = useState<string>("")
    const [errors, setErrors] = useState<ModalErrors>({})
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

    const handleNotification = async () => {
        setIsNotifying(true)

        setErrors({})
        const newErrors: ModalErrors = {}

        // * Add Validations Here
        // Validate Subject
        if (subject.length < 2) newErrors.subject = "Must be greater than 2 characters"

        // Validate Content
        if (content.length < 2) newErrors.content = "Must be greater than 2 characters"

        if (content.length > 500) newErrors.content = "Must be less than 500 characters"

        // Validate Time
        if (!timeRegex.test(time)) newErrors.time = "Invalid date format"

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
        }

        const payload: NotificationPayload = {
            subject,
            content,
            time
        }

        try {
            await makeApiRequest("http://localhost:8000/notifications", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: payload
            })
            closeModal()
        } catch (e) {
            throw Error(`Unable to create blast notification: ${e}`)
        } finally {
            setIsNotifying(false)
        }
    }

    return (
        <div className="rounded-lg p-6 w-fit">
            <h1 className="text-xl font-bold text-center">Send a Notification to All Users</h1>
            <p className="sm:text-sm text-center">All registered users will receive an email notification</p>
            <div className="flex flex-row mt-3 justify-around">
                <label>
                    Title
                </label>
                <input
                    name="subject"
                    placeholder="Rock Climbing"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="border border-black-900 rounded w-fit"
                />
            </div>
            {errors.subject && <p className="text-sm text-red-600 mt-1 text-center">{errors.subject}</p>}

            <div className="flex flex-row mt-3 justify-around">
                <label className="mr-2">
                    Content
                </label>
                <textarea
                    name="content"
                    placeholder="Write message"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="h-fit w-fit"
                ></textarea>
            </div>
            {errors.content && <p className="text-sm text-red-600 mt-1 text-center">{errors.content}</p>}

            <div className="flex flex-row mt-3 justify-around">
                <label>
                    Time
                </label>
                <input
                    name="time"
                    placeholder="HH:MM"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                />
            </div>
            {errors.time && <p className="text-sm text-red-600 mt-1 text-center">{errors.time}</p>}

            <div className="flex flex-row justify-evenly mt-4">
                <button onClick={handleNotification} className="border border-black-800 bg-wondergreen hover:bg-wonderleaf rounded w-[90px] text-white py-1 px-2">Send</button>
                <button onClick={closeModal} className="border border-black-800 bg-red-600 hover:bg-red-800 rounded w-[90px] text-white py-1 px-2">Cancel</button>
            </div>
        </div>
    )
}