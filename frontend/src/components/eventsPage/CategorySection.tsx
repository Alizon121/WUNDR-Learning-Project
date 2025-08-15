import ActivityBlock from "./ActivityBlock";

interface Props {
    categoryName: string;
    activities: { name: string; events: any[] }[];
}

export default function CategorySection({ categoryName, activities }: Props) {
    return (
        <section className="mb-10">
            <h2 className="text-2x1 font-semibold mb-4">{categoryName}</h2>

            {activities.map(({ name, events }) => (
                <ActivityBlock key={name} activityName={name} events={events} />
            ))}
        </section>
    )
}