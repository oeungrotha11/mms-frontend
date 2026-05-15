import { useEffect, useState } from "react";
import API from "../../api/axios";

import PageHeader from '../../components/admincomponents/PageHeader';
import Badge from '../../components/admincomponents/Badge';
import ActionButtons from '../../components/admincomponents/ActionButtons';
import AdminEditModal from '../../components/admincomponents/AdminEditModal';
import { confirmDialog, showError, showInfo, showSuccess } from '../../utils/swal';

export default function Users() {

  const [users, setUsers] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const userFields = [
    { name: 'username', label: 'Username', type: 'text', placeholder: 'Username' },
    { name: 'email', label: 'Email', type: 'text', placeholder: 'Email address' },
    { name: 'role', label: 'Role', type: 'select', options: ['user', 'admin'] },
    { name: 'status', label: 'Status', type: 'select', options: ['active', 'inactive', 'banned'] },
    { name: 'phone', label: 'Phone', type: 'text', placeholder: 'Phone number' },
    { name: 'profile_picture', label: 'Avatar URL', type: 'text', placeholder: 'Profile picture URL' }
  ];

  // FETCH USERS
  const fetchUsers = async () => {
    try {
      const res = await API.get("/users");
      setUsers(res.data);

    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // STATUS COLOR
  const getStatusColor = (status) => {
    if (status === "active") return "green";
    if (status === "banned") return "red";
    return "gray";
  };

  // ROLE COLOR
  const getRoleColor = (role) => {
    return role === "admin" ? "orange" : "purple";
  };

  const handleViewUser = (user) => {
    showInfo(`User: ${user.username}`, `
      <p><strong>Email:</strong> ${user.email}</p>
      <p><strong>Role:</strong> ${user.role}</p>
      <p><strong>Status:</strong> ${user.status}</p>
      <p><strong>Phone:</strong> ${user.phone || 'N/A'}</p>
      <p><strong>Joined:</strong> ${new Date(user.created_at || user.createdAt).toLocaleDateString()}</p>
    `);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setShowEditModal(true);
  };

  const handleSaveUser = async (updatedUser) => {
    try {
      const res = await API.put(`/users/${updatedUser._id}`, updatedUser);
      setUsers(prev => prev.map(u => u._id === res.data._id ? res.data : u));
      setShowEditModal(false);
      showSuccess("User updated");
    } catch (err) {
      showError(err.response?.data?.message || "Failed to update user");
    }
  };

  const handleDeleteUser = async (id) => {
    const result = await confirmDialog({
      title: "Delete user?",
      text: "This will permanently delete the user.",
      confirmButtonText: "Delete"
    });

    if (!result.isConfirmed) return;

    try {
      await API.delete(`/users/${id}`);
      setUsers(prev => prev.filter(u => u._id !== id));
      showSuccess("User deleted");
    } catch (err) {
      showError(err.response?.data?.message || "Failed to delete user");
    }
  };

  return (
    <div>

      <PageHeader
        title="Users"
        subtitle="Manage registered users"
      >
        <input
          type="text"
          placeholder="Search users…"
          style={{ width: '200px' }}
        />

        <select>
          <option>All Roles</option>
          <option>User</option>
          <option>Admin</option>
        </select>

        <select>
          <option>All Status</option>
          <option>Active</option>
          <option>Banned</option>
        </select>

      </PageHeader>

      <div className="table-card">

        <table>

          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Joined</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>

            {users.length > 0 ? (
              users.map((u) => (

                <tr key={u._id}>

                  {/* USER */}
                  <td>
                    <div className="user-cell">

                      <img
                        src={u.profile_picture}
                        alt=""
                        className="user-avatar-sm"
                        onError={(e) => {
                          e.target.src =
                            `https://ui-avatars.com/api/?name=${u.username}`;
                        }}
                      />

                      <strong>{u.username}</strong>

                    </div>
                  </td>

                  {/* EMAIL */}
                  <td>{u.email}</td>

                  {/* ROLE */}
                  <td>
                    <Badge color={getRoleColor(u.role)}>
                      {u.role}
                    </Badge>
                  </td>

                  {/* JOINED */}
                  <td>
                    {new Date(u.created_at || u.createdAt)
                      .toLocaleDateString()}
                  </td>

                  {/* STATUS */}
                  <td>
                    <Badge color={getStatusColor(u.status)}>
                      {u.status || "active"}
                    </Badge>
                  </td>

                  {/* ACTIONS */}
                  <td>
                    <ActionButtons
                      onView={() => handleViewUser(u)}
                      onEdit={() => handleEditUser(u)}
                      onDelete={() => handleDeleteUser(u._id)}
                    />
                  </td>

                </tr>

              ))
            ) : (
              <tr>
                <td colSpan="6">
                  No users found
                </td>
              </tr>
            )}

          </tbody>

        </table>

      </div>

      <AdminEditModal
        open={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit User"
        submitLabel="Save Changes"
        initialData={editingUser}
        fields={userFields}
        onSave={handleSaveUser}
      />

    </div>
  );
}