import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { Badge } from '@mui/material';
import { fetchNotifications } from '../redux/slices/notificationSlice';
import api from '../services/api';

export default function NotificationDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);
  const { items } = useSelector((s) => s.notifications);
  const unread = items.filter((n) => !n.isRead).length;

  useEffect(() => {
    if (user?.token) dispatch(fetchNotifications());
  }, [dispatch, user?.token]);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const markRead = async (id) => {
    await api.patch(`/notifications/${id}/read`);
    dispatch(fetchNotifications());
  };

  const markAllRead = async () => {
    await api.patch('/notifications/read-all');
    dispatch(fetchNotifications());
  };

  const handleClick = (n) => {
    markRead(n._id);
    if (n.relatedOrder && user?.role === 'admin') {
      navigate(`/admin/orders/${n.relatedOrder}`);
    }
    setOpen(false);
  };

  return (
    <div className="relative" ref={ref}>
      <button
  onClick={() => setOpen(!open)}
  className="
  p-2.5
  rounded-xl
  hover:bg-[#F3EFD9]
  dark:hover:bg-[#2A2A2A]
  transition
  "
>
       <Badge
  badgeContent={unread}
  sx={{
    '& .MuiBadge-badge': {
      backgroundColor: '#C48A7A',
      color: '#fff',
    },
  }}
>
         <Bell
  className="
  w-5
  h-5
  text-[#8B7D6B]
  dark:text-gray-300
  "
/>
        </Badge>
      </button>

      {open && (
        <div
  className="
  absolute
  right-0
  mt-3
  w-96
  max-h-[500px]
  overflow-auto
  bg-[#FAF8F5]
  dark:bg-[#252525]
  rounded-2xl
  shadow-xl
  border
  border-[#EAE3D6]
  dark:border-[#3A3A3A]
  z-50
  "
>
        <div
  className="
  flex
  items-center
  justify-between
  p-4
  bg-[#F8F4EC]
  dark:bg-[#2A2A2A]
  border-b
  border-[#EAE3D6]
  dark:border-[#333]
  "
>
            <span className="font-semibold text-[#4A3F35] dark:text-white">Notifications</span>
            {unread > 0 && (
              <button onClick={markAllRead}className="
text-xs
font-medium
text-[#C48A7A]
hover:text-[#8B5E52]
transition-colors
">
                Mark all read
              </button>
            )}
          </div>
          {items.length === 0 ? (
            <div className="py-10 text-center">
  <Bell className="w-8 h-8 mx-auto text-[#C9A227] mb-3" />
  <p className="text-sm text-[#8B7D6B]">
    No new notifications
  </p>
</div>
          ) : (
            items.map((n) => (
              <button
                key={n._id}
                onClick={() => handleClick(n)}
               className={`
w-full
text-left
p-4
border-b
border-[#EFE7D6]
dark:border-[#333]
hover:bg-[#F3EFD9]
dark:hover:bg-[#2E2E2E]
transition
${
 !n.isRead
  ? 'bg-[#F8F1EF] dark:bg-[#352C2A]'
  : ''
}
`}
              >
               <p className="font-medium text-sm text-[#4A3F35] dark:text-white">
  {n.title}
</p>
               <p className="text-xs text-[#8B7D6B] dark:text-gray-400 line-clamp-2">{n.message}</p>
                <p className="text-xs text-gray-400 mt-1">{new Date(n.createdAt).toLocaleString()}</p>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
