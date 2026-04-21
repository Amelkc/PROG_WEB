import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Header.css";

function Header(){
    const [menuOpen, setMenuOpen] = useState(false);
    const { user } = useAuth();

    const isAdmin = user?.is_staff || user?.is_superuser;
    return (

    <header className="app-header">

     <nav>
      <div className="header-left">
      <Link to="/" className="header-title">
        EventHub
      </Link>
      </div>
      <div className="header-menu" onClick={() => setMenuOpen(!menuOpen)}>
        <span></span>
        <span></span>
        <span></span>
      </div>
      <ul className={menuOpen ? "open" : ""}>
        <li>
          <NavLink to="/events">Events</NavLink>
        </li>
        {isAdmin && (
            <li><NavLink to="/participants">Participants</NavLink></li>
          )}
        {isAdmin && (
            <li><NavLink to="/dashboard">Dashboard</NavLink></li>
          )}

        <li>
          <NavLink to="/profile">Profile</NavLink>
        </li>
      </ul>
    </nav>
    </header>

  );
};

export {Header}