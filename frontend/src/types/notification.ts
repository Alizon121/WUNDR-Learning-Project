export type Notification = {
    id: string;
    title: string;
    description: string;
    isRead: boolean;
    time: Date;
}

export type NotificationsResponse = {
    Notifications: Notification[]
}