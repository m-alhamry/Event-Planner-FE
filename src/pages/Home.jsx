import { Link } from 'react-router-dom';
const Home = () => {
    const token = localStorage.getItem("access_token");
    const user = JSON.parse(localStorage.getItem("user"));
    const isAuthenticated = !!token;

    return (
        <div className="text-center">
            <div style={{ padding: '4rem 0' }}>
                <h1 style={{ fontSize: '3rem', marginBottom: '1rem', color: '#333' }}>
                    Welcome to Event Planner
                </h1>
                <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '2rem' }}>
                    Create, manage, and attend amazing events with ease
                </p>

                {isAuthenticated ? (
                    <div>
                        <h2 style={{ marginBottom: '2rem' }}>
                            Welcome back, {user?.first_name || user?.username}!
                        </h2>
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <Link to="/dashboard" className="btn btn-primary">
                                Go to Dashboard
                            </Link>
                            <Link to="/events" className="btn btn-secondary">
                                Browse Events
                            </Link>
                            <Link to="/create-event" className="btn btn-success">
                                Create Event
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div>
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '3rem' }}>
                            <Link to="/signup" className="btn btn-primary">
                                Get Started
                            </Link>
                            <Link to="/login" className="btn btn-secondary">
                                Login
                            </Link>
                        </div>

                        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                            <h3 style={{ marginBottom: '2rem', color: '#333' }}>Features</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
                                <div className="card">
                                    <h4 style={{ color: '#667eea', marginBottom: '1rem' }}>Create Events</h4>
                                    <p>Easily create and manage your own events with detailed information and settings.</p>
                                </div>
                                <div className="card">
                                    <h4 style={{ color: '#667eea', marginBottom: '1rem' }}>Browse Events</h4>
                                    <p>Explore a wide range of events happening around you and find the ones that interest you.</p>
                                </div>
                                <div className="card">
                                    <h4 style={{ color: '#667eea', marginBottom: '1rem' }}>Join Events</h4>
                                    <p>Discover and join interesting events in your area or online.</p>
                                </div>
                                <div className="card">
                                    <h4 style={{ color: '#667eea', marginBottom: '1rem' }}>Track Attendance</h4>
                                    <p>Keep track of who's attending your events and manage RSVPs.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
