import { useState } from "react";
import { useApi } from "../api/api";
import { LoadingWrap } from "../components/LoadingWrap/LoadingWrap";
import { ErrorBox } from "../components/ErrorBox/ErrorBox";
import { StatusBadge } from "../components/Badge/Badge";

export function ParticipantsPage() {
  const [search, setSearch] = useState("");
  const { data, loading, error } = useApi("/participants/");
  const participants = data?.results ?? data ?? [];
 
  const filtered = participants.filter(p =>
    !search ||
    `${p.first_name} ${p.last_name} ${p.email}`.toLowerCase().includes(search.toLowerCase())
  );
 
  return (
  <div className="participants-page">

    <header className="page-header">
      <h2 className="page-title">Participants</h2>
      <p className="page-sub">{filtered.length} participant{filtered.length !== 1 ? "s" : ""}</p>
    </header>

    <div className="field">
      <label htmlFor="participant-search">Search</label>
      <input
        id="participant-search"
        placeholder="Name or email…"
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="search-input"
      />
    </div>

    {loading && <LoadingWrap />}
    {error   && <ErrorBox msg={error} />}

    {!loading && !error && (
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Participant</th>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={4} className="empty">No participants found</td></tr>
            ) : (
              filtered.map(p => (
                <tr key={p.id}>
                  <td>
                    <div className="participant-cell">
                      <span className="participant-name">{p.first_name} {p.last_name}</span>
                    </div>
                  </td>
                  <td>{p.username}</td>
                  <td>{p.email}</td>
                  <td>
                    <StatusBadge status={p.is_staff ? "Admin" : "Viewer"}></StatusBadge>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    )}

  </div>
);
 
}