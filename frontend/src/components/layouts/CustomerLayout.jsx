import AppShell from './AppShell';

const customerLinks = [
  { to: '/customer/dashboard', label: 'Dashboard', icon: 'Dashboard', end: true },
  { to: '/customer/profile', label: 'Profile', icon: 'Profile' },
  { to: '/customer/measurements', label: 'Measurements', icon: 'Measurements' },
  { to: '/customer/orders', label: 'My Orders', icon: 'Orders' },
  { to: '/customer/track', label: 'Track Order', icon: 'TrackOrder' },
  {
  label: "AI Fashion Advisor",
  to: "/customer/fashion-advisor",
  icon: 'FashionAdvisor',
}
];
 
export default function CustomerLayout() {
  return <AppShell links={customerLinks} title="My Boutique" />;
}
