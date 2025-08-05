import { Link } from "react-router-dom";
import { logout } from "../../services/authAPI";

const Header = () => {
    const token = localStorage.getItem("access_token");
    const user = JSON.parse(localStorage.getItem("user"));
    const handleLogout = async () => {
        await logout();
    }
    return (
        <header className="header">
            <div className="container">
                <div className="header-content">
                    <Link to="/" className="logo">
                        Event Planner
                    </Link>
                    {token && (
                        <nav>
                            <ul className="nav-links">
                                <li><Link to="/dashboard">Dashboard</Link></li>
                                <li><Link to="/events">All Events</Link></li>
                                <li><Link to="/my-events">My Events</Link></li>
                                <li><Link to="/attending">Attending</Link></li>
                                <li><Link to="/create-event">Create Event</Link></li>
                            </ul>
                        </nav>
                    )}
                    <div className="auth-buttons">
                        {token ? (
                            <>
                                <Link to="/profile" className="btn btn-secondary">
                                    <center>{user?.username || 'Profile'}</center>
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
        </header>
    );
};

export default Header;