import { useEffect, useState } from 'react';
import PageHeader from '../../components/admincomponents/PageHeader';

export default function AddMovie() {

  const [form, setForm] = useState({
    title: "",
    description: "",
    release_year: "",
    duration: "",
    language: "English",
    category: "Action",
    poster_url: "",
    trailer_url: "",
    file_path: "",
    quality: "4K",
    file_size: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const movieData = {
      ...form,
      release_year: Number(form.release_year),
      duration: Number(form.duration),
      file_size: Number(form.file_size),

      category: selectedCategory, // from DB (next step)
    };

    console.log(movieData); // DEBUG

    const res = await fetch("http://localhost:5000/api/movies", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify(movieData)
    });


    const data = await res.json();
    console.log("Saved:", data);

  };
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/movies/categories")
      .then(res => res.json())
      .then(data => {
        setCategories(data);
        setSelectedCategory(data[0]);
      });
  }, []);

  return (
    <div>
      <PageHeader title="Add New Movie" subtitle="Fill in movie details and upload files" />

      {/* Movie Info */}
      <div className="form-card">
        <div className="form-title">Movie Information</div>
        <div className="form-grid">
          <div className="form-field full">
            <label>Movie Title *</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Enter movie title"
            />
          </div>
          <div className="form-field full">
            <label>Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder='Enter description'
            />
          </div>
          <div className="form-field">
            <label>Release Year *</label>
            <input
              name="release_year"
              type="number"
              value={form.release_year}
              onChange={handleChange}
              placeholder='2026'
            />
          </div>
          <div className="form-field">
            <label>Duration (minutes) *</label>
            <input
              name="duration"
              type="number"
              value={form.duration}
              onChange={handleChange}
              placeholder="120"
            />
          </div>
          <div className="form-field">
            <label>Language</label>
            <select name="language" value={form.language} onChange={handleChange}>
              <option>English</option>
              <option>French</option>
              <option>Spanish</option>
              <option>Korean</option>
            </select>
          </div>
          <div className="form-field">
            <label>Category *</label>
            <select
              onChange={(e) => {
                const cat = categories.find(c => c._id === e.target.value);
                setSelectedCategory(cat);
              }}
            >
              {categories.map(c => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-field full">
            <label>Poster URL</label>
            <input
              name="poster_url"
              value={form.poster_url}
              onChange={handleChange}
              placeholder="https://…"
            />
          </div>
          <div className="form-field full">
            <label>Trailer URL *</label>
            <input
              name="trailer_url"
              value={form.trailer_url}
              onChange={handleChange}
              placeholder="https://youtube.com/…" />
          </div>
        </div>
      </div>

      {/* Movie Files */}
      <div className="form-card">
        <div className="form-title">Movie Files</div>
        <div className="form-grid three">
          <div className="form-field">
            <label>File Path *</label>
            <input
              name="file_path"
              value={form.file_path}
              onChange={handleChange}
              placeholder="/movies/filename.mp4" />
          </div>
          <div className="form-field">
            <label>Video Quality *</label>
            <select name="quality" value={form.quality} onChange={handleChange}>
              <option>4K</option>
              <option>Full HD</option>
              <option>HD</option>
              <option>SD</option>
            </select>
          </div>
          <div className="form-field">
            <label>File Size (MB)</label>
            <input
              name="file_size"
              type="number"
              value={form.file_size}
              onChange={handleChange}
              placeholder="4200" />
          </div>
        </div>
      </div>

      {/* Cast */}
      <div className="form-card">
        <div className="form-actions">
          <button className="btn-cancel">Cancel</button>
          <button className="btn-primary" onClick={handleSave}>
            Save Movie
          </button>
        </div>
      </div>
    </div>
  );
}
