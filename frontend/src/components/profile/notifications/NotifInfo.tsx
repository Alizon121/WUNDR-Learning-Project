'use client';
//testing for merging

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { formatWhen } from '../../../../utils/formatDate';
import { Notification, NotificationsResponse } from '@/types/notification';
import { makeApiRequest } from '../../../../utils/api';
// type NotifType = 'event' | 'message';

// type Notif = {
//   id: number;
//   type: NotifType;
//   title: string;
//   text: string;
//   timeISO: string;     // ISO-время
//   isRead: boolean;
//   icon: string;
//   eventId?: string;    // для перехода на страницу события
// };

// const initialItems: Notif[] = [
//   {
//     id: 1,
//     type: 'event',
//     title: 'Event Reminder',
//     text: "Mountain Hiking starts tomorrow at 9:00 AM. Don't forget to bring water and comfortable shoes!",
//     timeISO: new Date().toISOString(),
//     isRead: false,
//     icon: '📅',
//     eventId: 'mountain-hiking-123',
//   },
//   {
//     id: 2,
//     type: 'event',
//     title: 'Event Reminder',
//     text: 'Art Workshop at Greenstone Artworks starts tomorrow at 2:00 PM. Materials will be provided.',
//     timeISO: new Date().toISOString(),
//     isRead: false,
//     icon: '🎨',
//     eventId: 'art-workshop-456',
//   },
//   {
//     id: 3,
//     type: 'event',
//     title: 'Event Reminder',
//     text: 'Museum Tour at The Custer County Historical Society starts tomorrow at 10:00 AM.',
//     timeISO: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
//     isRead: true,
//     icon: '🏛️',
//     eventId: 'museum-tour-789',
//   },
//   {
//     id: 4,
//     type: 'message',
//     title: 'Message from WonderHood',
//     text: 'Welcome! Your profile is set up. Feel free to join our upcoming events.',
//     timeISO: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3h ago
//     isRead: false,
//     icon: '📣',
//   },
// ];

type TabKey = 'all' | 'unread' | 'event' | 'message';

export default function Notifications() {
  const [items, setItems] = useState<Notification[]>([]);
  const [tab, setTab] = useState<TabKey>('all');
  const [loading, setLoading] = useState<boolean>(false)
  const [loadErrors, setLoadErrors] = useState<string | null>(null)

  // Set the items (e.g. notifications)
  const fetchNotifications = useCallback(async () => {
    setLoading(false)

    try {
      const response: NotificationsResponse = await makeApiRequest("http://localhost:8000/notifications/")
      setItems(response?.Notifications)
      setLoadErrors(null)
    } catch (e) {
      if (e instanceof Error) {
        setLoadErrors(e.message)
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])


  const unreadCount = useMemo(() => items.filter(i => !i.isRead).length, [items]);

  const filtered = useMemo(() => {
    switch (tab) {
      case 'unread':
        return items.filter(i => !i.isRead);
      //     case 'event':
      //       return items.filter(i => i.type === 'event');
      //     case 'message':
      //       return items.filter(i => i.type === 'message');
      default:
        return items;
    }
  }, [items, tab]);

  const markAsRead = async (id: string) => {
    try {
      await makeApiRequest(`http://localhost:8000/notifications/${id}`, {
        method: "PATCH",
        body: { isRead: true }  // This gets JSON.stringify'd automatically
      });
      setItems(prev =>
        prev.map(notification =>
          notification.id === id
            ? { ...notification, isRead: true }
            : notification
        )
      );
    } catch (e) {
      console.error("Failed to update notification", e)
    }
  }

  const markAllRead = async () => {
    try {
      const unreadNotifications = items.filter(item => !item.isRead);

      // Make API calls for each unread notification
      const updatePromises = unreadNotifications.map(notification =>
        makeApiRequest(`http://localhost:8000/notifications/${notification.id}`, {
          method: "PATCH",
          body: { isRead: true }
        })
      );

      // Wait for all API calls to complete
      await Promise.all(updatePromises);

      setItems(prev => prev.map(i =>
        ({ ...i, isRead: true })
      ))
    } catch (e) {
      if (e instanceof Error) {
        setLoadErrors(e.message)
      }
    }
  }


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold text-wondergreen">
          Your Notifications
        </h1>
        <button
          type="button"
          onClick={markAllRead}
          className="text-sm text-wonderleaf hover:underline"
        >
          Mark all as read
        </button>
      </div>

      {/* Subtabs */}
      <div className="flex gap-2 md:gap-3 flex-wrap">
        <TabButton active={tab === 'all'} onClick={() => setTab('all')}>
          All
        </TabButton>

        <TabButton active={tab === 'unread'} onClick={() => setTab('unread')}>
          Unread
          {unreadCount > 0 && (
            <span className="ml-2 inline-flex min-w-5 h-5 px-1 items-center justify-center rounded-full bg-wondergreen/10 text-wondergreen text-xs font-semibold">
              {unreadCount}
            </span>
          )}
        </TabButton>

        {/* <TabButton active={tab === 'event'} onClick={() => setTab('event')}>
          Event Reminders
        </TabButton>

        <TabButton active={tab === 'message'} onClick={() => setTab('message')}>
          Messages <span className="ml-1 opacity-70">(From WonderHood)</span>
        </TabButton> */}
      </div>

      {/* List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="rounded-xl border border-wonderleaf/30 bg-white p-8 text-center text-gray-500">
            No notifications here yet.
          </div>
        ) : (
          filtered
            .slice()
            // .sort((a, b) => +new Date(b.timeISO) - +new Date(a.timeISO))
            .map(n => (
              <div
                key={n.id}
                className={`rounded-xl border p-5 md:p-6 bg-white transition ${n.isRead
                  ? 'border-wonderleaf/40'
                  : 'border-wondergreen bg-wondergreen/5'
                  }`}
              >
                <div className="flex items-start gap-4">
                  {/* <div className="text-2xl leading-6">{n.icon}</div> */}

                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-x-2">
                      <div className="font-semibold text-gray-900">
                        {n.title}
                      </div>
                      {/* {n.type === 'message' && (
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-wonderleaf/10 text-wonderleaf uppercase tracking-wide">
                          From WonderHood
                        </span>
                      )} */}
                    </div>

                    <p className="text-gray-700 mt-1">{n.description}</p>

                    <div className="mt-3 flex items-center gap-3 text-sm">
                      <span className="text-gray-400">{formatWhen(n.time)}</span>

                      {/* {n.type === 'event' && (
                        <>
                          <span className="text-gray-300">•</span>
                          <Link
                            href={n.eventId ? `/events/${n.eventId}` : '/events'}
                            className="text-wondergreen hover:text-wonderleaf font-medium"
                          >
                            View Event
                          </Link>
                        </>
                      )} */}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => markAsRead(n?.id)}
                    className="text-sm text-gray-400 hover:text-wonderleaf"
                  >
                    {n.isRead === false ? "Mark as read" : ""}
                  </button>
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  );
}

/* ─── UI helper ────────────────────────────────────────────────────────────── */

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 md:px-4 py-2 rounded-full text-sm transition
        ${active
          ? 'bg-white text-wondergreen border border-wondergreen shadow-sm'
          : 'bg-white/70 text-gray-700 border border-transparent hover:border-wonderleaf/40'
        }`}
    >
      {children}
    </button>
  );
}
