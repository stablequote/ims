import { useEffect, useState } from 'react'
import { Box, Button, Container, Text, Flex, Tooltip } from '@mantine/core'
import { showNotification } from '@mantine/notifications';
import CustomTable from '../components/CustomTable'
import AddMerchantModal from '../components/AddMerchantModal';
import axios from 'axios';
import moment from 'moment'
import { IconTicket } from '@tabler/icons-react';

function Merchants() {
  const [ merchantsData, setMerchantsData ] = useState([])
  const [opened, setOpened] = useState(false);
  const [merchantForm, setMerchantForm] = useState({
      shopName: '',
      ownerName: '',
      phone: '',
      location: '',
      unitSalePrice: 0,
  })
  // state imports for MRT
  const [selectedResult, setSelectedResult] = useState(null);
  const [checkedRow, setCheckedRow] = useState([])
  const [rowStatuses, setRowStatuses] = useState({});
  const [selectedRow, setSelectedRow] = useState(null);
  const [rowSelection, setRowSelection] = useState({});
  // import ends here

  const BASE_URL = import.meta.env.VITE_URL;

  const columns = [
      { accessorKey: "shopName", header: "Shop Name" },
      { accessorKey: "ownerName", header: "Owner's Name" },
      { accessorKey: "location", header: "Location" },
      { accessorKey: "phone", header: "Phone" },
      { accessorKey: "unitSalePrice", header: "Unit Price" },
      { accessorKey: "createdAt", header: "Addet At", 
          Cell: ({ cell }) => (
              <Box>{moment(cell.getValue()).format("DD-MMMM-YYYY HH:MM")}</Box>
          )
      },
  ]

  const customTableOptions = {
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
  }
  
  useEffect(() => async () => {
      try {
          const url = `${BASE_URL}/merchants/list`;
          const res = await axios.get(url);
          console.log(res)
          if(res.status === 200 || res.status === 304) {
              setMerchantsData(res.data);
          }
      } catch (error) {
          alert("Error occured while fetching merchants")
      }
  }, [merchantsData[0]?._id])

  const handleChange = (field, value) => {
    setMerchantForm((prev) => ({ ...prev, [field]: value }));
  };

  const submitMerchantForm = async () => {
      
      try {
          const url = `${BASE_URL}/merchants/create`
          console.log("URL", url)
          console.log(merchantForm)
          const res = await axios.post(url, merchantForm)
          if(res.status === 201) {
              showNotification({
                  title: 'Success',
                  message: 'Merchant created succesfully',
                  color: 'green'
              })
              setOpened(false)
          }
      } catch (error) {
          showNotification({
              title: 'Error creating a merchant',
              message: error,
              color: 'red'
          })
          console.log(error)
      }
  }

  return (
    <Container size="100%">
        <Button mb='sm' color="green" onClick={() => setOpened(!opened)}>Add Merchant</Button>
        <CustomTable 
            columns={columns} 
            data={merchantsData}
            // renderTopToolbarCustomActions={customTableOptions.renderTopToolbarCustomActions}
            renderRowActions={customTableOptions.renderRowActions}
            // onRowSelectionChange={customTableOptions.onRowSelectionChange}
            onRowClick={(row) => setSelectedResult(row)}
            rowSelection={rowSelection}
            setRowSelection={setRowSelection}
            checkedRow={checkedRow}
            setCheckedRow={setCheckedRow}
        />
        <AddMerchantModal 
            opened={opened} 
            setOpened={setOpened} 
            merchantForm={merchantForm} 
            setMerchantForm={setMerchantForm} 
            handleChange={handleChange} 
            submitMerchantForm={submitMerchantForm}
        />
    </Container>
  )
}

export default Merchants