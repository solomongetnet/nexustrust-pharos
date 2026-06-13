export interface NotificationPayload {
  userId: string;
  title: string;
  message: string;
  type: "info" | "warning" | "error" | "success";
}

export interface EmailPayload {
  to: string;
  subject: string;
  body: string;
}

export interface BackgroundTaskPayload {
  taskType: string;
  payload: any;
  priority?: number;
}
