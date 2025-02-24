import {URLSearchParams} from "url";
import {bigcommerceClient} from "@lib/auth";
import db from "@lib/db";
import {getAdminSettings, getTemplate} from "@lib/dbs/firebase";
import {Customer, Order, Store} from "../types/bigcommerce";
import emailSender, {EmailSender} from "./emailSender";

const newOrderEmail = async (id:string,storeHash:string,template:string)=>{

    const accessToken = await db.getStoreToken(storeHash);
    const version = 'v2'; // define api version, default is "v3"
    const bigcommerce = bigcommerceClient(accessToken, storeHash);
    const bigcommerceV2 = bigcommerceClient(accessToken,storeHash, version);
    
    // fetch order details
    const orderDetails:Order = await bigcommerceV2.get(`/orders/${id}`);
    const {customer_id,products,id: orderId} = orderDetails;
    
    // Fetch customers details
    const params = new URLSearchParams({ 'id:in':customer_id }).toString();
    const response = await bigcommerce.get(`/customers?${params}`);
    const customer:Customer = response?.data[0];
    const {email:customerEmail, first_name:customerFirstName, last_name:customerLastName} = customer;
    
    // Fetch products
    const getProducts = await bigcommerceV2.get(`${products.resource}`);
    // console.log(getProducts);
    
    const storeData:Store = await bigcommerceV2.get(`/store`);
    // console.log(response.data[0]);
    
    const {name:storeName, phone:storePhone, address:storeAddress,logo:storeLogo} = storeData;
    const subject = `Thank you for your order ${customerFirstName}`;
    const message = `Your order number is  ${orderId}!`
    const {html, toggle} = await getTemplate(storeHash, template);
    const emailConfig = await getAdminSettings(storeHash);
    const sendToOwner = true;
    const enableSendEmail = toggle;
    const orderTemplate = html
        .replace(/{{first_name}}/g, customerFirstName)
        .replace(/{{last_name}}/g, customerLastName)
        .replace(/{{store_address}}/g, storeAddress)
        .replace(/{{store_phone}}/g, storePhone)
        .replace(/{{store_name}}/g, storeName)
        .replace(/{{store_logo}}/g, storeLogo?.url)
    // console.log(result);
    // if (!customer && !result){
    //     return false;
    // }
    if (!enableSendEmail) {
        return false;
    }
    try {
        await emailSender(<EmailSender>{email:customerEmail, subject, message,html:orderTemplate, settings:emailConfig, sendToOwner});
    } catch (error) {
        console.log('Error ' + error);
    }
}
export default newOrderEmail;