import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Search } from 'lucide-react';
import api from '../services/api';

export default function GlobalSearch() {
  const { user } = useSelector((s) => s.auth);
  const [q, setQ] = useState('');
  const [results, setResults] = useState(null);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (!isAdmin || q.length < 2) {
      setResults(null);
      return;
    }
    const t = setTimeout(() => {
      api.get(`/search?q=${encodeURIComponent(q)}`).then((r) => {
        setResults(r.data);
        setOpen(true);
      });
    }, 300);
    return () => clearTimeout(t);
  }, [q, isAdmin]);

  if (!isAdmin) return null;

  const goOrder = (id) => {
    navigate(`/admin/orders/${id}`);
    setOpen(false);
    setQ('');
  };

  const hasResults = results && (results.orders?.length || results.customers?.length);

  return (
    <div className="relative hidden md:block w-64" ref={ref}>
      <Search
  className="
  absolute
  left-3
  top-3
  w-4
  h-4
  text-[#8B7D6B]
  dark:text-gray-400
  "
/>
      <input
         className="
  w-full
  pl-10
  pr-4
  py-2.5
  text-sm
  bg-white
  dark:bg-[#2A2A2A]
  border
  border-[#EAE3D6]
  dark:border-[#3A3A3A]
  rounded-xl
  outline-none
  focus:border-[#C9A227]
  focus:ring-2
  focus:ring-[#C9A227]/20
  text-[#4A3F35]
  dark:text-white
  "
        placeholder="Search orders, customers..."
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onFocus={() => q.length >= 2 && setOpen(true)}
      />
      {open && hasResults && (
        <div
  className="
  absolute
  top-full
  mt-2
  w-full
  bg-[#FAF8F5]
  dark:bg-[#252525]
  rounded-2xl
  shadow-xl
  border
  border-[#EAE3D8]
  dark:border-[#3A3A3A]
  z-50
  max-h-80
  overflow-auto
  "
>
          {results.orders?.map((o) => (
            <button
              key={o._id}
              onClick={() => goOrder(o._id)}
              className="w-full text-left px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm"
            >
              <span className="font-medium">{o.orderNumber}</span>
              <span className="text-gray-500 ml-2 capitalize">{o.status}</span>
            </button>
          ))}
          {results.customers?.map((c) => (
            <div key={c.user?._id} className="px-3 py-2 text-sm text-gray-600 border-t border-gray-100 dark:border-gray-700">
              {c.user?.name} — {c.user?.email}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
