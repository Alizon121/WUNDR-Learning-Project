import EventCard from "./EventCard";

interface Props {
    activityName: string;
    events: any[];
}

const getActivityIcon = (activityname: string) => {
    
}

export default function ActivityBlock({ activityName, events }: Props) {
    return (
        <div className="mb-6">
            <h3 className="text-xl font-medium mb-2">{activityName}</h3>

            <div className="flex overflow-x-auto space-x-4 pb-2">
                {events.length > 0 ? (
                    events.map((event, idx) => <EventCard key={idx} event={event} />)
                ) : (
                        <p className="text-gray-500">No events yet</p>
                )}
            </div>
        </div>
    )
}