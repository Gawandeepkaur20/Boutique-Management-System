import { Plus, Trash2 } from 'lucide-react';
import { useEffect } from 'react';
import api from '../services/api';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
  MenuItem, Select, FormControl, InputLabel,
} from '@mui/material';

const emptyItem = { name: '', quantity: 1, price: 0, fabric: '' };
const inputClass = `
h-12
w-full
px-4
rounded-2xl
border
border-[#EAE3D6]
dark:border-[#333]

bg-[#FFFEFC]
dark:bg-[#1F1F1F]

text-[#5C4033]
dark:text-white

placeholder:text-[#8B7D6B]
dark:placeholder:text-gray-500

focus:outline-none
focus:ring-2
focus:ring-[#C48A7A]
`;

const sectionClass = `
bg-white
dark:bg-[#252525]

border
border-[#EAE3D6]
dark:border-[#333]

rounded-3xl
p-6
mb-6
`;

export default function OrderFormDialog({ open, onClose, customers, form, setForm, onSubmit }) {
  const addItem = () => setForm({ ...form, items: [...form.items, { ...emptyItem }] });
  const removeItem = (i) => setForm({ ...form, items: form.items.filter((_, idx) => idx !== i) });
  const updateItem = (i, field, value) => {
    const items = [...form.items];
    items[i] = { ...items[i], [field]: field === 'quantity' || field === 'price' ? Number(value) : value };
    setForm({ ...form, items });
  };

  const total = form.items.reduce((s, i) => s + (i.quantity || 0) * (i.price || 0), 0);
  useEffect(() => {

    if (
      form.customerId &&
      form.customerId !== "new"
    ) {
  
      fetchMeasurements();
  
    }
  
    if(form.customerId==="new"){
  
      setForm(prev=>({
  
        ...prev,
  
        measurements:{
          chest:"",
          waist:"",
          shoulder:"",
          sleeve:"",
          length:""
        }
  
      }));
  
    }
  
  }, [form.customerId]);
  
  const fetchMeasurements=async()=>{

    try{
    
    const {data}=await api.get(
    `/measurements/customer/${form.customerId}`
    );
    
    console.log(
      "Frontend measurement:",
      data
      );
    
    setForm(prev=>({
    
    ...prev,
    
    measurements:{
    
    chest:data.chest || "",
    
    waist:data.waist || "",
    
    shoulder:data.shoulder || "",
    
    sleeve:data.sleeveLength || "",
    
    length:data.additionalMeasurements?.length || ""
    
    }
    
    }));
    
    }
    catch(err){
    
    console.log(err);
    
    }
    
    }
  return (
    <Dialog
  open={open}
  onClose={onClose}
  maxWidth="lg"
  fullWidth
  PaperProps={{
  className: `
    !bg-[#FAF8F5]
    dark:!bg-[#1B1B1B]
    !border
    !border-[#EAE3D6]
    dark:!border-[#333]
  `,
}}
>
      <DialogTitle
  sx={{
    borderBottom: '1px solid #EAE3D6',
    padding: '24px 32px'
  }}
>
  <div>
   <p className="text-sm text-[#8B7D6B] dark:text-gray-400">
      Order Management
    </p>
<h2 className="text-3xl font-bold text-[#4A3F35] dark:text-white">
      Create New Order
    </h2>
  </div>
</DialogTitle>
    <DialogContent
  sx={{
    padding: "32px",
    maxHeight: "70vh",
    overflowY: "auto",
  }}
>
  
     <div className={sectionClass}>
  <h3 className="text-lg font-semibold text-[#4A3F35] mb-4">
    Customer Information
  </h3>

 <FormControl
  fullWidth
  variant="outlined"
  sx={{
    '& .MuiOutlinedInput-root': {
      borderRadius: '16px',

      '& fieldset': {
        borderColor: '#EAE3D6',
      },

      '&:hover fieldset': {
        borderColor: '#C48A7A',
      },

      '&.Mui-focused fieldset': {
        borderColor: '#C48A7A !important',
        borderWidth: '2px',
      },
    },

    '& .MuiInputLabel-root': {
      color: '#8B7D6B',
    },

    '& .MuiInputLabel-root.Mui-focused': {
      color: '#C48A7A !important',
    },
  }}
>

 <InputLabel id="customer-label">
  Customer
</InputLabel>

<Select
  labelId="customer-label"
  value={form.customerId}
  label="Customer"
  MenuProps={{
  PaperProps: {
    sx: {
      borderRadius: '16px',

      '& .MuiMenuItem-root.Mui-selected': {
        backgroundColor: '#F8F1EF',
        color: '#C48A7A',
      },

      '& .MuiMenuItem-root.Mui-selected:hover': {
        backgroundColor: '#F3E6E1',
      },
    },
  },
}}
  onChange={(e) =>
    setForm({
      ...form,
      customerId: e.target.value,
    })
  }
>

    <MenuItem value="">
      Select Customer
    </MenuItem>

    <MenuItem value="new">
      + Add New Customer
    </MenuItem>

    {customers.map((c) => (

      <MenuItem
        key={c._id}
        value={c._id}
      >
        {c.user?.name}
      </MenuItem>

    ))}

  </Select>

</FormControl>
 </div>

{form.customerId === "new" && (
<div className={sectionClass}>
    <h3 className="text-lg font-semibold text-[#4A3F35] mb-4">
      Customer Details
    </h3>

    <div className="grid md:grid-cols-2 gap-4">
      <input
        className={inputClass}
        placeholder="Customer Name"
        value={form.customerName || ""}
        onChange={(e) =>
          setForm({
            ...form,
            customerName: e.target.value,
          })
        }
      />

      <input
        className={inputClass}
        placeholder="Phone Number"
        value={form.phone || ""}
        onChange={(e) =>
          setForm({
            ...form,
            phone: e.target.value,
          })
        }
      />

      <input
        className={inputClass}
        placeholder="Email Address"
        value={form.email || ""}
        onChange={(e) =>
          setForm({
            ...form,
            email: e.target.value,
          })
        }
      />

      <input
     className={inputClass}
        placeholder="City"
        value={form.city || ""}
        onChange={(e) =>
          setForm({
            ...form,
            city: e.target.value,
          })
        }
      />
    </div>
  </div>
)}


{(form.customerId || form.customerId === "new") && (
<div className={sectionClass}>
  <h3 className="text-lg font-semibold text-[#4A3F35] mb-4">
    Measurements
  </h3>

  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
    {[
      ['chest', 'Chest'],
      ['waist', 'Waist'],
      ['shoulder', 'Shoulder'],
      ['sleeve', 'Sleeve'],
      ['length', 'Length'],
    ].map(([key, label]) => (
      <input
        key={key}
     
    className="
    h-12
    w-full
    px-4
    rounded-2xl
    border
    border-[#EAE3D6]
    bg-[#FFFEFC]
    text-[#5C4033]
    focus:outline-none
    focus:ring-2
    focus:ring-[#C48A7A]
    "
        placeholder={label}
        value={form.measurements?.[key] || ''}
        onChange={(e) =>
          setForm({
            ...form,
            measurements: {
              ...form.measurements,
              [key]: e.target.value,
            },
          })
        }
      />
    ))}
  </div>
</div>
)}

       <div className={sectionClass}>
  <h3 className="text-lg font-semibold text-[#4A3F35] mb-4">
    Order Details
  </h3>

  <div className="grid md:grid-cols-3 gap-4">
    <select
    
    className={inputClass}
      value={form.priority}
      onChange={(e) =>
        setForm({ ...form, priority: e.target.value })
      }
    >
      <option value="low">Low Priority</option>
      <option value="medium">Medium Priority</option>
      <option value="high">High Priority</option>
    </select>

    <input
      type="date"
      
   className={inputClass}
      value={form.deliveryDate || ''}
      onChange={(e) =>
        setForm({
          ...form,
          deliveryDate: e.target.value,
        })
      }
    />

    <input
      type="number"
    
   className={inputClass}
      placeholder="Advance Paid"
      value={form.advancePaid}
      onChange={(e) =>
        setForm({
          ...form,
          advancePaid: Number(e.target.value),
        })
      }
    />
  </div>
</div>
      <div className={sectionClass}>
  <div className="flex justify-between items-center mb-4">
    <h3 className="text-lg font-semibold text-[#4A3F35]">
      Order Items
    </h3>

    <button
      type="button"
      onClick={addItem}
      className="
      flex items-center gap-2
      px-4 py-2
      rounded-xl
      bg-[#F3EFD9]
      text-[#C9A227]
      "
    >
      <Plus className="w-4 h-4" />
      Add Item
    </button>
  </div>

  {form.items.map((item, i) => (
    <div
      key={i}
      className="
      grid
      md:grid-cols-[2fr_1fr_1fr_2fr_auto]
      gap-3
      mb-3
      p-4
      rounded-2xl
      border
      border-[#EAE3D6]
      "
    >
      <input
     
   className={inputClass}
        placeholder="Item Name"
        value={item.name}
        onChange={(e) =>
          updateItem(i, 'name', e.target.value)
        }
      />

      <input
        className={inputClass}
        type="number"
        placeholder="Qty"
        value={item.quantity}
        onChange={(e) =>
          updateItem(i, 'quantity', e.target.value)
        }
      />

      <input
         className={inputClass}
        type="number"
        placeholder="Price"
        value={item.price}
        onChange={(e) =>
          updateItem(i, 'price', e.target.value)
        }
      />

      <input
        className={inputClass}
        placeholder="Fabric"
        value={item.fabric || ''}
        onChange={(e) =>
          updateItem(i, 'fabric', e.target.value)
        }
      />

      {form.items.length > 1 && (
        <button
          type="button"
          onClick={() => removeItem(i)}
          className="text-red-500"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      )}
    </div>
  ))}

  <div className="flex justify-end mt-4">
   <div
  className="
  bg-[#F8F1EF]
  dark:bg-[#2A2220]
  rounded-2xl
  px-6
  py-3
  "
>
      <p className="text-sm text-[#8B7D6B] dark:text-gray">
        Order Total
      </p>

      <p className="text-2xl font-bold text-[#C48A7A]">
        ₹{total}
      </p>
    </div>
  </div>
</div>

       <textarea
  className="
  h-24
  w-full
  px-4
  py-3
  rounded-2xl

  border
  border-[#EAE3D6]
  dark:border-[#333]

  bg-[#FFFEFC]
  dark:bg-[#1F1F1F]

  text-[#5C4033]
  dark:text-white

  placeholder:text-[#8B7D6B]
  dark:placeholder:text-gray-500

  focus:outline-none
  focus:ring-2
  focus:ring-[#C48A7A]
  "
rows={2} placeholder="Notes" value={form.notes || ''}
          onChange={(e) => setForm({ ...form, notes: e.target.value })} />
      </DialogContent>
   <DialogActions
  sx={{
    padding: '24px 32px',
    borderTop: '1px solid #EAE3D6',
  }}
>
        <button
  onClick={onClose}
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
  onClick={onSubmit}
  className="
  px-6 py-3
  rounded-2xl
  bg-[#C48A7A]
  hover:bg-[#B17869]
  text-white
  font-medium
  "
>
  Create Order
</button>
      </DialogActions>
    </Dialog>
  );
}
