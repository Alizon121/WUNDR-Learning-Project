"use client";

import { useEffect, useState } from "react";
import ActivityBlock from "@/components/eventsPage/ActivityBlock";
import { makeApiRequest } from "../../../utils/api";
import Event from "@/types/event";

interface Activity {
  id: string;
  name: string;
  description: string;
  events: Event[];
}

interface GroupedEvents {
  activity: string;
  events: Event[];
}

export default function EventsPage() {
  const [groupedEvents, setGroupedEvents] = useState<GroupedEvents[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");
    console.log("THIS IS THE USER:", user);
    if (user) {
      const userObj = JSON.parse(user);
      setIsAdmin(userObj.role === "admin");
    }
  });

  useEffect(() => {
    const fetchActivitiesWithEvents = async () => {
      try {
        const { activities } = await makeApiRequest<{ activities: Activity[] }>(
          "http://localhost:8000/activity/with-events"
        );

        const formatted: GroupedEvents[] = activities.map((activity) => ({
          activity: activity.name,
          events: activity.events,
        }));

        setGroupedEvents(formatted);
      } catch (err) {
        console.error("Failed to fetch activities with events:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchActivitiesWithEvents();
  }, []);

  return (
    <main className="px-6 py-8 max-w-5xl md:max-w-7xl mx-auto bg-wonderbg min-h-screen">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 text-green-800">
          Upcoming Events
        </h1>
        <p className="text-green-700 max-w-2xl mx-auto text-lg">
          Connect with other homeschooling families through hands-on
          experiences, outdoor adventures, and educational opportunities.
        </p>
        {isAdmin && (
          <button className="mt-2 bg-green-700 text-white px-10 py-2 rounded text-sm font-medium hover:bg-green-800 transition-colors">
            <strong>ADD EVENT</strong>
          </button>
        )}
      </div>

      {groupedEvents.map(({ activity, events }) => (
        // <div>
        <ActivityBlock
          key={activity}
          activityName={activity}
          events={events}
          isAdmin={isAdmin}
        />
        // </div>
      ))}
    </main>
  );
}
