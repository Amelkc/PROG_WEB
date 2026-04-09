import { LoadingWrap } from '../components/LoadingWrap'
import { useState } from 'react'
import { Link, NavLink } from "react-router-dom";
import { StatusBadge } from '../components/Badge';
import { ErrorBox } from '../components/ErrorBox';
import { EventList } from '../components/EventList';
import "../style/EventList.css";


function EventsPage() {
  const [filters, setFilters] = useState({ status: "", location: "", search: "" });
  const [applied, setApplied] = useState({});
 
  const queryStr = Object.entries(applied)
    .filter(([, v]) => v)
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join("&");
 
  const { data, loading, error } = useApi(`/events/${queryStr ? "?" + queryStr : ""}`, [queryStr]);
  const eventsData = data?.results ?? data ?? [];  

 
  const applyFilters = () => setApplied({ ...filters });
  const clearFilters = () => { setFilters({ status: "", location: "", search: "" }); setApplied({}); };
 
  return (
    <div className='event-list'>
      <div className='back-link'>
      <Link to="/dashboard" className="back">
       <svg width="50px" height="50px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M15 7L10 12L15 17" stroke="#ffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        Back to dashboard
      </svg>
        Back to dashboard
      </Link>
      </div>
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
        
        <EventList data={eventsData}></EventList>
      )}
    </div>
  );
}

export {EventsPage}