import { useEffect, useState } from "react";
import PageHeader from '../../components/admincomponents/PageHeader';
import Badge from '../../components/admincomponents/Badge';
import ActionButtons from '../../components/admincomponents/ActionButtons';
import API from "../../api/axios";
import { confirmDialog, showSuccess, showError } from '../../utils/swal';

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

  const activeSubscriptions = subs.filter((item) => item.status === 'active').length;
  const cancelledSubscriptions = subs.filter((item) => item.status === 'cancelled').length;

  // ✅ Cancel subscription
  const handleCancel = async (id) => {
    const result = await confirmDialog({
      title: "Cancel subscription?",
      text: "This will cancel the subscription immediately.",
      confirmButtonText: "Cancel subscription"
    });

    if (!result.isConfirmed) return;

    try {
      await API.put(`/subscriptions/${id}/cancel`);
      fetchSubs();
      showSuccess("Subscription cancelled");
    } catch (err) {
      console.error(err);
      showError("Failed to cancel subscription");
    }
  };

  // ✅ Delete subscription
  const handleDelete = async (id) => {
    const result = await confirmDialog({
      title: "Delete subscription?",
      text: "This will permanently remove the subscription record.",
      confirmButtonText: "Delete"
    });

    if (!result.isConfirmed) return;

    try {
      await API.put(`/subscriptions/${id}/cancel`);
      fetchSubs();
      showSuccess("Subscription deleted");
    } catch (err) {
      console.error(err);
      showError("Failed to delete subscription");
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

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
        <div className="table-card" style={{ padding: '1rem 1.25rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>Active subscriptions</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--accent)' }}>{activeSubscriptions}</div>
        </div>
        <div className="table-card" style={{ padding: '1rem 1.25rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>Cancelled subscriptions</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 700 }}>{cancelledSubscriptions}</div>
        </div>
        <div className="table-card" style={{ padding: '1rem 1.25rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>Total subscriptions</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#a78bfa' }}>{subs.length}</div>
        </div>
        <div className="table-card" style={{ padding: '1rem 1.25rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>Expiring soon</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#fbbf24' }}>
            {subs.filter(s => {
              const daysLeft = (new Date(s.end_date) - new Date()) / (1000 * 60 * 60 * 24);
              return daysLeft > 0 && daysLeft <= 7 && s.status === 'active';
            }).length}
          </div>
        </div>
      </div>

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
                    <div className="user-cell" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '4px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img
                          src={s.user?.profile_picture}
                          className="user-avatar-sm"
                          alt="avatar"
                        />
                        <strong>{s.user?.username || 'Unknown'}</strong>
                      </div>
                      <span style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>
                        {s.user?.email || 'No email'}
                      </span>
                    </div>
                  </td>

                  {/* PLAN */}
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <strong>{s.plan?.name}</strong>
                      <span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>{s.plan?.quality}</span>
                    </div>
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
                    <Badge color={s.auto_renew ? 'green' : 'gray'}>
                      {s.auto_renew ? 'Yes' : 'No'}
                    </Badge>
                  </td>

                  {/* ACTIONS */}
                  <td>
                    <ActionButtons
                      onEdit={() => handleCancel(s._id)}
                      onDelete={() => handleDelete(s._id)}
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