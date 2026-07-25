import { useEffect, useState } from 'react';
import { Upload, Plus } from 'lucide-react';
import { Alert } from '@mui/material';
import api from '../../services/api';

export default function CustomerProfile() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({});
  const [modForm, setModForm] = useState({ title: '', description: '' });
  const [message, setMessage] = useState('');

  const load = () => {
    api.get('/customers/profile').then((r) => {
      setProfile(r.data);
      const c = r.data.customer;
      setForm({
        name: c.user?.name,
        phone: c.user?.phone,
        address: c.address,
        city: c.city,
        state: c.state,
        zipCode: c.zipCode,
        notes: c.notes,
      });
    });
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    await api.put('/customers/profile', form);
    setMessage('Profile updated!');
    load();
  };

  const handleUpload = async (e) => {
    const files = e.target.files;
    if (!files?.length) return;
    const fd = new FormData();
    Array.from(files).forEach((f) => fd.append('images', f));
    await api.post('/customers/reference-images', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    load();
  };

  const addModification = async () => {
  if (
    !modForm.title.trim() ||
    !modForm.description.trim()
  ) {
    return;
  }

  await api.post(
    '/customers/modifications',
    modForm
  );

  setModForm({
    title: '',
    description: '',
  });

  load();
};

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
     <div
  className="
  bg-[#FAF8F5]
  dark:bg-[#252525]
  rounded-3xl
  border
  border-[#EAE3D6]
  dark:border-[#333]
  p-6
  "
>
  <p className="text-sm text-[#8B7D6B]">
    Customer Account
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
    My Profile
  </h1>

  <p className="text-[#8B7D6B] mt-3">
    Manage your personal details,
    reference designs and alteration requests.
  </p>
</div>
      {message && <Alert severity="success" onClose={() => setMessage('')}>{message}</Alert>}

      <form onSubmit={handleSave} className="
  bg-[#FAF8F5]
  dark:bg-[#252525]
  border
  border-[#EAE3D6]
  dark:border-[#333]
  rounded-3xl
  p-6
  space-y-5
  ">
       
        <h2
  className="
  text-xl
  font-semibold
  text-[#4A3F35]
  dark:text-white
  "
>
  Personal Information
</h2>
        {['name', 'phone', 'address', 'city', 'state', 'zipCode'].map((f) => (
          <div key={f}>
            <label className="block text-sm font-medium mb-1 capitalize">{f}</label>
          <input
  className="
  w-full
  h-12
  px-4
  rounded-2xl
  border
  border-[#EAE3D6]
  dark:border-[#333]
  bg-white
  dark:bg-[#1F1F1F]
  text-[#4A3F35]
  dark:text-white
  focus:outline-none
  focus:ring-2
  focus:ring-[#C48A7A]
  "
 value={form[f] || ''}
              onChange={(e) => setForm({ ...form, [f]: e.target.value })} />
          </div>
        ))}
        <textarea    className="
  w-full
  p-4
  rounded-2xl
  border
  border-[#EAE3D6]
  dark:border-[#333]
  bg-white
  dark:bg-[#1F1F1F]
  text-[#4A3F35]
  dark:text-white
  resize-none
  " rows={3} placeholder="Notes" value={form.notes || ''}
          onChange={(e) => setForm({ ...form, notes: e.target.value })} />
      <button
  type="submit"
  className="
  px-6
  py-3
  rounded-2xl
  bg-[#C48A7A]
  hover:bg-[#B17869]
  text-white
  font-medium
  "
>
  Save Profile
</button>
      </form>
<div
  className="
  bg-[#FAF8F5]
  dark:bg-[#252525]
  border
  border-[#EAE3D6]
  dark:border-[#333]
  rounded-3xl
  p-6
  "
>
        <h2
  className="
  text-xl
  font-semibold
  text-[#4A3F35]
  dark:text-white
  mb-5
  "
>
  Reference Designs
</h2>
        <label  className="
  inline-flex
  items-center
  gap-2
  px-5
  py-3
  rounded-2xl
  bg-[#F3EFD9]
  dark:bg-[#2F2A1D]
  text-[#4A3F35]
  dark:text-[#EAE3D6]
  cursor-pointer
  ">
          <Upload className="w-4 h-4" /> Upload Images
          <input type="file" multiple accept="image/*" className="hidden" onChange={handleUpload} />
        </label>
        <div className="grid grid-cols-3 gap-3 mt-4">
          {profile.customer?.referenceImages?.map((img, i) => (
           <img
  key={i}
  src={img.url}
  alt="reference"
  className="
  h-32
  w-full
  rounded-2xl
  object-cover
  border
  border-[#EAE3D6]
  dark:border-[#333]
  "
/>
          ))}
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
  p-6
  "
>
        <h2 className="font-semibold mb-4">Modification Requests</h2>
      <div className="grid md:grid-cols-[250px_1fr_auto] gap-3 mb-6">
          <input
  className="
  flex-1
  h-12
  px-4
  rounded-2xl
  border
  border-[#EAE3D6]
  dark:border-[#333]
  bg-white
  dark:bg-[#1F1F1F]
  text-[#4A3F35]
  dark:text-white
  "
 placeholder="Title" value={modForm.title}
            onChange={(e) => setModForm({ ...modForm, title: e.target.value })} />
          <input  className="
  w-full
  h-12
  px-4
  rounded-2xl
  border
  border-[#EAE3D6]
  dark:border-[#333]
  bg-white
  dark:bg-[#1F1F1F]
  text-[#4A3F35]
  dark:text-white
  focus:outline-none
  focus:ring-2
  focus:ring-[#C48A7A]
  " placeholder="Description" value={modForm.description}
            onChange={(e) => setModForm({ ...modForm, description: e.target.value })} />
         <button
  type="button"
  onClick={addModification}
  className="
  h-12
  w-12
  flex
  items-center
  justify-center
  rounded-2xl
  bg-[#C48A7A]
  text-white
  "
>
  <Plus className="w-5 h-5" />
</button>
        </div>
       <ul className="space-y-4">
  {profile.customer?.modificationRequests
    ?.filter(
      (m) =>
        m.title?.trim() ||
        m.description?.trim()
    )
    .map((m, i) => (
      <li
        key={i}
        className="
        p-5
        rounded-2xl
        border
        border-[#EAE3D6]
        dark:border-[#333]
        bg-white
        dark:bg-[#1F1F1F]
        "
      >
        <div className="flex justify-between items-start">
          <div>
            <h3
              className="
              text-lg
              font-semibold
              text-[#4A3F35]
              dark:text-white
              "
            >
              {m.title}
            </h3>

            <p
              className="
              mt-2
              text-sm
              text-[#8B7D6B]
              "
            >
              {m.description}
            </p>
          </div>

          <span
            className="
            px-3
            py-1
            rounded-full
            bg-[#F3EFD9]
            dark:bg-[#2F2A1D]
            text-[#4A3F35]
            dark:text-[#EAE3D6]
            text-xs
            font-medium
            capitalize
            "
          >
            {m.status}
          </span>
        </div>
      </li>
    ))}
</ul>
      </div>
    </div>
  );
}
