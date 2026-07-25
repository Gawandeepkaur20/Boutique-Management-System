const statusColors = {
  received:
    'bg-[#EEF4EE] text-[#5D7A68]',

  processing:
    'bg-[#F5EAD7] text-[#A16B2A]',

  stitching:
    'bg-[#F8E6E1] text-[#B06D5C]',

  ready:
    'bg-[#E8F0FA] text-[#5478A3]',

  delivered:
    'bg-[#E8F4EE] text-[#4E7A61]',

   
};

export default function StatusBadge({ status }) {
  return (
  <span
    className={`
      px-5
      py-2.5
      rounded-full
      text-sm
      font-semibold
      capitalize
      ${statusColors[status]}
    `}
  >
    {status}
  </span>
);
  
}
