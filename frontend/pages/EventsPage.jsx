import { LoadingWrap } from '../components/LoadingWrap'
import { useState } from 'react'
import { Link } from "react-router-dom";
import { useApi } from '../api/api';
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
      <Link to="/home" className="back">
       <svg xmlns="http://www.w3.org/2000/svg" width="40px" height="40px" viewBox="0 0 16 16" fill="none">
          <path d="M1 6V15H6V11C6 9.89543 6.89543 9 8 9C9.10457 9 10 9.89543 10 11V15H15V6L8 0L1 6Z" fill="#ffff"/>
      </svg>
    
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