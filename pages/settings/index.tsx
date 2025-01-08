import { Button, Flex, FormGroup, Input, Panel, Form as StyledForm} from "@bigcommerce/big-design";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import Loading from "@components/loading";
import {alertsManager} from "@pages/_app";
import {useSession} from "../../context/session";
import {AdminSettings} from "../../types/bigcommerce";

const SettingsForm = () => {
    const [adminEmail, setAdminEmail] = useState('');
    const [mailHost, setMailHost] = useState('');
    const [mailPort, setMailPort] = useState('');
    const [mailUser, setMailUser] = useState('');
    const [mailPass, setMailPass] = useState('');
    const [loading, setLoading] = useState(false);
    const [dataLoading, setDataLoading] = useState(true);
    const { context } = useSession();

    const router = useRouter();

    const onCancel = ()=>{
        router.push('/');
    }

    const getAdminSettings = async ()=>{

        const setValues = (settings:AdminSettings)=>{
            setAdminEmail(settings.adminEmail);
            setMailHost(settings.mailHost);
            setMailUser(settings.mailUser);
            setMailPass(settings.mailPass);
            setMailPort(settings.mailPort);
            setDataLoading(false);
        }

        const response = await fetch(`/api/getAdminSettings?context=${context}`,{
            method: 'POST',
            headers:{
                'Content-Type' : 'application/json',
            },
            body: JSON.stringify('')
        });
        if (response.ok) {
            const data = await response.json();
            if (!data) return false;
            setValues(data.data);
        } else {
            alertsManager.add({ messages: [{ text: 'Failed to load settings' }],type: 'error' });
        }
    }

    useEffect(() => {
        getAdminSettings();
    }, []);

    const onSubmit = async (e:any)=>{
        e.preventDefault();
        try {
            setLoading(true);
            const settings = {
                adminEmail: adminEmail,
                mailHost: mailHost,
                mailUser: mailUser,
                mailPass: mailPass,
                mailPort: mailPort,
            }
            const response = await fetch(`/api/setAdminSettings?context=${context}`,{
                method: 'POST',
                headers:{
                    'Content-Type' : 'application/json',
                },
                body: JSON.stringify(settings)
            });

            if (response.ok) {
                setLoading(false);
                alertsManager.add({ messages: [{ text: 'Settings saved' }],type: 'success' });
            } else {
                alertsManager.add({ messages: [{ text: 'Failed to save settings' }],type: 'error' });
                setLoading(false);
            }
        } catch (error){
            alertsManager.add({ messages: [{ text: 'An error occurred while saving the settings' }],type: 'error' });
            setLoading(false);
        }
    };

    if (dataLoading) return <Loading />;

    return (
        <StyledForm onSubmit={onSubmit} >
            <Panel>
                <FormGroup>
                    <Input
                        readOnly={loading}
                        label="Admin Email"
                        name="email"
                        required
                        value={adminEmail}
                        onChange={(e)=> setAdminEmail(e.target.value)}
                        placeholder={'johndoe@gmail.com'}
                        type={'email'}
                    />
                </FormGroup>
                <FormGroup>
                    <Input
                        readOnly={loading}
                        label="Mail Host"
                        name="mailHost"
                        required
                        value={mailHost}
                        onChange={(e)=> setMailHost(e.target.value)}
                        placeholder={'smtp.gmail.com'}
                    />
                </FormGroup>
                <FormGroup>
                    <Input
                        readOnly={loading}
                        label="Mail User"
                        name="mailUser"
                        required
                        value={mailUser}
                        onChange={(e)=> setMailUser(e.target.value)}
                        placeholder={'johndoe@gmail.com'}
                        type={'email'}
                    />
                </FormGroup>
                <FormGroup>
                    <Input
                        readOnly={loading}
                        label="Mail Pass"
                        name="mailHost"
                        required
                        value={mailPass}
                        onChange={(e)=> setMailPass(e.target.value)}
                        placeholder={'password'}
                        type={'password'}
                    />
                </FormGroup>
                <FormGroup>
                    <Input
                        readOnly={loading}
                        label="Mail Port"
                        name="mailPort"
                        required
                        value={mailPort}
                        onChange={(e)=> setMailPort(e.target.value)}
                        placeholder={'465'}
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
                <Button type="submit" isLoading={loading}>Save</Button>
            </Flex>
        </StyledForm>
    );
}

export default SettingsForm;