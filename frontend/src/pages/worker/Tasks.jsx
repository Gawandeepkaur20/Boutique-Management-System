import { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import StatusBadge from '../../components/StatusBadge';
import DataTable from '../../components/DataTable';
import api from '../../services/api';

export default function WorkerTasks() {
  const [orders, setOrders] = useState([]);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ workerStatus: '', workerNotes: '', completedWorkDetails: '' });
  const [measurements, setMeasurements] = useState(null);

  const load = () => api.get('/workers/tasks').then((r) => setOrders(r.data.orders || []));
  useEffect(() => { load(); }, []);

  const openTask = async (order) => {
    setSelected(order);
    setForm({
      workerStatus: order.workerStatus,
      workerNotes: order.workerNotes || '',
      completedWorkDetails: order.completedWorkDetails || '',
    });
    if (order.measurement) {
      const { data } = await api.get(`/measurements/${order.measurement._id || order.measurement}`);
      setMeasurements(data);
    } else if (order.customer?._id) {
      const { data } = await api.get(`/measurements/customer/${order.customer._id}`);
      setMeasurements(data[0] || null);
    }
  };

  const updateStatus = async () => {
    await api.patch(`/workers/tasks/${selected._id}/status`, form);
    setSelected(null);
    load();
  };

  const submitWork = async () => {
    await api.post(`/workers/tasks/${selected._id}/submit`, {
      completedWorkDetails: form.completedWorkDetails,
      workerNotes: form.workerNotes,
    });
    setSelected(null);
    load();
  };

  const columns = [
    { field: 'orderNumber', headerName: 'Order #' },
    { field: 'customer', headerName: 'Customer', render: (r) => r.customer?.user?.name },
    { field: 'workerStatus', headerName: 'Status', render: (r) => <StatusBadge status={r.workerStatus} /> },
    { field: 'status', headerName: 'Order Status', render: (r) => <StatusBadge status={r.status} /> },
    { field: 'items', headerName: 'Items', render: (r) => r.items?.map((i) => i.name).join(', ') },
    {
      field: 'actions', headerName: 'Actions', sortable: false,
      render: (r) => (
        <button className="text-primary-600 text-sm" onClick={() => openTask(r)}>View / Update</button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">My Tasks</h1>
      <div className="card">
        <DataTable columns={columns} rows={orders} />
      </div>

      <Dialog open={!!selected} onClose={() => setSelected(null)} maxWidth="md" fullWidth>
        <DialogTitle>Task: {selected?.orderNumber}</DialogTitle>
        <DialogContent className="space-y-4 pt-2">
          {measurements && (
            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <h3 className="font-semibold mb-2">Customer Measurements</h3>
              <div className="grid grid-cols-4 gap-2 text-sm">
                {['height', 'chest', 'waist', 'shoulder', 'sleeveLength', 'hip', 'neck'].map((k) =>
                  measurements[k] != null && (
                    <div key={k}><span className="capitalize text-gray-500">{k}:</span> {measurements[k]}</div>
                  )
                )}
              </div>
            </div>
          )}

          <select className="input-field" value={form.workerStatus}
            onChange={(e) => setForm({ ...form, workerStatus: e.target.value })}>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
          </select>
          <textarea className="input-field" rows={2} placeholder="Worker notes" value={form.workerNotes}
            onChange={(e) => setForm({ ...form, workerNotes: e.target.value })} />
          <textarea className="input-field" rows={3} placeholder="Completed work details"
            value={form.completedWorkDetails}
            onChange={(e) => setForm({ ...form, completedWorkDetails: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelected(null)}>Close</Button>
          <Button variant="outlined" onClick={updateStatus}>Update Status</Button>
          <Button variant="contained" onClick={submitWork}>Submit to Admin</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
