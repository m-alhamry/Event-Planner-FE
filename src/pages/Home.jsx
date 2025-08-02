import { Link } from "react-router-dom";

const Home = () => {
    const token = localStorage.getItem("access_token");
    const user = JSON.parse(localStorage.getItem("user"));
    const isAuthenticated = !!token;

    return (
        <div className="text-center">
            <div>
                <h1>Welcome to Event Planner</h1>
                <p>Create, manage, and attend amazing events with ease</p>
                {isAuthenticated ? (
                    <div>
                        <h2>Welcome back, {user? user?.first_name || user?.username: ''}!</h2>
                        <div>
                            <Link to="/dashboard" className="btn btn-primary">
                                Go to Dashboard
                            </Link>
                            <Link to="/events" className="btn btn-secondary">
                                Browse Events
                            </Link>
                            <Link to="/create-event" className="btn btn-success">
                                Create New Event
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div>
                        <div>
                            <Link to="/signup" className="btn btn-primary">
                                Get Started
                            </Link>
                            <Link to="/login" className="btn btn-secondary">
                                Login
                            </Link>
                        </div>

                        <div>
                            <h3>Features</h3>
                            <div>
                                <div className="card">
                                    <h4>Create Events</h4>
                                    <p>Easily create and manage your own events with detailed information and settings.</p>
                                </div>
                                <div className="card">
                                    <h4>Browse Events</h4>
                                    <p>Explore a wide range of events happening around you and find the ones that interest you.</p>
                                </div>
                                <div className="card">
                                    <h4>Join Events</h4>
                                    <p>Discover and join interesting events in your area or online.</p>
                                </div>
                                <div className="card">
                                    <h4>Track Attendance</h4>
                                    <p>Keep track of who's attending your events and manage Attendance Status.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Home;