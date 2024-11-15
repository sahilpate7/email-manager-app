// eslint-disable-next-line import/default
import transporter from "../../../utils/nodeMailer";

export default async function handler(req:any, res:any) {
    if (req.method === 'POST') {
        const { email,subject, message } = req.body;

        // Nodemailer function.

        try {
            await transporter.sendMail({
              from: process.env.MAIL_FROM,
              to: email,
              subject: subject,
              text: message,
            });

            res.status(200).json({ message: 'Email sent successfully!' });
        } catch (error) {
            res.status(500).json({ error: error });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
