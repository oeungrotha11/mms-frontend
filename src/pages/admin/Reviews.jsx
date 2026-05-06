import PageHeader from '../../components/admincomponents/PageHeader';
import Badge from '../../components/admincomponents/Badge';
import ActionButtons from '../../components/admincomponents/ActionButtons';

const reviews = [
  { initials: 'JD', user: 'Jane Doe',    movie: 'Dark Meridian', stars: '★★★★★', comment: 'Absolutely gripping…',       date: 'Jan 10, 2024', status: 'green', statusLabel: 'Approved', spam: false },
  { initials: 'MK', user: 'Marcus Kim',  movie: 'Stellar Drift', stars: '★★★☆☆', comment: 'Good but slow paced…',       date: 'Jan 8, 2024',  status: 'green', statusLabel: 'Approved', spam: false },
  { initials: 'BX', user: 'Bob Xander',  movie: 'The Watcher',   stars: '★☆☆☆☆', comment: 'SPAM CONTENT DETECTED',       date: 'Jan 14, 2024', status: 'red',   statusLabel: 'Flagged',  spam: true },
];

export default function Reviews() {
  return (
    <div>
      <PageHeader title="Reviews" subtitle="Moderate user reviews and ratings">
        <select>
          <option>All Reviews</option><option>Flagged</option><option>Approved</option>
        </select>
      </PageHeader>

      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>User</th><th>Movie</th><th>Rating</th><th>Comment</th>
              <th>Date</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((r) => (
              <tr key={r.user + r.movie}>
                <td>
                  <div className="user-cell">
                    <div className="user-avatar-sm">{r.initials}</div>
                    {r.user}
                  </div>
                </td>
                <td>{r.movie}</td>
                <td><span className="star-rating">{r.stars}</span></td>
                <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: r.spam ? 'var(--red)' : 'var(--muted)' }}>
                  {r.comment}
                </td>
                <td>{r.date}</td>
                <td><Badge color={r.status}>{r.statusLabel}</Badge></td>
                <td>
                  <ActionButtons
                    onView={() => {}}
                    onApprove={r.spam ? () => {} : undefined}
                    onDelete={() => {}}
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
