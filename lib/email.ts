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

// ─── Fare breakdown helper (mirrors BookingContent calcFare) ──────────────────

const OUT_OF_AREA: Record<string, number> = {
  "Etobicoke": 5, "Mississauga (by Airport)": 5, "Toronto W (to Church St)": 10,
  "Toronto E (from Jarvis)": 15, "Vaughan / Maple": 20, "Brampton S of Williams Pkwy": 10,
  "Brampton N of Williams Pkwy": 15, "Bolton": 15, "Caledon": 15, "Kleinberg": 20,
  "Richmond Hill": 20, "Nobleton": 20, "Milton S of Steeles": 5, "Milton N of Steeles": 10,
  "Georgetown": 15, "Acton / Campbellville": 15, "Guelph": 20, "Carlisle": 5,
  "Freelton": 5, "Flamborough": 5, "Millgrove": 5, "Dundas": 5, "Ancaster": 5,
  "Copetown": 10, "Caledonia": 15, "Mt. Hope": 5, "Grimsby": 10, "Hannon": 5,
  "Stoney Creek (to Fruitland)": 5, "Stoney Creek (Winona)": 10, "Beamsville": 15,
  "Smithville": 15, "Cayuga": 20,
};

function fareRow(label: string, amount: number, highlight = false): string {
  return `<tr>
    <td style="padding:9px 16px;font-size:13px;color:${highlight ? "#0E1B35" : "#6B7A99"};${highlight ? "font-weight:700;border-top:1px solid #EEF1F6;" : "border-bottom:1px solid #F4F6F9;"}">${label}</td>
    <td style="padding:9px 16px;font-size:13px;color:#0E1B35;font-weight:${highlight ? "700" : "500"};text-align:right;${highlight ? "border-top:1px solid #EEF1F6;" : "border-bottom:1px solid #F4F6F9;"}">$${amount.toFixed(2)}</td>
  </tr>`;
}

// ─── 1. Booking confirmation → customer ───────────────────────────────────────

export interface BookingConfirmationData {
  toEmail: string;
  bookingId: string;
  fullName: string;
  phone: string;
  serviceType: string;
  pickupDate: string;
  pickupTime: string;
  pickupAddress: string;
  dropoffAddress: string;
  passengers: number;
  accessibility: boolean;
  estimatedDistance?: number | null;
  region: string;
  paymentMethod: string;
  stops: number;
  use407: boolean;
  km407: number;
  fareTotal: number;
  specialNotes?: string | null;
}

export async function sendBookingConfirmation(d: BookingConfirmationData) {
  const km = Math.max(0, d.estimatedDistance ?? 0);
  const distanceFare = 31.0 + Math.ceil(Math.max(km - 10, 0)) * 2.75;
  const regionSurcharge = OUT_OF_AREA[d.region] ?? null;
  const ccSurcharge = d.paymentMethod === "card" ? 1.0 : 0;
  const stopsFee = d.stops * 3.0;
  const toll407 = d.use407 ? 15.0 + d.km407 * 0.25 : 0;

  const serviceLabel = d.serviceType.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const refId = d.bookingId.slice(-8).toUpperCase();

  const body = `
    <!-- Greeting -->
    <h2 style="margin:0 0 6px;font-size:24px;font-weight:700;color:#0E1B35;">Your ride is confirmed! 🎉</h2>
    <p style="margin:0 0 24px;font-size:15px;color:#4B5E82;">Hi <strong>${d.fullName}</strong>, we've received your booking. A dispatcher will call to confirm shortly.</p>

    <!-- Booking ref badge -->
    <div style="background:#0E1B35;border-radius:12px;padding:14px 20px;margin-bottom:28px;display:flex;align-items:center;justify-content:space-between;">
      <span style="font-size:12px;color:#8A9BB5;letter-spacing:1px;text-transform:uppercase;">Booking Reference</span>
      <span style="font-size:18px;font-weight:700;color:#FFB627;letter-spacing:2px;font-family:monospace;">#RB-${refId}</span>
    </div>

    <!-- Route visual -->
    <div style="background:#F4F6F9;border-radius:14px;padding:20px;margin-bottom:24px;">
      <div style="display:flex;align-items:flex-start;gap:12px;margin-bottom:14px;">
        <div style="width:28px;height:28px;border-radius:50%;background:#22C55E;flex-shrink:0;display:flex;align-items:center;justify-content:center;">
          <span style="color:#fff;font-size:13px;font-weight:700;">A</span>
        </div>
        <div>
          <p style="margin:0 0 2px;font-size:11px;color:#8A9BB5;font-weight:600;text-transform:uppercase;letter-spacing:.5px;">Pickup</p>
          <p style="margin:0;font-size:14px;font-weight:600;color:#0E1B35;">${d.pickupAddress}</p>
        </div>
      </div>
      <div style="margin-left:14px;border-left:2px dashed #CBD5E1;padding-left:26px;margin-bottom:14px;">
        <span style="font-size:11px;color:#8A9BB5;">${km > 0 ? `${km} km` : "distance TBC"}</span>
      </div>
      <div style="display:flex;align-items:flex-start;gap:12px;">
        <div style="width:28px;height:28px;border-radius:50%;background:#EF4444;flex-shrink:0;display:flex;align-items:center;justify-content:center;">
          <span style="color:#fff;font-size:13px;font-weight:700;">B</span>
        </div>
        <div>
          <p style="margin:0 0 2px;font-size:11px;color:#8A9BB5;font-weight:600;text-transform:uppercase;letter-spacing:.5px;">Drop-off</p>
          <p style="margin:0;font-size:14px;font-weight:600;color:#0E1B35;">${d.dropoffAddress}</p>
        </div>
      </div>
    </div>

    <!-- Ride details -->
    ${section("Ride Details", "🗓️")}
    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-bottom:24px;">
      ${row("Service", serviceLabel)}
      ${row("Date", d.pickupDate)}
      ${row("Time", d.pickupTime)}
      ${row("Passengers", `${d.passengers} passenger${d.passengers > 1 ? "s" : ""}${d.accessibility ? " &nbsp;·&nbsp; ♿ Accessibility needed" : ""}`)}
      ${d.stops > 0 ? row("Stops", `${d.stops} intermediate stop${d.stops > 1 ? "s" : ""}`) : ""}
      ${d.use407 ? row("407 ETR", `${d.km407} km on 407`) : ""}
    </table>

    <!-- Fare breakdown -->
    ${section("Fare Breakdown", "💰")}
    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border-radius:12px;overflow:hidden;margin-bottom:24px;border:1px solid #EEF1F6;">
      ${fareRow(`Distance ${km > 0 ? `(${km} km)` : "(minimum)"}`, distanceFare)}
      ${regionSurcharge !== null ? fareRow(`Out-of-area: ${d.region}`, regionSurcharge) : ""}
      ${stopsFee > 0 ? fareRow(`${d.stops} intermediate stop${d.stops > 1 ? "s" : ""} (+$3.00 ea.)`, stopsFee) : ""}
      ${toll407 > 0 ? fareRow(`407 ETR (${d.km407} km)`, toll407) : ""}
      ${ccSurcharge > 0 ? fareRow("Credit card surcharge", ccSurcharge) : ""}
      ${fareRow("Total", d.fareTotal, true)}
    </table>

    <!-- Payment -->
    ${section("Payment", "💳")}
    ${table([
      row("Method", d.paymentMethod === "card" ? "Credit / Debit Card" : "Cash"),
    ].join(""))}

    <!-- Notes -->
    ${d.specialNotes ? `
    <div style="margin-top:24px;">
      ${section("Special Notes", "📝")}
      <p style="margin:0;font-size:14px;color:#4B5E82;font-style:italic;background:#FFF8E7;border-radius:10px;padding:14px 18px;border-left:3px solid #FFB627;">${d.specialNotes}</p>
    </div>` : ""}

    <!-- CTA banner -->
    <div style="margin-top:32px;background:#EDF7ED;border-radius:14px;padding:18px 22px;border-left:4px solid #22C55E;">
      <p style="margin:0 0 6px;font-size:14px;font-weight:700;color:#166534;">What happens next?</p>
      <p style="margin:0;font-size:13px;color:#166534;line-height:1.6;">A dispatcher will call you at <strong>${d.phone}</strong> to confirm your booking. Please keep your phone nearby around your pickup time.</p>
    </div>

    <!-- Contact footer -->
    <div style="margin-top:20px;text-align:center;">
      <p style="margin:0;font-size:13px;color:#8A9BB5;">Need to change or cancel? Call us at
        <a href="tel:6475017433" style="color:#FFB627;font-weight:600;text-decoration:none;">647-501-7433</a>
        or reply to this email.
      </p>
    </div>
  `;

  return send({
    from: FROM,
    to: d.toEmail,
    subject: `✅ Booking confirmed – ${d.pickupDate} at ${d.pickupTime} (#RB-${refId})`,
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

// ─── 6. Driver application approved → driver ─────────────────────────────────

export interface DriverApprovedData {
  toEmail: string;
  name: string;
  tempPassword: string;
  loginUrl: string;
}

export async function sendDriverApproved(d: DriverApprovedData) {
  const body = `
    <h2 style="margin:0 0 4px;font-size:22px;font-weight:700;color:#0E1B35;">Congratulations — you're approved! 🎉</h2>
    <p style="margin:0 0 24px;font-size:15px;color:#4B5E82;">Hi <strong>${d.name}</strong>, your RideBack driver application has been reviewed and approved. Your driver account is ready — log in with the credentials below to get started.</p>

    ${section("Your login credentials", "🔑")}
    ${table([row("Email", d.toEmail)].join(""))}

    <div style="background:#FFF8E7;border:2px dashed #FFB627;border-radius:14px;padding:20px;text-align:center;margin:20px 0;">
      <p style="margin:0 0 6px;font-size:12px;font-weight:600;color:#7A4F00;letter-spacing:1px;text-transform:uppercase;">Temporary Password</p>
      <p style="margin:0;font-size:28px;font-weight:700;color:#0E1B35;letter-spacing:3px;font-family:monospace;">${d.tempPassword}</p>
    </div>

    <div style="text-align:center;margin-bottom:24px;">
      <a href="${d.loginUrl}" style="display:inline-block;background:#FFB627;color:#0E1B35;font-weight:700;font-size:15px;padding:12px 28px;border-radius:12px;text-decoration:none;">
        Log In to Driver Portal →
      </a>
    </div>

    <div style="background:#EDF7ED;border-radius:12px;padding:16px 20px;margin-bottom:16px;border-left:3px solid #22C55E;">
      <p style="margin:0;font-size:13px;color:#166534;">✅ Once logged in, you'll be able to view assigned rides, update your profile, and manage your availability.</p>
    </div>

    <div style="background:#FEF2F2;border-radius:12px;padding:14px 18px;border-left:3px solid #F87171;">
      <p style="margin:0;font-size:13px;color:#991B1B;">⚠️ This is a temporary password. Please change it immediately after logging in from your Profile page.</p>
    </div>
  `;

  return send({
    from: FROM,
    to: d.toEmail,
    subject: "🎉 You're approved – Welcome to the RideBack driver team!",
    html: wrap(body),
  });
}

// ─── 7. Welcome with auto-generated password → new customer ──────────────────

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
