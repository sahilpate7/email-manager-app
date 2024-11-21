import {
    Button,
    Panel,
    Table,
    TableSortDirection,
    Text,
} from "@bigcommerce/big-design";
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
        <Text>{first_name + " " + last_name}</Text>
    );
    const renderEmail = (email: string): ReactElement => (
        <Text>{email}</Text>
    );

    const renderAction = (id: number): ReactElement => (
        <Button variant="secondary" onClick={()=> router.push(`/customers/${id}`)}>Send email</Button>
    );

    if (isLoading) return <Loading />;
    if (error) return <ErrorMessage error={error} />;

    return (
        <Panel id="customers">
            <Table
                columns={[
                    { header: 'Customer name', hash: 'name', render: ({ id, first_name,last_name }) => renderName(id, first_name,last_name), isSortable: false },
                    { header: 'Email', hash: 'email', render: ({ email }) => renderEmail(email) },
                    { header: 'Action', hash: 'id', render: ({ id }) => renderAction(id) },
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
