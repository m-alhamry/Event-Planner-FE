import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getMyEvents, getMyAttendingEvents } from "../services/eventAPI";
import { getUserStats } from "../services/statsAPI";
import { formatDateToLocal, formatTimeToLocal, isEventPast } from "../utils/dateTimeUtil";

const Dashboard = () => {
    const user = JSON.parse(localStorage.getItem("user"));

    const [stats, setStats] = useState(null);
    const [recentEvents, setRecentEvents] = useState([]);
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const statsResponse = await getUserStats();
            setStats(statsResponse);

            const myEventsResponse = await getMyEvents();
            const first3Events = myEventsResponse.slice(0, 3);
            setRecentEvents(first3Events);

            const attendingResponse = await getMyAttendingEvents();
            const upcomingEventsArray = attendingResponse.filter(
                (event) => !isEventPast(event.date, event.time)
            );
            const first3UpcomingEvents = upcomingEventsArray.slice(0, 3);
            setUpcomingEvents(first3UpcomingEvents);
        } catch (error) {
            alert("Failed to load dashboard data");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div>Loading dashboard...</div>;
    }

    return (
        <div>
            <div className="card-header">
                <h1 className="card-title">
                    Welcome back,{" "}
                    {user && user.first_name
                        ? user.first_name
                        : user && user.username
                        ? user.username
                        : ""}!
                </h1>
                <p style={{ color: "#666" }}>Here's what's happening with your events</p>
            </div>

            {stats && (
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                        gap: "1rem",
                        marginBottom: "2rem",
                    }}
                >
                    <div className="card text-center">
                        <h3 style={{ color: "#667eea", fontSize: "2rem" }}>{stats.created_events}</h3>
                        <p>Events Created</p>
                    </div>
                    <div className="card text-center">
                        <h3 style={{ color: "#17a2b8", fontSize: "2rem" }}>{stats.attending_events}</h3>
                        <p>Total Registered</p>
                    </div>
                    <div className="card text-center">
                        <h3 style={{ color: "#27ae60", fontSize: "2rem" }}>{stats.confirmed_events}</h3>
                        <p>Going</p>
                    </div>
                    <div className="card text-center">
                        <h3 style={{ color: "#f39c12", fontSize: "2rem" }}>{stats.pending_events}</h3>
                        <p>Maybe</p>
                    </div>
                    <div className="card text-center">
                        <h3 style={{ color: "#6c757d", fontSize: "2rem" }}>{stats.upcoming_events}</h3>
                        <p>Upcoming Events</p>
                    </div>
                </div>
            )}

            <div className="card">
                <h3 className="card-title">Quick Actions</h3>
                <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                    <Link to="/create-event" className="btn btn-primary">
                        Create New Event
                    </Link>
                    <Link to="/events" className="btn btn-secondary">
                        Browse All Events
                    </Link>
                    <Link to="/my-events" className="btn btn-info">
                        Manage My Events
                    </Link>
                </div>
            </div>

            <div className="dashboard-grid">
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">Recent Events Created</h3>
                        <Link to="/my-events" style={{ color: "#667eea" }}>
                            View All
                        </Link>
                    </div>
                    {recentEvents.length > 0 ? (
                        <div>
                            {recentEvents.map((event) => (
                                <div
                                    key={event.id}
                                    style={{ padding: "1rem 0", borderBottom: "1px solid #eee" }}
                                >
                                    <Link to={`/events/${event.id}`} style={{ textDecoration: "none" }}>
                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "flex-start",
                                            }}
                                        >
                                            <div style={{ flex: 1 }}>
                                                <h4 style={{ marginBottom: "0.5rem" }}>{event.title}</h4>
                                                <p style={{ color: "#666", fontSize: "0.9rem" }}>
                                                    📅 {formatDateToLocal(event.date)}
                                                </p>
                                                <p style={{ color: "#666", fontSize: "0.9rem" }}>
                                                    🕐 {formatTimeToLocal(event.time)}
                                                </p>
                                                <p style={{ color: "#666", fontSize: "0.9rem" }}>
                                                    📍 {event.location}
                                                </p>
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        gap: "1rem",
                                                        fontSize: "0.9rem",
                                                        color: "#666",
                                                    }}
                                                >
                                                    <span>👥 {event.attendees_count} registered</span>
                                                    <span style={{ color: "#27ae60" }}>
                                                        ✓ {event.confirmed_count} going
                                                    </span>
                                                    {event.pending_count > 0 && (
                                                        <span style={{ color: "#f39c12" }}>
                                                            ⏳ {event.pending_count} maybe
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            {isEventPast(event.date, event.time) && (
                                                <span
                                                    style={{
                                                        padding: "0.25rem 0.5rem",
                                                        borderRadius: "3px",
                                                        fontSize: "0.8rem",
                                                        backgroundColor: "#f8d7da",
                                                        color: "#721c24",
                                                        flexShrink: 0,
                                                        height: "fit-content",
                                                        display: "inline-block",
                                                        marginLeft: "1rem",
                                                    }}
                                                >
                                                    Past
                                                </span>
                                            )}
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state">
                            <p>No events created yet</p>
                            <Link to="/create-event" className="btn btn-primary btn-small">
                                Create Your First Event
                            </Link>
                        </div>
                    )}
                </div>

                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">Upcoming Events</h3>
                        <Link to="/attending" style={{ color: "#667eea" }}>
                            View All
                        </Link>
                    </div>
                    {upcomingEvents.length > 0 ? (
                        <div>
                            {upcomingEvents.map((event) => (
                                <div
                                    key={event.id}
                                    style={{ padding: "1rem 0", borderBottom: "1px solid #eee" }}
                                >
                                    <Link to={`/events/${event.id}`} style={{ textDecoration: "none" }}>
                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "flex-start",
                                            }}
                                        >
                                            <div style={{ flex: 1 }}>
                                                <h4 style={{ marginBottom: "0.5rem" }}>{event.title}</h4>
                                                <p style={{ color: "#666", fontSize: "0.9rem" }}>
                                                    📅 {formatDateToLocal(event.date)}
                                                </p>
                                                <p style={{ color: "#666", fontSize: "0.9rem" }}>
                                                    🕐 {formatTimeToLocal(event.time)}
                                                </p>
                                                <p style={{ color: "#666", fontSize: "0.9rem" }}>
                                                    📍 {event.location}
                                                </p>
                                                <p style={{ color: "#666", fontSize: "0.9rem" }}>
                                                    👤 Created by {event.created_by_username}
                                                </p>
                                            </div>
                                            <div style={{ flexShrink: 0, marginLeft: "1rem" }}>
                                                {event.user_attendance_status === "confirmed" && (
                                                    <span
                                                        style={{
                                                            padding: "0.25rem 0.5rem",
                                                            borderRadius: "3px",
                                                            fontSize: "0.8rem",
                                                            backgroundColor: "#d4edda",
                                                            color: "#155724",
                                                        }}
                                                    >
                                                        ✓ Going
                                                    </span>
                                                )}
                                                {event.user_attendance_status === "pending" && (
                                                    <span
                                                        style={{
                                                            padding: "0.25rem 0.5rem",
                                                            borderRadius: "3px",
                                                            fontSize: "0.8rem",
                                                            backgroundColor: "#fff3cd",
                                                            color: "#856404",
                                                        }}
                                                    >
                                                        ⏳ Maybe
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state">
                            <p>No upcoming events</p>
                            <Link to="/events" className="btn btn-secondary btn-small">
                                Browse Events
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {stats && stats.pending_events > 0 && (
                <div
                    className="card"
                    style={{ marginTop: "2rem", backgroundColor: "#fff3cd", border: "1px solid #ffeaa7" }}
                >
                    <h3 style={{ color: "#856404", marginBottom: "1rem" }}>⏳ Pending Responses</h3>
                    <p style={{ color: "#856404", marginBottom: "1rem" }}>
                        You have {stats.pending_events} event{stats.pending_events > 1 ? "s" : ""} waiting for
                        your response.
                    </p>
                    <Link to="/attending" className="btn btn-warning">
                        Confirm Your Attendance
                    </Link>
                </div>
            )}
        </div>
    );
};

export default Dashboard;