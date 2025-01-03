import {Box, Button, Flex, FlexItem, Tabs} from '@bigcommerce/big-design';
import {SettingsIcon} from "@bigcommerce/big-design-icons";
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import InnerHeader from './innerHeader';

export const TabIds = {
    HOME: 'home',
    EMAIL_TEMPLATE: 'emailTemplate',
};

export const TabRoutes = {
    [TabIds.HOME]: '/',
    [TabIds.EMAIL_TEMPLATE]: '/emailtemplate',
};

const HeaderlessRoutes = [
    '/orders/[orderId]',
    '/orders/[orderId]/labels',
    '/orders/[orderId]/modal',
    '/productAppExtension/[productId]',
];

const InnerRoutes = [
    '/products/[pid]',
    '/customers/[pid]',
    '/settings',
];

const HeaderTypes = {
    GLOBAL: 'global',
    INNER: 'inner',
    HEADERLESS: 'headerless',
};

const Header = () => {
    const [activeTab, setActiveTab] = useState<string>('');
    const [headerType, setHeaderType] = useState<string>(HeaderTypes.GLOBAL);
    const router = useRouter();
    const { pathname } = router;

    useEffect(() => {
        if (InnerRoutes.includes(pathname)) {
            // Use InnerHeader if route matches inner routes
            setHeaderType(HeaderTypes.INNER);
        } else if (HeaderlessRoutes.includes(pathname)) {
            setHeaderType(HeaderTypes.HEADERLESS);
        } else {
            // Check if new route matches TabRoutes
            const tabKey = Object.keys(TabRoutes).find(key => TabRoutes[key] === pathname);

            // Set the active tab to tabKey or set no active tab if route doesn't match (404)
            setActiveTab(tabKey ?? '');
            setHeaderType(HeaderTypes.GLOBAL);
        }

    }, [pathname]);

    useEffect(() => {
        // Prefetch products page to reduce latency (doesn't prefetch in dev)
        router.prefetch('/products');
    });

    const items = [
        { ariaControls: 'home', id: TabIds.HOME, title: 'Customers' },
        { ariaControls: 'emailTemplate', id: TabIds.EMAIL_TEMPLATE, title: 'Email Template' },
    ];

    const handleTabClick = (tabId: string) => {
        setActiveTab(tabId);

        return router.push(TabRoutes[tabId]);
    };

    const handleSettingsClick = () => {
        return router.push('/settings');
    }

    if (headerType === HeaderTypes.HEADERLESS) return null;
    if (headerType === HeaderTypes.INNER) return <InnerHeader />;

    return (
        <>
            <Flex justifyContent={'space-between'} alignItems={'center'}>
                <FlexItem>
                    <h2 className={'appName'}>Custom email manager</h2>
                </FlexItem>
                <FlexItem>
                    <Button iconLeft={<SettingsIcon color="secondary50" />} variant={'subtle'} onClick={handleSettingsClick} ></Button>
                </FlexItem>
            </Flex>
            <Box marginBottom="xxLarge">
                <Tabs
                    activeTab={activeTab}
                    items={items}
                    onTabClick={handleTabClick}
                />
            </Box>
        </>
    );
};

export default Header;
