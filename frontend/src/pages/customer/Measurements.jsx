import { useEffect, useState } from 'react';
import api from '../../services/api';
import { useNavigate } from "react-router-dom";
const FIELDS = [
  { key: 'height', label: 'Height (cm)' },
  { key: 'chest', label: 'Chest (in)' },
  { key: 'waist', label: 'Waist (in)' },
  { key: 'shoulder', label: 'Shoulder (in)' },
  { key: 'sleeveLength', label: 'Sleeve Length (in)' },
  { key: 'hip', label: 'Hip (in)' },
  { key: 'neck', label: 'Neck (in)' },
  { key: 'inseam', label: 'Inseam (in)' },
];

export default function CustomerMeasurements() {
  const [measurements, setMeasurements] = useState([]);
  const [form, setForm] = useState({});
  const [additional, setAdditional] = useState({ key: '', value: '' });
const [sizeRecommendation, setSizeRecommendation] =
useState(null);
const navigate = useNavigate();
  const load = async () => {
    const profile = await api.get('/customers/profile');
    setMeasurements(Array.isArray(profile.data.measurements) ? profile.data.measurements : []);
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const additionalMeasurements = {};
    if (additional.key) additionalMeasurements[additional.key] = Number(additional.value);
    await api.post('/measurements', { ...form, additionalMeasurements, isDefault: true });
    setForm({});
    setAdditional({ key: '', value: '' });
    load();
  };
const generateSizeRecommendation = async (e) => {
    if (e) e.preventDefault();

    try {
        const { data } = await api.post("/customers/size-recommendation");

        setSizeRecommendation(data);

        localStorage.setItem(
            "aiSizeRecommendation",
            JSON.stringify(data)
        );

        // reload measurements because AI recommendation
        // has been saved to MongoDB
        load();

    } catch (err) {
        console.log(err);
    }
};
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
    Customer Measurements
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
    Measurements
  </h1>

  <p className="text-[#8B7D6B] mt-3">
    Store and manage body measurements
    for accurate stitching and fitting.
  </p>
</div>

      <form onSubmit={handleSubmit}   className="
  bg-[#FAF8F5]
  dark:bg-[#252525]
  border
  border-[#EAE3D6]
  dark:border-[#333]
  rounded-3xl
  p-6
  ">
     <h2
  className="
  text-xl
  font-semibold
  text-[#4A3F35]
  dark:text-white
  mb-6
  "
>
  New Measurement
</h2>
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {FIELDS.map(({ key, label }) => (
            <div key={key}>
              <label className="block text-sm mb-1">{label}</label>
              <input type="number" step="0.1"   className="
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
  "value={form[key] || ''}
                onChange={(e) => setForm({ ...form, [key]: Number(e.target.value) })} />
            </div>
          ))}
        </div>
      <div className="grid md:grid-cols-2 gap-4 mt-6">
          <input   className="
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
  "placeholder="Additional field name" value={additional.key}
            onChange={(e) => setAdditional({ ...additional, key: e.target.value })} />
          <input type="number"   className="
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
  "placeholder="Value" value={additional.value}
            onChange={(e) => setAdditional({ ...additional, value: e.target.value })} />
        </div>
        <textarea  className="
  w-full
  mt-5
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
  " rows={2} placeholder="Notes" value={form.notes || ''}
          onChange={(e) => setForm({ ...form, notes: e.target.value })} />
       <div className="flex flex-wrap gap-4 mt-6">

<button
    type="submit"
    className="
    px-6
    py-3
    rounded-2xl
    bg-[#C48A7A]
    hover:bg-[#B17869]
    text-white
    "
>
    Save Measurements
</button>

<button
    type="button"
    onClick={generateSizeRecommendation}
    className="
    px-6
    py-3
    rounded-2xl
   bg-[#C48A7A]
    hover:bg-[#B17869]
    text-white
    "
>
    Generate AI Recommendation
</button>

</div>




      </form>
      {
sizeRecommendation && (

<div
className="
mt-8
bg-[#FAF8F5]
dark:bg-[#252525]
border
border-[#EAE3D6]
dark:border-[#333]
rounded-3xl
p-6
"
>

<div className="flex items-center justify-between mb-6">

  <h2
    className="
    text-2xl
    font-bold
    text-[#4A3F35]
    dark:text-white
    "
  >
    AI Size Recommendation
  </h2>

  <button
    onClick={() => navigate("/customer/orders")}
    className="
    px-5
    py-2.5
    rounded-2xl
    bg-[#C48A7A]
    hover:bg-[#B17869]
    text-white
    font-medium
    transition
    shadow-sm
    "
  >
    Create Order
  </button>

</div>

<div
className="
grid
md:grid-cols-2
gap-5
mt-6
"
>

<div>

<p>
<b>Kurta</b>
</p>

<p>{sizeRecommendation.kurtaSize}</p>

</div>

<div>

<p>
<b>Shirt</b>
</p>

<p>{sizeRecommendation.shirtSize}</p>

</div>

<div>

<p>
<b>Blazer</b>
</p>

<p>{sizeRecommendation.blazerSize}</p>

</div>

<div>

<p>
<b>Trouser</b>
</p>

<p>{sizeRecommendation.trouserSize}</p>

</div>

<div>

<p>
<b>Lehenga Waist</b>
</p>

<p>{sizeRecommendation.lehengaWaist}</p>

</div>

<div>

<p>
<b>Fit</b>
</p>

<p>{sizeRecommendation.fitType}</p>

</div>

<div>

<p>
<b>Confidence</b>
</p>

<p>{sizeRecommendation.confidence}</p>

</div>

</div>

<div
className="
mt-6
bg-[#F8F3EA]
dark:bg-[#1F1F1F]
rounded-2xl
p-5
"
>

<h3
className="
font-semibold
text-lg
"
>
Why this size?
</h3>

<p
className="
mt-2
text-[#8B7D6B]
"
>
{sizeRecommendation.reason}
</p>

</div>

</div>

)
}
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
  Saved Measurements
</h2>
        {measurements.length === 0 && (
       <div className="text-center py-10">
  <p className="text-[#8B7D6B]">
    No measurements saved yet.
  </p>
</div>
        )}
        {measurements.map((m) => (
         <div
  key={m._id}
  className="
  mb-4
  p-5
  rounded-2xl
  border
  border-[#EAE3D6]
  dark:border-[#333]
  bg-white
  dark:bg-[#1F1F1F]
  "
>
          <p
  className="
  text-xs
  text-[#8B7D6B]
  mb-4
  "
>{new Date(m.createdAt).toLocaleString()}</p>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
              {FIELDS.map(({ key, label }) => m[key] != null && (
               <div
  key={key}
  className="
  px-3
  py-2
  rounded-xl
  bg-[#F3EFD9]
  dark:bg-[#2F2A1D]
  text-[#4A3F35]
  dark:text-[#EAE3D6]
  text-sm
  "
>
  <span className="font-medium">
    {label.split(' ')[0]}
  </span>
  : {m[key]}
</div>
              ))}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
