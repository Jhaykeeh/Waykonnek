import { Badge, DataTable } from '../ui';
import Card from '../Card';

export default function AdminAdminsTable({ admins }) {
  const columns = [
    { label: 'Name', key: 'name', width: '1.5fr', render: (value) => <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#F0E9B5', fontFamily: 'Inter, sans-serif' }}>{value}</span> },
    { label: 'Email', key: 'email', width: '1.5fr', render: (value) => <span style={{ fontSize: '12px', color: '#D8C57F', fontFamily: 'Inter, sans-serif' }}>{value}</span> },
    { label: 'Role', key: 'role', width: '1fr', render: (value) => <span style={{ fontSize: '12px', color: '#F0E9B5', fontFamily: 'Inter, sans-serif', fontWeight: 'bold' }}>{value}</span> },
    { label: 'Last Login', key: 'lastLogin', width: '1fr', mono: true },
    { label: 'Status', key: 'status', width: '80px', render: (_, row) => <Badge status={row.status} /> },
  ];

  return (
    <Card style={{ padding: 0 }}>
      <DataTable columns={columns} data={admins} />
    </Card>
  );
}
