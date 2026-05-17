import { useEffect, useState } from "react";
import PageHeader from '../../components/admincomponents/PageHeader';
import Badge from '../../components/admincomponents/Badge';
import ActionButtons from '../../components/admincomponents/ActionButtons';
import API from "../../api/axios";
import { showInfo, showError } from '../../utils/swal';

export default function Payments() {
  const [payments, setPayments] = useState([]);

  const fetchPayments = async () => {
    try {
      const res = await API.get("/payments");
      setPayments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const totalRevenue = payments.reduce((sum, payment) => sum + (payment.amount || 0), 0);
  const totalTransactions = payments.length;

  const getStatusColor = (status) => {
    return status === "completed" ? "green" : "red";
  };

  const handleViewPayment = (payment) => {
    showInfo(`Payment ${payment._id.slice(-6)}`, `
      <p><strong>User:</strong> ${payment.user?.username || 'N/A'}</p>
      <p><strong>Email:</strong> ${payment.user?.email || 'N/A'}</p>
      <p><strong>Plan:</strong> ${payment.plan?.name || 'N/A'}</p>
      <p><strong>Amount:</strong> $${payment.amount}</p>
      <p><strong>Method:</strong> ${payment.method}</p>
      <p><strong>Status:</strong> ${payment.status}</p>
    `);
  };

  return (
    <div>
      <PageHeader title="Payments" subtitle="Transaction history" />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
        <div className="table-card" style={{ padding: '1rem 1.25rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>Total Revenue</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--accent)' }}>${totalRevenue.toFixed(2)}</div>
        </div>
        <div className="table-card" style={{ padding: '1rem 1.25rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>Transactions</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 700 }}>{totalTransactions}</div>
        </div>
      </div>

      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Transaction</th>
              <th>User</th>
              <th>Plan</th>
              <th>Amount</th>
              <th>Method</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {payments.length > 0 ? (
              payments.map((p) => (
                <tr key={p._id}>
                  
                  {/* TXN */}
                  <td style={{ fontSize: ".75rem" }}>
                    {p._id.slice(-6)}
                  </td>

                  {/* USER */}
                  <td>
                    <div className="user-cell" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '4px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img
                          src={p.user?.profile_picture}
                          className="user-avatar-sm"
                          alt=""
                        />
                        <strong>{p.user?.username || 'Unknown'}</strong>
                      </div>
                      <span style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>
                        {p.user?.email || 'No email'}
                      </span>
                    </div>
                  </td>

                  {/* PLAN */}
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <strong>{p.plan?.name || 'Unknown plan'}</strong>
                      <span style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>
                        {p.plan?.quality || 'N/A'}
                      </span>
                    </div>
                  </td>

                  {/* AMOUNT */}
                  <td style={{ color: 'var(--accent)', fontWeight: 600 }}>
                    ${p.amount}
                  </td>

                  {/* METHOD */}
                  <td>{p.method}</td>

                  {/* DATE */}
                  <td>
                    {new Date(p.created_at).toLocaleDateString()}
                  </td>

                  {/* STATUS */}
                  <td>
                    <Badge color={getStatusColor(p.status)}>
                      {p.status}
                    </Badge>
                  </td>

                  <td>
                    <ActionButtons onView={() => handleViewPayment(p)} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8">No payments found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}