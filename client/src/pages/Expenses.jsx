import { useEffect, useMemo, useState } from 'react'
import {Button, Center, Container, Loader, Text, Flex, Tooltip} from '@mantine/core'
import CustomTable from '../components/CustomTable'
import { useTranslation } from 'react-i18next';
import axios, { Axios } from 'axios';
import moment from 'moment';
import ExpenseModal from '../components/ExpenseModal';
import { showNotification } from '@mantine/notifications';
import { IconCategory } from '@tabler/icons-react';

function Expenses() {

  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false)
  const [expenseForm, setExpenseForm] = useState({
    amount: 0,
    description: '',
    category: '',
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
  
  const expensesColumns = useMemo(
      () => [
        { accessorKey: "description", header: t("Description"), size: 120},
        { accessorKey: "amount", header: t("Amount"), size: 120},
        { accessorKey: "paymentMethod", header: t("Payment-Method"), size: 30 },
        { accessorKey: "createdBy", header: t("Created-By"), size: 30 },
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
  
  const fetchExpenses = async (url) => {
    try {
      setLoading(true);
      const res = await axios.get(url);
      console.log(res);
      if(res.status === 200) {
        setExpenses(res.data);
        setLoading(false)
      }
    } catch (error) {
      console.error('Error fetching inventory data:', error);
      setSalesData([]); // Set to empty array in case of error
    }
  };
  
  useEffect(() => {
    const url = `http://localhost:5003/expenses/list`
    fetchExpenses(url)
  }, [])

  const handleChange = (field, value) => {
    setExpenseForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = `http://localhost:5003/expenses/create`;
      const res = await axios.post(url, expenseForm)
      if(res.status === 201) {
        setOpen(false);
        showNotification({
          title: "Success",
          message: "Expense created successfully!",
          color: "green"
        })
        setExpenseForm({})
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

  // const todayExpenses = expenses.filter(exp => isToday(exp.createdAt));
  // const totalTodayExpenses = todayExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  // console.log("💸 Total Expenses for Today:", totalTodayExpenses);


  return (
    <>
    <Container size="100%">
      {/* <Text>Total expenses today: <strong>{totalTodayExpenses}</strong></Text> */}

      <Button color='yellow' mb="xs" onClick={() => setOpen(!open)}>Add expense</Button>
      <CustomTable 
        columns={expensesColumns} 
        data={expenses}
        renderTopToolbarCustomActions={customTableOptions.renderTopToolbarCustomActions}
        renderRowActions={customTableOptions.renderRowActions}
        // onRowSelectionChange={customTableOptions.onRowSelectionChange}
        onRowClick={(row) => setSelectedResult(row)}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
        checkedRow={checkedRow}
        setCheckedRow={setCheckedRow}
      />
      <ExpenseModal 
        open={open} 
        setOpen={setOpen} 
        expenseForm={expenseForm} 
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

export default Expenses