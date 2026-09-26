import { getAccessToken, googleSignIn } from '../lib/auth';

export interface EmailPayload {
  to: string;
  subject: string;
  bodyText?: string;
  bodyHtml?: string;
  category?: string;
  recipientName?: string;
  studentName?: string;
  studentClass?: string;
  studentRollNo?: string | number;
  severity?: 'low' | 'medium' | 'high';
  senderName?: string;
  actionUrl?: string;
  actionLabel?: string;
  metadata?: Record<string, any>;
}

export interface DispatchedEmailResult {
  success: boolean;
  messageId?: string;
  threadId?: string;
  sentAt: string;
  to: string;
  subject: string;
  category?: string;
  error?: string;
}

export interface ServerNotificationLog {
  id: string;
  messageId: string;
  threadId?: string;
  to: string;
  recipientName?: string;
  studentName?: string;
  studentClass?: string;
  subject: string;
  category: string;
  channel: string;
  status: 'Delivered' | 'Queued' | 'Failed';
  sentAt: string;
  error?: string;
}

export interface GmailUserProfile {
  emailAddress: string;
  messagesTotal: number;
  threadsTotal: number;
  historyId: string;
}

/**
 * Retrieves the authenticated Gmail user's profile
 */
export async function getGmailUserProfile(token?: string | null): Promise<GmailUserProfile> {
  const activeToken = token || getAccessToken();
  if (!activeToken) {
    throw new Error('Google Workspace OAuth access token is required. Please sign in with Google.');
  }

  const res = await fetch('/api/gmail/profile', {
    headers: {
      Authorization: `Bearer ${activeToken}`,
      'Content-Type': 'application/json'
    }
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.details || `Failed to fetch profile: ${res.statusText}`);
  }

  return res.json();
}

/**
 * Sends a single school email notification through the secure server-side Gmail gateway
 */
export async function sendEmailNotification(
  payload: EmailPayload,
  token?: string | null
): Promise<DispatchedEmailResult> {
  let activeToken = token || getAccessToken();

  // If token is missing, prompt sign-in popup
  if (!activeToken) {
    const authResult = await googleSignIn();
    if (!authResult?.accessToken) {
      throw new Error('Google Sign-In was cancelled or failed to yield an access token.');
    }
    activeToken = authResult.accessToken;
  }

  const res = await fetch('/api/notifications/send-email', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${activeToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || errData.details || `Email dispatch failed: ${res.statusText}`);
  }

  return res.json();
}

/**
 * Sends batch email notifications through the server-side Gmail gateway
 */
export async function batchSendEmailNotifications(
  notifications: EmailPayload[],
  token?: string | null
): Promise<{
  success: boolean;
  totalRequested: number;
  successful: number;
  failed: number;
  details: any[];
}> {
  let activeToken = token || getAccessToken();

  if (!activeToken) {
    const authResult = await googleSignIn();
    if (!authResult?.accessToken) {
      throw new Error('Google Sign-In required to dispatch batch notifications.');
    }
    activeToken = authResult.accessToken;
  }

  const res = await fetch('/api/notifications/batch-send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${activeToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ notifications })
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || `Batch notification dispatch failed: ${res.statusText}`);
  }

  return res.json();
}

/**
 * Fetches server notification logs
 */
export async function fetchNotificationLogs(): Promise<ServerNotificationLog[]> {
  const res = await fetch('/api/notifications/history');
  if (!res.ok) {
    throw new Error('Failed to fetch notification history');
  }
  const data = await res.json();
  return data.logs || [];
}

/**
 * Clears notification history
 */
export async function clearNotificationLogs(): Promise<boolean> {
  const res = await fetch('/api/notifications/history', { method: 'DELETE' });
  return res.ok;
}
