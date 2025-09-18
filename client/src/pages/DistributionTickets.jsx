import { useEffect, useMemo, useState } from 'react'
import { Box, Button, Container, Flex, Title, Tooltip } from '@mantine/core'
import CustomTable from '../components/CustomTable'
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { IconUpload, IconPlus, IconMoneybagPlus, IconTicketOff, IconTicket } from '@tabler/icons-react';
import { showNotification } from '@mantine/notifications';

function DistributionTickets() {

  const [distributions, setDistributions] = useState([]);
  const [loading, setLoading] = useState(false);

  // state imports for MRT
  const [selectedResult, setSelectedResult] = useState(null);
  const [checkedRow, setCheckedRow] = useState([])
  const [rowStatuses, setRowStatuses] = useState({});
  const [selectedRow, setSelectedRow] = useState(null);
  const [rowSelection, setRowSelection] = useState({});
  // import ends here

  const BASE_URL = import.meta.env.VITE_URL
  const { t } = useTranslation();

  const distributionColumns = useMemo(
    () => [
      { accessorKey: "merchant.shopName", header: t("Shop Name"), size: 120},
      { accessorKey: "quantity", header: t("Quantity"), size: 120},
      { accessorKey: "unitSalePrice", header: t("Sale Price"), size: 120},
      { accessorKey: "totalAmount", header: t("Total Amount"), size: 120},
      { accessorKey: "paymentMethod", header: t("Payment Method"), size: 30 },
      { accessorKey: "paymentStatus", header: t("Payment Status"), size: 30 },
      { accessorKey: "createdAt", header: t("Date"), 
        Cell: ({cell}) => (
        <Box>{moment(cell.getValue()).format("DD/MM/YYYY h:mm a")}</Box>
      )}
    ],
    [t]
  );

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
        disabled={
          !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
        }
        //only export selected rows
        onClick={() => closeTicket(checkedRow[0]?._id)}
        leftIcon={<IconTicket />}
        variant="light"
      >
        Close Ticket
      </Button>
    </Box>
    ),
    renderRowActions: ({ row }) => {
      const rowId = row.original._id;
      const status = rowStatuses[rowId] ?? row.original.status; // fallback to original status
      // console.log(row.original.status)
      // console.log(status)

      return (
        <Flex justify="space-between">
          <Tooltip label="Delete">
            <Button
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

  const fetchDistributions = async (url) => {
    try {
      setLoading(true);
      let res = await axios.get(url);
      console.log(res.data);
      if(res.status === 200) {
        const filtered = res.data.filter((item) => item.paymentStatus === "Pending" || item.paymentStatus === "Partial")
        setDistributions(filtered);
        setLoading(false)
      }
    } catch (error) {
      console.error('Error fetching inventory data:', error);
      setSalesData([]); // Set to empty array in case of error
    }
  };
    
  useEffect(() => {
    const url = `http://localhost:5003/distributions/list`
    fetchDistributions(url)
  }, [checkedRow[0]?._id])

  const isToday = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
    return date >= start && date <= end;
  };

  const closeTicket = async (distributionId) => {
    try {
      console.log("Distribution ID: ", distributionId)
      const url = `http://localhost:5003/distributions/close-ticket`;
      const payload = {
        distributionId: distributionId,
        paymentMethod: "Bankak",
        transactionNumber: "1794"
      }
      const res = await axios.post(url, payload);
      if(res.status === 200) {
        window.location.reload();
        showNotification({
          title: "Success",
          message: "Ticket successfully closed!",
          color: "green",
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
      <Title ta="center">Open Tickets</Title>
      <CustomTable
        columns={distributionColumns}
        data={distributions}
        renderTopToolbarCustomActions={customTableOptions.renderTopToolbarCustomActions}
        renderRowActions={customTableOptions.renderRowActions}
        // onRowSelectionChange={customTableOptions.onRowSelectionChange}
        onRowClick={(row) => setSelectedResult(row)}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
        checkedRow={checkedRow}
        setCheckedRow={setCheckedRow}
      />
    </Container>
  )
}

export default DistributionTickets