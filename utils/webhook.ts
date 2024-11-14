import {URLSearchParams} from "url";
import {bigcommerceClient} from "@lib/auth";
import db from "@lib/db";
import {Customer} from "../types/bigcommerce";


const sendEmail = async (id:string,storeHash:string)=>{
    
    const accessToken = await db.getStoreToken(storeHash);

    const bigcommerce = bigcommerceClient(accessToken, storeHash);

    const params = new URLSearchParams({ 'id:in':id }).toString();

    const response = await bigcommerce.get(`/customers?${params}`);
    console.log(response.data[0]);
    
    const customer:Customer = response?.data[0];
    const {email, first_name, last_name} = customer;
    const subject = "Account Created Successfully";
    const message = "Welcome to the store! we have exciting offers for you."
    
    if (!customer){
        return false;
    }
    
    try {
        const response = await fetch('https://worthy-endless-colt.ngrok-free.app/api/email',{
            method: 'POST',
            headers:{
                'Content-Type' : 'application/json',
            },
            body: JSON.stringify({email,subject,message})
        });

        const data = await response.json();

        if (response.ok) {
            console.log('email sent');
        } else {
            // setStatus(`Failed to send message: ${data.error}`);
            console.log(`${data.error}`);

        }
    } catch (error){
        console.log(error);
    }
}
export default sendEmail;