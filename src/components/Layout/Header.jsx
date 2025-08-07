import { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import { logout } from "../../services/authAPI";

const NavLinks = ({ onLinkClick }) => (
    <ul className="nav-links">
        <li><Link to="/dashboard" onClick={onLinkClick}>Dashboard</Link></li>
        <li><Link to="/events" onClick={onLinkClick}>All Events</Link></li>
        <li><Link to="/my-events" onClick={onLinkClick}>My Events</Link></li>
        <li><Link to="/attending" onClick={onLinkClick}>Attending</Link></li>
        <li><Link to="/create-event" onClick={onLinkClick}>Create Event</Link></li>
    </ul>
);

const Header = () => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const token = localStorage.getItem("access_token");
    const user = JSON.parse(localStorage.getItem("user"));

    const handleLogout = async () => {
        await logout();
    };

    const closeDrawer = () => setIsDrawerOpen(false);

    return (
        <header className="header">
            <div className="container">
                <div className="header-content">
                    <Link to="/" className="logo">
                        Event Planner
                    </Link>
                    <div className="hamburger" onClick={() => setIsDrawerOpen(true)}>
                        <FaBars />
                    </div>
                    {token && (
                        <nav className="header-nav">
                            <NavLinks />
                        </nav>
                    )}
                    <div className="auth-buttons header-auth">
                        {token ? (
                            <>
                                <Link to="/profile" className="btn btn-secondary">
                                    <center>{user?.username || "Profile"}</center>
                                </Link>
                                <button onClick={handleLogout} className="btn btn-primary">
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="btn btn-secondary">
                                    Login
                                </Link>
                                <Link to="/signup" className="btn btn-primary">
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
            {isDrawerOpen && (
                <div className="drawer" onClick={closeDrawer}>
                    <div className="drawer-content" onClick={(e) => e.stopPropagation()}>
                        <button onClick={closeDrawer} className="close-btn">
                            <FaTimes />
                        </button>
                        {token ? (
                            <>
                                <NavLinks onLinkClick={closeDrawer} />
                                <div className="drawer-auth">
                                    <Link to="/profile" className="btn btn-secondary" onClick={closeDrawer}>
                                        <center>{user?.username || "Profile"}</center>
                                    </Link>
                                    <button
                                        onClick={() => {
                                            handleLogout();
                                            closeDrawer();
                                        }}
                                        className="btn btn-primary"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="drawer-auth">
                                <Link to="/login" className="btn btn-secondary" onClick={closeDrawer}>
                                    Login
                                </Link>
                                <Link to="/signup" className="btn btn-primary" onClick={closeDrawer}>
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;