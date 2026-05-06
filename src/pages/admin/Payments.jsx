import { useEffect, useState } from "react";
import PageHeader from '../../components/admincomponents/PageHeader';
import Badge from '../../components/admincomponents/Badge';
import API from "../../api/axios";

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

  const getStatusColor = (status) => {
    return status === "completed" ? "green" : "red";
  };

  return (
    <div>
      <PageHeader title="Payments" subtitle="Transaction history" />

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
                    <div className="user-cell">
                      <img
                        src={p.user?.profile_picture}
                        className="user-avatar-sm"
                        alt=""
                      />
                      {p.user?.username}
                    </div>
                  </td>

                  {/* PLAN */}
                  <td>{p.plan?.name}</td>

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

                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">No payments found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}