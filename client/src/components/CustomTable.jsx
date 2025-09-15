import { ActionIcon, Box, Button, Tooltip } from '@mantine/core';
import { IconDownload, IconEdit, IconTrash } from '@tabler/icons-react';
import {
  MantineReactTable,
  useMantineReactTable,
} from 'mantine-react-table';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const CustomTable = ({
  columns,
  data,
  onRowClick,
  rowActions,
  enablePagination = true,
  enableSorting = true,
  ...props
}) => {

  const { t } = useTranslation();
  const [rowSelection, setRowSelection] = useState({});


  const table = useMantineReactTable({
    columns: [
      ...columns,
      ...(rowActions
        ? [{
            id: 'actions',
            header: 'Actions',
            Cell: ({ row }) => rowActions(row.original),
          }]
        : []),
    ],
    data,
    initialState: {
      pagination: { pageSize: 5 },
      density: 'xs',
      sorting: [
        {
          id: 'createdAt', // Sort by the 'orderDate' column
          desc: true, // Sort in descending order (newest first)
        },
      ],
    },
    enablePagination,
    enableSorting,
    enableRowActions: true,
    enableRowSelection: true,
    columnFilterDisplayMode: 'popover',
    paginationDisplayMode: 'pages',
    positionToolbarAlertBanner: 'bottom',
    getRowId: (row) => row._id || row.id,
    onRowSelectionChange: setRowSelection,
    state: {
    rowSelection,
  },
    renderRowActions: ({ row, table }) => (
      <div style={{ display: 'flex', gap: '8px' }}>
        {/* Default edit icons */}
        {table.options.enableEditing && (
          <>
            <Tooltip label="Edit">
              <ActionIcon onClick={() => table.setEditingRow(row)}>
                <IconEdit />
              </ActionIcon>
            </Tooltip>
          </>
        )}
        {/* Custom delete button */}
        <Tooltip label="Delete">
          <ActionIcon color="red" onClick={() => handleDelete(row)}>
            <IconTrash />
          </ActionIcon>
        </Tooltip>
      </div>
    ),
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
          color="lightblue"
          //export all data that is currently in the table (ignore pagination, sorting, filtering, etc.)
          // onClick={}
          leftIcon={<IconDownload />}
          variant="filled"
        >
          {t("EXPORT-ALL-DATA")}
        </Button>
        <Button
          disabled={table.getPrePaginationRowModel().rows.length === 0}
          //export all rows, including from the next page, (still respects filtering and sorting)
          // onClick={}
          leftIcon={<IconDownload />}
          variant="filled"
        >
          {t("EXPORT-ALL-ROWS")}
        </Button>
        <Button
          disabled={table.getRowModel().rows.length === 0}
          //export all rows as seen on the screen (respects pagination, sorting, filtering, etc.)
          // onClick={}
          leftIcon={<IconDownload />}
          variant="filled"
        >
          {t("EXPORT-PAGE-ROWS")}
        </Button>
        <Button
          disabled={
            !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
          }
          //only export selected rows
          // onClick={}
          leftIcon={<IconDownload />}
          variant="filled"
        >
          {t("EXPORT-SELECTED-ROWS")}
        </Button>
      </Box>
    ),
    mantineTableBodyRowProps: ({ row }) => ({
      onClick: onRowClick ? () => onRowClick(row.original) : undefined,
      style: {
        cursor: onRowClick ? 'pointer' : 'default',
      },
    }),
    ...props,
  });

  return <MantineReactTable table={table}
            mantineEditTextInputProps={({ cell }) => ({
              //onBlur is more efficient, but could use onChange instead
              onBlur: (event) => {
                handleSaveCell(cell, event.target.value);
                console.log(cell)
              },
            })}
            positionGlobalFilter="right"
            mantineSearchTextInputProps={{
              // placeholder: `Search ${data.length} rows`,
              sx: { minWidth: '300px' },
              variant: 'filled',
            }}
          />
};

export default CustomTable;