import { useEffect, useMemo, useState } from 'react'
import {Button, Center, Container, Loader, Text, Box, Flex, Tooltip} from '@mantine/core'
import CustomTable from '../components/CustomTable'
import { useTranslation } from 'react-i18next';
import axios, { Axios } from 'axios';
import moment from 'moment';
import ExpenseModal from '../components/ExpenseModal';
import { showNotification } from '@mantine/notifications';
import { IconCategory } from '@tabler/icons-react';
import PurchaseModal from '../components/PurchaseModal'

function Purchases() {

  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false)
  const [purchaseForm, setPurchase] = useState({
    // item: {
    //   name: '',
    //   quantity: 0,
    //   itemPrice: 0,
    //   itemTotalPrice: 0,
    // },
    totalCost: 0,
    description: '',
    paymentMethod: '',
  })
  
  // state imports for MRT
  const [selectedResult, setSelectedResult] = useState(null);
  const [checkedRow, setCheckedRow] = useState([])
  const [rowStatuses, setRowStatuses] = useState({});
  const [selectedRow, setSelectedRow] = useState(null);
  const [rowSelection, setRowSelection] = useState({});
  // import ends here

  const BASE_URL = import.meta.env.VITE_URL;
  const { t } = useTranslation();

  const columns = useMemo(
    () => [
      { accessorKey: "description", header: t("Description"), size: 120},
      { accessorKey: "totalCost", header: t("Amount"), size: 120},
      { accessorKey: "paymentMethod", header: t("Payment-Method"), size: 30 },
      // { accessorKey: "createdBy", header: t("Created-By"), size: 30 },
      {
        accessorFn: (data) => moment(data.createdAt).format("DD-MM-YYYY h:mm a"),
        id: "createdAt",
        header: t("Date"),
        size: 120,
      },
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
  
  const fetchPurchases = async (url) => {
      try {
        setLoading(true);
        const res = await axios.get(url);
        console.log(res);
        if(res.status === 200) {
          setPurchases(res.data);
          setLoading(false)
        }
      } catch (error) {
        console.error('Error fetching inventory data:', error);
        setSalesData([]); // Set to empty array in case of error
      }
  };
  
  useEffect(() => {
    const url = `http://localhost:5003/purchases/list`
    fetchPurchases(url)
  }, [])

  const handleChange = (field, value) => {
    setPurchase((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = `http://localhost:5003/purchases/create`;
      const res = await axios.post(url, purchaseForm)
      if(res.status === 201) {
        setOpen(false);
        showNotification({
          title: "Success",
          message: "Expense created successfully!",
          color: "green"
        })
        setPurchase({})
        // window.location.reload();
      } else {
        showNotification({
          title: "error",
          message: "Error occured while creating expense!",
          color: "red"
        })
      }
    } catch (error) {
      showNotification({
        title: "Error",
        message: error,
        color: "red"
      })
    }
  }

  const isToday = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
  return date >= start && date <= end;
};

  // const todayExpenses = purchases.filter(exp => isToday(exp.createdAt));
  // const totalTodayExpenses = todayExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  // console.log("💸 Total Purchases for Today:", totalTodayExpenses);


  return (
    <>
    <Container size="100%">
      {/* <Text>Total purchases today: <strong>{totalTodayExpenses}</strong></Text> */}
      <Button color='yellow' mb="xs" onClick={() => setOpen(!open)}>New Purchase</Button>
      <CustomTable 
        columns={columns} 
        data={purchases}
        renderTopToolbarCustomActions={customTableOptions.renderTopToolbarCustomActions}
        renderRowActions={customTableOptions.renderRowActions}
        // onRowSelectionChange={customTableOptions.onRowSelectionChange}
        onRowClick={(row) => setSelectedResult(row)}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
        checkedRow={checkedRow}
        setCheckedRow={setCheckedRow}
      />
      <PurchaseModal
        open={open} 
        setOpen={setOpen} 
        purchaseForm={purchaseForm} 
        handleChange={handleChange} 
        handleSubmit={handleSubmit}
      />
       {loading &&
        <Center >
          <Loader variant="dots" size={36} color="green" />
        </Center>
      }
    </Container>
    </>
  )
}

export default Purchases