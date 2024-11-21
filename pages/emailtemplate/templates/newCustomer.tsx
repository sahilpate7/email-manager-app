
import {Box, Button, Flex, Modal} from "@bigcommerce/big-design";
import Editor from "@monaco-editor/react";
import {useEffect, useRef, useState} from "react";
import {alertsManager} from "@pages/_app";
import {useSession} from "../../../context/session";


const NewCustomer = () => {
    const [code, setCode] = useState('');
    const template= "newCustomer";
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

export default NewCustomer;