
import { LoadingWrap } from "../components/LoadingWrap";
import { useApi } from "../api/api.jsx"
import { useAuth } from "../context/AuthContext.jsx";
import { Link } from "react-router-dom";
import { EventList } from "../components/EventList/EventList";
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
      <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24" fill="none"> 
        <path fillRule="evenodd" clipRule="evenodd" d="M6 2C6 1.44772 6.44772 1 7 1C7.55228 1 8 1.44772 8 2V3H16V2C16 1.44772 16.4477 1 17 1C17.5523 1 18 1.44772 18 2V3H19C20.6569 3 22 4.34315 22 6V20C22 21.6569 20.6569 23 19 23H5C3.34315 23 2 21.6569 2 20V6C2 4.34315 3.34315 3 5 3H6V2ZM16 5V6C16 6.55228 16.4477 7 17 7C17.5523 7 18 6.55228 18 6V5H19C19.5523 5 20 5.44772 20 6V9H4V6C4 5.44772 4.44772 5 5 5H6V6C6 6.55228 6.44772 7 7 7C7.55228 7 8 6.55228 8 6V5H16ZM4 11V20C4 20.5523 4.44772 21 5 21H19C19.5523 21 20 20.5523 20 20V11H4Z" fill="#ff69b4"/>
      </svg> Browse Events
      </Link>
      {loading && <LoadingWrap />}
      {!loading && ( <EventList data={upcoming}/>)}
      
    </div>
  </div>
);
}