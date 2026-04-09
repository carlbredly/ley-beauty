import { Resend } from "resend";
import type { BookingWithSlot } from "@/types";

const resend = new Resend(process.env.RESEND_API_KEY);

const BRAND = {
  obsidian: "#080B0F",
  gold: "#C8952A",
  sand: "#EDE5D0",
  coral: "#C4593A",
  surface: "#0F1318",
};

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatTime(timeStr: string): string {
  const [h, m] = timeStr.split(":");
  const hour = parseInt(h);
  const ampm = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  return `${hour12}:${m} ${ampm}`;
}

function getServicePrice(service: string): number {
  const prices: Record<string, number> = {
    "Box Braids": 12000,
    "Knotless Braids": 15000,
    Cornrows: 7000,
    "Senegalese Twists": 13500,
    "Fulani Braids": 9500,
    "Goddess Braids": 11000,
  };
  return prices[service] ?? 0;
}

// ─── Email 1: Admin notification ──────────────────────────────────────────────

export async function sendAdminNotification(booking: BookingWithSlot) {
  const dashboardUrl = `${process.env.NEXT_PUBLIC_URL}/admin/dashboard`;
  const dateStr = formatDate(booking.slot.date);
  const startTime = formatTime(booking.slot.start_time);
  const endTime = formatTime(booking.slot.end_time);

  await resend.emails.send({
    from: "LEY Beauty <noreply@leybeauty.jp>",
    to: process.env.ADMIN_EMAIL!,
    subject: `✨ New Appointment Request – ${booking.client_name}`,
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>New Booking Request</title>
</head>
<body style="margin:0;padding:0;background:${BRAND.obsidian};font-family:'DM Sans',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
    <tr>
      <td align="center" style="padding:40px 20px;">
        <table width="600" cellpadding="0" cellspacing="0" role="presentation"
               style="max-width:600px;background:${BRAND.surface};border-radius:12px;overflow:hidden;border:1px solid #1E2530;">
          <!-- Header -->
          <tr>
            <td style="padding:40px 48px 32px;border-bottom:1px solid #1E2530;">
              <div style="font-size:11px;letter-spacing:4px;color:${BRAND.gold};text-transform:uppercase;margin-bottom:12px;">
                LEY Beauty — Okinawa
              </div>
              <h1 style="margin:0;font-size:28px;font-weight:300;color:${BRAND.sand};letter-spacing:1px;">
                New Appointment Request
              </h1>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px 48px;">
              <p style="margin:0 0 24px;color:#8A9BB0;font-size:15px;line-height:1.6;">
                A new booking request has been submitted. Please review the details below and accept or decline from the dashboard.
              </p>
              <!-- Info table -->
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
                     style="background:#080B0F;border-radius:8px;border:1px solid #1E2530;overflow:hidden;">
                ${[
                  ["Client", booking.client_name],
                  ["Email", booking.client_email],
                  ["Phone", booking.client_phone ?? "Not provided"],
                  ["Service", booking.service],
                  ["Date", dateStr],
                  ["Time", `${startTime} – ${endTime}`],
                  ...(booking.message ? [["Message", booking.message]] : []),
                ]
                  .map(
                    ([label, value], i) => `
                <tr style="border-top:${i > 0 ? "1px solid #1E2530" : "none"};">
                  <td style="padding:14px 20px;font-size:12px;color:${BRAND.gold};letter-spacing:2px;text-transform:uppercase;width:120px;">${label}</td>
                  <td style="padding:14px 20px;font-size:14px;color:${BRAND.sand};border-left:1px solid #1E2530;">${value}</td>
                </tr>`
                  )
                  .join("")}
              </table>
              <!-- CTA -->
              <div style="margin-top:40px;text-align:center;">
                <a href="${dashboardUrl}"
                   style="display:inline-block;padding:16px 40px;background:${BRAND.gold};color:${BRAND.obsidian};
                          font-size:13px;font-weight:700;letter-spacing:2px;text-transform:uppercase;
                          text-decoration:none;border-radius:4px;">
                  Open Dashboard →
                </a>
              </div>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:24px 48px;border-top:1px solid #1E2530;text-align:center;">
              <p style="margin:0;font-size:12px;color:#4A5568;">
                LEY Beauty · Okinawa, Japan · <a href="mailto:${process.env.ADMIN_EMAIL}" style="color:${BRAND.gold};text-decoration:none;">${process.env.ADMIN_EMAIL}</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim(),
  });
}

// ─── Email 2: Client confirmation ─────────────────────────────────────────────

export async function sendClientConfirmation(booking: BookingWithSlot) {
  const price = getServicePrice(booking.service);
  const dateStr = formatDate(booking.slot.date);
  const startTime = formatTime(booking.slot.start_time);
  const endTime = formatTime(booking.slot.end_time);
  const reference = `APPT-${booking.id.slice(0, 8).toUpperCase()}`;
  const bankAccount = process.env.PAYMENT_BANK_ACCOUNT ?? "Japan Post Bank / Account: 12345-67890";

  await resend.emails.send({
    from: "LEY Beauty <noreply@leybeauty.jp>",
    to: booking.client_email,
    subject: "Your appointment at LEY Beauty is confirmed!",
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>Appointment Confirmed</title>
</head>
<body style="margin:0;padding:0;background:${BRAND.obsidian};font-family:'DM Sans',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
    <tr>
      <td align="center" style="padding:40px 20px;">
        <table width="600" cellpadding="0" cellspacing="0" role="presentation"
               style="max-width:600px;background:${BRAND.surface};border-radius:12px;overflow:hidden;border:1px solid #1E2530;">
          <!-- Gold accent bar -->
          <tr>
            <td style="height:4px;background:linear-gradient(90deg,${BRAND.gold},${BRAND.coral});"></td>
          </tr>
          <!-- Header -->
          <tr>
            <td style="padding:48px 48px 32px;text-align:center;">
              <div style="font-size:10px;letter-spacing:5px;color:${BRAND.gold};text-transform:uppercase;margin-bottom:16px;">
                LEY Beauty — Okinawa
              </div>
              <h1 style="margin:0;font-size:32px;font-weight:300;color:${BRAND.sand};letter-spacing:1px;line-height:1.2;">
                Your Appointment<br/>is Confirmed
              </h1>
              <div style="margin-top:20px;width:40px;height:1px;background:${BRAND.gold};margin-left:auto;margin-right:auto;"></div>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:0 48px 40px;">
              <p style="margin:0 0 32px;color:#8A9BB0;font-size:15px;line-height:1.7;text-align:center;">
                We're delighted to welcome you, <strong style="color:${BRAND.sand};">${booking.client_name}</strong>.<br/>
                Here are your appointment details:
              </p>
              <!-- Appointment details card -->
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
                     style="background:#080B0F;border-radius:8px;border:1px solid ${BRAND.gold}33;overflow:hidden;margin-bottom:32px;">
                ${[
                  ["Service", booking.service],
                  ["Date", dateStr],
                  ["Time", `${startTime} – ${endTime}`],
                  ["Total", `¥${price.toLocaleString()}`],
                ]
                  .map(
                    ([label, value], i) => `
                <tr style="border-top:${i > 0 ? "1px solid #1E2530" : "none"};">
                  <td style="padding:16px 24px;font-size:11px;color:${BRAND.gold};letter-spacing:3px;text-transform:uppercase;width:120px;">${label}</td>
                  <td style="padding:16px 24px;font-size:15px;color:${i === 3 ? BRAND.gold : BRAND.sand};font-weight:${i === 3 ? "700" : "400"};border-left:1px solid #1E2530;">${value}</td>
                </tr>`
                  )
                  .join("")}
              </table>
              <!-- Payment section -->
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
                     style="background:#0C1018;border-radius:8px;border:1px solid #1E2530;overflow:hidden;margin-bottom:32px;padding:28px 24px;">
                <tr>
                  <td>
                    <div style="font-size:11px;letter-spacing:3px;color:${BRAND.gold};text-transform:uppercase;margin-bottom:16px;">
                      Payment Instructions
                    </div>
                    <p style="margin:0 0 12px;font-size:14px;color:${BRAND.sand};line-height:1.6;">
                      Please complete your payment via bank transfer within <strong>48 hours</strong> to secure your spot.
                    </p>
                    <table cellpadding="0" cellspacing="0" role="presentation">
                      <tr>
                        <td style="padding:4px 0;font-size:13px;color:#8A9BB0;width:80px;">Bank</td>
                        <td style="padding:4px 0;font-size:13px;color:${BRAND.sand};">${bankAccount}</td>
                      </tr>
                      <tr>
                        <td style="padding:4px 0;font-size:13px;color:#8A9BB0;width:80px;">Amount</td>
                        <td style="padding:4px 0;font-size:13px;color:${BRAND.gold};font-weight:700;">¥${price.toLocaleString()}</td>
                      </tr>
                      <tr>
                        <td style="padding:4px 0;font-size:13px;color:#8A9BB0;width:80px;">Reference</td>
                        <td style="padding:4px 0;font-size:13px;color:${BRAND.sand};font-weight:700;letter-spacing:1px;">${reference}</td>
                      </tr>
                    </table>
                    <div style="margin-top:20px;padding:14px 18px;background:${BRAND.gold}15;border-left:3px solid ${BRAND.gold};border-radius:0 4px 4px 0;">
                      <p style="margin:0;font-size:13px;color:#C8952A;line-height:1.5;">
                        ⏱ Your spot is reserved for <strong>48 hours</strong> from this email. Please transfer before the deadline to confirm your appointment.
                      </p>
                    </div>
                  </td>
                </tr>
              </table>
              <p style="margin:0;font-size:14px;color:#8A9BB0;line-height:1.7;">
                If you have any questions, reply to this email or contact us at 
                <a href="mailto:${process.env.ADMIN_EMAIL}" style="color:${BRAND.gold};text-decoration:none;">${process.env.ADMIN_EMAIL}</a>.
              </p>
            </td>
          </tr>
          <!-- Sign-off -->
          <tr>
            <td style="padding:32px 48px;border-top:1px solid #1E2530;text-align:center;">
              <p style="margin:0 0 8px;font-size:14px;color:${BRAND.sand};font-style:italic;">
                We look forward to welcoming you,
              </p>
              <p style="margin:0;font-size:13px;color:${BRAND.gold};letter-spacing:2px;text-transform:uppercase;">
                The LEY Beauty Team — Okinawa
              </p>
            </td>
          </tr>
          <!-- Bottom gold bar -->
          <tr>
            <td style="height:4px;background:linear-gradient(90deg,${BRAND.coral},${BRAND.gold});"></td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim(),
  });
}
