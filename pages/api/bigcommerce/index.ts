// pages/api/webhooks.js
import * as process from "node:process";
import sendEmail from "../../../utils/webhook";

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const payload = req.body;
        
        const securityHeader = req.headers['customer-email-manager'];
        
        // check if request receive from BigCommerce
        if (securityHeader !== process.env.WEBHOOK_SECRET){
            res.status(401).send('Authentication Failed');
        }
        const customerID = payload.data.id;
        const storeHash = payload.producer.split('/')[1];
        // console.log(storehash + " " + customerID);
        switch (payload.scope){
            case "store/customer/created":
                // code goes here
                sendEmail(customerID,storeHash)
                break;
        }
        
        // Process the payload here
        console.log('Received webhook payload:', payload);

        // Respond to BigCommerce to confirm receipt
        res.status(200).send('Webhook received');
    } else {
        // Return a 405 Method Not Allowed if not a POST request
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
