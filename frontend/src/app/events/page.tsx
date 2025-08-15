import ActivityBlock from "@/components/eventsPage/ActivityBlock";

const mockData = [
    {
        activity: "Outdoor",
        events: [
            { id: "1", name: "Mountain Hiking Adventure", date: "2025-08-20", description: "Explore beautiful trails" },
            { id: "2", name: "Nature Scavenger Hunt", date: "2025-08-25", description: "Find natural treasures" },
        ]
    },
    {
        activity: "Indoor",
        events: [
            { id: "3", name: "Museum Tour", date: "2025-08-22", description: "Local history exploration" },
            { id: "4", name: "Art Workshop", date: "2025-08-28", description: "Creative expression session" }
        ]
    },
    {
        activity: "STEM",
        events: [
            { id: "5", name: "Robotics Workshop", date: "2025-08-24", description: "Build and program robots" },
            { id: "6", name: "Science Experiments", date: "2025-09-03", description: "Fun chemistry and physics" }
        ]
    }
]

export default function EventsPage() {
    return (
        <main className="px-6 py-8 max-w-7x1 mx-auto">
            
            <div className="text-center mb-8">
                <h1 className="text-3x1 font-bold mb-4">Upcoming Events</h1>
                <p className="text-gray-600 max-w-2x1 mx-auto">
                    Connect with other homeschooling families through hands-on experiences, outdoor adventures, and educational opportunities.
                </p>
            </div>

            {mockData.map(({ activity, events }) => (
                <ActivityBlock
                    key={activity}
                    activityName={activity}
                    events={events}
                />
            ))}
        </main>
    )
}