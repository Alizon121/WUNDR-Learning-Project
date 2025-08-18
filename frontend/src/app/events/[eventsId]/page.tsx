"use client"

import Image from "next/image"
import { makeApiRequest } from "../../../../utils/api"
import { useParams } from "next/navigation"
import { useState, useEffect } from "react"

interface Event {
    eventId: string
    eventName: string
    eventImage: string
    eventDate: string
    eventDescription: string
}

export function useEvent() {
    const [event, setEvent] = useState<Event | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {

    })
}

const { eventIdUrl } = useParams()
const event = makeApiRequest(`http://localhost:8000/events/${eventIdUrl}/`, {
    method: "GET",
})

export default function EventsDetailPage({ }) {
    return (
        <div>
            {/* Header */}
            <header>
                <h1>View Details Below</h1>
                <Image
                    src={`${params.eventImage}`}
                    alt={`${params.eventName}`}
                    className="h-[300px] w-[800px]"
                />

            </header>
            <body>
                <div>
                    <h2>{`${params.eventName} - ${params.eventDate}`}</h2>
                    <p>
                        {`${params.eventDescription}`}
                    </p>
                </div>
            </body>
            <div>
                <button>Enroll in Event</button>
            </div>


        </div>
    )


}