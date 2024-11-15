
import {Box, Button, Flex, Form, FormGroup, Textarea} from "@bigcommerce/big-design";
import { useState} from "react";
import Loading from "@components/loading";
import {alertsManager} from "@pages/_app";


const NewCustomer = () => {
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    
    const onSubmit = ()=>{
        setLoading(true)
        alertsManager.add({ messages: [{ text: 'An error occurred while sending the message.' }],type: 'error' });
    };
    
    if (loading) return <Loading />;

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