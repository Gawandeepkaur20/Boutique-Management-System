import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import DataTable from '../../components/DataTable';
import api from '../../services/api';

export default function AdminWorkers() {
  const [workers, setWorkers] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', specialization: '', experience: 0 });

  const load = () => api.get('/workers').then((r) => setWorkers(r.data || []));
  useEffect(() => { load(); }, []);

  const handleCreate = async () => {
    await api.post('/workers', form);
    setOpen(false);
    load();
  };

 const columns = [
  {
    field: 'name',
    headerName: 'Worker',
  render: (r) => (
  <div>
   <p className="font-semibold text-base text-[#4A3F35] dark:text-white">
  {r.user?.name}
</p>

 <p className="text-sm mt-1 text-[#8B7D6B] dark:text-gray-400">
  {r.user?.phone}
</p>
  </div>
),
  },

  {
    field: 'email',
    headerName: 'Email',
    render: (r) => (
     <span className="font-medium text-[#6F7F94] dark:text-gray-300">
  {r.user?.email}
</span>
    ),
  },

  {
    field: 'specialization',
    headerName: 'Specialization',
    render: (r) => (
      <span
       className="
px-3
py-1
rounded-full
bg-[#F6F0E2]
text-[#A16B2A]
dark:bg-yellow-900/30
dark:text-yellow-300
font-medium
"
      >
        {r.specialization || 'General'}
      </span>
    ),
  },

  {
    field: 'experience',
    headerName: 'Experience',
    render: (r) => (
     <span className="font-semibold text-[#C48A7A]">
        {r.experience} yrs
      </span>
    ),
  },

  {
    field: 'isAvailable',
    headerName: 'Status',
    render: (r) => (
      <span
        className={
          r.isAvailable
            ?"px-3 py-1 rounded-full bg-[#EEF7F0] text-[#3F7A57] dark:bg-green-900/30 dark:text-green-300 font-medium"
            : "px-3 py-1 rounded-full bg-[#FFF1ED] text-[#C4664D] dark:bg-red-900/30 dark:text-red-300 font-medium"
        }
      >
        {r.isAvailable ? 'Available' : 'Busy'}
      </span>
    ),
  },
];

  return (
    <div className="space-y-4">
     <div className="grid lg:grid-cols-[1fr_auto] gap-6">
 <div
  className="
  bg-[#FAF8F5]
  border
  bg-[#FAF8F5] dark:bg-[#252525]
  text-[#4A3F35] dark:text-white
  rounded-3xl
  px-8
  py-7
  "
>
  <p className="text-sm text-[#8B7D6B] dark:text-gray-400 font-medium">
    Workforce Management
  </p>

  <h1
            className="
            text-3xl
            font-bold
            text-[#4A3F35]
            dark:text-white
            mt-2
            "
          >
          Workers
          </h1>

  <p className="text-[#8B7D6B] mt-2 text-lg">
    Manage tailors, specialists and staff availability.
  </p>
</div>
  <div
  className="
  bg-[#FAF8F5]
  border
  border-[#EAE3D6]
   bg-[#FAF8F5] dark:bg-[#252525]
  rounded-3xl
  p-6
  flex
  items-center
  justify-center
  min-w-[220px]
  "
>
  <button
    onClick={() => setOpen(true)}
    className="
    w-full
    h-14
    rounded-2xl
    bg-[#C48A7A]
    
    hover:bg-[#B17869]
    text-white
    font-semibold
    flex items-center justify-center gap-2
    transition
    "
  >
    <Plus className="w-5 h-5" />
    Add Worker
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
        <DataTable columns={columns} rows={workers} />
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
      padding: '24px 32px',
    }}
  >
     <p className="text-sm text-[#8B7D6B] dark:text-gray-400">
      Workforce Management
    </p>

    <h2 className="text-3xl font-bold text-[#4A3F35] dark:text-white">
      Add Worker
    </h2>
  </DialogTitle>

  <DialogContent
    sx={{
      padding: '32px',
    }}
  >
    <div className="space-y-4 mt-2">
         <div className="grid gap-4 mt-4">
      <input
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
        placeholder="Full Name"
        value={form.name}
        onChange={(e) =>
          setForm({ ...form, name: e.target.value })
        }
      />

      <input
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
        placeholder="Email Address"
        value={form.email}
        onChange={(e) =>
          setForm({ ...form, email: e.target.value })
        }
      />

      <input
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
        placeholder="Phone Number"
        value={form.phone}
        onChange={(e) =>
          setForm({ ...form, phone: e.target.value })
        }
      />

      <input
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
        placeholder="Specialization"
        value={form.specialization}
        onChange={(e) =>
          setForm({
            ...form,
            specialization: e.target.value,
          })
        }
      />

      <input
        type="number"
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
        placeholder="Experience (Years)"
        value={form.experience}
        onChange={(e) =>
          setForm({
            ...form,
            experience: Number(e.target.value),
          })
        }
      />
    </div>
    </div>
  </DialogContent>

  <DialogActions
    sx={{
      padding: '24px 32px',
      borderTop: '1px solid #EAE3D6',
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
      Create Worker
    </button>
  </DialogActions>
</Dialog>
    </div>
  );
}
