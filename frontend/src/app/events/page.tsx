import CategorySection from "@/components/eventsPage/CategorySection"

const mockData = [
    {
        category: "Outdoor",
        activities: [
            { name: "Hiking", events: [/* maybe put event objects here */] },
            { name: "Skiing", events: [] }
        ]
    },
    {
        category: "Indoor",
        activities: [
            { name: "Museum Trip", events: [] },
            { name: "Crafting", events: [] }
        ]
    },
    {
        category: "STEM",
        activities: [
            { name: "Mycology", events: [] },
            { name: "Coding", events: [] }
        ]
    }
        
]

export default function EventsPage() {
    return (
        <main className="px-6-8">
            {/* <h1 className="text-3x1 font-bold mb-6 text-center">Events</h1> */}

            {mockData.map(({ category, activities }) => (
                <CategorySection
                    key={category}
                    categoryName={category}
                    activities={activities}
                />
            ))}
        </main>
    );
}