import PageHeader from '../../components/admincomponents/PageHeader';
import Badge from '../../components/admincomponents/Badge';
import ActionButtons from '../../components/admincomponents/ActionButtons';
import AdminEditModal from '../../components/admincomponents/AdminEditModal';
import { confirmDialog, showSuccess, showError } from '../../utils/swal';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Movies() {

  const navigate = useNavigate();

  const [movies, setMovies] = useState([]);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [category, setCategory] = useState("");
  const [quality, setQuality] = useState("");

  const [categories, setCategories] = useState([]);
  const [editingCategory, setEditingCategory] = useState(null);
  const [newName, setNewName] = useState("");

  const [page, setPage] = useState(1);

  const movieFields = [
    { name: 'title', label: 'Title', type: 'text', placeholder: 'Movie title' },
    { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Movie description' },
    { name: 'language', label: 'Language', type: 'select', options: ['English', 'French', 'Spanish', 'Korean'] },
    { name: 'release_year', label: 'Release Year', type: 'number', placeholder: '1991' },
    { name: 'duration', label: 'Duration (min)', type: 'number', placeholder: '120' },
    {
      name: 'category',
      label: 'Category',
      type: 'select',
      options: categories.map(c => ({ value: c._id, label: c.name })),
      transform: value => {
        const selected = categories.find(c => c._id === value);
        return selected ? { _id: selected._id, name: selected.name } : value;
      }
    },
    { name: 'file_path', label: 'File Path', type: 'text', placeholder: '/movies/movie.mp4' },
    { name: 'file_size', label: 'File Size (MB)', type: 'number', placeholder: '0' },
    { name: 'quality', label: 'Quality', type: 'select', options: ['4K', 'Full HD', 'HD', 'SD'] },
    { name: 'status', label: 'Status', type: 'select', options: ['Active', 'Inactive'] },
    { name: 'poster_url', label: 'Poster URL', type: 'text', placeholder: 'https://example.com/poster.jpg' },
    { name: 'trailer_url', label: 'Trailer URL', type: 'text', placeholder: 'https://youtube.com/embed/...'}
  ];
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

  // ================= FETCH CATEGORIES =================
  const fetchCategories = async () => {

  try {

    const res = await fetch(
      "http://localhost:5000/api/movies/categories"
    );

    const data = await res.json();

    setCategories(
      Array.isArray(data) ? data : []
    );

  } catch (err) {

    console.error(err);
    setCategories([]);

  }
};

useEffect(() => {
  fetchCategories();
}, []);
  

  // ================= DELETE =================
  const handleDelete = async (id, title) => {
    const result = await confirmDialog({
      title: `Delete ${title}?`,
      text: "This will remove the movie permanently.",
      confirmButtonText: "Delete"
    });

    if (!result.isConfirmed) return;

    try {
      await fetch(`http://localhost:5000/api/movies/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      setMovies(prev => prev.filter(m => m._id !== id));
      showSuccess("Movie deleted successfully");
    } catch (err) {
      console.error(err);
      showError("Failed to delete movie");
    }
  };
  // ================= edit =================
  const handleEdit = (movie) => {
    setEditingMovie(movie);
    setShowEditModal(true);
  };

  const handleSaveMovie = async (updatedMovie) => {
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
          <div
  style={{
    marginBottom: "20px",
    display: "flex",
    gap: "10px",
    flexWrap: "wrap"
  }}
>

  {categories.map((cat) => (

    <div
      key={cat._id}
      style={{
        background: "#111827",
        padding: "10px 14px",
        borderRadius: "10px",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        color: "white"
      }}
    >

      <span>{cat.name}</span>

      <button
        onClick={() => {
          setEditingCategory(cat);
          setNewName(cat.name);
        }}
        style={{
          border: "none",
          background: "#4f46e5",
          color: "white",
          padding: "5px 10px",
          borderRadius: "6px",
          cursor: "pointer"
        }}
      >
        Edit
      </button>

    </div>

  ))}

</div>
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
<option value="Full HD">Full HD</option>
<option value="HD">HD</option>
<option value="SD">SD</option>
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

              <tr key={m._id}

              >

                <td>
                  <div className="td-movie">

                    <div className="movie-thumb-sm">
                      <img src={m.poster_url} alt={m.title} title={m.title}
                        onClick={() => navigate(`/movies/${m._id}`)}
                        style={{ cursor: "pointer" }} />
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
      <AdminEditModal
        open={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Movie"
        submitLabel="Save Changes"
        initialData={editingMovie}
        fields={movieFields}
        onSave={handleSaveMovie}
      />

      
    </div>
  );
}