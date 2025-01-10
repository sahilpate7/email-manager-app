import nodemailer from 'nodemailer';

export type EmailSender = {
    email : string,
    subject:string,
    message:string,
    html:string,
    settings:{
        adminEmail: string,
        mailHost: string,
        mailPort: number,
        mailUser: string,
        mailPass: string
    }
}


export default async function emailSender({email, subject, message,html, settings}:EmailSender) {
    const transporter = nodemailer.createTransport({
        host: settings.mailHost,
        port: Number(settings.mailPort),
        secure: true, // true for port 465, false for other ports
        auth: {
            user: settings.mailUser,
            pass: settings.mailPass,
        },
    });

    await transporter.sendMail({
        from: settings.adminEmail,
        to: email,
        subject: subject,
        text: message,
        html: html
    });
}