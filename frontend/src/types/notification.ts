export type Notification = {
    id: string;
    title: string;
    description: string;
    isRead: boolean;
    time: string;
}

export type NotificationsResponse = {
    Notifications: Notification[]
}