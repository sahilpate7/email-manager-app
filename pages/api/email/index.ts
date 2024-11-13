// eslint-disable-next-line import/default
import transporter from "../../../utils/nodeMailer";

export default async function handler(req:any, res:any) {
    if (req.method === 'POST') {
        const { email,subject, message } = req.body;

        // Here, you would add the logic to send the email, for example:
        // - Using an email-sending service like SendGrid, Nodemailer, or Mailgun.

        try {
            await transporter.sendMail({
              from: 'connect@sahilpate.dev',
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
