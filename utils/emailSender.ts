import transporter from "./transporter";

type EmailSender = {
    email : string,
    subject:string,
    message:string,
    html:string
}
export default async function emailSender({email, subject, message,html}:EmailSender) {
    await transporter.sendMail({
        from: process.env.MAIL_FROM,
        to: email,
        subject: subject,
        text: message,
        html: html
    });
}