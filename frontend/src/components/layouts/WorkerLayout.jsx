import AppShell from './AppShell';

const workerLinks = [
  { to: '/worker', label: 'Dashboard', icon: 'LayoutDashboard', end: true },
  { to: '/worker/tasks', label: 'My Tasks', icon: 'ListTodo' },
];

export default function WorkerLayout() {
  return <AppShell links={workerLinks} title="Worker Panel" />;
}
