import {Box, Panel, Tabs} from "@bigcommerce/big-design";
import {useState} from "react";
import NewCustomer from "@pages/emailtemplate/templates/newCustomer";
import NewOrder from "@pages/emailtemplate/templates/newOrder";

const EmailTemplate = ()=>{
    const [activeTab, setActiveTab] = useState('tab1');

    const items = [
        { ariaControls: 'content1', id: 'tab1', title: 'New Customer' },
        { ariaControls: 'content2', id: 'tab2', title: 'New Order' },
    ]
    
    
    return(
        <Panel id="emailTemplate">
            <Tabs
                activeTab={activeTab}
                aria-label="Example Tab Content"
                id="tab-example"
                items={items}
                onTabClick={setActiveTab}
            />
            <Box marginTop="large">
                {activeTab === 'tab1' && <NewCustomer />}
                {activeTab === 'tab2' && <NewOrder />}
            </Box>
        </Panel>
    )
}

export default EmailTemplate;