import { useState, useEffect } from "react";

export default function EditMovieModal({
  open,
  onClose,
  movie,
  onSave,
  categories = []
}) 
{

  const inputStyle = {
  width: "100%",
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #374151",
  background: "#1f2937",
  color: "#fff",
  boxSizing: "border-box"
};

const labelStyle = {
  display: "block",
  marginBottom: "8px",
  fontSize: "14px",
  fontWeight: "500"
};

  const [formData, setFormData] = useState(movie || {});

  useEffect(() => {
    if (movie) {
      setFormData(movie);
    }
  }, [movie, open]);

  if (!open || !movie) return null;

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    const cleanedCategory = (() => {
      if (!formData.category) return undefined;
      if (typeof formData.category === "string") {
        const selected = categories.find(c => c._id === formData.category);
        return selected ? { _id: selected._id, name: selected.name } : formData.category;
      }
      if (formData.category._id && formData.category.name) {
        return { _id: formData.category._id, name: formData.category.name };
      }
      return formData.category;
    })();

    const cleanedData = {
      ...formData,
      category: cleanedCategory
    };

    onSave(cleanedData);
  };

  
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.7)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999
      }}
    >
      <div
        style={{
          width: "550px",
          maxHeight: "90vh",
          overflowY: "auto",
          background: "#111827",
          borderRadius: "18px",
          padding: "30px",
          color: "#fff",
          border: "1px solid #1f2937"
        }}
      >
        {/* HEADER */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "25px"
          }}
        >
          <h2 style={{ margin: 0 }}>✏ Edit Movie</h2>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              color: "#9ca3af",
              fontSize: "24px",
              cursor: "pointer",
              padding: 0
            }}
          >
            ✕
          </button>
        </div>

        {/* FORM FIELDS */}
        <div style={{ display: "flex", flexDirection: "column", gap: "15px", marginBottom: "25px" }}>

          {/* Title */}
          <div>
            <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "500" }}>
              Title
            </label>
            <input
              type="text"
              value={formData.title || ''}
              onChange={(e) => handleChange('title', e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #374151",
                background: "#1f2937",
                color: "#fff",
                boxSizing: "border-box"
              }}
            />
          </div>

          {/* Description */}
          <div>
            <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "500" }}>
              Description
            </label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => handleChange('description', e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #374151",
                background: "#1f2937",
                color: "#fff",
                minHeight: "80px",
                boxSizing: "border-box",
                fontFamily: "inherit"
              }}
            />
          </div>

          {/* Language */}
          <div>
            <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "500" }}>
              Language
            </label>
            <select
  value={formData.language || "English"}
  onChange={(e) =>
    handleChange("language", e.target.value)
  }
  style={inputStyle}
>
  <option>English</option>
  <option>French</option>
  <option>Spanish</option>
  <option>Korean</option>
</select>
          </div>

          {/* Release Year & Duration */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "500" }}>
                Release Year
              </label>
              <input
                type="number"
                value={formData.release_year || ''}
                onChange={(e) => handleChange('release_year', parseInt(e.target.value) || 0)}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid #374151",
                  background: "#1f2937",
                  color: "#fff",
                  boxSizing: "border-box"
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "500" }}>
                Duration (min)
              </label>
              <input
                type="number"
                value={formData.duration || ''}
                onChange={(e) => handleChange('duration', parseInt(e.target.value) || 0)}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid #374151",
                  background: "#1f2937",
                  color: "#fff",
                  boxSizing: "border-box"
                }}
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontSize: "14px",
                fontWeight: "500"
              }}
            >
              Category
            </label>

            <select
              value={formData.category?._id || formData.category || ""}
              onChange={(e) => {
                const selected = categories.find(c => c._id === e.target.value);
                handleChange("category", selected || e.target.value);
              }}
              style={inputStyle}
            >
              <option value="">Select Category</option>

              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* File Path */}
<div>
  <label style={labelStyle}>
    File Path
  </label>

  <input
    type="text"
    value={formData.file_path || ""}
    onChange={(e) =>
      handleChange("file_path", e.target.value)
    }
    placeholder="/movies/movie.mp4"
    style={inputStyle}
  />
</div>

{/* File Size */}
<div>
  <label style={labelStyle}>
    File Size (MB)
  </label>

  <input
    type="number"
    value={formData.file_size || ""}
    onChange={(e) =>
      handleChange(
        "file_size",
        parseInt(e.target.value) || 0
      )
    }
    style={inputStyle}
  />
</div>


          {/* Quality & Status */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "500" }}>
                Quality
              </label>
              <select
                value={formData.quality || 'HD'}
                onChange={(e) => handleChange('quality', e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid #374151",
                  background: "#1f2937",
                  color: "#fff",
                  boxSizing: "border-box"
                }}
              >
                <option value="4K">4K</option>
<option value="Full HD">Full HD</option>
<option value="HD">HD</option>
<option value="SD">SD</option>
              </select>
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "500" }}>
                Status
              </label>
              <select
                value={formData.status || 'Active'}
                onChange={(e) => handleChange('status', e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid #374151",
                  background: "#1f2937",
                  color: "#fff",
                  boxSizing: "border-box"
                }}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Poster URL */}
          <div>
            <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "500" }}>
              Poster URL
            </label>
            <input
              type="text"
              value={formData.poster_url || ''}
              onChange={(e) => handleChange('poster_url', e.target.value)}
              placeholder="https://example.com/poster.jpg"
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #374151",
                background: "#1f2937",
                color: "#fff",
                boxSizing: "border-box"
              }}
            />
            {formData.poster_url && (
              <div style={{ marginTop: "12px", textAlign: "center" }}>
                <img
                  src={formData.poster_url}
                  alt="Poster preview"
                  style={{ maxWidth: "100%", maxHeight: "150px", borderRadius: "8px" }}
                  onError={(e) => e.target.style.display = "none"}
                />
              </div>
            )}
          </div>

          {/* Trailer URL */}
          <div>
            <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "500" }}>
              Trailer URL
            </label>
            <input
              type="text"
              value={formData.trailer_url || ''}
              onChange={(e) => handleChange('trailer_url', e.target.value)}
              placeholder="https://youtube.com/embed/..."
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #374151",
                background: "#1f2937",
                color: "#fff",
                boxSizing: "border-box"
              }}
            />
          </div>

        </div>

        {/* BUTTONS */}
        <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
          <button
            onClick={onClose}
            style={{
              padding: "10px 25px",
              borderRadius: "8px",
              border: "1px solid #374151",
              background: "transparent",
              color: "#9ca3af",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "500"
            }}
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            style={{
              padding: "10px 25px",
              borderRadius: "8px",
              border: "none",
              background: "#4f46e5",
              color: "#fff",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "500"
            }}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
