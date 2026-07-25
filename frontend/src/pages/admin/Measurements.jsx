import { useEffect, useState } from "react";
import api from "../../services/api";
import {
Dialog,
DialogTitle,
DialogContent,
DialogActions
} from "@mui/material";

import {
Search,
Download,
Eye,
Ruler,
Sparkles
} from "lucide-react";

import DataTable from "../../components/DataTable";
import EmptyState from "../../components/EmptyState";
import { TableSkeleton } from "../../components/Skeleton";
import StatCard from "../../components/StatCard";
export default function Measurements() {
  const [measurements, setMeasurements] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedMeasurement, setSelectedMeasurement] = useState(null);
    const [loading, setLoading] = useState(true);
    const isDark =
document.documentElement.classList.contains("dark");
const [open, setOpen] = useState(false);
  useEffect(() => {
    loadMeasurements();
  }, []);

 const loadMeasurements = async () => {
  try {
    setLoading(true);

    const { data } = await api.get("/measurements/all");

    console.log("Measurements API:", data);

    setMeasurements(data);
  } catch (err) {
    console.log(err);
  } finally {
    setLoading(false);
  }
};

  const filtered = measurements.filter((m) =>
    m.customer?.user?.name
      ?.toLowerCase()
      .includes(search.toLowerCase())
  );
const columns = [

{
field:"customer",
headerName:"Customer",
render:(m)=>m.customer?.user?.name
},

{
field:"height",
headerName:"Height",
render:(m)=>m.height || "-"
},

{
field:"chest",
headerName:"Chest",
render:(m)=>m.chest || "-"
},

{
field:"waist",
headerName:"Waist",
render:(m)=>m.waist || "-"
},

{
field:"hip",
headerName:"Hip",
render:(m)=>m.hip || "-"
},

{
field:"updated",
headerName:"Updated",
render:(m)=>new Date(m.updatedAt).toLocaleDateString()
},

{
field:"actions",
headerName:"Actions",
render:(m)=>(

<button
onClick={()=>{
setSelectedMeasurement(m);
setOpen(true);
}}
className="
px-4
py-2
rounded-xl
bg-[#C48A7A]
text-white
hover:bg-[#B17869]
"
>

<Eye className="w-4 h-4"/>

</button>

)

}

];
  return (
    <div className="space-y-6">
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
"
>

<p className="text-sm text-[#8B7D6B]">
Measurements
</p>

<h1 className="text-3xl font-semibold text-[#4A3F35] dark:text-white">
Customer Measurements
</h1>

<p className="text-[#8B7D6B] mt-2">
Manage customer body measurements and AI recommendations.
</p>

</div>

<div
className="
flex
justify-end
items-center
gap-3
bg-[#FAF8F5]
dark:bg-[#252525]
rounded-3xl
border
border-[#EAE3D6]
dark:border-[#333]
px-6
py-5
"
>

<button
className="
flex items-center gap-2
px-5 py-3
rounded-xl
bg-white
dark:bg-[#1F1F1F]
border
border-[#EAE3D6]
dark:border-[#333]
"
>
<Download className="w-4 h-4"/>
Export
</button>

</div>

</div>
<div
className="
bg-[#FAF8F5]
dark:bg-[#252525]
rounded-2xl
border
border-[#EAE3D6]
dark:border-[#333]
p-4
"
>

<div className="relative">

<Search
className="absolute left-4 top-3.5 w-4 h-4 text-gray-400"
/>

<input
placeholder="Search customer..."
value={search}
onChange={(e)=>setSearch(e.target.value)}
className="
w-full
h-12
pl-12
rounded-3xl
border
border-[#EAE3D6]
bg-white
dark:bg-[#1F1F1F]
"
/>

</div>

</div>
<div className="grid md:grid-cols-4 gap-6">

<StatCard
title="Customers"
value={measurements.length}
icon={Ruler}
color="#C48A7A"
/>

<StatCard
title="Default Profiles"
value={measurements.filter(m=>m.isDefault).length}
icon={Sparkles}
color="#7A9B76"
/>

<StatCard
title="AI Ready"
value={measurements.filter(m=>m.aiRecommendation).length}
icon={Sparkles}
color="#C9A227"
/>

<StatCard
title="Updated Today"
value={
measurements.filter(m=>
new Date(m.updatedAt).toDateString()===new Date().toDateString()
).length
}
icon={Ruler}
color="#C48A7A"
/>

</div>



<div
  className="
  bg-[#FAF8F5]
  dark:bg-[#252525]
  rounded-3xl
  border
  border-[#EAE3D6]
  dark:border-[#333]
  overflow-hidden
  "
>
    {
loading ?

<TableSkeleton/>

:

filtered.length===0 ?

<EmptyState

title="No Measurements"

description="No customer measurements have been added yet."

/>

:

<DataTable
    columns={columns}
    rows={filtered.map(m => ({
        id: m._id,
        ...m
    }))}
/>

}



</div>
{selectedMeasurement?.aiRecommendation && (
<div className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 text-green-700 font-semibold mb-6">
    AI Recommendation Available
</div>
)}
<Dialog
open={open}
onClose={()=>setOpen(false)}
maxWidth="md"
fullWidth
PaperProps={{
sx:{
borderRadius:4,
backgroundColor:isDark ? "#252525" : "#FAF8F5",
color:isDark ? "#F5F5F5" : "#4A3F35",
border:isDark
? "1px solid #333"
: "1px solid #EAE3D6"
}
}}
>
<DialogTitle
sx={{
fontWeight:700,
fontSize:28,
borderBottom:isDark
? "1px solid #333"
: "1px solid #EAE3D6",
color:isDark ? "#fff" : "#4A3F35"
}}
>
Measurement Details
</DialogTitle>

<DialogContent>

{selectedMeasurement && (

<div className="space-y-6">

{/* Customer */}

<div
className="
bg-white
dark:bg-[#1F1F1F]
border
border-[#EAE3D6]
dark:border-[#333]
rounded-3xl
p-6
"
>

<h2 className="text-2xl font-bold text-[#4A3F35] dark:text-white">
{selectedMeasurement.customer?.user?.name}
</h2>

<p className="text-[#8B7D6B] mt-2">
{selectedMeasurement.customer?.user?.email}
</p>

<p className="text-[#8B7D6B]">
{selectedMeasurement.customer?.user?.phone}
</p>

</div>

{/* AI Recommendation */}

{selectedMeasurement.aiRecommendation && (

<div
className="
bg-[#F8F3EA]
dark:bg-[#1F1F1F]
border
border-[#EAE3D6]
dark:border-[#333]
rounded-3xl
p-6
"
>

<h2 className="text-2xl font-bold text-[#4A3F35] dark:text-white mb-6">
🧠 AI Fit Analysis
</h2>

<div className="grid md:grid-cols-2 gap-5">

{[
["Recommended Size", selectedMeasurement.aiRecommendation.recommendedSize],
["Fit Type", selectedMeasurement.aiRecommendation.fitType],
["Neck Design", selectedMeasurement.aiRecommendation.recommendedNeck],
["Sleeves", selectedMeasurement.aiRecommendation.recommendedSleeves],
["Bottom Style", selectedMeasurement.aiRecommendation.recommendedBottom],
["Recommended Fabric", selectedMeasurement.aiRecommendation.recommendedFabric],
].map(([label,value])=>(

<div
key={label}
className="
bg-white
dark:bg-[#252525]
border
border-[#EAE3D6]
dark:border-[#333]
rounded-2xl
p-4
"
>

<p className="text-sm text-[#8B7D6B]">
{label}
</p>

<h3 className="text-lg font-semibold text-[#4A3F35] dark:text-white mt-2">
{value || "--"}
</h3>

</div>

))}

</div>

{/* Confidence */}

<div className="mt-8">

<p className="font-semibold mb-2 dark:text-white">
Confidence
</p>

<div
className="
w-full
h-4
rounded-full
bg-[#EAE3D6]
dark:bg-[#333]
overflow-hidden
"
>

<div
className="h-full bg-[#C48A7A]"
style={{
width:
selectedMeasurement.aiRecommendation.confidence
? `${selectedMeasurement.aiRecommendation.confidence}%`
: "0%"
}}
/>

</div>

<p className="mt-2 text-sm text-[#8B7D6B]">
{selectedMeasurement.aiRecommendation.confidence || "--"}%
</p>

</div>

{/* Reason */}

<div
className="
mt-8
bg-white
dark:bg-[#252525]
border
border-[#EAE3D6]
dark:border-[#333]
rounded-2xl
p-5
"
>

<h3 className="font-semibold text-lg dark:text-white">
Why AI Recommended This?
</h3>

<p className="mt-3 text-[#8B7D6B]">
{selectedMeasurement.aiRecommendation.reason || "No explanation available."}
</p>

</div>

</div>

)}

{/* Measurements */}

<div
className="
grid
grid-cols-2
md:grid-cols-4
gap-4
"
>

{[
["Height", selectedMeasurement.height],
["Chest", selectedMeasurement.chest],
["Waist", selectedMeasurement.waist],
["Hip", selectedMeasurement.hip],
["Shoulder", selectedMeasurement.shoulder],
["Sleeve", selectedMeasurement.sleeveLength],
["Neck", selectedMeasurement.neck],
["Inseam", selectedMeasurement.inseam]
].map(([label,value])=>(

<div
key={label}
className="
bg-[#F3EFD9]
dark:bg-[#2D2D2D]
border
border-[#EAE3D6]
dark:border-[#333]
rounded-2xl
p-4
"
>

<p className="text-sm text-[#8B7D6B]">
{label}
</p>

<h2 className="text-2xl font-bold text-[#4A3F35] dark:text-white mt-2">
{value ?? "--"}
</h2>

</div>

))}

</div>

{/* Notes */}

<div
className="
bg-white
dark:bg-[#1F1F1F]
border
border-[#EAE3D6]
dark:border-[#333]
rounded-3xl
p-6
"
>

<h3 className="font-semibold text-lg dark:text-white">
Notes
</h3>

<p className="mt-3 text-[#8B7D6B]">
{selectedMeasurement.notes || "No notes available"}
</p>

</div>

</div>

)}

</DialogContent>
<DialogActions>

<button
className="
px-5
py-3
rounded-2xl
border
"
onClick={()=>setOpen(false)}
>
Close
</button>

<button
className="
px-5
py-3
rounded-2xl
bg-[#C48A7A]
text-white
"
>

Create Order

</button>

</DialogActions>
</Dialog>
    </div>
  );
}