"use client"

import Image from "next/image"
import { useParams } from "next/navigation"
import { useEvent } from "../../../../hooks/useEvent"
// import { useState, useEffect } from "react"

interface Event {
    eventId: string
    eventName: string
    eventImage: string
    eventDate: string
    eventDescription: string
}


export default function EventsDetailPage() {
    const { eventId } = useParams()
    const { event, loading, error, refetch } = useEvent(eventId)

    console.log("ALALALA", event?.name)

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div>Loading event details...</div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-red-500">
                    Error: {error}
                    <button
                        onClick={refetch}
                        className="ml-4 bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        Retry
                    </button>
                </div>
            </div>
        )
    }

    if (!event) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div>Event not found</div>
            </div>
        )
    }

    return (
        <div>
            <header>
                <h1>View Details Below</h1>
                <img
                    src={event?.image}
                    alt={event?.name}
                    width={800}
                    height={300}
                    className="h-[300px] w-[800px] object-cover"
                />
            </header>

            <main>
                <div>
                    <h2>{event?.name} - {event?.date}</h2>
                    <p>{event?.description}</p>
                </div>
            </main>

            <div>
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => console.log("Enrolling in event:", event?.id)}
                >
                    Enroll in Event
                </button>
            </div>
        </div>
    )
}