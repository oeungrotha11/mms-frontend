import PageHeader from '../../components/admincomponents/PageHeader';
import Badge from '../../components/admincomponents/Badge';
import ActionButtons from '../../components/admincomponents/ActionButtons';

const users = [
  { initials: 'JD', name: 'Jane Doe',    email: 'jane.doe@email.com', phone: '+1 555 0102', role: 'purple', roleLabel: 'User',  joined: 'Jan 14, 2024', status: 'green', statusLabel: 'Active', banned: false },
  { initials: 'MK', name: 'Marcus Kim',  email: 'm.kim@email.com',    phone: '+1 555 0183', role: 'purple', roleLabel: 'User',  joined: 'Dec 28, 2023', status: 'green', statusLabel: 'Active', banned: false },
  { initials: 'AL', name: 'Anna Lee',    email: 'anna.l@email.com',   phone: '—',           role: 'orange', roleLabel: 'Admin', joined: 'Jan 1, 2023',  status: 'green', statusLabel: 'Active', banned: false },
  { initials: 'BX', name: 'Bob Xander',  email: 'bobx@email.com',     phone: '+1 555 0099', role: 'purple', roleLabel: 'User',  joined: 'Nov 10, 2023', status: 'red',   statusLabel: 'Banned', banned: true },
];

export default function Users() {
  return (
    <div>
      <PageHeader title="Users" subtitle="Manage registered users">
        <input type="text" placeholder="Search users…" style={{ width: '200px' }} />
        <select><option>All Roles</option><option>User</option><option>Admin</option></select>
        <select><option>All Status</option><option>Active</option><option>Banned</option></select>
      </PageHeader>

      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>User</th><th>Email</th><th>Phone</th><th>Role</th>
              <th>Joined</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.name}>
                <td>
                  <div className="user-cell">
                    <div className="user-avatar-sm">{u.initials}</div>
                    <strong>{u.name}</strong>
                  </div>
                </td>
                <td>{u.email}</td>
                <td>{u.phone}</td>
                <td><Badge color={u.role}>{u.roleLabel}</Badge></td>
                <td>{u.joined}</td>
                <td><Badge color={u.status}>{u.statusLabel}</Badge></td>
                <td>
                  <ActionButtons
                    onView={() => {}}
                    onApprove={u.banned ? () => {} : undefined}
                    onDelete={!u.banned ? () => {} : undefined}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
