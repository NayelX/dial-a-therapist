import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface StatusChangePayload {
  table: "appointments" | "contacts";
  record_id?: string;
  record_ids?: string[];
  new_status: string;
  reason?: string;
}

interface EmailItem {
  from: string;
  to: string[];
  subject: string;
  html: string;
}

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY environment variable is not set.");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const fromEmail = Deno.env.get("RESEND_FROM_EMAIL") || "Dial-A-Therapist GH <onboarding@resend.dev>";

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const payload: StatusChangePayload = await req.json();
    const { table, record_id, record_ids, new_status, reason } = payload;

    const targetIds: string[] = [];
    if (record_ids && Array.isArray(record_ids)) {
      targetIds.push(...record_ids.filter(Boolean));
    } else if (record_id) {
      targetIds.push(record_id);
    }

    if (!table || targetIds.length === 0 || !new_status) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: table, record_id(s), new_status" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const emailBatch: EmailItem[] = [];

    if (table === "appointments") {
      const { data: appts, error: dbError } = await supabase
        .from("appointments")
        .select("*")
        .in("id", targetIds);

      if (dbError || !appts || appts.length === 0) {
        throw new Error(`Appointment record(s) not found: ${dbError?.message || "Unknown error"}`);
      }

      for (const appt of appts) {
        if (!appt.email) continue;
        const recipientName = appt.full_name || "Client";
        let emailSubject = "";
        let emailHtml = "";

        if (new_status === "Confirmed") {
          emailSubject = `Appointment Confirmed - Dial-A-Therapist GH`;
          emailHtml = `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
              <h2 style="color: #bfa15f; margin-bottom: 20px;">Appointment Confirmed</h2>
              <p>Dear <strong>${recipientName}</strong>,</p>
              <p>Your therapy appointment request with Dial-A-Therapist GH has been officially <strong>confirmed</strong>.</p>
              
              <div style="background: #fafafa; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #bfa15f;">
                <p style="margin: 6px 0;"><strong>Service:</strong> ${appt.service_type}</p>
                <p style="margin: 6px 0;"><strong>Date:</strong> ${appt.preferred_date}</p>
                <p style="margin: 6px 0;"><strong>Time:</strong> ${appt.preferred_time}</p>
              </div>

              <p>If you need to make changes or have any questions prior to your session, please reply directly to this email or call our direct line.</p>
              <br/>
              <p style="color: #777; font-size: 14px;">Warm regards,<br/><strong>Dial-A-Therapist GH Team</strong></p>
            </div>
          `;
        } else if (new_status === "Cancelled") {
          emailSubject = `Appointment Update - Dial-A-Therapist GH`;
          emailHtml = `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
              <h2 style="color: #991b1b; margin-bottom: 20px;">Appointment Cancelled</h2>
              <p>Dear <strong>${recipientName}</strong>,</p>
              <p>We are writing to inform you that your scheduled appointment for <strong>${appt.service_type}</strong> on <strong>${appt.preferred_date}</strong> has been cancelled.</p>
              
              ${
                reason
                  ? `<div style="background: #fef2f2; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
                       <p style="margin: 0; color: #991b1b;"><strong>Reason for Cancellation:</strong><br/>${reason}</p>
                     </div>`
                  : ""
              }

              <p>To reschedule or book a different session, please visit our booking portal or contact us directly.</p>
              <br/>
              <p style="color: #777; font-size: 14px;">Warm regards,<br/><strong>Dial-A-Therapist GH Team</strong></p>
            </div>
          `;
        } else {
          emailSubject = `Appointment Status Update - Dial-A-Therapist GH`;
          emailHtml = `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
              <p>Dear <strong>${recipientName}</strong>,</p>
              <p>The status of your appointment request has been updated to: <strong>${new_status}</strong>.</p>
              <p style="color: #777; font-size: 14px;">Dial-A-Therapist GH</p>
            </div>
          `;
        }

        emailBatch.push({
          from: fromEmail,
          to: [appt.email],
          subject: emailSubject,
          html: emailHtml,
        });
      }
    } else if (table === "contacts") {
      const { data: contacts, error: dbError } = await supabase
        .from("contacts")
        .select("*")
        .in("id", targetIds);

      if (dbError || !contacts || contacts.length === 0) {
        throw new Error(`Contact record(s) not found: ${dbError?.message || "Unknown error"}`);
      }

      for (const contact of contacts) {
        if (!contact.email) continue;
        const recipientName = contact.name || "Client";
        const emailSubject = `Update regarding your message: ${contact.subject}`;
        const emailHtml = `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
            <h2 style="color: #bfa15f; margin-bottom: 20px;">Message Update</h2>
            <p>Dear <strong>${recipientName}</strong>,</p>
            <p>Thank you for reaching out regarding <em>"${contact.subject}"</em>. Our team has reviewed your inquiry.</p>
            ${reason ? `<p><strong>Note from our team:</strong><br/>${reason}</p>` : ""}
            <p style="color: #777; font-size: 14px;">Warm regards,<br/><strong>Dial-A-Therapist GH Team</strong></p>
          </div>
        `;

        emailBatch.push({
          from: fromEmail,
          to: [contact.email],
          subject: emailSubject,
          html: emailHtml,
        });
      }
    }

    if (emailBatch.length === 0) {
      return new Response(
        JSON.stringify({ success: true, count: 0, message: "No valid recipient email addresses found" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Try Resend batch endpoint if multiple, or single if 1
    if (emailBatch.length > 1) {
      const resendBatchResponse = await fetch("https://api.resend.com/emails/batch", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(emailBatch),
      });

      if (!resendBatchResponse.ok) {
        // Fallback: sequential sending with 200ms delay to avoid rate limit spikes
        for (let i = 0; i < emailBatch.length; i++) {
          await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${resendApiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(emailBatch[i]),
          });
          if (i < emailBatch.length - 1) {
            await new Promise((resolve) => setTimeout(resolve, 200));
          }
        }
      }
    } else {
      const resendResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(emailBatch[0]),
      });

      if (!resendResponse.ok) {
        const resendResult = await resendResponse.json();
        throw new Error(`Resend API error: ${JSON.stringify(resendResult)}`);
      }
    }

    return new Response(
      JSON.stringify({ success: true, count: emailBatch.length }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
