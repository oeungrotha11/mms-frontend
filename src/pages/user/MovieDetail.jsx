import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReactPlayer from "react-player";
import Swal from "sweetalert2";
import API from "../../api/axios";
import EditReviewModal from "../../components/usercomponents/EditReviewModal";
import { showInfo, confirmDialog, showSuccess, showError } from "../../utils/swal";

export default function MovieDetail() {

  const { id } = useParams();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [openEdit, setOpenEdit] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);



  const fetchMovie = async () => {

    try {

      const [movieRes, reviewRes] = await Promise.all([
        API.get(`/movies/${id}`),
        API.get(`/reviews/movie/${id}`)
      ]);

      setMovie(movieRes.data);

      setReviews(reviewRes.data);

    } catch (err) {

      console.error(err);

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {

    fetchMovie();

  }, [id]);

  const handleReview = async () => {

    try {

      const user = JSON.parse(localStorage.getItem("user"));

      if (editingId) {

        await API.put(`/reviews/${editingId}`, {
          rating,
          comment
        });

      } else {

        await API.post("/reviews", {

          user_id: user.id,
          movie_id: id,
          rating,
          comment

        });
      }

      alert("Review added");

      setComment("");

      const reviewRes = await API.get(`/reviews/movie/${id}`);

      setReviews(reviewRes.data);

    } catch (err) {

      console.error(err);

      alert("Failed to add review");

    }
  };

  const currentUser = JSON.parse(localStorage.getItem("user"));

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!movie) {
    return <p>Movie not found</p>;
  }

  const handleDelete = async (id) => {

    try {

      await API.delete(`/reviews/${id}`);

      setReviews(
        reviews.filter((r) => r._id !== id)
      );

    } catch (err) {

      console.error(err);

    }
  };

  const handleFlag = async (reviewId) => {
    try {
      const result = await Swal.fire({
        title: "Report this review",
        html: '<p style="text-align: left; margin-bottom: 12px;">Why are you reporting this review?</p>',
        input: "text",
        inputPlaceholder: "e.g., Inappropriate content, Spam, Offensive language",
        showCancelButton: true,
        confirmButtonText: "Report",
        cancelButtonText: "Cancel",
        inputValidator: (value) => {
          if (!value || !value.trim()) {
            return "Please provide a reason";
          }
        }
      });

      if (!result.isConfirmed) return;

      await API.put(`/reviews/${reviewId}/flag`, { reason: result.value });
      showSuccess("Review flagged. Thank you for reporting!");
      fetchMovie();
    } catch (err) {
      console.error(err);
      showError("Failed to flag review");
    }
  };

  const handleEdit = (review) => {

    setSelectedReview(review);

    setOpenEdit(true);

  };

  const handleSaveEdit = async (data) => {

    try {

      await API.put(
        `/reviews/${selectedReview._id}`,
        data
      );

      fetchMovie();

      setOpenEdit(false);

    } catch (err) {

      console.error(err);

    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f1117",
        color: "#fff"
      }}
    >

      {/* HERO */}
      <div
        style={{
          position: "relative",
          height: "70vh",
          overflow: "hidden"
        }}
      >

        <img
          src={movie.poster_url}
          alt={movie.title}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "brightness(0.4)"
          }}
        />

        <div
          style={{
            position: "absolute",
            bottom: "40px",
            left: "40px",
            maxWidth: "600px"
          }}
        >
          <h1
            style={{
              fontSize: "4rem",
              marginBottom: "15px"
            }}
          >
            {movie.title}
          </h1>

          <div
            style={{
              display: "flex",
              gap: "15px",
              marginBottom: "15px",
              color: "#9ca3af"
            }}
          >
            <span>{movie.release_year}</span>
            <span>{movie.duration} min</span>
            <span>
              {movie.category?.name || "No category"}
            </span>
          </div>

          <p
            style={{
              lineHeight: "1.7",
              color: "#d1d5db"
            }}
          >
            {movie.description}
          </p>
        </div>
      </div>

      {/* TRAILER */}
      <div
        style={{
          padding: "40px"
        }}
      >
        <h2
          style={{
            marginBottom: "20px"
          }}
        >
          🎬 Trailer
        </h2>

        <div
          style={{
            borderRadius: "20px",
            overflow: "hidden"
          }}
        >
          {/* <ReactPlayer
            url={movie.trailer_url}
            controls
            width="100%"
            height="600px"
          /> */}
          <iframe
            width="100%"
            height="600"
            src={movie.trailer_url}
            title={movie.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{
              borderRadius: "20px"
            }}
          />
        </div>
      </div>

      <div
        style={{
          padding: "40px"
        }}
      >

        <h2
          style={{
            marginBottom: "20px"
          }}
        >
          ⭐ Reviews
        </h2>

        {/* MOVIE RATING SUMMARY */}
        {movie && (
          <div
            style={{
              background: "#171923",
              padding: "20px",
              borderRadius: "16px",
              marginBottom: "30px",
              display: "flex",
              alignItems: "center",
              gap: "20px"
            }}
          >
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "3rem", color: "#fbbf24", fontWeight: "bold" }}>
                {movie.avgRating ? movie.avgRating.toFixed(1) : "0.0"}
              </div>
              <div style={{ color: "#9ca3af", fontSize: "14px" }}>
                {movie.totalReviews || 0} reviews
              </div>
            </div>
            <div>
              <div style={{ color: "#d1d5db" }}>
                {"★".repeat(Math.round(movie.avgRating || 0))}
                {"☆".repeat(5 - Math.round(movie.avgRating || 0))}
              </div>
              <p style={{ color: "#9ca3af", marginTop: "10px", fontSize: "13px" }}>
                Average rating from {movie.totalReviews || 0} user{(movie.totalReviews || 0) !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        )}

        {/* ADD REVIEW */}

        <div
          style={{
            background: "#171923",
            padding: "20px",
            borderRadius: "16px",
            marginBottom: "30px"
          }}
        >

          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            style={{
              padding: "10px",
              marginBottom: "15px",
              borderRadius: "8px",
              width: "100%"
            }}
          >
            <option value="5">★★★★★</option>
            <option value="4">★★★★☆</option>
            <option value="3">★★★☆☆</option>
            <option value="2">★★☆☆☆</option>
            <option value="1">★☆☆☆☆</option>
          </select>

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your review..."
            rows="4"
            style={{
              width: "100%",
              padding: "15px",
              borderRadius: "10px",
              background: "#0f1117",
              color: "#fff",
              border: "1px solid #2d3748",
              marginBottom: "15px"
            }}
          />

          <button
            onClick={handleReview}
            style={{
              background: "#22c55e",
              color: "#fff",
              border: "none",
              padding: "12px 20px",
              borderRadius: "10px",
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            Submit Review
          </button>

        </div>

        {/* REVIEW LIST */}

        <div
          style={{
            display: "grid",
            gap: "20px"
          }}
        >

          {reviews.length > 0 ? (

            reviews.map((r) => (

              <div
                key={r._id}
                style={{
                  background: "#171923",
                  padding: "20px",
                  borderRadius: "16px"
                }}
              >

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "15px",
                    marginBottom: "15px"
                  }}
                >

                  <img
                    src={
                      r.user_id?.profile_picture ||
                      `https://ui-avatars.com/api/?name=${r.user_id?.username}`
                    }
                    alt=""
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "50%"
                    }}
                  />

                  <div>

                    <div
                      style={{
                        fontWeight: "bold"
                      }}
                    >
                      {r.user_id?.username}
                    </div>

                    <div
                      style={{
                        color: "#facc15"
                      }}
                    >
                      {"★".repeat(r.rating)}
                      {"☆".repeat(5 - r.rating)}
                    </div>

                    <div
                      style={{
                        fontSize: ".8rem",
                        color: "#9ca3af",
                        marginTop: "4px"
                      }}
                    >
                      {new Date(r.review_date).toLocaleString()}
                    </div>

                  </div>

                </div>

                <p
                  style={{
                    color: "#d1d5db",
                    lineHeight: "1.7"
                  }}
                >
                  {r.comment}
                </p>

                {currentUser?.id === r.user_id?._id && (

                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      marginTop: "15px"
                    }}
                  >

                    <button
                      onClick={() => handleEdit(r)}
                      style={{
                        background: "#3b82f6",
                        color: "#fff",
                        border: "none",
                        padding: "8px 14px",
                        borderRadius: "8px",
                        cursor: "pointer"
                      }}
                    >
                      ✏ Edit
                    </button>

                    <button
                      onClick={() => handleDelete(r._id)}
                      style={{
                        background: "#ef4444",
                        color: "#fff",
                        border: "none",
                        padding: "8px 14px",
                        borderRadius: "8px",
                        cursor: "pointer"
                      }}
                    >
                      🗑 Delete
                    </button>

                  </div>

                )}

                <button
                  onClick={() => handleFlag(r._id)}
                  style={{
                    marginTop: "10px",
                    background: "#8b5cf6",
                    color: "#fff",
                    border: "none",
                    padding: "8px 14px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: "0.9rem"
                  }}
                  title="Report inappropriate content"
                >
                  🚩 Report
                </button>


              </div>

            ))

          ) : (

            <p>No reviews yet</p>

          )}

        </div>

      </div>
      <EditReviewModal
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        review={selectedReview}
        onSave={handleSaveEdit}
      />
    </div>
  );
}