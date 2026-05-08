import { useEffect, useState } from "react";
import API from "../../api/axios";

import PageHeader from '../../components/admincomponents/PageHeader';
import Badge from '../../components/admincomponents/Badge';
import ActionButtons from '../../components/admincomponents/ActionButtons';

export default function Users() {

  const [users, setUsers] = useState([]);

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
                      onView={() => console.log("view", u._id)}

                      onDelete={() =>
                        console.log("delete", u._id)
                      }
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

    </div>
  );
}