
import { LoadingWrap } from "../components/LoadingWrap";
import { useApi } from "../api/api.jsx"
import { useAuth } from "../context/AuthContext.jsx";
import { Link } from "react-router-dom";
import { EventList } from "../components/EventList.jsx";
import "../style/HomePage.css"
import { Logout } from "../components/Logout.jsx";


export function HomePage() {
  const { user, tokens, refreshToken } = useAuth();
  const { data: regsData, loading: regsLoading, error:regError} = useApi("/registrations/");
  const { data: eventsData, loading: eventsLoading, error:evError } = useApi("/events/");
 
  const regs = regsData?.results ?? regsData ?? [];
  const allEvents = eventsData?.results ?? eventsData ?? [];
 
  const myEventIds = new Set(
    regs.filter(r => r.participant === user?.id).map(r => r.event)
  );
 
  const now = new Date();
  const upcoming = allEvents
    .filter(ev => myEventIds.has(ev.id) && ev.start_datetime && new Date(ev.start_datetime) >= now)
    .sort((a, b) => new Date(a.start_datetime) - new Date(b.start_datetime));
 
  const loading = regsLoading || eventsLoading;
 
 
  return (
  <div>
    <div className="home-hero">
      <Logout></Logout>
     
      <div className="home-hero-title">Hello {user?.first_name} !</div>
      <div className="home-hero-sub">Here are your upcoming registered events.</div>
      <Link to="/events" >
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="1" y="3" width="14" height="12" rx="1.5"/>
          <path d="M5 1v4M11 1v4M1 7h14"/>
        </svg> Browse all events
      </Link>
      {loading && <LoadingWrap />}
      {!loading && ( <EventList data={upcoming}/>)}
      
    </div>
  </div>
);
}