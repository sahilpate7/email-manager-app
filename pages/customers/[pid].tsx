import { Button, Flex, FormGroup, Input, Panel, Form as StyledForm, Text, Textarea} from "@bigcommerce/big-design";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import ErrorMessage from "@components/error";
import Loading from "@components/loading";
import {useCustomerInfo} from "@lib/hooks";
import {alertsManager} from "@pages/_app";
import {useSession} from "../../context/session";


const CustomerInfo = () => {
    const [message, setMessage] = useState('');
    const [subject, setSubject] = useState('');
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const pid = Number(router.query?.pid);
    const { error, isLoading,customer} = useCustomerInfo(pid);
    const currentCustomer = customer;
    const { context } = useSession();

    useEffect(()=>{
        setEmail(currentCustomer?.email);
        setName(currentCustomer?.first_name + ' ' + currentCustomer?.last_name);
    },[currentCustomer]);

    const onCancel = ()=>{
        router.push('/customers');
    }
    
    const onSubmit = async (e:any)=>{
        e.preventDefault();
        try {
            setLoading(true);
            const sendToOwner = false;
            const response = await fetch(`/api/email?context=${context}`,{
                method: 'POST',
                headers:{
                    'Content-Type' : 'application/json',
                },
                body: JSON.stringify({email,subject,message,sendToOwner})
            });

            // const data = await response.json();
            
            if (response.ok) {
                setMessage(''); // Clear the message
                setSubject(''); // Clear the subject
                setLoading(false);
                alertsManager.add({ messages: [{ text: 'Email sent successfully' }],type: 'success' });
            } else {
                // setStatus(`Failed to send message: ${data.error}`);
                alertsManager.add({ messages: [{ text: 'Failed to send message' }],type: 'error' });
                setLoading(false);
            }
        } catch (error){
            alertsManager.add({ messages: [{ text: 'An error occurred while sending the message.' }],type: 'error' });
            setLoading(false);
        }
    };
    if (isLoading) return <Loading />;
    if (error) return <ErrorMessage error={error} />;
    
    return (
        <StyledForm onSubmit={onSubmit} >
            <Panel header="Send email to the customer">
                <Text><Text bold>Name: </Text>{name}</Text>
                <Text><Text bold>Email: </Text>{email}</Text>
                <FormGroup>
                    <Input
                        readOnly={loading}
                        label="Subject"
                        name="subject"
                        required
                        value={subject}
                        onChange={(e)=> setSubject(e.target.value)}
                    />
                </FormGroup>
                <FormGroup>
                    <Textarea
                        readOnly={loading}
                        label="Message"
                        name="message"
                        placeholder="Write message here"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                    />
                </FormGroup>
            </Panel>
            <Flex justifyContent="flex-end">
                <Button
                    marginRight="medium"
                    type="button"
                    variant="subtle"
                    onClick={onCancel}
                >
                    Cancel
                </Button>
                <Button type="submit" isLoading={loading}>Send email</Button>
            </Flex>
        </StyledForm>
    );
}

export default CustomerInfo;