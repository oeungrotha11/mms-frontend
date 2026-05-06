import PageHeader from '../../components/admincomponents/PageHeader';
import Badge from '../../components/admincomponents/Badge';
import ActionButtons from '../../components/admincomponents/ActionButtons';
import { useEffect, useState } from 'react';

// const movies = [
//   { icon: '🎭', title: 'Dark Meridian',  uploaded: 'Uploaded Jan 12, 2024', category: 'Thriller', lang: 'English', year: 2024, duration: '2h 4m',  quality: 'purple', qualityLabel: '4K', rating: '8.2', status: 'green',  statusLabel: 'Active' },
//   { icon: '🚀', title: 'Stellar Drift',  uploaded: 'Uploaded Dec 18, 2023', category: 'Sci-Fi',   lang: 'English', year: 2023, duration: '1h 58m', quality: 'green',  qualityLabel: 'HD', rating: '7.9', status: 'green',  statusLabel: 'Active' },
//   { icon: '👁',  title: 'The Watcher',   uploaded: 'Uploaded Jan 14, 2024', category: 'Horror',   lang: 'English', year: 2024, duration: '2h 12m', quality: 'purple', qualityLabel: '4K', rating: '8.5', status: 'yellow', statusLabel: 'Pending' },
//   { icon: '🌿', title: 'Green Solitude', uploaded: 'Uploaded Nov 5, 2023',  category: 'Drama',    lang: 'French',  year: 2023, duration: '1h 42m', quality: 'green',  qualityLabel: 'HD', rating: '7.3', status: 'green',  statusLabel: 'Active' },
//   { icon: '🔥', title: 'Inferno Lane',   uploaded: 'Uploaded Jan 2, 2024',  category: 'Action',   lang: 'English', year: 2024, duration: '2h 6m',  quality: 'purple', qualityLabel: '4K', rating: '8.0', status: 'red',    statusLabel: 'Inactive' },
// ];

export default function Movies({ onNavigate }) {

  const [movies, setMovies] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/movies", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(res => res.json())
      .then(data => setMovies(data));
  }, []);

  const handleDelete = async (id) => {
    await fetch(`http://localhost:5000/api/movies/${id}`, {
      method: "DELETE"
    });

    setMovies(movies.filter(m => m._id !== id));
  };

  return (
    <div>
      <PageHeader title="Movies" subtitle="Manage all movie content">
        <input type="text" placeholder="Search movies…" style={{ width: '200px' }} />
        <select><option>All Categories</option><option>Action</option><option>Thriller</option><option>Drama</option></select>
        <select><option>All Quality</option><option>4K</option><option>HD</option></select>
        <button className="btn-primary" onClick={() => onNavigate('add-movie')}>+ Add Movie</button>
      </PageHeader>

      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Movie</th><th>Category</th><th>Language</th><th>Year</th>
              <th>Duration</th><th>Quality</th><th>Rating</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {movies.map((m) => (
              <tr key={m._id}>
                <td>
                  <div className="td-movie">
                    <div className="movie-thumb-sm">🎬</div>
                    <div>
                      <div className="movie-title-sm">{m.title}</div>
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
                  <Badge color="green">{m.quality || "HD"}</Badge>
                </td>

                <td>
                  <span className="star-rating">★</span> 8.0
                </td>

                <td>
                  <Badge color="green">Active</Badge>
                </td>

                <td>
                  <ActionButtons
                    onEdit={() => { }}
                    onDelete={() => handleDelete(m._id)}
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
