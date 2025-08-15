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
        <main className="px-6 py-8 max-w-7xl mx-auto bg-amber-50 min-h-screen">
            
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-4 text-green-800">Upcoming Events</h1>
                <p className="text-green-700 max-w-2xl mx-auto text-lg">
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