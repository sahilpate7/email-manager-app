
import {Box, Button, Flex, Form, FormGroup, Textarea} from "@bigcommerce/big-design";
import { useState} from "react";
import {alertsManager} from "@pages/_app";
import {useSession} from "../../../context/session";

const NewCustomer = () => {
    const [code, setCode] = useState('');
    const template= "newCustomer";
    const [loading, setLoading] = useState(false);
    const { context } = useSession();

    const onSubmit = async (e:any)=>{
        e.preventDefault();
        try {
            setLoading(true);
            const response = await fetch(`/api/setTemplate?context=${context}`,{
                method: 'POST',
                headers:{
                    'Content-Type' : 'application/json',
                },
                body: JSON.stringify({template,html: code})
            });

            // const data = await response.json();

            if (response.ok) {
                // setCode(''); // Clear the message
                setLoading(false);
                alertsManager.add({ messages: [{ text: 'Template saved' }],type: 'success' });
            } else {
                // setStatus(`Failed to send message: ${data.error}`);
                alertsManager.add({ messages: [{ text: 'Failed to save template' }],type: 'error' });
                setLoading(false);
            }
        } catch (error){
            alertsManager.add({ messages: [{ text: 'An error occurred while saving the template.' }],type: 'error' });
            setLoading(false);
        }
    };
    
    return (
        <Form onSubmit={onSubmit} >
            <Box>
                <FormGroup>
                    <Textarea
                        readOnly={loading}
                        label=""
                        name="message"
                        placeholder="HTML code goes here"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        required
                        rows={7}
                    />
                </FormGroup>
            </Box>
            <Flex justifyContent="flex-start" marginTop={'medium'}>
                <Button type="submit" isLoading={loading}>Save</Button>
            </Flex>
        </Form>
    );
}

export default NewCustomer;