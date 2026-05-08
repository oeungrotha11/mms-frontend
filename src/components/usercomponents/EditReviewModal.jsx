import { useState } from "react";

export default function EditReviewModal({
  open,
  onClose,
  review,
  onSave
}) {

  const [rating, setRating] = useState(review?.rating || 5);
  const [comment, setComment] = useState(review?.comment || "");

  if (!open) return null;

  const handleSubmit = () => {
    onSave({
      rating,
      comment
    });
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
          width: "420px",
          background: "#111827",
          borderRadius: "18px",
          padding: "25px",
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
            marginBottom: "20px"
          }}
        >
          <h2 style={{ margin: 0 }}>✏ Edit Review</h2>

          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              color: "#9ca3af",
              fontSize: "20px",
              cursor: "pointer"
            }}
          >
            ✕
          </button>
        </div>

        {/* RATING */}
        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "8px" }}>
            Rating
          </label>

          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "10px",
              border: "1px solid #374151",
              background: "#1f2937",
              color: "#fff"
            }}
          >
            <option value={1}>1 ⭐</option>
            <option value={2}>2 ⭐⭐</option>
            <option value={3}>3 ⭐⭐⭐</option>
            <option value={4}>4 ⭐⭐⭐⭐</option>
            <option value={5}>5 ⭐⭐⭐⭐⭐</option>
          </select>
        </div>

        {/* COMMENT */}
        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "8px" }}>
            Comment
          </label>

          <textarea
            rows={5}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "10px",
              border: "1px solid #374151",
              background: "#1f2937",
              color: "#fff",
              resize: "none"
            }}
          />
        </div>

        {/* FOOTER */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "10px"
          }}
        >

          <button
            onClick={onClose}
            style={{
              background: "#374151",
              color: "#fff",
              border: "none",
              padding: "10px 16px",
              borderRadius: "10px",
              cursor: "pointer"
            }}
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            style={{
              background: "#22c55e",
              color: "#fff",
              border: "none",
              padding: "10px 16px",
              borderRadius: "10px",
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            Save Changes
          </button>

        </div>

      </div>

    </div>
  );
}