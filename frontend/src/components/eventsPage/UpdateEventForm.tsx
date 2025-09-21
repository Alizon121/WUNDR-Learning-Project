"use client"

import { useParams } from "next/navigation"
import { useEvent } from "../../../hooks/useEvent"

export default function UpdateEventForm() {
    const { eventId } = useParams()
    const { event, loading, error, refetch } = useEvent(eventId)

    console.log("LALAL", event)

    return (
        <>
        </>
    )
}