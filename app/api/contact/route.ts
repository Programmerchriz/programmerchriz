import { Resend } from "resend";
import { createContactHandler } from "@/lib/contact";

export async function POST(request: Request) {
  let client: Resend | undefined;
  const handler = createContactHandler({
    apiKey: () => process.env.RESEND_API_KEY,
    from: process.env.CONTACT_FROM_EMAIL || "Contact Form <onboarding@resend.dev>",
    // Preserve the existing delivery destination; deployments may override it.
    to: process.env.CONTACT_TO_EMAIL || "programmerchris6002@gmail.com",
    send: async (email) => {
      client ??= new Resend(process.env.RESEND_API_KEY);
      return client.emails.send(email);
    },
  });
  return handler(request);
}
