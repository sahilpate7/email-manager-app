import {URLSearchParams} from "url";
import {bigcommerceClient} from "@lib/auth";
import db from "@lib/db";
import {Customer} from "../types/bigcommerce";
import sendCustomEmail from "./emailSender";
import {getTemplate} from "@lib/dbs/firebase";

const sendEmail = async (id:string,storeHash:string,template:string)=>{
    
    const accessToken = await db.getStoreToken(storeHash);

    const bigcommerce = bigcommerceClient(accessToken, storeHash);

    const params = new URLSearchParams({ 'id:in':id }).toString();

    const response = await bigcommerce.get(`/customers?${params}`);
    console.log(response.data[0]);
    const customer:Customer = response?.data[0];
    const {email, first_name, last_name} = customer;
    const subject = `Account Created Successfully ${first_name}`;
    const message = `Welcome to the store ${first_name + ' ' + last_name}! we have exciting offers for you.`
    const result = await getTemplate(storeHash,template);
    // console.log(result);
    if (!customer && !result){
        return false;
    }
    try {
        await sendCustomEmail({email, subject, message,html:result})
        console.log('Email sent successfully!');
    } catch (error) {
        console.log('Error ' + error);
    }
}   
export default sendEmail;