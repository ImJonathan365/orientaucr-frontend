export interface NotificationEvent {
  event: { eventId: string };
}

export interface Notification {
  notificationId?: string;
  notificationTitle: string;
  notificationMessage: string;
  notificationSendDate: string;
  notificationEvents: NotificationEvent[];
  attachments?: File[];
}