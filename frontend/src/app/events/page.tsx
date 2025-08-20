"use client"

import { useEffect, useState } from "react";
import ActivityBlock from "@/components/eventsPage/ActivityBlock";
import { makeApiRequest } from "../../../utils/api";

// const mockData = [
//     {
//         activity: "Outdoor",
//         events: [
//             { id: "1", name: "Mountain Hiking Adventure", date: "2025-08-20", description: "Explore beautiful trails" },
//             { id: "2", name: "Nature Scavenger Hunt", date: "2025-08-25", description: "Find natural treasures" },
//         ]
//     },
//     {
//         activity: "Indoor",
//         events: [
//             { id: "3", name: "Museum Tour", date: "2025-08-22", description: "Local history exploration" },
//             { id: "4", name: "Art Workshop", date: "2025-08-28", description: "Creative expression session" }
//         ]
//     },
//     {
//         activity: "STEM",
//         events: [
//             { id: "5", name: "Robotics Workshop", date: "2025-08-24", description: "Build and program robots" },
//             { id: "6", name: "Science Experiments", date: "2025-09-03", description: "Fun chemistry and physics" }
//         ]
//     }
// ]

interface Event {
    id: string;
    name: string;
    description: string;
    date: string;
    image: string;
    participants: number;
    activityId: string
}

interface Activity {
    id: string;
    name: string;
    description: string;
}

interface GroupedEvents {
    activity: string;
    events: Event[]
}

export default function EventsPage() {
    const [groupedEvents, setGroupedEvents] = useState<GroupedEvents[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {

            try {
                // Fetch events
                const { events } = await makeApiRequest<{ events: Event[] }>(
                    "http://localhost:8000/event"
                );

                // Fetch unique activityIds
                const activityIds = [...new Set(events.map((e) => e.activityId))];

                // Fetch activities by ID
                const activityMap: Record<string, string> = {};

                await Promise.all(
                    activityIds.map(async (id) => {
                        const activity = await makeApiRequest<Activity>(
                            `http://localhost:8000/activity/${id}`
                        );

                        activityMap[id] = activity.name;
                    })
                )

                // Group events by activity name
                const grouped: Record<string, Event[]> = {};
                
                events.forEach((event) => {
                    const activityName = activityMap[event.activityId] || "Unknown";

                    if (!grouped[activityName]) grouped[activityName] = [];

                    grouped[activityName].push(event)
                });

                // Convert into an array
                const formatted: GroupedEvents[] = Object.entries(grouped).map(
                    ([activity, events]) => ({
                        activity,
                        events
                    })
                );

                setGroupedEvents(formatted);

            } catch (err) {
                console.error("Failed to fetch events:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    return (
        <main className="px-6 py-8 max-w-5xl md:max-w-7xl mx-auto bg-wonderbg min-h-screen">

            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-4 text-green-800">Upcoming Events</h1>
                <p className="text-green-700 max-w-2xl mx-auto text-lg">
                    Connect with other homeschooling families through hands-on experiences, outdoor adventures, and educational opportunities.
                </p>
            </div>

            {groupedEvents.map(({ activity, events }) => (

                <div>
                    <ActivityBlock
                        key={activity}
                        activityName={activity}
                        events={events}
                    />
                </div>
            ))}
        </main>
    )
}