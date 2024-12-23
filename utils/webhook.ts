import {URLSearchParams} from "url";
import {bigcommerceClient} from "@lib/auth";
import db from "@lib/db";
import {getTemplate} from "@lib/dbs/firebase";
import {Customer,Store} from "../types/bigcommerce";
import sendCustomEmail from "./emailSender";

const sendEmail = async (id:string,storeHash:string,template:string)=>{
    
    const accessToken = await db.getStoreToken(storeHash);
    const version = 'v2';

    const bigcommerce = bigcommerceClient(accessToken, storeHash);
    const bigcommerceV2 = bigcommerceClient(accessToken,storeHash, version);

    const params = new URLSearchParams({ 'id:in':id }).toString();

    const response = await bigcommerce.get(`/customers?${params}`);
    const storeData:Store = await bigcommerceV2.get(`/store`);
    // console.log(response.data[0]);
    // console.log(storeData);
    const customer:Customer = response?.data[0];
    const {email, first_name, last_name} = customer;
    const {name, phone, address,logo} = storeData;
    const subject = `Account Created Successfully ${first_name}`;
    const message = `Welcome to the store ${first_name + ' ' + last_name}! we have exciting offers for you.`
    const result = await getTemplate(storeHash,template);
    let newTemplate = result;
    
    newTemplate = newTemplate
        .replace(/{{first_name}}/g, first_name)
        .replace(/{{last_name}}/g,last_name)
        .replace(/{{store_address}}/g,address)
        .replace(/{{store_phone}}/g,phone)
        .replace(/{{store_name}}/g,name)
        .replace(/{{store_logo}}/g,logo?.url)
    // console.log(result);
    if (!customer && !result){
        return false;
    }
    try {
        await sendCustomEmail({email, subject, message,html:newTemplate})
        console.log('Email sent successfully!');
    } catch (error) {
        console.log('Error ' + error);
    }
}   
export default sendEmail;