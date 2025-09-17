"use client"

import React, { useMemo, useRef, useState } from "react"
import { Views, Calendar, dateFnsLocalizer, type View } from "react-big-calendar"
import { format, getDay, parse, startOfWeek, addHours, addMinutes } from "date-fns"
import {enUS} from 'date-fns/locale';
import { Event } from "@/types/event"
import "react-big-calendar/lib/css/react-big-calendar.css";
import { combineLocal } from "../../../../utils/formatDate";

//placeholders while erika waits for startTime and endTime
const DEFAULT_START = "09:00"
const DEFAULT_DURATION = 60

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0}),
    getDay,
    locales: { "en-US": enUS }
})

// const combineLocal = (dateStr: string, timeStr: string) => {
//     const [y, m, d] = dateStr.split("-").map(Number)
//     const [hh, mm] = timeStr.split(":").map(Number)

//     return new Date(y, (m ?? 1) - 1, d ?? 1, hh ?? 0, mm ?? 0, 0, 0)
// }

type Props = {
    events: Partial<Event>[]
    onPick: (eventId: string) => void
}

const EventCalendar: React.FC<Props> = ({ events, onPick }) => {
    const [date, setDate] = useState<Date>(new Date())
    const [view, setView] = useState<View>(Views.MONTH)

    const calendarEvents = useMemo(() => {
        return (events ?? []).flatMap((e) => {
            if (!e?.id || !e?.name || !e?.date) return []

            const start = combineLocal(e.date, DEFAULT_START)
            const end = addMinutes(start, DEFAULT_DURATION)
            return [{ id: e.id, title: e.name, start, end, resource: e }]
        })
    }, [events])

    return (
        <div className="h-[700px]">
            <Calendar
                localizer={localizer}
                defaultView={Views.MONTH}
                views={{month: true, week: false, day: false, agenda: false}}
                events={calendarEvents}
                date={date}
                onNavigate={(newDate) => setDate(newDate)}
                view={view}
                onView={(v) => setView(v)}
                popup
                onSelectEvent={(ev: any) => {
                    const id = ev?.resource?.id ?? ev?.id
                    if (id && onPick) onPick(String(id))
                }}
            />
        </div>
    )
}

export default EventCalendar
