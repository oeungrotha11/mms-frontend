import { useState, useEffect } from "react";

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

export default function AdminEditModal({
  open,
  onClose,
  title = "Edit Item",
  submitLabel = "Save Changes",
  initialData = {},
  fields = [],
  onSave
}) {
  const [formData, setFormData] = useState(initialData || {});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData, open]);

  const handleChange = (name, value, type) => {
    const nextValue = type === "number"
      ? value === ""
        ? ""
        : Number(value)
      : value;

    setFormData(prev => ({
      ...prev,
      [name]: nextValue
    }));
  };

  const handleSubmit = () => {
    if (!onSave) return;

    const cleanedData = { ...formData };
    fields.forEach(field => {
      if (field.transform && field.name) {
        cleanedData[field.name] = field.transform(formData[field.name], formData);
      }
    });

    onSave(cleanedData);
  };

  if (!open) return null;

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
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "25px"
          }}
        >
          <h2 style={{ margin: 0 }}>{title}</h2>
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

        <div style={{ display: "flex", flexDirection: "column", gap: "15px", marginBottom: "25px" }}>
          {fields.map(field => {
            const value = formData[field.name] ?? "";
            const selectedValue = field.type === "select"
              ? (value && typeof value === "object" ? value._id ?? value : value)
              : value;

            return (
              <div key={field.name}>
                <label style={labelStyle}>{field.label}</label>

                {field.type === "textarea" ? (
                  <textarea
                    value={selectedValue}
                    onChange={(e) => handleChange(field.name, e.target.value, field.type)}
                    placeholder={field.placeholder || ""}
                    style={{
                      ...inputStyle,
                      minHeight: field.rows ? `${field.rows * 24}px` : "80px",
                      fontFamily: "inherit"
                    }}
                  />
                ) : field.type === "select" ? (
                  <select
                    value={selectedValue}
                    onChange={(e) => handleChange(field.name, e.target.value, field.type)}
                    style={inputStyle}
                  >
                    <option value="">Select {field.label}</option>
                    {Array.isArray(field.options) && field.options.map(option => {
                      const optionValue = typeof option === "object" ? option.value : option;
                      const optionLabel = typeof option === "object" ? option.label : option;
                      return (
                        <option key={optionValue} value={optionValue}>
                          {optionLabel}
                        </option>
                      );
                    })}
                  </select>
                ) : (
                  <input
                    type={field.type || "text"}
                    value={selectedValue}
                    onChange={(e) => handleChange(field.name, e.target.value, field.type)}
                    placeholder={field.placeholder || ""}
                    style={inputStyle}
                  />
                )}
              </div>
            );
          })}
        </div>

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
            {submitLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
