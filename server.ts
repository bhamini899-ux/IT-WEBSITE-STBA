import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// In-memory ledger of dispatched school email notifications
interface EmailNotificationLog {
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

const notificationAuditLogs: EmailNotificationLog[] = [
  {
    id: 'LOG-101',
    messageId: 'gmail-msg-18f1a23b9',
    to: 'sunita.jain@example.com',
    recipientName: 'Sunita Jain',
    studentName: 'Kabir Jain',
    studentClass: '10-A',
    subject: 'Attendance Alert: Kabir Jain marked Absent',
    category: 'ATTENDANCE',
    channel: 'Gmail API',
    status: 'Delivered',
    sentAt: 'Today, 08:35 AM'
  },
  {
    id: 'LOG-102',
    messageId: 'gmail-msg-18f1a29cc',
    to: 'vikram.mehta@example.com',
    recipientName: 'Vikram Mehta',
    studentName: 'Rohan Mehta',
    studentClass: '11-B',
    subject: 'Fee Installment Reminder: Rohan Mehta',
    category: 'FEES',
    channel: 'Gmail API',
    status: 'Delivered',
    sentAt: 'Today, 09:12 AM'
  },
  {
    id: 'LOG-103',
    messageId: 'gmail-msg-18f1a30fa',
    to: 'rajesh.sharma@example.com',
    recipientName: 'Rajesh Sharma',
    studentName: 'Aarav Sharma',
    studentClass: '10-A',
    subject: 'Transport Update: Aarav Sharma Boarded Bus #04',
    category: 'BUS',
    channel: 'Gmail API',
    status: 'Delivered',
    sentAt: 'Today, 07:42 AM'
  }
];

// Generates an official, responsive Seth Tolaram Bafna Academy HTML Email Template
function generateAcademyEmailHtml({
  subject,
  bodyText,
  bodyHtml,
  category = 'GENERAL',
  recipientName = 'Respected Guardian',
  studentName,
  studentClass,
  studentRollNo,
  severity = 'medium',
  actionUrl,
  actionLabel
}: {
  subject: string;
  bodyText?: string;
  bodyHtml?: string;
  category?: string;
  recipientName?: string;
  studentName?: string;
  studentClass?: string;
  studentRollNo?: string | number;
  severity?: 'low' | 'medium' | 'high';
  actionUrl?: string;
  actionLabel?: string;
}): string {
  const currentDate = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const categoryBadgeColors: Record<string, { bg: string; text: string; border: string }> = {
    ATTENDANCE: { bg: '#fffbeb', text: '#b45309', border: '#fde68a' },
    FEES: { bg: '#fff1f2', text: '#be123c', border: '#fecdd3' },
    EXAMS: { bg: '#f5f3ff', text: '#6d28d9', border: '#ddd6fe' },
    BUS: { bg: '#fef3c7', text: '#92400e', border: '#fde68a' },
    ACADEMICS: { bg: '#eff6ff', text: '#1d4ed8', border: '#bfdbfe' },
    EVENTS: { bg: '#ecfdf5', text: '#047857', border: '#a7f3d0' },
    ENTRY: { bg: '#f0fdf4', text: '#15803d', border: '#bbf7d0' },
    EXIT: { bg: '#eff6ff', text: '#1d4ed8', border: '#bfdbfe' },
    GENERAL: { bg: '#f8fafc', text: '#334155', border: '#e2e8f0' }
  };

  const badge = categoryBadgeColors[category.toUpperCase()] || categoryBadgeColors.GENERAL;

  const contentSection = bodyHtml || `
    <p style="margin: 0 0 16px 0; font-size: 15px; line-height: 1.6; color: #1e293b;">
      Dear <strong>${recipientName}</strong>,
    </p>
    <p style="margin: 0 0 16px 0; font-size: 14px; line-height: 1.6; color: #334155;">
      ${(bodyText || '').replace(/\n/g, '<br/>')}
    </p>
  `;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f1f5f9; padding: 24px 12px;">
    <tr>
      <td align="center">
        <!-- Main Email Container -->
        <table role="presentation" width="100%" max-width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05); border: 1px solid #e2e8f0;">
          
          <!-- Academy Official Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #1e3a8a 0%, #172554 100%); padding: 28px 24px; text-align: center; color: #ffffff;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center">
                    <div style="display: inline-block; background-color: rgba(255, 255, 255, 0.15); padding: 8px 16px; border-radius: 9999px; margin-bottom: 12px; border: 1px solid rgba(255, 255, 255, 0.2);">
                      <span style="font-size: 11px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #93c5fd;">CBSE AFFILIATION NO. 1730058</span>
                    </div>
                    <h1 style="margin: 0; font-size: 22px; font-weight: 900; letter-spacing: -0.02em; color: #ffffff; text-transform: uppercase;">
                      SETH TOLARAM BAFNA ACADEMY
                    </h1>
                    <p style="margin: 4px 0 0 0; font-size: 12px; color: #bfdbfe; font-weight: 500;">
                      Intelligent Digital School Notification Gateway • Smart School 360°
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Notification Category Strip -->
          <tr>
            <td style="padding: 16px 24px; background-color: #f8fafc; border-bottom: 1px solid #e2e8f0;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="left">
                    <span style="display: inline-block; padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; background-color: ${badge.bg}; color: ${badge.text}; border: 1px solid ${badge.border};">
                      ${category.toUpperCase()} NOTICE
                    </span>
                  </td>
                  <td align="right" style="font-size: 12px; color: #64748b; font-weight: 500;">
                    ${currentDate}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Student & Parent Context Dossier (If Available) -->
          ${studentName ? `
          <tr>
            <td style="padding: 16px 24px 0 24px;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0; padding: 12px 16px;">
                <tr>
                  <td style="font-size: 12px; color: #475569;">
                    <strong style="color: #0f172a;">Student:</strong> ${studentName} &nbsp;|&nbsp; 
                    <strong style="color: #0f172a;">Class:</strong> ${studentClass || 'N/A'} 
                    ${studentRollNo ? `&nbsp;|&nbsp; <strong style="color: #0f172a;">Roll No:</strong> ${studentRollNo}` : ''}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          ` : ''}

          <!-- Body Content Area -->
          <tr>
            <td style="padding: 24px; color: #1e293b;">
              <h2 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 700; color: #0f172a; line-height: 1.4;">
                ${subject}
              </h2>
              ${contentSection}

              ${actionUrl ? `
              <div style="margin-top: 24px; text-align: center;">
                <a href="${actionUrl}" style="display: inline-block; padding: 12px 28px; background-color: #2563eb; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 14px; box-shadow: 0 2px 4px rgba(37, 99, 235, 0.2);">
                  ${actionLabel || 'Access Smart School Portal'} &rarr;
                </a>
              </div>
              ` : ''}
            </td>
          </tr>

          <!-- Institutional Guarantee & Verification Stamp -->
          <tr>
            <td style="padding: 16px 24px; background-color: #f8fafc; border-top: 1px solid #e2e8f0;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="font-size: 11px; line-height: 1.5; color: #64748b;">
                    <strong>Office of Academic Administration</strong><br/>
                    Seth Tolaram Bafna Academy, Nokha Road, Bikaner, Rajasthan 334001<br/>
                    Phone: +91 151 2223344 &nbsp;•&nbsp; Email: info@stbafna.edu.in
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Anti-Phishing & Automated Notice Footnote -->
          <tr>
            <td style="background-color: #0f172a; padding: 16px 24px; text-align: center; color: #94a3b8; font-size: 11px; line-height: 1.5;">
              This is an authenticated, secure automated notification dispatched from the Academy's Gmail Gateway.<br/>
              © 2026 Seth Tolaram Bafna Academy. All rights reserved.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ---------------- API ROUTES ----------------

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'ok', 
    service: 'Smart School 360 Gmail Notification Gateway',
    timestamp: new Date().toISOString() 
  });
});

// Hosted Faculty Directory Persistence Endpoints
const FACULTY_HOSTED_FILE = path.join(process.cwd(), 'src', 'data', 'faculty_hosted.json');

app.get('/api/faculty', (req: Request, res: Response) => {
  try {
    if (fs.existsSync(FACULTY_HOSTED_FILE)) {
      const data = fs.readFileSync(FACULTY_HOSTED_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return res.json({ success: true, count: parsed.length, teachers: parsed });
      }
    }
  } catch (err: any) {
    console.error('Error reading hosted faculty file:', err);
  }
  return res.json({ success: true, count: 0, teachers: [] });
});

app.post('/api/faculty/confirm', (req: Request, res: Response) => {
  try {
    const { teachers } = req.body;
    if (!Array.isArray(teachers)) {
      return res.status(400).json({ error: 'Invalid payload: teachers must be an array.' });
    }
    fs.writeFileSync(FACULTY_HOSTED_FILE, JSON.stringify(teachers, null, 2), 'utf-8');
    return res.json({
      success: true,
      message: 'Faculty changes successfully confirmed and saved to hosting!',
      count: teachers.length,
      savedAt: new Date().toISOString()
    });
  } catch (err: any) {
    console.error('Error saving faculty to hosting:', err);
    return res.status(500).json({ error: 'Failed to save changes to hosting: ' + err.message });
  }
});

// Gmail Connected Profile via Google Workspace OAuth Token
app.get('/api/gmail/profile', async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'Unauthorized. Missing or invalid Bearer access token.' 
      });
    }

    const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/profile', {
      headers: {
        Authorization: authHeader,
        Accept: 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ 
        error: 'Failed to retrieve Gmail profile from Google Workspace API',
        details: errorText 
      });
    }

    const data = await response.json();
    return res.json(data);
  } catch (error: any) {
    console.error('Error fetching Gmail profile:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// Send single email notification through Gmail API
app.post('/api/notifications/send-email', async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'Unauthorized. Bearer access token required to send emails via Gmail API.' 
      });
    }

    const {
      to,
      subject,
      bodyText,
      bodyHtml,
      category = 'GENERAL',
      recipientName,
      studentName,
      studentClass,
      studentRollNo,
      severity = 'medium',
      senderName = 'Seth Tolaram Bafna Academy',
      actionUrl,
      actionLabel
    } = req.body;

    if (!to || !subject) {
      return res.status(400).json({ error: 'Recipient "to" and "subject" are required fields.' });
    }

    // Generate responsive HTML body
    const formattedHtml = bodyHtml || generateAcademyEmailHtml({
      subject,
      bodyText,
      category,
      recipientName,
      studentName,
      studentClass,
      studentRollNo,
      severity,
      actionUrl,
      actionLabel
    });

    // Create RFC 2822 email message
    const utf8Subject = `=?utf-8?B?${Buffer.from(subject, 'utf-8').toString('base64')}?=`;
    const messageParts = [
      `To: ${to}`,
      `Subject: ${utf8Subject}`,
      'MIME-Version: 1.0',
      'Content-Type: text/html; charset=utf-8',
      '',
      formattedHtml
    ];

    const rawMime = messageParts.join('\r\n');
    // Base64URL encode
    const base64Encoded = Buffer.from(rawMime, 'utf-8')
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    // Dispatch via Google Gmail API
    const gmailRes = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: {
        Authorization: authHeader,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        raw: base64Encoded
      })
    });

    if (!gmailRes.ok) {
      const errText = await gmailRes.text();
      console.error('Gmail API send error:', errText);
      
      // Record failure in audit log
      notificationAuditLogs.unshift({
        id: `LOG-${Date.now()}`,
        messageId: 'FAILED',
        to,
        recipientName,
        studentName,
        studentClass,
        subject,
        category,
        channel: 'Gmail API',
        status: 'Failed',
        sentAt: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        error: errText
      });

      return res.status(gmailRes.status).json({
        error: 'Gmail API failed to dispatch email.',
        details: errText
      });
    }

    const result = await gmailRes.json();
    const sentTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    // Record success in server-side audit logs
    const auditRecord: EmailNotificationLog = {
      id: `LOG-${Date.now()}`,
      messageId: result.id || `GMAIL-${Date.now()}`,
      threadId: result.threadId,
      to,
      recipientName: recipientName || to,
      studentName,
      studentClass,
      subject,
      category,
      channel: 'Gmail API',
      status: 'Delivered',
      sentAt: `Today, ${sentTime}`
    };
    notificationAuditLogs.unshift(auditRecord);

    return res.json({
      success: true,
      messageId: result.id,
      threadId: result.threadId,
      sentAt: auditRecord.sentAt,
      to,
      subject,
      category
    });
  } catch (err: any) {
    console.error('Server notification dispatch error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error while sending email' });
  }
});

// Batch send email notifications (e.g. for mass attendance or fee notices)
app.post('/api/notifications/batch-send', async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized. Bearer access token required.' });
    }

    const { notifications } = req.body;
    if (!Array.isArray(notifications) || notifications.length === 0) {
      return res.status(400).json({ error: 'Array of "notifications" required.' });
    }

    const results: any[] = [];

    for (const item of notifications) {
      const { to, subject, bodyText, category, recipientName, studentName, studentClass } = item;
      if (!to || !subject) continue;

      try {
        const formattedHtml = generateAcademyEmailHtml({
          subject,
          bodyText,
          category,
          recipientName,
          studentName,
          studentClass
        });

        const utf8Subject = `=?utf-8?B?${Buffer.from(subject, 'utf-8').toString('base64')}?=`;
        const rawMime = [
          `To: ${to}`,
          `Subject: ${utf8Subject}`,
          'MIME-Version: 1.0',
          'Content-Type: text/html; charset=utf-8',
          '',
          formattedHtml
        ].join('\r\n');

        const base64Encoded = Buffer.from(rawMime, 'utf-8')
          .toString('base64')
          .replace(/\+/g, '-')
          .replace(/\//g, '_')
          .replace(/=+$/, '');

        const gmailRes = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
          method: 'POST',
          headers: {
            Authorization: authHeader,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ raw: base64Encoded })
        });

        if (gmailRes.ok) {
          const data = await gmailRes.json();
          const sentTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
          const auditRecord: EmailNotificationLog = {
            id: `LOG-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            messageId: data.id,
            to,
            recipientName,
            studentName,
            studentClass,
            subject,
            category: category || 'GENERAL',
            channel: 'Gmail API',
            status: 'Delivered',
            sentAt: `Today, ${sentTime}`
          };
          notificationAuditLogs.unshift(auditRecord);
          results.push({ to, success: true, messageId: data.id });
        } else {
          results.push({ to, success: false, error: await gmailRes.text() });
        }

        // Brief delay to prevent burst rate limit
        await new Promise(r => setTimeout(r, 120));
      } catch (subErr: any) {
        results.push({ to, success: false, error: subErr.message });
      }
    }

    return res.json({
      success: true,
      totalRequested: notifications.length,
      successful: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length,
      details: results
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Batch send failed' });
  }
});

// Get notification audit log history
app.get('/api/notifications/history', (req: Request, res: Response) => {
  res.json({
    total: notificationAuditLogs.length,
    logs: notificationAuditLogs
  });
});

// Clear audit logs
app.delete('/api/notifications/history', (req: Request, res: Response) => {
  notificationAuditLogs.length = 0;
  res.json({ success: true, message: 'Notification audit logs cleared.' });
});

// ---------------- VITE MIDDLEWARE / STATIC ASSETS ----------------

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
