import { Event } from "@/types/event"
import { useEffect, useState } from "react"
import { makeApiRequest } from "../utils/api"

type EventsResponse = { events: Event[]}

const useGetAllEvents = () => {
    const [events, setEvents] = useState<Event[] | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchAllEvents = async () => {
        try {
            setLoading(true)
            setError(null)

            const data = await makeApiRequest<EventsResponse>(`http://localhost:8000/event`)
            setEvents(data.events)
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to fetch all user's current enrolled events")
            setEvents(null)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchAllEvents()
    }, [])

    const refetch = () => {
        setLoading(true)
        setError(null)
        fetchAllEvents()
    }

    return { events, loading, error, refetch }
}

export default useGetAllEvents
