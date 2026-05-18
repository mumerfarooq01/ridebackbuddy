import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_KEY);

async function send(payload: Parameters<typeof resend.emails.send>[0]) {
  const { data, error } = await resend.emails.send(payload);
  if (error) throw new Error(error.message ?? "Resend error");
  return data;
}
const FROM = process.env.RESEND_FROM ?? "";

// ─── Shared layout ────────────────────────────────────────────────────────────

function wrap(body: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /></head>
<body style="margin:0;padding:0;background:#F4F6F9;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F4F6F9;padding:32px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">

        <!-- Header -->
        <tr><td style="background:#0E1B35;border-radius:16px 16px 0 0;padding:24px 32px;text-align:center;">
          <span style="display:inline-block;background:#FFB627;border-radius:10px;width:36px;height:36px;line-height:36px;font-size:20px;text-align:center;vertical-align:middle;">🚗</span>
          <span style="font-size:18px;font-weight:700;color:#fff;margin-left:10px;vertical-align:middle;letter-spacing:-0.3px;">RideBack</span>
        </td></tr>

        <!-- Body -->
        <tr><td style="background:#fff;padding:32px;border-radius:0 0 16px 16px;">
          ${body}
        </td></tr>

        <!-- Footer -->
        <tr><td style="padding:20px 0;text-align:center;">
          <p style="margin:0;font-size:12px;color:#8A9BB5;">
            © ${new Date().getFullYear()} RideBack · Ontario, Canada<br/>
            Questions? <a href="tel:+1-000-000-0000" style="color:#FFB627;text-decoration:none;">Call us anytime</a>
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body></html>`;
}

function row(label: string, value: string): string {
  return `<tr>
    <td style="padding:10px 0;border-bottom:1px solid #EEF1F6;font-size:13px;color:#6B7A99;white-space:nowrap;padding-right:16px;">${label}</td>
    <td style="padding:10px 0;border-bottom:1px solid #EEF1F6;font-size:14px;color:#0E1B35;font-weight:500;">${value}</td>
  </tr>`;
}

function table(rows: string): string {
  return `<table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">${rows}</table>`;
}

function section(title: string, icon: string): string {
  return `<p style="margin:24px 0 12px;font-size:11px;font-weight:700;color:#8A9BB5;letter-spacing:1px;text-transform:uppercase;">${icon} ${title}</p>`;
}

// ─── 1. Booking confirmation → customer ───────────────────────────────────────

export interface BookingConfirmationData {
  toEmail: string;
  fullName: string;
  serviceType: string;
  pickupDate: string;
  pickupTime: string;
  pickupAddress: string;
  dropoffAddress: string;
  passengers: number;
  fareTotal: number;
  paymentMethod: string;
  specialNotes?: string | null;
}

export async function sendBookingConfirmation(d: BookingConfirmationData) {
  const body = `
    <h2 style="margin:0 0 4px;font-size:22px;font-weight:700;color:#0E1B35;">Booking confirmed! 🎉</h2>
    <p style="margin:0 0 24px;font-size:15px;color:#4B5E82;">Hi ${d.fullName}, we've received your booking. We'll notify you as soon as a driver is assigned.</p>

    ${section("Ride details", "🗓️")}
    ${table([
      row("Service", d.serviceType.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())),
      row("Date", d.pickupDate),
      row("Time", d.pickupTime),
      row("Passengers", String(d.passengers)),
    ].join(""))}

    ${section("Route", "📍")}
    ${table([
      row("Pickup", d.pickupAddress),
      row("Drop-off", d.dropoffAddress),
    ].join(""))}

    ${section("Payment", "💳")}
    ${table([
      row("Fare", `$${d.fareTotal.toFixed(2)}`),
      row("Method", d.paymentMethod.replace(/\b\w/g, (c) => c.toUpperCase())),
    ].join(""))}

    ${d.specialNotes ? `${section("Notes", "📝")}<p style="margin:0;font-size:14px;color:#4B5E82;font-style:italic;background:#F4F6F9;border-radius:8px;padding:12px 16px;">${d.specialNotes}</p>` : ""}

    <div style="margin-top:32px;background:#F4F6F9;border-radius:12px;padding:16px 20px;">
      <p style="margin:0;font-size:13px;color:#4B5E82;">Need to make changes? Call us or reply to this email and we'll sort it out.</p>
    </div>
  `;

  return send({
    from: FROM,
    to: d.toEmail,
    subject: `✅ Booking confirmed – ${d.pickupDate} at ${d.pickupTime}`,
    html: wrap(body),
  });
}

// ─── 2. Driver assigned → customer ────────────────────────────────────────────

export interface DriverAssignedToUserData {
  toEmail: string;
  customerName: string;
  pickupDate: string;
  pickupTime: string;
  pickupAddress: string;
  dropoffAddress: string;
  driverName: string;
  driverPhone: string;
  vehicleInfo?: string | null;
  licenseNo?: string | null;
}

export async function sendDriverAssignedToUser(d: DriverAssignedToUserData) {
  const body = `
    <h2 style="margin:0 0 4px;font-size:22px;font-weight:700;color:#0E1B35;">Your driver is confirmed 🚗</h2>
    <p style="margin:0 0 24px;font-size:15px;color:#4B5E82;">Hi ${d.customerName}, great news — a driver has been assigned to your ride on <strong>${d.pickupDate}</strong>.</p>

    ${section("Your driver", "👤")}
    <div style="background:#F4F6F9;border-radius:12px;padding:20px;margin-bottom:4px;">
      <p style="margin:0 0 4px;font-size:18px;font-weight:700;color:#0E1B35;">${d.driverName}</p>
      ${d.vehicleInfo ? `<p style="margin:0 0 10px;font-size:13px;color:#6B7A99;">🚘 ${d.vehicleInfo}</p>` : ""}
      ${d.licenseNo ? `<p style="margin:0 0 10px;font-size:13px;color:#6B7A99;">🪪 License: ${d.licenseNo}</p>` : ""}
      <a href="tel:${d.driverPhone}" style="display:inline-block;background:#FFB627;color:#0E1B35;font-weight:700;font-size:14px;padding:10px 20px;border-radius:10px;text-decoration:none;">
        📞 Call ${d.driverPhone}
      </a>
    </div>

    ${section("Your ride", "📍")}
    ${table([
      row("Date", d.pickupDate),
      row("Time", d.pickupTime),
      row("Pickup", d.pickupAddress),
      row("Drop-off", d.dropoffAddress),
    ].join(""))}

    <div style="margin-top:32px;background:#EDF7ED;border-radius:12px;padding:16px 20px;">
      <p style="margin:0;font-size:13px;color:#2E7D32;">✅ Your driver will be at your pickup location at the scheduled time. Save their number in case you need to coordinate.</p>
    </div>
  `;

  return send({
    from: FROM,
    to: d.toEmail,
    subject: `🚗 Driver assigned – ${d.driverName} will be your driver on ${d.pickupDate}`,
    html: wrap(body),
  });
}

// ─── 3. Booking assigned → driver ─────────────────────────────────────────────

export interface BookingAssignedToDriverData {
  toEmail: string;
  driverName: string;
  customerName: string;
  customerPhone: string;
  serviceType: string;
  pickupDate: string;
  pickupTime: string;
  pickupAddress: string;
  dropoffAddress: string;
  passengers: number;
  fareTotal: number;
  paymentMethod: string;
  accessibility: boolean;
  specialNotes?: string | null;
}

export async function sendBookingAssignedToDriver(d: BookingAssignedToDriverData) {
  const body = `
    <h2 style="margin:0 0 4px;font-size:22px;font-weight:700;color:#0E1B35;">New ride assigned 📋</h2>
    <p style="margin:0 0 24px;font-size:15px;color:#4B5E82;">Hi ${d.driverName}, you've been assigned a new ride. Here are the full details.</p>

    ${section("Customer", "👤")}
    <div style="background:#F4F6F9;border-radius:12px;padding:20px;margin-bottom:4px;">
      <p style="margin:0 0 4px;font-size:18px;font-weight:700;color:#0E1B35;">${d.customerName}</p>
      <p style="margin:0 0 10px;font-size:13px;color:#6B7A99;">${d.passengers} passenger${d.passengers > 1 ? "s" : ""}${d.accessibility ? " · ♿ Accessibility needed" : ""}</p>
      <a href="tel:${d.customerPhone}" style="display:inline-block;background:#FFB627;color:#0E1B35;font-weight:700;font-size:14px;padding:10px 20px;border-radius:10px;text-decoration:none;">
        📞 Call ${d.customerPhone}
      </a>
    </div>

    ${section("Ride details", "🗓️")}
    ${table([
      row("Service", d.serviceType.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())),
      row("Date", d.pickupDate),
      row("Pickup time", d.pickupTime),
    ].join(""))}

    ${section("Route", "📍")}
    ${table([
      row("Pickup", d.pickupAddress),
      row("Drop-off", d.dropoffAddress),
    ].join(""))}

    ${section("Fare", "💰")}
    ${table([
      row("Total", `$${d.fareTotal.toFixed(2)}`),
      row("Payment", d.paymentMethod.replace(/\b\w/g, (c) => c.toUpperCase())),
    ].join(""))}

    ${d.specialNotes ? `${section("Customer notes", "📝")}<p style="margin:0;font-size:14px;color:#4B5E82;font-style:italic;background:#FFF8E7;border-radius:8px;padding:12px 16px;border-left:3px solid #FFB627;">${d.specialNotes}</p>` : ""}

    <div style="margin-top:32px;background:#F4F6F9;border-radius:12px;padding:16px 20px;">
      <p style="margin:0;font-size:13px;color:#4B5E82;">Log in to your driver portal to view this ride and update your status.</p>
    </div>
  `;

  return send({
    from: FROM,
    to: d.toEmail,
    subject: `📋 New ride – ${d.customerName} on ${d.pickupDate} at ${d.pickupTime}`,
    html: wrap(body),
  });
}

// ─── 4. New booking → admins ─────────────────────────────────────────────────

export interface NewBookingAdminData {
  toEmails: string[];
  fullName: string;
  phone: string;
  email: string;
  serviceType: string;
  pickupDate: string;
  pickupTime: string;
  pickupAddress: string;
  dropoffAddress: string;
  passengers: number;
  fareTotal: number;
  paymentMethod: string;
  specialNotes?: string | null;
}

export async function sendNewBookingToAdmins(d: NewBookingAdminData) {
  if (!d.toEmails.length) return;
  const body = `
    <h2 style="margin:0 0 4px;font-size:22px;font-weight:700;color:#0E1B35;">New booking received 📥</h2>
    <p style="margin:0 0 24px;font-size:15px;color:#4B5E82;">A new ride has been booked. Assign a driver from the admin panel.</p>

    ${section("Customer", "👤")}
    ${table([
      row("Name", d.fullName),
      row("Email", `<a href="mailto:${d.email}" style="color:#FFB627;">${d.email}</a>`),
      row("Phone", `<a href="tel:${d.phone}" style="color:#FFB627;">${d.phone}</a>`),
    ].join(""))}

    ${section("Ride details", "🗓️")}
    ${table([
      row("Service", d.serviceType.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())),
      row("Date", d.pickupDate),
      row("Time", d.pickupTime),
      row("Passengers", String(d.passengers)),
    ].join(""))}

    ${section("Route", "📍")}
    ${table([
      row("Pickup", d.pickupAddress),
      row("Drop-off", d.dropoffAddress),
    ].join(""))}

    ${section("Payment", "💳")}
    ${table([
      row("Fare", `$${d.fareTotal.toFixed(2)}`),
      row("Method", d.paymentMethod.replace(/\b\w/g, (c) => c.toUpperCase())),
    ].join(""))}

    ${d.specialNotes ? `${section("Notes", "📝")}<p style="margin:0;font-size:14px;color:#4B5E82;font-style:italic;background:#FFF8E7;border-radius:8px;padding:12px 16px;border-left:3px solid #FFB627;">${d.specialNotes}</p>` : ""}
  `;

  return send({
    from: FROM,
    to: d.toEmails,
    subject: `📥 New booking – ${d.fullName} on ${d.pickupDate} at ${d.pickupTime}`,
    html: wrap(body),
  });
}

// ─── 5. Temp password → admin user or driver ──────────────────────────────────


export interface TempPasswordData {
  toEmail: string;
  name: string;
  tempPassword: string;
  loginUrl: string;
}

export async function sendTempPassword(d: TempPasswordData) {
  const body = `
    <h2 style="margin:0 0 4px;font-size:22px;font-weight:700;color:#0E1B35;">Password reset 🔑</h2>
    <p style="margin:0 0 24px;font-size:15px;color:#4B5E82;">Hi ${d.name}, here is your temporary password. Use it to log in, then update it from your profile right away.</p>

    <div style="background:#FFF8E7;border:2px dashed #FFB627;border-radius:14px;padding:20px;text-align:center;margin-bottom:24px;">
      <p style="margin:0 0 6px;font-size:12px;font-weight:600;color:#7A4F00;letter-spacing:1px;text-transform:uppercase;">Temporary Password</p>
      <p style="margin:0;font-size:28px;font-weight:700;color:#0E1B35;letter-spacing:3px;font-family:monospace;">${d.tempPassword}</p>
    </div>

    <div style="text-align:center;margin-bottom:24px;">
      <a href="${d.loginUrl}" style="display:inline-block;background:#FFB627;color:#0E1B35;font-weight:700;font-size:15px;padding:12px 28px;border-radius:12px;text-decoration:none;">
        Log In Now →
      </a>
    </div>

    <div style="background:#FEF2F2;border-radius:12px;padding:14px 18px;border-left:3px solid #F87171;">
      <p style="margin:0;font-size:13px;color:#991B1B;">⚠️ This is a temporary password. Please change it immediately after logging in from your Profile page.</p>
    </div>
  `;

  return send({
    from: FROM,
    to: d.toEmail,
    subject: "🔑 Your temporary password – RideBack Buddy",
    html: wrap(body),
  });
}

// ─── 6. Welcome with auto-generated password → new customer ──────────────────

export interface WelcomeWithPasswordData {
  toEmail: string;
  name: string;
  tempPassword: string;
  loginUrl: string;
}

export async function sendWelcomeWithPassword(d: WelcomeWithPasswordData) {
  const body = `
    <h2 style="margin:0 0 4px;font-size:22px;font-weight:700;color:#0E1B35;">Welcome to RideBack Buddy! 🎉</h2>
    <p style="margin:0 0 24px;font-size:15px;color:#4B5E82;">Hi ${d.name}, your booking created an account for you. Sign in anytime to view your rides and book again in seconds.</p>

    ${section("Your login", "📧")}
    ${table([row("Email", d.toEmail)].join(""))}

    <div style="background:#FFF8E7;border:2px dashed #FFB627;border-radius:14px;padding:20px;text-align:center;margin:20px 0;">
      <p style="margin:0 0 6px;font-size:12px;font-weight:600;color:#7A4F00;letter-spacing:1px;text-transform:uppercase;">Temporary Password</p>
      <p style="margin:0;font-size:28px;font-weight:700;color:#0E1B35;letter-spacing:3px;font-family:monospace;">${d.tempPassword}</p>
    </div>

    <div style="text-align:center;margin-bottom:24px;">
      <a href="${d.loginUrl}" style="display:inline-block;background:#FFB627;color:#0E1B35;font-weight:700;font-size:15px;padding:12px 28px;border-radius:12px;text-decoration:none;">
        View My Bookings →
      </a>
    </div>

    <div style="background:#FEF2F2;border-radius:12px;padding:14px 18px;border-left:3px solid #F87171;">
      <p style="margin:0;font-size:13px;color:#991B1B;">⚠️ Please change your password after logging in from your Profile page.</p>
    </div>
  `;

  return send({
    from: FROM,
    to: d.toEmail,
    subject: "Welcome to RideBack Buddy – Your account is ready 🎉",
    html: wrap(body),
  });
}
