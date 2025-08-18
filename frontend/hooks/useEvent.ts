import { useState, useEffect } from "react"
import { makeApiRequest } from "../utils/api"

interface Event {
  eventId: string
  eventName: string
  eventImage: string
  eventDate: string
  eventDescription: string
}

export function useEvent(eventId: string | string[] | undefined) {
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchEvent = async () => {
      if (!eventId || Array.isArray(eventId)) {
        setError("Invalid event ID")
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)
        const eventData = await makeApiRequest<Event>(
          `http://localhost:8000/events/${eventId}/`,
          { method: "GET" }
        )
        setEvent(eventData)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch event")
        setEvent(null)
      } finally {
        setLoading(false)
      }
    }

    fetchEvent()
  }, [eventId])

  const refetch = () => {
    if (eventId && !Array.isArray(eventId)) {
      setLoading(true)
      setError(null)
      // Re-trigger the effect
      fetchEvent()
    }
  }

  return { event, loading, error, refetch }
}