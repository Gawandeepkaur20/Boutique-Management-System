import { useEffect, useState } from 'react';
import { ListTodo, Clock, CheckCircle } from 'lucide-react';
import StatCard from '../../components/StatCard';
import OnboardingHint from '../../components/OnboardingHint';
import { StatCardSkeleton } from '../../components/Skeleton';
import api from '../../services/api';


export default function WorkerDashboard() {
  const [stats, setStats] = useState({ pending: 0, processing: 0, completed: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/workers/tasks?limit=100').then((res) => {
      const orders = res.data.orders || [];
      setStats({
        pending: orders.filter((o) => o.workerStatus === 'pending').length,
        processing: orders.filter((o) => o.workerStatus === 'processing').length,
        completed: orders.filter((o) => o.workerStatus === 'completed').length,
      });
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Worker Dashboard</h1>
      <OnboardingHint id="worker-dashboard">
        Open <strong>My Tasks</strong> to see measurements, update status, and submit completed work to admin.
      </OnboardingHint>
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => <StatCardSkeleton key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard title="Pending Tasks" value={stats.pending} icon={Clock} color="orange" />
          <StatCard title="In Progress" value={stats.processing} icon={ListTodo} color="blue" />
          <StatCard title="Completed" value={stats.completed} icon={CheckCircle} color="green" />
        </div>
      )}
    </div>
  );
}
