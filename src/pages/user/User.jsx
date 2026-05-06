import { useEffect, useState } from "react";
import PageHeader from '../../components/admincomponents/PageHeader';
import Badge from '../../components/admincomponents/Badge';
import API from "../../api/axios";

export default function User() {
  const [users, setUsers] = useState([]);
  const [plans, setPlans] = useState([]);

  // fetch users
  const fetchUsers = async () => {
    const res = await API.get("/users");
    setUsers(res.data);
  };

  // fetch plans (for test payment)
  const fetchPlans = async () => {
    const res = await API.get("/subscriptions/plans");
    setPlans(res.data);
  };

  useEffect(() => {
    fetchUsers();
    fetchPlans();
  }, []);

  // 🔥 TEST PAYMENT BUTTON
  const handleTestPay = async (userId, planId) => {
    try {
      await API.post("/payments", {
        userId,
        planId,
        method: "test"
      });

      alert("Payment + Subscription created!");
      fetchUsers();

    } catch (err) {
      console.error(err);
      alert("Failed");
    }
  };

  const getStatusColor = (status) => {
    if (status === "active") return "green";
    if (status === "expired") return "red";
    return "gray";
  };

  return (
    <div>
      <PageHeader title="Users" subtitle="Manage users & subscriptions" />

      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Plan</th>
              <th>Status</th>
              <th>End Date</th>
              <th>Test Pay</th>
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
                        className="user-avatar-sm"
                        alt=""
                        onError={(e) => {
                          e.target.src = "https://ui-avatars.com/api/?name=" + u.username;
                        }}
                      />
                      {u.username}
                    </div>
                  </td>

                  {/* EMAIL */}
                  <td>{u.email}</td>

                  {/* ROLE */}
                  <td>
                    <Badge color={u.role === "admin" ? "orange" : "purple"}>
                      {u.role}
                    </Badge>
                  </td>

                  {/* PLAN */}
                  <td>
                    {u.subscription?.plan?.name || "No Plan"}
                  </td>

                  {/* STATUS */}
                  <td>
                    <Badge color={getStatusColor(u.subscription?.status)}>
                      {u.subscription?.status || "none"}
                    </Badge>
                  </td>

                  {/* END DATE */}
                  <td>
                    {u.subscription
                      ? new Date(u.subscription.end_date).toLocaleDateString()
                      : "-"}
                  </td>

                  {/* TEST PAYMENT */}
                  <td>
                    {plans.map((p) => (
                      <button
                        key={p._id}
                        className="btn-sm"
                        onClick={() => handleTestPay(u._id, p._id)}
                      >
                        {p.name}
                      </button>
                    ))}
                  </td>

                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">No users found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}