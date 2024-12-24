
import {Box, Button, Flex, Form, FormGroup,Modal, Select} from "@bigcommerce/big-design";
import Editor from "@monaco-editor/react";
import {useEffect, useRef, useState} from "react";
import {alertsManager} from "@pages/_app";
import {useSession} from "../../../context/session";


const NewOrder = () => {
    const [code, setCode] = useState('');
    const template= "newOrder";
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const iframeRef = useRef(null);

    const { context } = useSession();

    const getTemplateHtml = async ()=>{
        const response = await fetch(`/api/getTemplate?context=${context}`,{
            method: 'POST',
            headers:{
                'Content-Type' : 'application/json',
            },
            body: JSON.stringify({template})
        });
        if (response.ok) {
            const data = await response.json();
            if (!data) return false;
            setCode(data.data)
        }
    }

    useEffect(() => {
        getTemplateHtml()
    }, []);

    const onSave = async (e:any)=>{
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

            if (response.ok) {
                setLoading(false);
                alertsManager.add({ messages: [{ text: 'Template saved' }],type: 'success' });
            } else {
                alertsManager.add({ messages: [{ text: 'Failed to save template' }],type: 'error' });
                setLoading(false);
            }
        } catch (error){
            alertsManager.add({ messages: [{ text: 'An error occurred while saving the template.' }],type: 'error' });
            setLoading(false);
        }
    };

    const showPreview = (e:any)=>{
        e.preventDefault();
        setIsOpen(true);
        setTimeout(()=>{
            const iframeDoc = iframeRef.current.contentWindow.document;

            // Dynamically write the fetched content into the iframe
            iframeDoc.open();
            iframeDoc.write(code); // Assuming `code` contains valid HTML content
            iframeDoc.close();
        },2000)

    }

    return (
        <Box>
            <Form marginBottom={'medium'}>
                <FormGroup>
                    <Select
                        onOptionChange={()=> {return null}}
                        label="Available variables"
                        maxHeight={300}
                        options={[
                            { value: 'fn', content: 'First name: {{first_name}}' },
                            { value: 'ln', content: 'Last name: {{last_name}}' },
                            { value: 'sa', content: 'Store Address: {{store_address}}' },
                            { value: 'sp', content: 'Store Phone: {{store_phone}}' },
                            { value: 'sn', content: 'Store Name: {{store_name}}' },
                            { value: 'sl', content: 'Store Logo: {{store_logo}}' },
                        ]}
                        placeholder="Check variables"
                        placement="bottom-start"
                        required
                    />
                </FormGroup>
            </Form>
            <Box style={{border:"1px solid #ccc"}}>
                <Editor
                    height="50vh" // Set the editor's height
                    defaultLanguage="html" // Specify the language
                    defaultValue={code} // Initial value
                    value={code} // Bind editor value to state
                    onChange={(value) => setCode(value)} // Handle content changes
                    theme="light" // Editor theme ('vs-dark', 'light', etc.)
                    options={{
                        "wordWrap": "on",
                    }}
                />
            </Box>
            <Flex justifyContent="flex-end" marginTop={'medium'}>
                <Button type="button" onClick={onSave} isLoading={loading}>Save</Button>
                <Button type="button" onClick={showPreview} variant={'secondary'}>Preview</Button>
            </Flex>
            <Modal
                actions={[
                    {
                        text: 'Cancel',
                        onClick: () => setIsOpen(false),
                    }
                ]}
                closeOnClickOutside={false}
                closeOnEscKey={true}
                header="Preview"
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
            >
                <Box style={{
                    border: "1px solid #ccc",
                }}>
                    <iframe ref={iframeRef} width="100%" height="auto" style={{
                        border: "none",
                    }} ></iframe>
                </Box>
            </Modal>
        </Box>
    );
}

export default NewOrder;