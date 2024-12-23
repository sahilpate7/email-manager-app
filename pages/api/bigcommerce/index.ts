// pages/api/webhooks.js
import * as process from "node:process";
import newCustomerEmail from "../../../utils/newCustomerWebhook";
import newOrderEmail from "../../../utils/newOrderWebhook";

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const payload = req.body;
        
        const securityHeader = req.headers['customer-email-manager'];
        
        // check if request receive from BigCommerce
        if (securityHeader !== process.env.WEBHOOK_SECRET){
            res.status(401).send('Authentication Failed');
        }
        const id = payload.data.id;
        const storeHash = payload.producer.split('/')[1];
        // console.log(storehash + " " + customerID);
        switch (payload.scope){
            case "store/customer/created":{
                // code goes here
                const template = "newCustomer";
                await newCustomerEmail(id,storeHash,template);
                break;
            }
            case "store/order/created":{
                const template = "newOrder";
                await newOrderEmail(id,storeHash,template);
                break;
            }
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
