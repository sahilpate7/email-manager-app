import {Button, Dropdown, Panel, Link as StyledLink, Table, TableSortDirection,} from "@bigcommerce/big-design";
import {MoreHorizIcon} from "@bigcommerce/big-design-icons";
import Link from "next/link";
import {useRouter} from "next/router";
import {ReactElement, useState} from "react";
import {useCustomers} from '@lib/hooks';
import {TableItem} from "@types"; 
import ErrorMessage from '../../components/error';
import Loading from '../../components/loading';


const Customers = () => {
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [columnHash, setColumnHash] = useState('');
    const [direction, setDirection] = useState<TableSortDirection>('ASC');
    const router = useRouter();
    const { error, isLoading, list = [], meta = {} } = useCustomers({
        page: String(currentPage),
        limit: String(itemsPerPage),
        ...(columnHash && { sort: columnHash }),
        ...(columnHash && { direction: direction.toLowerCase() }),
    });
    const itemsPerPageOptions = [10, 20, 50, 100];
    const tableItems: TableItem[] = list.map(({ id, first_name,last_name,email }) => ({
        id,
        first_name,
        last_name,
        email
    }));

    const onItemsPerPageChange = newRange => {
        setCurrentPage(1);
        setItemsPerPage(newRange);
    };

    const onSort = (newColumnHash: string, newDirection: TableSortDirection) => {
        setColumnHash(newColumnHash === 'name' ? 'first_name' : newColumnHash);
        setDirection(newDirection);
    };

    const renderName = (id: number, first_name:string,last_name): ReactElement => (
        <Link href={`/customers/${id}`}>
            <StyledLink>{first_name + " " + last_name}</StyledLink>
        </Link>
    );
    const renderEmail = (email: string): ReactElement => (
        <Link href={`mailto:${email}`}>
            <StyledLink>{email}</StyledLink>
        </Link>
    );

    const renderAction = (id: number): ReactElement => (
        <Dropdown
            items={[ { content: 'Edit customer', onItemClick: () => router.push(`/products/${id}`), hash: 'edit' } ]}
            toggle={<Button iconOnly={<MoreHorizIcon color="secondary60" />} variant="subtle" />}
        />
    );
    
    // const { error, isLoading, list } = useCustomers({
    //     page:"1",
    //     limit: "10"
    //    
    // });
    // const customerList = ()=>{
    //     return(
    //         <ul>
    //         {list.map((user) => (
    //             <li key={user.email}>{user.email}</li>
    //         )) || <li>No customers available</li>}
    //         </ul>
    //     )
    // }

    if (isLoading) return <Loading />;
    if (error) return <ErrorMessage error={error} />;

    return (
        <Panel id="customers">
            <Table
                columns={[
                    { header: 'Customer name', hash: 'name', render: ({ id, first_name,last_name }) => renderName(id, first_name,last_name), isSortable: false },
                    { header: 'Email', hash: 'email', render: ({ email }) => renderEmail(email) },
                    { header: 'Action', hideHeader: true, hash: 'id', render: ({ id }) => renderAction(id) },
                ]}
                items={tableItems}
                itemName="Customers"
                pagination={{
                    currentPage,
                    totalItems: meta?.pagination?.total,
                    onPageChange: setCurrentPage,
                    itemsPerPageOptions,
                    onItemsPerPageChange,
                    itemsPerPage,
                }}
                sortable={{
                    columnHash,
                    direction,
                    onSort,
                }}
                stickyHeader
            />
        </Panel>
    );
};

export default Customers;
