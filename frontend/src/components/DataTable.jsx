import { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  Paper,
} from '@mui/material';

export default function DataTable({
  columns,
  rows,
  defaultSort = 'createdAt',
  defaultOrder = 'desc',
  pageSize = 10,
  highlightedRowId = null,
}) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(pageSize);
  const [orderBy, setOrderBy] = useState(defaultSort);
  const [order, setOrder] = useState(defaultOrder);

  const isDark = document.documentElement.classList.contains('dark');

  const handleSort = (field) => {
    const isAsc = orderBy === field && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(field);
  };

  const sortedRows = useMemo(() => {
    return [...rows].sort((a, b) => {
      const aVal = a[orderBy];
      const bVal = b[orderBy];

      if (aVal == null) return 1;
      if (bVal == null) return -1;

      if (aVal < bVal) return order === 'asc' ? -1 : 1;
      if (aVal > bVal) return order === 'asc' ? 1 : -1;

      return 0;
    });
  }, [rows, orderBy, order]);

  const paginatedRows = sortedRows.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Paper
      elevation={0}
      sx={{
        backgroundColor: 'transparent',
        borderRadius: 0,
      }}
    >
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow
              sx={{
                backgroundColor: isDark
                  ? '#2A2A2A'
                  : '#F3EFD9',
              }}
            >
              {columns.map((col) => (
                <TableCell
                  key={col.field}
                  sx={{
                    color: isDark
                      ? '#EAE3D6'
                      : '#5C4033',
                    fontWeight: 700,
                    borderBottom: `1px solid ${
                      isDark ? '#333' : '#EAE3D6'
                    }`,
                  }}
                >
                  {col.sortable !== false ? (
                    <TableSortLabel
                      active={orderBy === col.field}
                      direction={
                        orderBy === col.field
                          ? order
                          : 'asc'
                      }
                      onClick={() =>
                        handleSort(col.field)
                      }
                      sx={{
                        color: 'inherit !important',
                      }}
                    >
                      {col.headerName}
                    </TableSortLabel>
                  ) : (
                    col.headerName
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedRows.map((row, index) => {
              const highlighted =
                row._id &&
                highlightedRowId &&
                row._id.toString() ===
                  highlightedRowId.toString();

              return (
                <TableRow
                  key={
                    row._id ||
                    row.id ||
                    index
                  }
                  hover
                  sx={{
                    backgroundColor: highlighted
                      ? '#FFF8D6'
                      : isDark
                      ? '#252525'
                      : '#FFFFFF',

                    '&:hover': {
                      backgroundColor: isDark
                        ? '#2E2E2E'
                        : '#F8F1EF',
                    },

                    '& td': {
                      borderBottom: `1px solid ${
                        isDark
                          ? '#333'
                          : '#EAE3D6'
                      }`,
                      color: isDark
                        ? '#F5F5F5'
                        : '#4A3F35',
                      paddingTop: '18px',
                      paddingBottom: '18px',
                    },
                  }}
                >
                  {columns.map((col) => (
                    <TableCell key={col.field}>
                      {col.render
                        ? col.render(row)
                        : row[col.field]}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}

            {rows.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  align="center"
                  sx={{
                    py: 8,
                    color: isDark
                      ? '#8B7D6B'
                      : '#8B7D6B',
                  }}
                >
                  No data found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={rows.length}
        page={page}
        onPageChange={(_, newPage) =>
          setPage(newPage)
        }
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(
            parseInt(e.target.value, 10)
          );
          setPage(0);
        }}
        rowsPerPageOptions={[5, 10, 25, 50]}
        sx={{
          backgroundColor: isDark
            ? '#252525'
            : '#FAF8F5',
          color: isDark
            ? '#EAE3D6'
            : '#5C4033',
          borderTop: `1px solid ${
            isDark ? '#333' : '#EAE3D6'
          }`,

          '& .MuiSvgIcon-root': {
            color: isDark
              ? '#EAE3D6'
              : '#5C4033',
          },

          '& .MuiSelect-icon': {
            color: isDark
              ? '#EAE3D6'
              : '#5C4033',
          },
        }}
      />
    </Paper>
  );
}