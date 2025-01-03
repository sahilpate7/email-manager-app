import { Box, Button, H1, HR, Text } from '@bigcommerce/big-design';
import { ArrowBackIcon } from '@bigcommerce/big-design-icons';
import { useRouter } from 'next/router';
import {useEffect, useState} from "react";
import { useProductList } from '@lib/hooks';
import { TabIds, TabRoutes } from './header';

const InnerHeader = () => {
    const router = useRouter();
    const { pathname } = router;
    const { pid } = router.query;
    const { list = [] } = useProductList();
    const { name } = list.find(item => item.id === Number(pid)) ?? {};
    const [title, setTitle] = useState("");
   
    const handleBackClick = () =>{ 
        if (pathname.includes('/customers/[pid]')){
            router.push(TabRoutes[TabIds.HOME]);
        } else if (pathname.includes('/settings')){
            router.push(TabRoutes[TabIds.HOME]);
        }
    };

    useEffect(() => {
       if (String(pathname) === '/customers/[pid]'){
            setTitle('Customers')
       } else if (String(pathname) === '/settings'){
           setTitle('Settings')
       }
    }, [pathname]);

    return (
        <Box marginBottom="xxLarge">
            <Button iconLeft={<ArrowBackIcon color="secondary50" />} variant="subtle" onClick={handleBackClick}>
                <Text bold color="secondary50">{title}</Text>
            </Button>
            {name &&
                <H1>{name}</H1>
            }
            <HR color="secondary30" />
        </Box>
    );
};

export default InnerHeader;
