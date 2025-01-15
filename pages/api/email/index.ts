import {NextApiRequest, NextApiResponse} from "next";
import {getSession} from "@lib/auth";
import {getAdminSettings} from "@lib/dbs/firebase";
import emailSender, {EmailSender} from "../../../utils/emailSender";

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    if (req.method === 'POST') {
        const { email,subject, message,sendToOwner } = req.body;
        const {storeHash} = await getSession(req);
        const emailConfig = await getAdminSettings(storeHash);
        const html = "";

        // Nodemailer function.

        try {
            await emailSender(<EmailSender>{email, subject, message, html, settings:emailConfig,sendToOwner});
            res.status(200).json({ message: 'Email sent successfully!' });
        } catch (error) {
            res.status(500).json({ error: error });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
