import { useEffect, useState } from "react";
import PageHeader from '../../components/admincomponents/PageHeader';
import ActionButtons from '../../components/admincomponents/ActionButtons';
import API from "../../api/axios";

const plans = [
  { name: 'Basic', price: '$4.99/mo', duration: '30 days', quality: 'HD', devices: 1, desc: 'Entry-level plan' },
  { name: 'Standard', price: '$9.99/mo', duration: '30 days', quality: 'Full HD + 4K', devices: 2, desc: 'Most popular plan' },
  { name: 'Premium', price: '$14.99/mo', duration: '30 days', quality: '4K Ultra HD', devices: 4, desc: 'All features' },
];

export default function Plans() {
  const [plans, setPlans] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    name: "",
    price: "",
    duration_days: "",
    quality: "",
    devices: "",
    description: ""
  });

  // ✅ Fetch plans
  const fetchPlans = async () => {
    try {
      const res = await API.get("/subscriptions/plans");
      setPlans(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  // ✅ Handle input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Add plan
  const handleAdd = async () => {
    try {
      await API.post("/subscriptions/plans", {
        ...form,
        price: Number(form.price),
        duration_days: Number(form.duration_days),
        devices: Number(form.devices)
      });

      setShowForm(false);
      fetchPlans();

      if (!form.name || !form.price || !form.duration_days || !form.devices) {
        alert("Please fill all required fields");
        return;
      }

      if (isNaN(form.price) || isNaN(form.duration_days) || isNaN(form.devices)) {
        alert("Price, Duration, and Devices must be numbers");
        return;
      }

    } catch (err) {
      console.error(err.response?.data || err);
      alert("Failed to add plan");
    }
  };

  // ✅ Delete plan
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this plan?")) return;

    try {
      await API.delete(`/subscriptions/plans/${id}`);
      fetchPlans();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <PageHeader
        title="Subscription Plans"
        subtitle="Manage pricing and features"
      >
        <button
          className="btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          + Add Plan
        </button>
      </PageHeader>

      {/* ✅ ADD FORM */}
      {showForm && (
        <div className="table-card" style={{ marginBottom: "1rem" }}>
          <div className="form-grid">
            <input name="name" placeholder="Plan Name" onChange={handleChange} title="Plan Name" />
            <input name="price" type="number" placeholder="Price" title="Price" onChange={handleChange} />
            <input name="duration_days" type="number" placeholder="Duration (days)" title="Duration (days)" onChange={handleChange} />
            <input name="devices" type="number" placeholder="Devices" title="Devices" onChange={handleChange} />
            <input name="quality" placeholder="Quality (HD, 4K...)" title="Quality (HD, 4K...)" onChange={handleChange} />
            <input name="description" placeholder="Description" title="Description" onChange={handleChange} />

            <button className="btn-primary" onClick={handleAdd}>
              Save Plan
            </button>
          </div>
        </div>
      )}

      {/* ✅ TABLE */}
      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Plan Name</th>
              <th>Price</th>
              <th>Duration</th>
              <th>Quality</th>
              <th>Devices</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {plans.length > 0 ? (
              plans.map((p) => (
                <tr key={p._id}>
                  <td><strong>{p.name}</strong></td>

                  <td style={{ color: 'var(--accent)', fontWeight: 600 }}>
                    ${p.price}
                  </td>

                  <td>{p.duration_days} days</td>
                  <td>{p.quality}</td>
                  <td>{p.devices}</td>

                  <td style={{ color: 'var(--muted)' }}>
                    {p.description}
                  </td>

                  <td>
                    <ActionButtons
                      onDelete={() => handleDelete(p._id)}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">No plans found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}