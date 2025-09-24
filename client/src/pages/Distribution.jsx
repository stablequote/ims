import { useEffect, useMemo, useState } from 'react'
import { Box, Container, Title, Flex, Tooltip, Button } from '@mantine/core'
import CustomTable from '../components/CustomTable'
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import moment from 'moment';

function Distribution() {

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
      { accessorKey: "totalAmount", header: t("totalAmount"), size: 120},
      { accessorKey: "paymentMethod", header: t("Payment-Method"), size: 30 },
      { accessorKey: "paymentStatus", header: t("Payment Status"), size: 30 },
      { accessorKey: "createdAt", header: t("Date"), 
        Cell: ({cell}) => (
          <Box>{moment(cell.getValue()).format("DD/MM/YYYY h:mm a")}</Box>
      )}
      // {
      //   accessorFn: (data) => moment(data.createdAt).format("DD-MM-YYYY h:mm a"),
      //   id: "createdAt",
      //   header: t("Date"),
      //   size: 120,
      // },
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
        setDistributions(res.data);
        setLoading(false)
      }
    } catch (error) {
      console.error('Error fetching inventory data:', error);
      setSalesData([]); // Set to empty array in case of error
    }
  };
    
  useEffect(() => {
    const url = `${BASE_URL}/distributions/list`
    fetchExpenses(url)
  }, [])

  const isToday = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
    return date >= start && date <= end;
  };

  return (
    <Container size="100%">
      <Title ta="center" mb="xs">قائمة التوزيع</Title>
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

export default Distribution