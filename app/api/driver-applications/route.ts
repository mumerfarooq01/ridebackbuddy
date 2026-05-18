import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { prisma } from "@/lib/prisma";

const resend = new Resend(process.env.RESEND_KEY);
const FROM = process.env.RESEND_FROM ?? "";

async function sendEmail(payload: Parameters<typeof resend.emails.send>[0]) {
  const { error } = await resend.emails.send(payload);
  if (error) throw new Error(error.message ?? "Resend error");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { firstName, lastName, email, phone, area, experience, availability, notes } = body;

    if (!firstName || !lastName || !email || !phone || !area || !experience) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const availabilityList = Array.isArray(availability)
      ? availability.join(", ")
      : availability || "Not specified";

    // Fetch all admin emails from DB
    const admins = await prisma.user.findMany({ select: { email: true } });
    const adminEmails = admins.map((a) => a.email);

    // Notify all admins
    if (adminEmails.length > 0) {
      await sendEmail({
        from: FROM,
        to: adminEmails,
        replyTo: email,
        subject: `🚗 New Driver Application – ${firstName} ${lastName}`,
        html: `
        <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:560px;margin:0 auto;background:#F4F6F9;padding:24px 16px;">
          <div style="background:#0E1B35;border-radius:16px 16px 0 0;padding:20px 28px;">
            <span style="font-size:18px;font-weight:700;color:#fff;">New Driver Application</span>
          </div>
          <div style="background:#fff;border-radius:0 0 16px 16px;padding:28px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
              ${[
                ["Name", `${firstName} ${lastName}`],
                ["Email", `<a href="mailto:${email}">${email}</a>`],
                ["Phone", `<a href="tel:${phone}">${phone}</a>`],
                ["Area", area],
                ["Experience", experience],
                ["Availability", availabilityList],
                ["Notes", notes || "—"],
              ]
                .map(
                  ([label, value]) => `
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #EEF1F6;font-size:13px;color:#6B7A99;white-space:nowrap;padding-right:20px;width:130px;">${label}</td>
                  <td style="padding:10px 0;border-bottom:1px solid #EEF1F6;font-size:14px;color:#0E1B35;font-weight:500;">${value}</td>
                </tr>`
                )
                .join("")}
            </table>
            <div style="margin-top:24px;background:#FFF8E7;border-radius:10px;padding:14px 18px;border-left:3px solid #FFB627;">
              <p style="margin:0;font-size:13px;color:#7A4F00;">Reply to this email to contact the applicant directly.</p>
            </div>
          </div>
        </div>
      `,
      });
    }

    // Confirmation to applicant
    await sendEmail({
      from: FROM,
      to: email,
      subject: "We received your application – RideBack Buddy",
      html: `
        <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:560px;margin:0 auto;background:#F4F6F9;padding:24px 16px;">
          <div style="background:#0E1B35;border-radius:16px 16px 0 0;padding:20px 28px;text-align:center;">
            <span style="font-size:18px;font-weight:700;color:#fff;">🚗 RideBack Buddy</span>
          </div>
          <div style="background:#fff;border-radius:0 0 16px 16px;padding:32px;text-align:center;">
            <div style="font-size:48px;margin-bottom:12px;">🎉</div>
            <h2 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#0E1B35;">Application received, ${firstName}!</h2>
            <p style="margin:0 0 20px;font-size:15px;color:#4B5E82;">Thanks for applying to drive with RideBack Buddy. Our team will review your info and give you a call within <strong>48 hours</strong>.</p>
            <div style="background:#F4F6F9;border-radius:12px;padding:16px 20px;text-align:left;margin-bottom:20px;">
              <p style="margin:0 0 6px;font-size:13px;color:#6B7A99;font-weight:600;">WHAT HAPPENS NEXT</p>
              <p style="margin:0;font-size:14px;color:#0E1B35;">1. We review your application<br/>2. Quick phone screen with our team<br/>3. Onboarding & orientation<br/>4. Start your first ride!</p>
            </div>
            <p style="margin:0;font-size:13px;color:#6B7A99;">Questions? Call us at <a href="tel:6475017433" style="color:#FFB627;font-weight:600;text-decoration:none;">647-501-7433</a></p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("POST /api/driver-applications", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
