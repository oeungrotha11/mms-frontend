import { useEffect, useState } from "react";
import PageHeader from '../../components/admincomponents/PageHeader';
import Badge from '../../components/admincomponents/Badge';
import ActionButtons from '../../components/admincomponents/ActionButtons';
import API from "../../api/axios";

export default function Subscriptions() {
  const [subs, setSubs] = useState([]);

  // ✅ Fetch subscriptions
  const fetchSubs = async () => {
    try {
      const res = await API.get("/subscriptions");
      setSubs(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSubs();
  }, []);

  // ✅ Cancel subscription
  const handleCancel = async (id) => {
    if (!window.confirm("Cancel this subscription?")) return;

    try {
      await API.put(`/subscriptions/${id}/cancel`);
      fetchSubs();
    } catch (err) {
      console.error(err);
    }
  };

  // 🎨 Status color
  const getStatusColor = (status) => {
    switch (status) {
      case "active": return "green";
      case "expired": return "red";
      case "cancelled": return "gray";
      default: return "purple";
    }
  };

  return (
    <div>
      <PageHeader
        title="Subscriptions"
        subtitle="Active user subscriptions"
      />

      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Plan</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Status</th>
              <th>Auto-Renew</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {subs.length > 0 ? (
              subs.map((s) => (
                <tr key={s._id}>
                  
                  {/* USER */}
                  <td>
                    <div className="user-cell">
                      <img
                        src={s.user?.profile_picture}
                        className="user-avatar-sm"
                        alt="avatar"
                      />
                      {s.user?.username}
                    </div>
                  </td>

                  {/* PLAN */}
                  <td>
                    <Badge color="purple">
                      {s.plan?.name}
                    </Badge>
                  </td>

                  {/* DATES */}
                  <td>
                    {new Date(s.start_date).toLocaleDateString()}
                  </td>

                  <td>
                    {new Date(s.end_date).toLocaleDateString()}
                  </td>

                  {/* STATUS */}
                  <td>
                    <Badge color={getStatusColor(s.status)}>
                      {s.status}
                    </Badge>
                  </td>

                  {/* AUTO RENEW */}
                  <td>
                    {s.auto_renew ? "✅ Yes" : "❌ No"}
                  </td>

                  {/* ACTIONS */}
                  <td>
                    <ActionButtons
                      onDelete={() => handleCancel(s._id)}
                    />
                  </td>

                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">No subscriptions found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}