"use client"

import { FaCircleChevronLeft, FaCircleChevronRight } from "react-icons/fa6"
import useGetAllEvents from "../../../../hooks/useGetAllEvents"
import { useUser } from "../../../../hooks/useUser"
import { formatDate } from "../../../../utils/formatDate"
import { useMemo, useRef, useState } from "react"
import EventCalendar from "./calendar"
import Link from "next/link"


const YourEvents = () => {
    const { events, loading, error, refetch } = useGetAllEvents()
    const { user } = useUser()
    const [currEventIdx, setCurrEventIdx] = useState(0)
    const cardsRef = useRef<HTMLDivElement>(null)

    const usersEvents = useMemo(() => (events ?? []).map((event) => ({
        id: event.id,
        name: event.name,
        description: event.description,
        city: event.city,
        date: event.date,
        // startTime: event.startTime,
        // endTime: event.endTime,
        childIds: (user?.children ?? []).filter(child => (event.childIDs ?? []).includes(child.id))
    })), [events, user])

    const visibleEvents = Array.from({ length: Math.min(2, usersEvents.length) }, (_, i) => {
        const idx = (((currEventIdx + i) % usersEvents.length) + usersEvents.length) % usersEvents.length
        return usersEvents[idx]
    })

    const handleNext = () => {
        if (usersEvents.length > 0) setCurrEventIdx((prevIdx) => (((prevIdx + 2) % usersEvents.length) + usersEvents.length) % usersEvents.length)
    }
    const handlePrev = () => {
        if (usersEvents.length > 0) setCurrEventIdx((prevIdx) => (((prevIdx - 2) % usersEvents.length) + usersEvents.length) % usersEvents.length)
    }

    const handlePickFromCalendar = (eventId: string) => {
        const idx = usersEvents.findIndex(e => e.id === eventId)
        if (idx < 0) return

        setCurrEventIdx(idx)

        cardsRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start"
        })
    }

    if (loading) return <div className="flex justify-center items-center min-h-[200px]">Loading...</div>

    return (
        <div>
            <div className="text-center mb-[40px]">
                <h1 className="text-4xl font-bold text-wondergreen mb-4">Your Events</h1>
                <h2 className="max-w-2xl mx-auto text-lg text-wondergreen">Manage all the events you and children are enrolled in</h2>
            </div>

            <div ref={cardsRef} className="scroll-mt-24 aria-hidden" />
            <div className="flex flex-row gap-6 my-10">
                {usersEvents.length > 2 && (
                    <FaCircleChevronLeft className="w-[50px] h-[50px] cursor-pointer my-auto" onClick={handlePrev}/>
                )}

                {visibleEvents.map((event) => {
                    const children = event.childIds?.map((child: { firstName?: string; lastName?: string }) =>
                        [child.firstName, child.lastName].filter(Boolean).join(" ")) ?? []

                    return (
                        <div key={event.id} className="basis-1/2 max-w-3xl w-full mx-auto">
                            <Link href={`/events/${event.id}`}>
                                <div className="bg-white rounded-lg p-6 min-h-[350px]">
                                    <div className="mb-6">
                                        <div className="inline-block bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold mb-4">
                                            {formatDate(event.date)}
                                        </div>

                                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                            {event.name} in {event.city}
                                        </h3>

                                        <p className="text-gray-600 text-sm mb-4 line-clamp-2 min-h-[3.5rem]">
                                            {event.description}
                                        </p>
                                    </div>

                                    <div className="flex flex-col justify-center mt-auto">
                                        <p className="text-xs text-gray-500 mb-2">Your Children Enrolled:</p>
                                        {children.length && (
                                            <ul className="list-disc pl-5 text-xs text-gray-700 space-y-0.5">
                                                {children.map((name, i) => (
                                                    <li key={`${event.id}-${i}`}>{name}</li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        </div>
                    )
                })}

                {usersEvents.length > 2 && (
                    <FaCircleChevronRight className="w-[50px] h-[50px] cursor-pointer my-auto" onClick={handleNext}/>
                )}
            </div>

            <EventCalendar events={usersEvents} onPick={handlePickFromCalendar}/>
        </div>
    )
}

export default YourEvents
