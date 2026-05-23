import { Resend } from "resend";

const resend = new Resend("re_Bf76Mbb3_CJAUzR2iZYH7wmwz2L4tQGcf");

export async function sendBookingEmail(data) {

    try {

        await resend.emails.send({

            from: "Motiva <onboarding@resend.dev>",

            to: ["mitaxise@gmail.com"],

            subject: "New Booking Request",

            html: `

        <h1>New Booking</h1>

        <p><strong>Name:</strong> ${data.fullName}</p>

        <p><strong>Phone:</strong> ${data.phone}</p>

        <p><strong>Service:</strong> ${data.service}</p>

      `,
        });

    } catch (err) {

        console.error(err);

    }
}