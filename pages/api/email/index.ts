// eslint-disable-next-line import/default
import emailSender from "../../../utils/emailSender";

export default async function handler(req:any, res:any) {
    if (req.method === 'POST') {
        const { email,subject, message } = req.body;
        const html = ""

        // Nodemailer function.

        try {
            await emailSender({email, subject, message, html});

            res.status(200).json({ message: 'Email sent successfully!' });
        } catch (error) {
            res.status(500).json({ error: error });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
