import PageHeader from '../../components/admincomponents/PageHeader';

const history = [
  { initials: 'JD', user: 'Jane Doe',   icon: '🎭', movie: 'Dark Meridian', watchedAt: 'Jan 14, 2024 · 9:22 PM',  duration: '1h 16m (62%)',  device: 'Desktop' },
  { initials: 'MK', user: 'Marcus Kim', icon: '🚀', movie: 'Stellar Drift', watchedAt: 'Jan 13, 2024 · 8:00 PM',  duration: '1h 40m (85%)',  device: 'Mobile' },
  { initials: 'AL', user: 'Anna Lee',   icon: '🔥', movie: 'Inferno Lane',  watchedAt: 'Jan 11, 2024 · 7:30 PM',  duration: '2h 6m (100%)',  device: 'Tablet' },
];

export default function WatchHistory() {
  return (
    <div>
      <PageHeader title="Watch History" subtitle="User viewing analytics" />
      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>User</th><th>Movie</th><th>Watched At</th><th>Duration Watched</th><th>Device</th>
            </tr>
          </thead>
          <tbody>
            {history.map((h, i) => (
              <tr key={i}>
                <td>
                  <div className="user-cell">
                    <div className="user-avatar-sm">{h.initials}</div>
                    {h.user}
                  </div>
                </td>
                <td>
                  <div className="td-movie">
                    <div className="movie-thumb-sm" style={{ width: '28px', height: '38px', fontSize: '.9rem' }}>{h.icon}</div>
                    <div className="movie-title-sm">{h.movie}</div>
                  </div>
                </td>
                <td>{h.watchedAt}</td>
                <td>{h.duration}</td>
                <td>{h.device}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
