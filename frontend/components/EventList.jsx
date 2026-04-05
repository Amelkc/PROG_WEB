import { LoadingWrap } from './LoadingWrap'
import { useState } from 'react'
import { Link, NavLink } from "react-router-dom";
import { StatusBadge } from './Badge';
import { ErrorBox } from './ErrorBox';
import "./EventList.css";

const MOCK_EVENTS = [
  {
    id: 1,
    title: "React Paris Meetup",
    description: "Monthly frontend community gathering.",
    location: "Paris, France",
    start_datetime: "2026-04-15T18:00:00Z",
    end_datetime: "2026-04-15T21:00:00Z",
    max_participants: 50,
    status: "open",
  },
  {
    id: 2,
    title: "Machine Learning Summit",
    description: "Annual ML research conference.",
    location: "Lyon, France",
    start_datetime: "2026-05-10T09:00:00Z",
    end_datetime: "2026-05-12T18:00:00Z",
    max_participants: 200,
    status: "closed",
  },
  {
    id: 3,
    title: "Deep Learning Workshop",
    description: "Hands-on transformer fine-tuning session.",
    location: "Bordeaux, France",
    start_datetime: null,
    end_datetime: null,
    max_participants: 30,
    status: "postponed",
  },
  {
    id: 4,
    title: "Open Source Hackathon",
    description: "48-hour collaborative coding event.",
    location: "Lille, France",
    start_datetime: "2026-03-01T08:00:00Z",
    end_datetime: "2026-03-03T08:00:00Z",
    max_participants: null,       // ∞ — no participant cap
    status: "cancelled",
  },
  {
    id: 5,
    title: "Computer Vision Seminar",
    description: "Medical imaging and histopathology analysis.",
    location: "Marseille, France",
    start_datetime: "2026-06-20T14:00:00Z",
    end_datetime: "2026-06-20T17:30:00Z",
    max_participants: 80,
    status: "open",
  },
];

function EventList() {
  const [filters, setFilters] = useState({ status: "", location: "", search: "" });
  const [applied, setApplied] = useState({});
 
  const queryStr = Object.entries(applied)
    .filter(([, v]) => v)
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join("&");
 
  {/*const { data, loading, error } = useApi(`/events/${queryStr ? "?" + queryStr : ""}`, [queryStr]);
  const eventsData = data?.results ?? data ?? [];  
  
       !!!!!!!!!!!!!!!!!!!!!!  A DECOMMENTER QUAND API*/}
 
  {/*  A SUPP QUAND API A PARTIR DE ICI */}
  const loading = false;
  const error = null;
  const eventsData = MOCK_EVENTS.filter(ev => {
    const s = applied.search?.toLowerCase() ?? "";
    const matchSearch = !s || ev.title.toLowerCase().includes(s) || ev.location.toLowerCase().includes(s);
    const matchStatus = !applied.status || ev.status === applied.status;
    const matchLocation = !applied.location || ev.location.toLowerCase().includes(applied.location.toLowerCase());
      return matchSearch && matchStatus && matchLocation;
  });
  {/*  JUSQUE ICI */ }
 
  const applyFilters = () => setApplied({ ...filters });
  const clearFilters = () => { setFilters({ status: "", location: "", search: "" }); setApplied({}); };
 
  return (
    <div className='event-list'>
      <div className="page-header">
        <div>
          <h2>Find events to join !</h2>
          <h3>{eventsData.length} event{eventsData.length !== 1 ? "s" : ""} found</h3>
        </div>
      </div>
 
      <div className="filters">
        <div className="event-field">
          <label>Search</label>
          <input placeholder="Title or location…" value={filters.search}
            onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
            onKeyDown={e => e.key === "Enter" && applyFilters()}
            style={{ width: 200 }} />
        </div>
        <div className="event-field">
          <label>Status</label>
          <select value={filters.status} onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}>
            <option value="">All</option>
            <option value="open">Open</option>
            <option value="closed">Closed</option>
            <option value="postponed">Postponed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div className="event-field">
          <label>&nbsp;</label>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="apply-btn" onClick={applyFilters}>Apply</button>
            <button className="clear-btn" onClick={clearFilters}>Clear</button>
          </div>
        </div>
      </div>
 
      {loading && <LoadingWrap />}
      {error && <ErrorBox msg={error} />}
      {!loading && !error && (
        <div className="card" style={{ padding: 0 }}>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Location</th>
                  <th>Start</th>
                  <th>End</th>
                  <th>Capacity</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {eventsData.length === 0 && (
                  <tr><td colSpan={6} className="empty">No events match your filters</td></tr>
                )}
                {eventsData.map(ev => (
                  <tr key={ev.id}>
                    <td><Link to={`/events/${ev.id}`}>{ev.title}</Link></td>
                    <td>{ev.location}</td>
                    <td style={{ whiteSpace: "nowrap" }}>{ev.start_datetime ? new Date(ev.start_datetime).toLocaleDateString() : "—"}</td>
                    <td style={{ whiteSpace: "nowrap" }}>{ev.end_datetime ? new Date(ev.end_datetime).toLocaleDateString() : "—"}</td>
                    <td>{ev.max_participants ?? "∞"}</td>
                    <td><StatusBadge status={ev.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export {EventList}