import { useEffect, useState } from "react";
import PageHeader from "../../components/admincomponents/PageHeader";
import Badge from "../../components/admincomponents/Badge";
import ActionButtons from "../../components/admincomponents/ActionButtons";
import API from "../../api/axios";

export default function Reviews() {

  const [reviews, setReviews] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(false);

  // FETCH REVIEWS
  const fetchReviews = async () => {
    try {

      setLoading(true);

      const res = await API.get("/reviews");

      setReviews(res.data);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // DELETE REVIEW
  const handleDelete = async (id) => {
    try {

      if (!window.confirm("Delete this review?")) return;

      await API.delete(`/reviews/${id}`);

      fetchReviews();

    } catch (err) {
      console.error(err);
    }
  };

  // APPROVE REVIEW
  const handleApprove = async (id) => {
    try {

      await API.put(`/reviews/${id}/approve`);

      fetchReviews();

    } catch (err) {
      console.error(err);
    }
  };

  // FILTER
  const filteredReviews = reviews.filter((r) => {

    if (filter === "approved") {
      return r.status === "approved";
    }

    if (filter === "flagged") {
      return r.status === "flagged";
    }

    return true;
  });

  // STARS
  const renderStars = (rating) => {
    return "★".repeat(rating) + "☆".repeat(5 - rating);
  };

  // BADGE COLOR
  const getBadgeColor = (status) => {
    if (status === "approved") return "green";
    if (status === "flagged") return "red";
    return "gray";
  };

  return (
    <div>

      {/* HEADER */}
      <PageHeader
        title="Reviews"
        subtitle="Moderate user reviews and ratings"
      >

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All Reviews</option>
          <option value="approved">Approved</option>
          <option value="flagged">Flagged</option>
        </select>

      </PageHeader>

      {/* TABLE */}
      <div className="table-card">

        <table>

          <thead>
            <tr>
              <th>User</th>
              <th>Movie</th>
              <th>Rating</th>
              <th>Comment</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>

            {loading ? (

              <tr>
                <td colSpan="7">Loading...</td>
              </tr>

            ) : filteredReviews.length > 0 ? (

              filteredReviews.map((r) => (

                <tr key={r._id}>

                  {/* USER */}
                  <td>
                    <div className="user-cell">

                      <img
                        src={r.user?.profile_picture}
                        alt=""
                        className="user-avatar-sm"
                        onError={(e) => {
                          e.target.src =
                            `https://ui-avatars.com/api/?name=${r.user?.username}`;
                        }}
                      />

                      <div>
                        <div style={{ fontWeight: 600 }}>
                          {r.user?.username}
                        </div>

                        <div
                          style={{
                            fontSize: ".75rem",
                            color: "var(--muted)"
                          }}
                        >
                          {r.user?.email}
                        </div>
                      </div>

                    </div>
                  </td>

                  {/* MOVIE */}
                  <td>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: ".7rem"
                      }}
                    >

                      <img
                        src={r.movie?.poster_url}
                        alt=""
                        style={{
                          width: "45px",
                          height: "60px",
                          objectFit: "cover",
                          borderRadius: "8px"
                        }}
                      />

                      <div>
                        <div style={{ fontWeight: 600 }}>
                          {r.movie?.title}
                        </div>

                        <div
                          style={{
                            fontSize: ".75rem",
                            color: "var(--muted)"
                          }}
                        >
                          {r.movie?.release_year}
                        </div>
                      </div>

                    </div>

                  </td>

                  {/* RATING */}
                  <td>

                    <span
                      style={{
                        color: "#facc15",
                        fontSize: "1rem",
                        letterSpacing: "1px"
                      }}
                    >
                      {renderStars(r.rating)}
                    </span>

                  </td>

                  {/* COMMENT */}
                  <td>

                    <div
                      style={{
                        maxWidth: "250px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        color:
                          r.status === "flagged"
                            ? "var(--red)"
                            : "var(--muted)"
                      }}
                    >
                      {r.comment}
                    </div>

                  </td>

                  {/* DATE */}
                  <td>

                    {new Date(r.createdAt).toLocaleDateString()}

                  </td>

                  {/* STATUS */}
                  <td>

                    <Badge color={getBadgeColor(r.status)}>
                      {r.status}
                    </Badge>

                  </td>

                  {/* ACTIONS */}
                  <td>

                    <ActionButtons

                      onView={() => {
                        alert(r.comment);
                      }}

                      onApprove={
                        r.status === "flagged"
                          ? () => handleApprove(r._id)
                          : undefined
                      }

                      onDelete={() => handleDelete(r._id)}

                    />

                  </td>

                </tr>
              ))

            ) : (

              <tr>
                <td colSpan="7">
                  No reviews found
                </td>
              </tr>

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}