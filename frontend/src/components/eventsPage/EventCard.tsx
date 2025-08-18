interface Event {
    id: string;
    name: string;
    date: string;
    description: string;
}

interface Props {
    event: Event;
}

const formatDate = (dateString: string) => {
    const date = new Date(dateString);

    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
};

export default function EventCard({ event }: Props) {
    return (
        <div className="flex-shrink-0 w-80 bg-white border rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">

            {/* Date Badge */}
            <div className="inline-block bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold mb-4">
                {formatDate(event.date)}
            </div>

            {/* Event Content */}
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {event.name}
            </h3>
            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {event.description}
            </p>

            {/* Event Metadata */}
            <div className="flex flex-col justify-center mt-auto">
                <span className="text-xs text-gray-500 mb-2">
                    5 families signed up
                </span>
                <button className="bg-green-700 text-white px-4 py-2 rounded text-sm font-medium hover:bg-green-800 transition-colors">
                    View Details
                </button>
            </div>

        </div>
    )
}