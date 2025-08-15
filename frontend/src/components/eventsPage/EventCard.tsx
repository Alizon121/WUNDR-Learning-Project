interface Props {
    event: any;
}

export default function EventCard({ event }: Props) {
    return (
        <div className="min-w-[200px] bg-white border rounded shadow p-4">
            <p className="font-semibold">Event Title</p>
            <p className="text-sm text-gray-600">Date TBD</p>
        </div>
    )
}