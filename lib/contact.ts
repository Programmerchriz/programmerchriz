export interface ContactInput {
  name: string;
  email: string;
  mobileNumber: string;
  message: string;
}

export interface ContactEmail {
  from: string;
  to: string;
  subject: string;
  replyTo?: string;
  html: string;
  text: string;
}

interface ContactDependencies {
  send: (email: ContactEmail) => Promise<{ data: { id: string } | null; error: unknown | null }>;
  apiKey: () => string | undefined;
  from: string;
  to: string;
}

export function parseContactPayload(value: unknown): ContactInput | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const input = value as Record<string, unknown>;
  if (typeof input.name !== "string" || typeof input.email !== "string" || typeof input.message !== "string") return null;
  if (input.mobileNumber !== undefined && typeof input.mobileNumber !== "string") return null;
  const name = input.name.trim();
  const email = input.email.trim();
  const message = input.message.trim();
  const mobileNumber = typeof input.mobileNumber === "string" ? input.mobileNumber.trim() : "";
  if (!name || name.length > 100 || !message || message.length > 5000 || email.length > 254 || mobileNumber.length > 40) return null;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null;
  return { name, email, mobileNumber, message };
}

export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[character]!);
}

// The delivery function is injected so every outcome can be checked without email.
export function createContactHandler({ send, apiKey, from, to }: ContactDependencies) {
  return async (request: Request): Promise<Response> => {
    let payload: unknown;
    try { payload = await request.json(); }
    catch { return Response.json({ error: "Please send a valid contact form." }, { status: 400 }); }
    const contact = parseContactPayload(payload);
    if (!contact) return Response.json({ error: "Check your name, email and message, then try again." }, { status: 400 });
    if (!apiKey()) return Response.json({ error: "Contact form is temporarily unavailable. Please email me directly." }, { status: 503 });

    const { name, email, mobileNumber, message } = contact;
    const safeName = escapeHtml(name);
    const safeMessage = escapeHtml(message).replace(/\r\n|\r|\n/g, "<br>");
    try {
      const result = await send({
        from, to, replyTo: email,
        subject: `Portfolio message from ${name.replace(/[\r\n]+/g, " ")}`,
        text: `Name: ${name}\nEmail: ${email}\nPhone: ${mobileNumber || "Not provided"}\n\n${message}`,
        html: `<h2>New portfolio message</h2><p><strong>Name:</strong> ${safeName}</p><p><strong>Email:</strong> ${escapeHtml(email)}</p><p><strong>Phone:</strong> ${escapeHtml(mobileNumber || "Not provided")}</p><p><strong>Message:</strong></p><p>${safeMessage}</p>`,
      });
      if (result.error || !result.data?.id) return Response.json({ error: "Your message could not be delivered. Please try again or email me directly." }, { status: 502 });
    } catch {
      return Response.json({ error: "Your message could not be delivered. Please try again or email me directly." }, { status: 502 });
    }

    // Once the owner's copy is accepted, a confirmation failure must not invite
    // a duplicate submission of an already-delivered message.
    try {
      await send({
        from, to: email, subject: "Your message to Chris Nwachukwu",
        text: `Hi ${name},\n\nThank you for getting in touch. Your message has been received.\n\nChris Nwachukwu`,
        html: `<p>Hi ${safeName},</p><p>Thank you for getting in touch. Your message has been received.</p><p>Chris Nwachukwu</p>`,
      });
    } catch { /* Visitor confirmation is best effort after primary delivery. */ }
    return Response.json({ success: true, message: "Your message has been sent. Thank you for getting in touch." });
  };
}
