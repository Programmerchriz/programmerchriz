import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { name, email, mobileNumber, message } = await request.json();

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Send email to you
    const response = await resend.emails.send({
      from: "Contact Form <onboarding@resend.dev>", // Resend sandbox email (change after verifying domain)
      to: "programmerchris6002@gmail.com", // YOUR email
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${mobileNumber || "Not provided"}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\\n/g, "<br>")}</p>
      `,
    });

    // Optional: Send confirmation email to the visitor
    await resend.emails.send({
      from: "Contact Form <onboarding@resend.dev>",
      to: email,
      subject: "We received your message!",
      html: `
        <h2>Thank you for reaching out!</h2>
        <p>Hi ${name},</p>
        <p>I've received your message and will get back to you soon.</p>
        <p>Best regards,<br>Christian Nwachukwu</p>
      `,
    });

    return NextResponse.json(
      { success: true, message: "Email sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Email error:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
};
