import { useModal } from "@/app/context/modal";
import React, { useState } from "react";
import { makeApiRequest } from "../../../utils/api";
import { NotificationPayload } from "../../../utils/auth";
import { convertStringToIsoFormat } from "../../../utils/formatDate";

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
            time: convertStringToIsoFormat(time)
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
        <div className="rounded-lg p-6 w-full max-w-md mx-auto bg-white shadow-md">
            <h1 className="text-xl font-bold text-center">Send a Notification to All Users</h1>
            <p className="text-sm text-center text-gray-600">
                All registered users will receive an email notification
            </p>

            {/* Title */}
            <div className="mt-4">
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                    name="subject"
                    placeholder="Rock Climbing"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-wondergreen"
                />
                {errors.subject && (
                    <p className="text-sm text-red-600 mt-1">{errors.subject}</p>
                )}
            </div>

            {/* Content */}
            <div className="mt-4">
                <label className="block text-sm font-medium mb-1">Content</label>
                <textarea
                    name="content"
                    placeholder="Write message"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 h-28 resize-none focus:outline-none focus:ring-2 focus:ring-wondergreen"
                ></textarea>
                {errors.content && (
                    <p className="text-sm text-red-600 mt-1">{errors.content}</p>
                )}
            </div>

            {/* Time */}
            <div className="mt-4">
                <label className="block text-sm font-medium mb-1">Time</label>
                <input
                    name="time"
                    placeholder="HH:MM"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-wondergreen"
                />
                {errors.time && (
                    <p className="text-sm text-red-600 mt-1">{errors.time}</p>
                )}
            </div>

            {/* Actions */}
            <div className="flex justify-between mt-6">
                <button
                    onClick={handleNotification}
                    className="border border-black bg-wondergreen hover:bg-wonderleaf rounded w-[100px] text-white py-2 font-medium transition-colors"
                >
                    Send
                </button>
                <button
                    onClick={closeModal}
                    className="border border-black bg-red-600 hover:bg-red-800 rounded w-[100px] text-white py-2 font-medium transition-colors"
                >
                    Cancel
                </button>
            </div>
        </div>
    )
}