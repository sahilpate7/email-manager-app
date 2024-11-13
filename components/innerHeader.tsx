import { Box, Button, H1, HR, Text } from '@bigcommerce/big-design';
import { ArrowBackIcon } from '@bigcommerce/big-design-icons';
import { useRouter } from 'next/router';
import { useProductList } from '../lib/hooks';
import { TabIds, TabRoutes } from './header';
import {string} from "prop-types";

const InnerHeader = () => {
    const router = useRouter();
    const { pid } = router.query;
    const { list = [] } = useProductList();
    const { name } = list.find(item => item.id === Number(pid)) ?? {};

    const InnerRoutes = [
        '/products/[pid]',
        '/customers/[pid]',
    ];
   
    const handleBackClick = () =>{ 
        if (InnerRoutes.includes('/products/[pid])')){
            router.push(TabRoutes[TabIds.PRODUCTS]);
        } else if (InnerRoutes.includes('/customers/[pid]')){
            router.push(TabRoutes[TabIds.CUSTOMERS]);
        }
    };
    
    const title = ()=>{
        if (InnerRoutes.includes('/products/[pid])')){
            return 'Products';
        } else if (InnerRoutes.includes('/customers/[pid]')){
            return 'Customers';
        }
    }

    return (
        <Box marginBottom="xxLarge">
            <Button iconLeft={<ArrowBackIcon color="secondary50" />} variant="subtle" onClick={handleBackClick}>
                <Text bold color="secondary50">{title()}</Text>
            </Button>
            {name &&
                <H1>{name}</H1>
            }
            <HR color="secondary30" />
        </Box>
    );
};

export default InnerHeader;
