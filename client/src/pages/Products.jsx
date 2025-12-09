import { useEffect, useState } from 'react'
import { Container, Flex, Image, Title } from '@mantine/core'
import CustomTable from '../components/CustomTable'
import axios from 'axios';
import { Box, Button, Tooltip } from '@mantine/core';
import { IconBookmarkEdit, IconDownload, IconPlus, IconUpload } from '@tabler/icons-react';
import AddProdutModal from '../components/AddProdutModal'
import moment from 'moment'
import { showNotification } from '@mantine/notifications';

function Products() {
  const BASE_URL = import.meta.env.VITE_URL;

  const productsColumns = [
    { accessorKey: 'image', header: 'صورة المنتج',
       Cell: ({ cell }) => (
        <Box>
          <Image 
            src={`${BASE_URL}${cell.getValue()}`}
            height={50}
            fit="contain"
            alt={cell.getValue()}
          />
        </Box>
    )},
    { accessorKey: 'name', header: 'المنتج' },
    { accessorKey: 'category', header: 'التصنيف' },
    { accessorKey: 'wholePrice', header: 'سعر التكلفة' },
    { accessorKey: 'retailPrice', header: 'سعر البيع' },
    { accessorKey: 'createdAt', header: 'تاريخ الإضافة', size: 100,
      Cell: ({ cell }) => (
        <Box>{moment(cell.getValue()).format("DD-MMMM-YYYY")}</Box>
    )},
  ];

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [opened, setOpened] = useState(false);
  const [rowStatuses, setRowStatuses] = useState({});
  const [selectedRow, setSelectedRow] = useState(null);
  const [rowSelection, setRowSelection] = useState({});
  const [checkedRow, setCheckedRow] = useState([])
  const [modalOpened, setModalOpened] = useState(false);
  const [products, setProducts] = useState([]);
  const [productForm, setProductForm] = useState({
    name: '',
    wholePrice: 0,
    retailPrice: 0,
    category: '',
  })

  // state imports
  const [editRow, setEditRow] = useState(null);
  const [deleteRow, setDeleteRow] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const fetchProducts = async (url) => {
    try {
      setLoading(true)
      const products = await axios.get(url);
      setData(products.data)
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

  useEffect(()=> {
    const url = `${BASE_URL}/products/list`
    fetchProducts(url)
  }, [])

  // Delete Modal Handlers  
  const handleDeleteRow = (row) => {
    console.log(row.original)
    setDeleteRow(row.original);
    setDeleteModalOpen(true);
  }

  // confirm deletion function
  const confirmDeleteRow = async (row) => {
    handleDeleteRow(row)
    const id = row.original._id
    console.log(id)
    const url = `${BASE_URL}/products/${id}`
    const dialog = window.confirm("Are you sure you want to delete this item?");
    if(!dialog) return;

    try {
      // send axios delete
      const response = await axios.delete(url, id);
      if(response.status === 200) {
        showNotification({
          title: "success",
          message: "You have successfully deleted an item",
          color: "green"
        })
        // updating state
        setData((prev) => prev.filter((item) => item._id !== id));
      }
      
    } catch (error) {
      showNotification({
        title: "Server error",
        message: "An error on the server, please try again",
        color: "red"
      })
    }
    setDeleteModalOpen(!deleteModalOpen)
  }

  const customTableOptions = {
    renderTopToolbarCustomActions: ({ table }) => (
    <Box
      sx={{
        display: 'flex',
        gap: '16px',
        padding: '8px',
        flexWrap: 'wrap',
      }}
    >
      <Button
        color="green"
        //export all data that is currently in the table (ignore pagination, sorting, filtering, etc.)
        onClick={() => setModalOpened(!modalOpened)}
        leftIcon={<IconPlus />}
        variant="filled"
      >
        إضافة منتج
      </Button>
      <Button
        disabled={
          !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
        }
        //only export selected rows
        // onClick={}
        leftIcon={<IconUpload />}
        variant="light"
      >
        Export data
      </Button>
    </Box>
    ),
    renderRowActions: ({ row }) => {
      const rowId = row.original._id;
      const status = rowStatuses[rowId] ?? row.original.status; // fallback to original status
      // console.log(row.original.status)
      // console.log(status)

      return (
        <Flex justify="flex-start">
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
    onRowSelectionChange: (updater) => {
      const newRowSelection =
        typeof updater === 'function' ? updater(rowSelection) : updater;

      setRowSelection(newRowSelection);

      // testing
      setCheckedRow(Object.keys(newRowSelection).map((rowId) => table.getRow(rowId).original))
      console.log(checkedRow)

      // If using MRT table instance (like with useMantineReactTable)
      const selectedData = Object.keys(newRowSelection).map((rowId) =>
        table.getRow(rowId).original
      );

      setCheckedRow(selectedData)

      // console.log('✅ Selected row data:', selectedData);
    },
  }

  const handleChange = (field, value) => {
    setProductForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = `${BASE_URL}/products/create`;
      const res = await axios.post(url, productForm)
      if(res.status === 201) {
        setOpened(false);
        showNotification({
          title: "Success",
          message: "Expense created successfully!",
          color: "green"
        })
        setProductForm({})
        window.location.reload();
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

  return (
    <Container size="100%">
      <CustomTable
        columns={productsColumns}
        data={data}
        renderTopToolbarCustomActions={customTableOptions.renderTopToolbarCustomActions}
        renderRowActions={customTableOptions.renderRowActions}
        // onRowClick={(row) => printRow(row)}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
        checkedRow={checkedRow}
        setCheckedRow={setCheckedRow}
        handleDeleteRow={handleDeleteRow}
        confirmDeleteRow={confirmDeleteRow}
      />
      <AddProdutModal
        opened={modalOpened}
        setOpened={setModalOpened}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        productForm={productForm}
      />
    </Container>
  )
}

export default Products