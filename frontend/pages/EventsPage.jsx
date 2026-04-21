import { LoadingWrap } from '../components/LoadingWrap/LoadingWrap'
import { useState } from 'react'
import { Link } from "react-router-dom";
import { useApi } from '../api/api';
import { ErrorBox } from '../components/ErrorBox/ErrorBox';
import { EventList } from '../components/EventList/EventList';
import { useAuth } from "../context/AuthContext";
import "../components/EventList/EventList.css";


function EventsPage() {
  const [filters, setFilters] = useState({ status: "", location: "", search: "" });
  const [applied, setApplied] = useState({});
  const { user } = useAuth();
 
  const queryStr = Object.entries(applied)
    .filter(([, v]) => v)
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join("&");
 
  const { data, loading, error } = useApi(`/events/${queryStr ? "?" + queryStr : ""}`, [queryStr]);
  const eventsData = data?.results ?? data ?? [];  
  const isAdmin = user?.is_staff || user?.is_superuser;
 
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
        <div className="filters-left">
          <div className="event-field">
            <label>Search</label>
            <input
              placeholder="Title or location…"
              value={filters.search}
              onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
              onKeyDown={e => e.key === "Enter" && applyFilters()}
            />
          </div>

          <div className="event-field">
            <label>Status</label>
            <select
              value={filters.status}
              onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}
            >
              <option value="">All</option>
              <option value="open">Open</option>
              <option value="closed">Closed</option>
              <option value="postponed">Postponed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="event-field">
            <label>&nbsp;</label>
            <div className="event-actions">
              <button className="apply-btn" onClick={applyFilters}>Apply</button>
              <button className="clear-btn" onClick={clearFilters}>Clear</button>
            </div>
          </div>
        </div>

        {isAdmin && (
          <div className="filters-right">
            <label>&nbsp;</label>
            <Link to="/admin/events/create" className="admin-add-btn">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Add
            </Link>
          </div>
        )}
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