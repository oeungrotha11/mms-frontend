import { useEffect, useState } from "react";
import PageHeader from '../../components/admincomponents/PageHeader';
import ActionButtons from '../../components/admincomponents/ActionButtons';
import AdminEditModal from '../../components/admincomponents/AdminEditModal';
import { confirmDialog, showError, showSuccess } from '../../utils/swal';
import API from "../../api/axios";

export default function Plans() {
  const [plans, setPlans] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);

  const [form, setForm] = useState({
    name: "",
    price: "",
    duration_days: "",
    quality: "",
    devices: "",
    description: ""
  });

  const planFields = [
    { name: 'name', label: 'Plan Name', type: 'text', placeholder: 'Enter plan name' },
    { name: 'price', label: 'Price', type: 'number', placeholder: 'Price' },
    { name: 'duration_days', label: 'Duration (days)', type: 'number', placeholder: 'Duration' },
    { name: 'quality', label: 'Quality', type: 'text', placeholder: 'Quality' },
    { name: 'devices', label: 'Devices', type: 'number', placeholder: 'Devices' },
    { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Description' }
  ];

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
    if (!form.name || !form.price || !form.duration_days || !form.devices) {
      showError("Please fill all required fields");
      return;
    }

    if (isNaN(form.price) || isNaN(form.duration_days) || isNaN(form.devices)) {
      showError("Price, Duration, and Devices must be numbers");
      return;
    }

    try {
      await API.post("/subscriptions/plans", {
        ...form,
        price: Number(form.price),
        duration_days: Number(form.duration_days),
        devices: Number(form.devices)
      });

      setShowForm(false);
      setForm({ name: "", price: "", duration_days: "", quality: "", devices: "", description: "" });
      fetchPlans();
      showSuccess("Plan added");
    } catch (err) {
      console.error(err.response?.data || err);
      showError(err.response?.data?.message || "Failed to add plan");
    }
  };

  const handleEditPlan = (plan) => {
    setEditingPlan(plan);
    setShowEditModal(true);
  };

  const handleSavePlan = async (updatedPlan) => {
    try {
      const res = await API.put(`/subscriptions/plans/${updatedPlan._id}`, {
        ...updatedPlan,
        price: Number(updatedPlan.price),
        duration_days: Number(updatedPlan.duration_days),
        devices: Number(updatedPlan.devices)
      });
      setPlans(prev => prev.map(p => p._id === res.data._id ? res.data : p));
      setShowEditModal(false);
      showSuccess("Plan updated");
    } catch (err) {
      console.error(err.response?.data || err);
      showError(err.response?.data?.message || "Failed to update plan");
    }
  };

  // ✅ Delete plan
  const handleDelete = async (id) => {
    const result = await confirmDialog({
      title: "Delete plan?",
      text: "This will permanently delete the plan.",
      confirmButtonText: "Delete"
    });

    if (!result.isConfirmed) return;

    try {
      await API.delete(`/subscriptions/plans/${id}`);
      fetchPlans();
      showSuccess("Plan deleted");
    } catch (err) {
      console.error(err);
      showError("Failed to delete plan");
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
                      onEdit={() => handleEditPlan(p)}
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

      <AdminEditModal
        open={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Plan"
        submitLabel="Save Changes"
        initialData={editingPlan}
        fields={planFields}
        onSave={handleSavePlan}
      />
    </div>
  );
}