import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(request: Request) {
  try {
    const { name, brand, need, message } = await request.json();

    // Validate required fields
    if (!name || !brand || !need || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Send emails if Resend is configured
    if (resend) {
      // Send confirmation email to submitter
      await resend.emails.send({
        from: "VIRAL DUO <onboarding@resend.dev>",
        to: "user@example.com",
        subject: "Thanks for reaching out to VIRAL DUO",
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #080808;">Hey ${name}! 👋</h1>
            <p style="color: #333;">Thanks for reaching out to VIRAL DUO. We&apos;ve received your message and will get back to you within 24 hours.</p>
            <div style="background: #f5f0e8; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; color: #666;"><strong>Your request:</strong></p>
              <p style="margin: 10px 0 0; color: #333;">${need} for ${brand}</p>
            </div>
            <p style="color: #333;">Get ready to go viral! 🚀</p>
            <p style="color: #888;">— The VIRAL DUO Team</p>
          </div>
        `,
      });

      // Send notification to team
      await resend.emails.send({
        from: "VIRAL DUO <onboarding@resend.dev>",
        to: "team@viralduo.com",
        subject: `New inquiry from ${name} at ${brand}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #E63946;">New VIRAL DUO Inquiry 🎬</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; color: #666;"><strong>Name:</strong></td>
                <td style="padding: 10px 0; color: #333;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #666;"><strong>Brand:</strong></td>
                <td style="padding: 10px 0; color: #333;">${brand}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #666;"><strong>Service:</strong></td>
                <td style="padding: 10px 0; color: #333;">${need}</td>
              </tr>
            </table>
            <div style="background: #f5f0e8; padding: 20px; border-radius: 8px; margin-top: 20px;">
              <p style="margin: 0; color: #666;"><strong>Message:</strong></p>
              <p style="margin: 10px 0 0; color: #333;">${message}</p>
            </div>
          </div>
        `,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
