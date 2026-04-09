import { Resend } from "resend";
import type { BookingWithSlot } from "@/types";
import { SERVICES } from "@/types";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL =
  process.env.FROM_EMAIL || "LEY Beauty <carlbredlyrefus.e@gmail.com>";

const B = {
  bg: "#06090C",
  card: "#0D1117",
  cardBorder: "#1A2030",
  row: "#0A0E14",
  gold: "#C8952A",
  goldLight: "#E0A830",
  sand: "#EDE5D0",
  muted: "#7A8BA0",
  dim: "#4A5568",
  coral: "#C4593A",
  divider: "#161D27",
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
  const found = SERVICES.find((s) => s.name === service);
  return found?.price ?? 0;
}

function getCurrencySymbol(): string {
  const currency = process.env.BOOKING_CURRENCY || "USD";
  const symbols: Record<string, string> = {
    USD: "$",
    JPY: "¥",
    EUR: "€",
    GBP: "£",
  };
  return symbols[currency] ?? "$";
}

function formatPrice(amount: number): string {
  const symbol = getCurrencySymbol();
  return `${symbol}${amount.toLocaleString()}`;
}

function emailShell(content: string): string {
  return `
<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
  <meta name="x-apple-disable-message-reformatting"/>
  <meta name="color-scheme" content="dark"/>
  <meta name="supported-color-schemes" content="dark"/>
  <title>LEY Beauty</title>
  <!--[if mso]>
  <noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript>
  <![endif]-->
  <style>
    body,table,td,a{-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%}
    table,td{mso-table-lspace:0;mso-table-rspace:0}
    img{-ms-interpolation-mode:bicubic;border:0;height:auto;line-height:100%;outline:none;text-decoration:none}
    body{margin:0;padding:0;width:100%!important;height:100%!important}
    a[x-apple-data-detectors]{color:inherit!important;text-decoration:none!important;font-size:inherit!important;font-family:inherit!important;font-weight:inherit!important;line-height:inherit!important}
    @media only screen and (max-width:620px){
      .container{width:100%!important;padding:0 16px!important}
      .inner-pad{padding-left:24px!important;padding-right:24px!important}
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:${B.bg};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${B.bg};">
    <tr>
      <td align="center" style="padding:48px 16px;">

        <!-- Container -->
        <table role="presentation" class="container" width="580" cellpadding="0" cellspacing="0" style="max-width:580px;width:100%;">

          <!-- Gold top accent -->
          <tr>
            <td style="height:3px;background:linear-gradient(90deg,${B.gold},${B.goldLight},${B.coral});border-radius:8px 8px 0 0;font-size:0;line-height:0;">&nbsp;</td>
          </tr>

          <!-- Main card -->
          <tr>
            <td style="background-color:${B.card};border-left:1px solid ${B.cardBorder};border-right:1px solid ${B.cardBorder};">

              <!-- Logo area -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td class="inner-pad" style="padding:40px 44px 0;">
                    <table role="presentation" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="font-size:11px;font-weight:700;letter-spacing:5px;color:${B.gold};text-transform:uppercase;font-family:Georgia,'Times New Roman',serif;">
                          LEY BEAUTY
                        </td>
                      </tr>
                      <tr>
                        <td style="font-size:10px;letter-spacing:3px;color:${B.dim};text-transform:uppercase;padding-top:4px;">
                          Okinawa, Japan
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Divider -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td class="inner-pad" style="padding:24px 44px 0;">
                    <div style="height:1px;background-color:${B.divider};"></div>
                  </td>
                </tr>
              </table>

              ${content}

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:${B.card};border-left:1px solid ${B.cardBorder};border-right:1px solid ${B.cardBorder};border-top:1px solid ${B.divider};">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td class="inner-pad" style="padding:28px 44px;text-align:center;">
                    <p style="margin:0 0 6px;font-size:11px;letter-spacing:3px;color:${B.dim};text-transform:uppercase;">
                      LEY Beauty
                    </p>
                    <p style="margin:0;font-size:12px;color:${B.dim};line-height:1.6;">
                      Okinawa, Japan &middot;
                      <a href="mailto:${process.env.ADMIN_EMAIL}" style="color:${B.gold};text-decoration:none;">${process.env.ADMIN_EMAIL}</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Gold bottom accent -->
          <tr>
            <td style="height:3px;background:linear-gradient(90deg,${B.coral},${B.gold});border-radius:0 0 8px 8px;font-size:0;line-height:0;">&nbsp;</td>
          </tr>

        </table>

      </td>
    </tr>
  </table>
</body>
</html>`.trim();
}

function infoRow(label: string, value: string, isLast = false): string {
  return `
    <tr>
      <td style="padding:14px 20px;font-size:10px;font-weight:700;letter-spacing:2.5px;color:${B.gold};text-transform:uppercase;vertical-align:top;width:110px;${!isLast ? `border-bottom:1px solid ${B.divider};` : ""}">${label}</td>
      <td style="padding:14px 20px;font-size:14px;color:${B.sand};line-height:1.5;${!isLast ? `border-bottom:1px solid ${B.divider};` : ""}">${value}</td>
    </tr>`;
}

// ─── Email 1: Admin notification ──────────────────────────────────────────────

export async function sendAdminNotification(booking: BookingWithSlot) {
  const dashboardUrl = `${process.env.NEXT_PUBLIC_URL}admin/dashboard`;
  const dateStr = formatDate(booking.slot.date);
  const startTime = formatTime(booking.slot.start_time);
  const endTime = formatTime(booking.slot.end_time);
  const price = getServicePrice(booking.service);

  const rows = [
    ["Client", booking.client_name],
    ["Email", `<a href="mailto:${booking.client_email}" style="color:${B.sand};text-decoration:underline;text-decoration-color:${B.dim};">${booking.client_email}</a>`],
    ["Phone", booking.client_phone ?? '<span style="color:' + B.dim + ';">Not provided</span>'],
    ["Service", `${booking.service} &mdash; <strong style="color:${B.gold};">${formatPrice(price)}</strong>`],
    ["Date", dateStr],
    ["Time", `${startTime} &ndash; ${endTime}`],
    ...(booking.message ? [["Note", booking.message]] : []),
  ];

  const content = `
    <!-- Title -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td class="inner-pad" style="padding:32px 44px 12px;">
          <h1 style="margin:0;font-size:26px;font-weight:400;color:${B.sand};line-height:1.3;font-family:Georgia,'Times New Roman',serif;">
            New Appointment Request
          </h1>
        </td>
      </tr>
      <tr>
        <td class="inner-pad" style="padding:0 44px 32px;">
          <p style="margin:0;font-size:14px;color:${B.muted};line-height:1.6;">
            A client has requested a new appointment. Review the details below and manage from your dashboard.
          </p>
        </td>
      </tr>
    </table>

    <!-- Details card -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td class="inner-pad" style="padding:0 44px 36px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${B.row};border-radius:8px;border:1px solid ${B.cardBorder};">
            ${rows.map(([label, value], i) => infoRow(label, value, i === rows.length - 1)).join("")}
          </table>
        </td>
      </tr>
    </table>

    <!-- CTA Button -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td class="inner-pad" style="padding:0 44px 44px;text-align:center;">
          <table role="presentation" cellpadding="0" cellspacing="0" align="center">
            <tr>
              <td style="background-color:${B.gold};border-radius:6px;">
                <a href="${dashboardUrl}" target="_blank"
                   style="display:inline-block;padding:15px 44px;font-size:12px;font-weight:700;letter-spacing:2px;color:${B.bg};text-transform:uppercase;text-decoration:none;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
                  Open Dashboard
                </a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>`;

  await resend.emails.send({
    from: FROM_EMAIL,
    to: process.env.ADMIN_EMAIL!,
    subject: `New Appointment Request — ${booking.client_name}`,
    html: emailShell(content),
  });
}

// ─── Email 2: Client confirmation ─────────────────────────────────────────────

export async function sendClientConfirmation(booking: BookingWithSlot) {
  const price = getServicePrice(booking.service);
  const dateStr = formatDate(booking.slot.date);
  const startTime = formatTime(booking.slot.start_time);
  const endTime = formatTime(booking.slot.end_time);
  const reference = `LEY-${booking.id.slice(0, 8).toUpperCase()}`;
  const paymentMethod =
    process.env.PAYMENT_BANK_ACCOUNT ?? "Zelle: +1 (323) 331-5010";

  const content = `
    <!-- Title -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td class="inner-pad" style="padding:36px 44px 8px;text-align:center;">
          <div style="display:inline-block;padding:6px 18px;background-color:rgba(200,149,42,0.1);border:1px solid rgba(200,149,42,0.2);border-radius:20px;font-size:11px;letter-spacing:2px;color:${B.gold};text-transform:uppercase;margin-bottom:20px;">
            Confirmed
          </div>
        </td>
      </tr>
      <tr>
        <td class="inner-pad" style="padding:12px 44px 8px;text-align:center;">
          <h1 style="margin:0;font-size:28px;font-weight:400;color:${B.sand};line-height:1.3;font-family:Georgia,'Times New Roman',serif;">
            Your Appointment<br/>is Confirmed
          </h1>
        </td>
      </tr>
      <tr>
        <td style="padding:16px 0 0;text-align:center;">
          <div style="display:inline-block;width:40px;height:2px;background-color:${B.gold};"></div>
        </td>
      </tr>
      <tr>
        <td class="inner-pad" style="padding:20px 44px 36px;text-align:center;">
          <p style="margin:0;font-size:15px;color:${B.muted};line-height:1.7;">
            We're delighted to welcome you, <strong style="color:${B.sand};">${booking.client_name}</strong>.<br/>
            Here are your appointment details.
          </p>
        </td>
      </tr>
    </table>

    <!-- Appointment details -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td class="inner-pad" style="padding:0 44px 8px;">
          <p style="margin:0;font-size:10px;font-weight:700;letter-spacing:3px;color:${B.gold};text-transform:uppercase;">
            Appointment Details
          </p>
        </td>
      </tr>
      <tr>
        <td class="inner-pad" style="padding:8px 44px 32px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${B.row};border-radius:8px;border:1px solid ${B.cardBorder};">
            ${infoRow("Service", booking.service)}
            ${infoRow("Date", dateStr)}
            ${infoRow("Time", `${startTime} &ndash; ${endTime}`)}
            ${infoRow("Reference", `<span style="font-family:monospace;letter-spacing:1px;">${reference}</span>`)}
            ${infoRow("Total", `<strong style="color:${B.gold};font-size:16px;">${formatPrice(price)}</strong>`, true)}
          </table>
        </td>
      </tr>
    </table>

    <!-- Payment section -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td class="inner-pad" style="padding:0 44px 8px;">
          <p style="margin:0;font-size:10px;font-weight:700;letter-spacing:3px;color:${B.gold};text-transform:uppercase;">
            Payment Instructions
          </p>
        </td>
      </tr>
      <tr>
        <td class="inner-pad" style="padding:8px 44px 36px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${B.row};border-radius:8px;border:1px solid ${B.cardBorder};">
            <tr>
              <td style="padding:24px 20px;">
                <p style="margin:0 0 16px;font-size:14px;color:${B.sand};line-height:1.6;">
                  Please complete your payment within <strong style="color:${B.gold};">48 hours</strong> to secure your appointment.
                </p>
                <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td style="padding:8px 0;font-size:12px;font-weight:700;letter-spacing:1.5px;color:${B.dim};text-transform:uppercase;width:90px;vertical-align:top;">Payment</td>
                    <td style="padding:8px 0;font-size:14px;color:${B.sand};">${paymentMethod}</td>
                  </tr>
                  <tr>
                    <td style="padding:8px 0;font-size:12px;font-weight:700;letter-spacing:1.5px;color:${B.dim};text-transform:uppercase;width:90px;">Amount</td>
                    <td style="padding:8px 0;font-size:14px;color:${B.gold};font-weight:700;">${formatPrice(price)}</td>
                  </tr>
                  <tr>
                    <td style="padding:8px 0;font-size:12px;font-weight:700;letter-spacing:1.5px;color:${B.dim};text-transform:uppercase;width:90px;">Reference</td>
                    <td style="padding:8px 0;font-size:14px;color:${B.sand};font-family:monospace;letter-spacing:1px;">${reference}</td>
                  </tr>
                </table>

                <!-- Warning box -->
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:20px;">
                  <tr>
                    <td style="border-left:3px solid ${B.gold};padding:12px 16px;background-color:rgba(200,149,42,0.05);border-radius:0 6px 6px 0;">
                      <p style="margin:0;font-size:13px;color:${B.gold};line-height:1.5;">
                        Your spot is held for <strong>48 hours</strong>. Please complete your transfer before the deadline.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- Contact -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td class="inner-pad" style="padding:0 44px 20px;text-align:center;">
          <p style="margin:0;font-size:13px;color:${B.muted};line-height:1.7;">
            Questions? Contact us at
            <a href="mailto:${process.env.ADMIN_EMAIL}" style="color:${B.gold};text-decoration:none;">${process.env.ADMIN_EMAIL}</a>
          </p>
        </td>
      </tr>
    </table>

    <!-- Sign-off -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td class="inner-pad" style="padding:12px 44px 36px;text-align:center;">
          <p style="margin:0 0 4px;font-size:14px;color:${B.sand};font-style:italic;font-family:Georgia,'Times New Roman',serif;">
            We look forward to welcoming you,
          </p>
          <p style="margin:0;font-size:11px;letter-spacing:3px;color:${B.gold};text-transform:uppercase;">
            The LEY Beauty Team
          </p>
        </td>
      </tr>
    </table>`;

  await resend.emails.send({
    from: FROM_EMAIL,
    to: booking.client_email,
    subject: "Your appointment at LEY Beauty is confirmed!",
    html: emailShell(content),
  });
}
