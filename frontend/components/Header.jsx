import React, { useState } from "react";

import { Link, NavLink } from "react-router-dom";

function Header(){
    const [menuOpen, setMenuOpen] = useState(false);

    return (

    <header className="app-header">

     <nav>
      <div className="header-left">
      <Link to="/" className="header-title">
        EventHub
      </Link>
        <button className="theme-toggle">
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3">
            <path d="M565-395q35-35 35-85t-35-85q-35-35-85-35t-85 35q-35 35-35 85t35 85q35 35 85 35t85-35Zm-226.5 56.5Q280-397 280-480t58.5-141.5Q397-680 480-680t141.5 58.5Q680-563 680-480t-58.5 141.5Q563-280 480-280t-141.5-58.5ZM200-440H40v-80h160v80Zm720 0H760v-80h160v80ZM440-760v-160h80v160h-80Zm0 720v-160h80v160h-80ZM256-650l-101-97 57-59 96 100-52 56Zm492 496-97-101 53-55 101 97-57 59Zm-98-550 97-101 59 57-100 96-56-52ZM154-212l101-97 55 53-97 101-59-57Zm326-268Z"/></svg>
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3">
            <path d="M353.25-353.25Q301.12-405.39 301.12-480t52.13-127.1q52.14-52.48 126.75-52.48t127.1 52.48q52.48 52.49 52.48 127.1 0 74.61-52.48 126.75-52.49 52.13-127.1 52.13-74.61 0-126.75-52.13ZM199.58-458.42H51.12v-43.85h148.46v43.85Zm710 0H761.12v-43.85h148.46v43.85Zm-451.16-302.7v-148.46h43.85v148.46h-43.85Zm0 710v-148.46h43.85v148.46h-43.85ZM267.39-664.04l-92.16-89.04 31.31-32.69L296.35-694l-28.96 29.96Zm486.69 489.19-90.04-91.77 29.57-30.65 91.16 90.35-30.69 32.07Zm-90.66-518.76 89.66-91.16 32.69 30.69-91.16 90.35-31.19-29.88ZM174.85-206.54 266-297.27l30.5 30.5-89.46 91.42-32.19-31.19Z"/></svg>
      </button>
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