import React, { useState } from "react";
import "./Header.css";
import { Link, NavLink } from "react-router-dom";

function Header(){
    const [menuOpen, setMenuOpen] = useState(false);

    return (

    <header className="app-header">
     <nav>
      <Link to="/" className="header-title">
        EventHub
      </Link>
      <div className="header-menu" onClick={() => setMenuOpen(!menuOpen)}>
        <span></span>
        <span></span>
        <span></span>
      </div>
      <ul className={menuOpen ? "open" : ""}>
        <li>
          <NavLink to="/events">Events</NavLink>
        </li>
        <li>
          <NavLink to="/login">Sign In</NavLink>
        </li>
        <li>
          <NavLink to="/signup">Sign Up</NavLink>
        </li>
      </ul>
    </nav>
    </header>

  );
};

export {Header}