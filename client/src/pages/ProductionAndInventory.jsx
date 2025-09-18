import { useEffect, useMemo, useState, useTransition } from 'react'
import { Box, Button, Container, Grid, Table, Text, Title, Flex, Tooltip } from '@mantine/core'
import { showNotification } from '@mantine/notifications';
import axios from 'axios';
import AddProductionModal from '../components/AddProductionModal';
import moment from 'moment';
import CustomTable from '../components/CustomTable';
import { useTranslation } from 'react-i18next';

function ProductionAndInventory() {
    const [opened, setOpened] = useState(false);
    const [production, setProduction] = useState({
        product: '',
        quantity: 0,
        category: '',
    });
    const [stock, setStock] = useState([]);
    const [products, setProducts] = useState([]);
    const [distributions, setDistributions] = useState([]);
    const [inventory, setInvetory] = useState([]);
    // state imports for MRT
    const [selectedResult, setSelectedResult] = useState(null);
    const [checkedRow, setCheckedRow] = useState([])
    const [rowStatuses, setRowStatuses] = useState({});
    const [selectedRow, setSelectedRow] = useState(null);
    const [rowSelection, setRowSelection] = useState({});
    // import ends here

    const BASE_URL = import.meta.env.VITE_URL;
    const { t } = useTranslation();

    const productionColumns = useMemo(
        () => [
        { accessorKey: "product.name", header: t("Product"), size: 120},
        { accessorKey: "quantity", header: t("Quantity"), size: 120},
        { accessorKey: "createdAt", header: t("Production Time"), 
            Cell: ({cell}) => (
            <Box>{moment(cell.getValue()).format("DD/MM/YYYY h:mm a")}</Box>
        )}
        ],
        [t]
    );

    const customTableOptions = {
        renderRowActions: ({ row }) => {
          const rowId = row.original._id;
          const status = rowStatuses[rowId] ?? row.original.status; // fallback to original status
          // console.log(row.original.status)
          // console.log(status)
    
          return (
            <Flex justify="Flex-start">
              <Tooltip label="Delete">
                <Button
                  mr="md"
                  color="red"
                  onClick={() => confirmDeleteRow(row)}
                  // disabled={isDone}
                  compact
                >
                  Delete
                </Button>
              </Tooltip>
              <Tooltip label="Edit">
                <Button
                  color="blue"
                  onClick={() => handleActionClick(rowId)}
                  // disabled={isDone}
                  compact
                >
                  Edit
                </Button>
              </Tooltip>
            </Flex>
          );
        },
    }

    const handleChange = (field, value) => {
        setProduction((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        try {
            const url = `http://localhost:5003/production/add`;
            const payload = {
                product: production.product,
                quantity: production.quantity,
                category: production.category
            }
            const res = await axios.post(url, payload);
            if(res.status === 201) {
                showNotification({
                    title: "Success",
                    message: "Production has been added successfully",
                    color: "green"
                })
                setOpened(false)
                // setStock(...prev, res.data)
                window.location.reload()
                setProduction({})
            }
        } catch (error) {
            showNotification({
                title: "Error",
                message: error,
                color: "red"
            })
        }
    }

    useEffect(() => async () => {
        try {
            const production = `http://localhost:5003/production/list`;
            const productsUrl = `http://localhost:5003/products/list`;
            const distributionsUrl = `http://localhost:5003/distributions/list`;
            const invetoryUrl = `http://localhost:5003/inventory/list`;

            const productionResponse = await axios.get(production);
            const productsResponse = await axios.get(productsUrl);
            const distributionsResponse = await axios.get(distributionsUrl);
            const inventoryResponse = await axios.get(invetoryUrl);

            console.log(productionResponse)
            console.log(productsResponse)

            if(productionResponse.status === 200 || productionResponse.status === 304) {
                setStock(productionResponse.data)
            }
            setProducts(productsResponse.data);
            setDistributions(distributionsResponse.data);
            setInvetory(inventoryResponse.data);
        } catch (error) {
            showNotification({
                title: "Error",
                message: "Error loading data",
                color: "red"
            })
        }
    }, [stock?.length])

    const isToday = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
        const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
        return date >= start && date <= end;
    };
  return (
    <Container size="100%" sx={{height: "80vh"}}>
        <Grid>
            <Grid.Col span={9}>
                <Box p="md" sx={{ border: "2px solid black"}}> 
                    <Title ta="center">Production</Title>
                    <Button mb="xs" color="green" onClick={() => setOpened(true)}>Add Production</Button>
                    <CustomTable 
                        columns={productionColumns}
                        data={stock}
                        renderTopToolbarCustomActions={customTableOptions.renderTopToolbarCustomActions}
                        renderRowActions={customTableOptions.renderRowActions}
                        // onRowSelectionChange={customTableOptions.onRowSelectionChange}
                        onRowClick={(row) => setSelectedResult(row)}
                        rowSelection={rowSelection}
                        setRowSelection={setRowSelection}
                        checkedRow={checkedRow}
                        setCheckedRow={setCheckedRow}
                    />
                </Box>
            </Grid.Col>
            <Grid.Col span={3}>
                <Box p="md" sx={{ border: "2px dotted black"}}>
                    <Title mb="xl" ta="center">Inventory</Title>
                    {/* total production today - current stock - number of flips today */}
                    <Text><strong>Total Production Today:</strong> {stock?.reduce((acc, p) => acc + p.quantity, 0)}</Text>
                    {/* const totalAdmissionCost = admissions.reduce((acc, a) => acc + a.totalCost, 0); */}
                    <Text><strong>Current Stock:</strong> {inventory?.reduce((acc, p) => acc + p.stock, 0)}</Text>
                    <Text><strong>Production Flips Today:</strong> {stock?.length}</Text>
                    <Text><strong>Distributions Today:</strong> {distributions?.length}</Text>
                </Box>
            </Grid.Col>
        </Grid>
        <AddProductionModal
            opened={opened}
            setOpened={setOpened}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            production={production}
            products={products}
        />
    </Container>
  )
}

export default ProductionAndInventory