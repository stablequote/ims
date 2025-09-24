import { useEffect, useMemo, useState, useTransition } from 'react'
import { Box, Button, Container, Grid, Table, Text, Title, Flex, Tooltip, Center, Loader } from '@mantine/core'
import { showNotification } from '@mantine/notifications';
import axios from 'axios';
import AddProductionModal from '../components/AddProductionModal';
import moment from 'moment';
import CustomTable from '../components/CustomTable';
import { useTranslation } from 'react-i18next';

function ProductionAndInventory() {
    const [opened, setOpened] = useState(false);
    const [loading, setLoading] = useState(false);
    const [production, setProduction] = useState({
        product: '',
        quantity: 0,
        category: '',
        date: null,
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
            const url = `${BASE_URL}/production/add`;
            const payload = {
                product: production.product,
                quantity: production.quantity,
                category: production.category,
                date: production?.date?.toISOString() || null,
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

    const fetchData = async (productionUrl, productsUrl, distributionsUrl, inventoryUrl) => {
        try {
            setLoading(true)
            const [productionResponse, productsResponse, distributionsResponse, inventoryResponse] = await Promise.all([
                axios.get(productionUrl),
                axios.get(productsUrl),
                axios.get(distributionsUrl),
                axios.get(inventoryUrl),
            ])
            setStock(productionResponse.data)
            setProducts(productsResponse.data);
            setDistributions(distributionsResponse.data);
            setInvetory(inventoryResponse.data);
        } catch (error) {
            showNotification({
                title: "Error",
                message: "Error loading data",
                color: "red"
            })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const productionUrl = `${BASE_URL}/production/list`;
        const productsUrl = `${BASE_URL}/products/list`;
        const distributionsUrl = `${BASE_URL}/distributions/list`;
        const inventoryUrl = `${BASE_URL}/inventory/list`;
        fetchData(productionUrl, productsUrl, distributionsUrl, inventoryUrl)
    }, [])

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
                    <Title ta="center">الإنتاج</Title>
                    <Button mb="xs" color="green" onClick={() => setOpened(true)}>إضافة إنتاج</Button>
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
                    <Title mb="xl" ta="center">المخزن</Title>
                    {/* total production today - current stock - number of flips today */}
                    <Text><strong>مجمل الإنتاج اليوم:</strong> {stock?.reduce((acc, p) => acc + p.quantity, 0)}</Text>
                    {/* const totalAdmissionCost = admissions.reduce((acc, a) => acc + a.totalCost, 0); */}
                    <Text><strong>المخزون الحالي:</strong> {inventory?.reduce((acc, p) => acc + p.stock, 0)}</Text>
                    <Text><strong>قلبات الإنتاج اليوم:</strong> {stock?.length}</Text>
                    <Text><strong>التوزيع اليوم:</strong> {distributions?.length}</Text>
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
        {
            loading &&
            <Center>
                <Loader size={32} color="green" variant='dots' />
            </Center>
        }
    </Container>
  )
}

export default ProductionAndInventory