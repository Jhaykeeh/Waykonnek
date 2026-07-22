import { Badge, Button, DataTable } from '../ui';
import Card from '../Card';

export default function AdminUsersTable({ users, onSuspend, onDelete }) {
  const columns = [
    { label: 'Student', key: 'name', width: '1.5fr', render: (value) => <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#F0E9B5', fontFamily: 'Inter, sans-serif' }}>{value}</span> },
    { label: 'School ID', key: 'schoolId', width: '1fr', mono: true },
    { label: 'Devices', key: 'devices', width: '80px', mono: true, render: (value) => <span style={{ textAlign: 'center', display: 'block' }}>{value}</span> },
    { label: 'Usage', key: 'usage', width: '100px', mono: true },
    { label: 'Status', key: 'status', width: '100px', render: (_, row) => <Badge status={row.status} /> },
    { label: 'Action', key: 'action', width: '100px', render: (_, row) => (
      <Button
        variant={row.suspended ? 'primary' : 'danger'}
        padding="7px 12px"
        fontSize="12px"
        onClick={() => onSuspend(row.id)}
      >
        {row.suspended ? '✓ Restore' : '⊘ Suspend'}
      </Button>
    ) },
    { label: 'Delete', key: 'delete', width: '80px', render: (_, row) => (
      <Button
        variant="danger"
        padding="7px 12px"
        fontSize="12px"
        onClick={() => onDelete(row.id)}
      >
        Delete
      </Button>
    ) },
  ];

  return (
    <Card style={{ padding: 0 }}>
      <DataTable columns={columns} data={users} />
    </Card>
  );
}
