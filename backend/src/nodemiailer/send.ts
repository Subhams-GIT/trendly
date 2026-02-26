import nodemailer from "nodemailer";
import { createTestTransporter } from "./setup";

export async function sendTestEmail(link:string,receiver:string) {
    const transporter = await createTestTransporter();

    const info = await transporter.sendMail({
        from: '"Survey Dev" <dev@survey.com>',
        to: receiver,
        subject: "Survey Test Email",
        text: link,
        html: "<h1>Survey Test Email</h1>",
    });
    console.log("Message ID:", info.messageId);
    console.log("Preview URL:", nodemailer.getTestMessageUrl(info));
}

// sendTestEmail(link:string);
