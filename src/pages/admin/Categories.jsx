import PageHeader from '../../components/admincomponents/PageHeader';
import ActionButtons from '../../components/admincomponents/ActionButtons';
import { useEffect, useState } from 'react';

export default function Categories() {

  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: "", description: "" });

 useEffect(() => {
  fetch("http://localhost:5000/api/movies/categories/with-count")
    .then(res => res.json())
    .then(data => {
      // console.log(data); // DEBUG
      setCategories(data);
    })
    .catch(err => console.error(err));
}, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {

      const res = await fetch("http://localhost:5000/api/movies/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      // console.log("Saved:", data);
      if (res.ok) {
        setCategories([...categories, data]);
        setForm({ name: "", description: "" }); // clear form
      } else {
        alert(data.message || "Error saving category");
      }

    } catch (err) {
      console.error(err);
    }
    // setCategories([...categories, data]);
  };

  const handleDelete = async (id) => {
    await fetch(`http://localhost:5000/api/categories/${id}`, {
      method: "DELETE"
    });

    setCategories(categories.filter(c => c._id !== id));
  };

  return (
    <div>
      <PageHeader title="Categories" subtitle="Movie genre categories">
        <button className="btn-primary">+ Add Category</button>
      </PageHeader>

      {/* Add Form */}
      <div className="form-card" style={{ maxWidth: '500px' }}>
        <div className="form-title">Add New Category</div>
        <div className="form-field" style={{ marginBottom: '1rem' }}>
          <label>Category Name *</label>
          <input
            type="text"
            name='name'
            value={form.name}
            onChange={handleChange}
          // placeholder="e.g. Sci-Fi" 
          />
        </div>
        <div className="form-field">
          <label>Description</label>
          <textarea
            name='description'
            value={form.description}
            onChange={handleChange}
            placeholder="Optional description…" style={{ minHeight: '60px' }} />
        </div>
        <div className="form-actions">
          <button className="btn-cancel">Clear</button>
          <button className="btn-primary" onClick={handleSave}>
            Save Category
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Category</th><th>Description</th><th>Movies</th><th>Created At</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c._id}>
                <td><strong>{c.name || 'N/A'}</strong></td>
                <td style={{ color: 'var(--muted)' }}>
                  {c.description}</td>
                <td>{c.movieCount ?? 0}</td>
                <td>
                  {c.created_at
                    ? new Date(c.created_at).toDateString()
                    : "N/A"}
                </td>
                <td>
                  <ActionButtons
                    onEdit={() => { }}
                    onDelete={() => handleDelete(c._id)}
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
