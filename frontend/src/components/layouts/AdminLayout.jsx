// import AppShell from './AppShell';

// const adminLinks = [
//   { to: '/admin/dashboard', label: 'Dashboard', icon: 'LayoutDashboard', end: true },
//   { to: '/admin/orders', label: 'Orders', icon: 'ShoppingBag' },
//   { to: '/admin/customers', label: 'Customers', icon: 'Users' },
//   { to: '/admin/workers', label: 'Workers', icon: 'Wrench' },
//   { to: '/admin/invoices', label: 'Invoices', icon: 'FileText' },
// ];

// export default function AdminLayout() {
//   return <AppShell links={adminLinks} title="Boutique Admin" gradient />;
// }
import AppShell from './AppShell';

const adminLinks = [
  {
    to: '/admin/dashboard',
    label: 'Dashboard',
    icon: 'Dashboard',
    end: true,
  },
  {
    to: '/admin/orders',
    label: 'Orders',
    icon: 'Orders',
  },
  {
    to: '/admin/customers',
    label: 'Customers',
    icon: 'Customers',
  },
  {
    to: '/admin/workers',
    label: 'Workers',
    icon: 'Workers',
  },
  {
    to: '/admin/invoices',
    label: 'Invoices',
    icon: 'Invoices',
  },
  {
  to: '/admin/payments',
  label: 'Payments',
  icon: 'Payments',
},
{
  to: '/admin/measurements',
  label: 'Measurements',
  icon: 'Measurements',
},
// {
//   to: '/admin/notifications',
//   label: 'Notifications',
//   icon: 'Notifications',
// },
];

export default function AdminLayout() {
  return (
    <AppShell
      links={adminLinks}
      title="Boutique Admin"
      gradient={false}
    />
  );
}