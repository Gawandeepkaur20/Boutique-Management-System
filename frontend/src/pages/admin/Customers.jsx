import { useEffect, useState } from 'react';
import { Plus, Download, Search, Upload } from 'lucide-react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import DataTable from '../../components/DataTable';
import EmptyState from '../../components/EmptyState';
import { TableSkeleton } from '../../components/Skeleton';
import api from '../../services/api';
import { showSuccess, showError } from '../../utils/toast';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: 'customer123', city: '' });

  const load = () => {
    setLoading(true);
    const params = search ? `?search=${search}` : '';
    api.get(`/customers${params}`)
      .then((r) => setCustomers(r.data.customers || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async () => {
    try {
      await api.post('/customers', form);
      showSuccess('Customer created');
      setOpen(false);
      load();
    } catch (err) {
      showError(err.response?.data?.message || 'Failed');
    }
  };

 const handleImport = async (e) => {
  const file = e.target.files?.[0];

  if (!file) return;

  const fd = new FormData();
  fd.append('file', file);

  try {
    const { data } = await api.post(
      '/export/import/customers',
      fd,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    showSuccess(
      `Created ${data.created}, Skipped ${data.skipped}`
    );

    if (data.errors?.length) {
      console.log('Import Errors:', data.errors);
    }

    load();

  } catch (err) {
    console.log(err);

    showError(
      err.response?.data?.message ||
      'Import failed'
    );
  }
};
const exportCustomers = async () => {
  try {
    const response = await api.get(
      '/export/customers',
      {
        responseType: 'blob',
      }
    );

    const url = window.URL.createObjectURL(
      new Blob([response.data])
    );

    const link = document.createElement('a');

    link.href = url;
    link.download = 'customers.xlsx';

    document.body.appendChild(link);
    link.click();
    link.remove();

    showSuccess('Customers exported');
  } catch (err) {
    showError('Export failed');
  }
};
const downloadTemplate = () => {
  const rows = [
    [
      'Name',
      'Email',
      'Phone',
      'City',
      'Address',
    ],
    [
      'John Doe',
      'john@gmail.com',
      '9876543210',
      'Delhi',
      'Street 1',
    ],
  ];

  const csv = rows
    .map((r) => r.join(','))
    .join('\n');

  const blob = new Blob(
    [csv],
    {
      type: 'text/csv;charset=utf-8;',
    }
  );

  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');

  link.href = url;
  link.download = 'customer-import-template.csv';

  link.click();
};
 const columns = [
  {
    field: 'name',
    headerName: 'Customer',
    render: (r) => (
      <div>
        <p className="font-semibold text-[#4A3F35] dark:text-white">
          {r.user?.name}
        </p>
      </div>
    ),
  },

  {
    field: 'email',
    headerName: 'Email',
    render: (r) => (
      <span className="text-[#6F7F94] dark:text-gray-300">
        {r.user?.email}
      </span>
    ),
  },

  {
    field: 'phone',
    headerName: 'Phone',
    render: (r) => (
      <span className="text-[#8B7D6B] dark:text-gray-400">
        {r.user?.phone}
      </span>
    ),
  },

  {
    field: 'city',
    headerName: 'City',
    render: (r) => (
      <span
        className="
        px-3
        py-1
        rounded-full
        bg-[#F3EFD9]
        dark:bg-[#2F2A1D]
        text-[#5C4033]
        dark:text-[#EAE3D6]
        text-sm
        "
      >
        {r.city || 'N/A'}
      </span>
    ),
  },

  {
    field: 'createdAt',
    headerName: 'Joined',
    render: (r) => (
      <span className="text-[#8B7D6B] dark:text-gray-400">
        {new Date(r.createdAt).toLocaleDateString()}
      </span>
    ),
  },
];
  return (
    <div className="space-y-4">
      <div className="grid lg:grid-cols-[1fr_auto] gap-6 items-center">
   <div
  className="
  bg-[#FAF8F5]
  dark:bg-[#252525]
  rounded-3xl
  border
  border-[#EAE3D6]
  dark:border-[#333]
  p-5
w-full
h-full
  "
>
    <p className="text-sm text-[#8B7D6B]">
      Customer Management
    </p>

    <h1 className="text-2xl font-bold text-[#4A3F35] dark:text-white mt-2">
      Customers
    </h1>

    <p className="text-[#8B7D6B] mt-3">
      Manage boutique customers, profiles and measurements.
    </p>
  </div>

<div className="
  flex
  items-center
  justify-end
  gap-3
  bg-[#FAF8F5]
  dark:bg-[#252525]
  rounded-3xl
  border
  border-[#EAE3D6]
  dark:border-[#333]
  px-6
  py-5
  min-h-[140px]
  ">
  
      
                   <button
  onClick={downloadTemplate}
  className="
flex items-center gap-2
px-5 py-3
rounded-xl
bg-white
dark:bg-[#1F1F1F]
border border-[#EAE3D6]
dark:border-[#333]
text-[#5C4033]
dark:text-[#EAE3D6]
font-medium
hover:border-[#C48A7A]
transition
"
>
  <Download className="w-4 h-4" />
  Template
</button>
          <label
  className="
flex items-center gap-2
px-5 py-3
rounded-xl
bg-white
dark:bg-[#1F1F1F]
border border-[#EAE3D6]
dark:border-[#333]
text-[#5C4033]

dark:text-[#EAE3D6]
font-medium
hover:border-[#C48A7A]
transition
"

>
            <Upload className="w-4 h-4" /> Import
            <input type="file" accept=".xlsx,.xls" className="hidden" onChange={handleImport} />
          </label>

<button
  onClick={exportCustomers}
  className="
flex items-center gap-2
px-5 py-3
rounded-xl
bg-white
dark:bg-[#1F1F1F]
border border-[#EAE3D6]
dark:border-[#333]
text-[#5C4033]

dark:text-[#EAE3D6]
font-medium
hover:border-[#C48A7A]
transition
"
>
  <Download className="w-4 h-4" />
  Export
</button>
         <button
  onClick={() => setOpen(true)}
  className="
  px-6 py-3
  rounded-2xl
  bg-[#C48A7A]
  hover:bg-[#B17869]
  text-white
  font-medium
  flex items-center gap-2
  "
>
            <Plus className="w-4 h-4" /> Add Customer
          </button>
        </div>
      </div>
      
      
  

   <div
  className="
  bg-[#FAF8F5]
  dark:bg-[#252525]
  border
  border-[#EAE3D6]
  dark:border-[#333]
  rounded-3xl
  overflow-hidden
  "
>
        <div className="relative flex-1 min-w-[200px]">
       <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#8B7D6B] dark:text-gray-400" />
          <input
           className="
w-full
h-10
pl-12
pr-4
rounded-3xl
shadow-[0_8px_24px_rgba(0,0,0,0.04)]
border
border-[#EAE3D6]
bg-white
dark:bg-[#1F1F1F]
dark:border-[#3A3A3A]
focus:outline-none
focus:ring-2
focus:ring-[#C48A7A]
focus:border-[#C48A7A]
"

            placeholder="Search customers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && load()}
            
          />
           
        </div>
       </div>
      

   <div
  className="
  bg-[#FAF8F5]
  border
  border-[#EAE3D6]
  rounded-3xl
  overflow-hidden
  "
>
  {loading ? (
    <TableSkeleton />
  ) : customers.length === 0 ? (
    <EmptyState
  title="No Customers Found"
  description="Add customers manually or import them from Excel."
  action={() => setOpen(true)}
  actionLabel="Add Customer"
/>
  ) : (
    <DataTable columns={columns} rows={customers} />
  )}
</div>

    <Dialog
  open={open}
  onClose={() => setOpen(false)}
  maxWidth="sm"
  fullWidth
PaperProps={{
  sx: {
    borderRadius: '24px',
    backgroundColor: '#FAF8F5',
    border: '1px solid #EAE3D6',

    '.dark &': {
      backgroundColor: '#252525',
      border: '1px solid #333',
    },
  },
}}
>
       <DialogTitle
  sx={{
    borderBottom: '1px solid #EAE3D6',
    p: 3,
  }}
>
  <p className="text-sm text-[#8B7D6B] dark:text-gray-400">
    Customer Management
  </p>

 <h2 className="text-3xl font-bold text-[#4A3F35] dark:text-white">
    Add Customer
  </h2>
</DialogTitle>
        <DialogContent className="space-y-3 pt-2 ">
          <div className="grid gap-4 mt-4">
          {['name', 'email', 'phone', 'city'].map((f) => (
            <input
      key={f}
     className="
h-12
px-4
rounded-2xl
border
border-[#EAE3D6]
dark:border-[#333]
bg-white
dark:bg-[#1F1F1F]
text-[#5C4033]
dark:text-white
placeholder:text-gray-400
focus:outline-none
focus:ring-2
focus:ring-[#C48A7A]
"
      placeholder={
        f.charAt(0).toUpperCase() + f.slice(1)
      }
      value={form[f]}
      onChange={(e) =>
        setForm({
          ...form,
          [f]: e.target.value,
        })
      }
    />
    
          ))}
          </div>
        </DialogContent>
        <DialogActions
  sx={{
    borderTop: '1px solid #EAE3D6',
    p: 3,
  }}
>
  <button
    onClick={() => setOpen(false)}
   className="
px-5 py-3
rounded-2xl
border
border-[#EAE3D6]
dark:border-[#333]
bg-white
dark:bg-[#1F1F1F]
text-[#5C4033]
dark:text-white
"
  >
    Cancel
  </button>

  <button
    onClick={handleCreate}
   className="
px-6 py-3
rounded-2xl
bg-[#C48A7A]
hover:bg-[#B17869]
text-white
font-medium
transition
"
  >
    Create Customer
  </button>
</DialogActions>
      </Dialog>
    </div>
  );
  }
