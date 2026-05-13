import PageHeader from '../../components/admincomponents/PageHeader';
import Badge from '../../components/admincomponents/Badge';
import ActionButtons from '../../components/admincomponents/ActionButtons';
import EditMovieModal from '../../components/admincomponents/EditMovieModal';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Movies({ onNavigate }) {

  const [movies, setMovies] = useState([]);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [category, setCategory] = useState("");
  const [quality, setQuality] = useState("");

  const [categories, setCategories] = useState([]);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);

  // ================= DEBOUNCE SEARCH =================
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [category, quality, debouncedSearch]);

  // ================= FETCH MOVIES =================
  const fetchMovies = async () => {

    let url = `http://localhost:5000/api/movies?page=${page}&search=${debouncedSearch}&category=${category}&quality=${quality}`;

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    });

    const data = await res.json();

    setMovies(data.movies || []);
    setTotalPages(data.totalPages || 1);
  };

  useEffect(() => {
    fetchMovies();
  }, [debouncedSearch, category, quality, page]);

// ===========fetch update==========
  const updateMovie = async (updatedMovie) => {

    await fetch(
      `http://localhost:5000/api/movies/${updatedMovie._id}`,
      {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },

        body: JSON.stringify(updatedMovie)
      }
    );

    fetchMovies();

    setShowEditModal(false);
  };

  // ================= FETCH CATEGORIES =================
  useEffect(() => {
    fetch("http://localhost:5000/api/movies/categories")
      .then(res => res.json())
      .then(data => {
        setCategories(Array.isArray(data) ? data : []);
      })
      .catch(() => setCategories([]));
  }, []);

  // ================= DELETE =================
  const handleDelete = async (id, title) => {

    const confirmDelete = window.confirm(`Delete "${title}" ?`);
    if (!confirmDelete) return;

    await fetch(`http://localhost:5000/api/movies/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    });

    setMovies(prev => prev.filter(m => m._id !== id));
    alert("Movie deleted successfully");
  };
  // ================= edit =================
  const handleEdit = (movie) => {
    setEditingMovie(movie);
    setShowEditModal(true);
  };







  return (
    <div>

      <PageHeader
        title="Movies"
        subtitle="Manage all movie content"
      >

        {/* SEARCH */}
        <input
          type="text"
          placeholder="Search movies..."
          style={{ width: '220px' }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* CATEGORY FILTER */}
        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All Categories</option>

          {categories.map(c => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>

        {/* QUALITY FILTER */}
        <select
          value={quality}
          onChange={(e) => {
            setQuality(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All Quality</option>
          <option value="4K">4K</option>
          <option value="HD">HD</option>
        </select>
        <Link to={'/admin/add-movie'}>
          <button
            // onNavigate
            className="btn-primary"
            // onClick={() => onNavigate('add-movie')}
          >
            + Add Movie
          </button>
        </Link>

      </PageHeader>

      {/* TABLE */}
      <div className="table-card" style={{ overflowX: "auto" }}>

        <table>

          <thead>
            <tr>
              <th>Movie</th>
              <th>Category</th>
              <th>Language</th>
              <th>Year</th>
              <th>Duration</th>
              <th>Quality</th>
              <th>Rating</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>

            {movies.map((m) => (

              <tr key={m._id}>

                <td>
                  <div className="td-movie">

                    <div className="movie-thumb-sm">
                      <img src={m.poster_url} alt={m.title} title={m.title} />
                    </div>

                    <div>
                      <div className="movie-title-sm">
                        {m.title}
                      </div>

                      <div className="movie-cat-sm">
                        {new Date(m.created_at).toDateString()}
                      </div>
                    </div>

                  </div>
                </td>

                <td>{m.category?.name}</td>
                <td>{m.language}</td>
                <td>{m.release_year}</td>
                <td>{m.duration} min</td>

                <td>
                  <Badge color="green">
                    {m.quality || "HD"}
                  </Badge>
                </td>

                <td>
                  <span className="star-rating">★</span>{" "}
                  {m.avgRating?.toFixed(1) || "0.0"}
                </td>

                <td>
                  <Badge color={m.status === "Active" ? "green" : "red"}>
                    {m.status}
                  </Badge>
                </td>

                <td>
                  <ActionButtons
                    onEdit={() => handleEdit(m)}

                    onDelete={() => handleDelete(m._id, m.title)}
                  />
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      {/* PAGINATION */}
      <div style={{ marginTop: "15px", display: "flex", gap: "10px" }}>

        <button
          className='underline'
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Prev
        </button>

        <span>
          Page {page} / {totalPages}
        </span>

        <button
          className='underline'
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>

      </div>

      {/* EDIT MOVIE MODAL */}
      <EditMovieModal
        open={showEditModal}
        onClose={() => setShowEditModal(false)}
        movie={editingMovie}
        onSave={updateMovie}
      />
    </div>
  );
}