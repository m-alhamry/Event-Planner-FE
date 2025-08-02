import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyEvents, getMyAttendingEvents } from '../services/eventAPI';
import { formatDateToLocal, formatTimeToLocal } from '../utils/dateTimeUtil';

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  const [recentEvents, setRecentEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Function to fetch all dashboard data
  const fetchDashboardData = async () => {
    try {
      // Fetch events created by user
      const myEventsResponse = await getMyEvents();
      const first3Events = myEventsResponse.slice(0, 3);
      setRecentEvents(first3Events);

      // Fetch events user is attending
      const attendingResponse = await getMyAttendingEvents();
      const upcomingEventsArray = attendingResponse.filter(event => event.is_past === false);
      const first3UpcomingEvents = upcomingEventsArray.slice(0, 3);
      setUpcomingEvents(first3UpcomingEvents);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      alert('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading === true) {
    return <div>Loading dashboard...</div>;
  }

  return (
    <div>
      {/* Welcome header */}
      <div>
        <h1>
          Welcome back, {user && user.first_name ? user.first_name : user && user.username? user.username: ''}!
        </h1>
        <p>Here's what's happening with your events</p>
      </div>

      {/* Quick actions */}
      <div>
        <h3>Quick Actions</h3>
        <div>
          <Link to="/create-event">
            Create New Event
          </Link>
          <Link to="/events">
            Browse All Events
          </Link>
          <Link to="/my-events">
            Manage My Events
          </Link>
        </div>
      </div>

      {/* Main content grid */}
      <div>

        {/* Recent Events Created */}
        <div>
          <div>
            <h3>Recent Events Created</h3>
            <Link>View All</Link>
          </div>

          {recentEvents.length > 0 ? (
            <div>
              {recentEvents.map(event => {
                return (
                  <div key={event.id}>
                    <div>
                      <div>
                        <h4>{event.title}</h4>
                        <p>
                          📅 {formatDateToLocal(event.date)}
                        </p>
                        <p>
                          🕐 {formatTimeToLocal(event.time)}
                        </p>
                        <p>
                          📍 {event.location}
                        </p>

                        {/* Attendance counts */}
                        <div>
                          <span>👥 {event.attendees_count} registered</span>
                          <span>✓ {event.confirmed_count} going</span>
                          {event.pending_count > 0 && (
                            <span>⏳ {event.pending_count} maybe</span>
                          )}
                        </div>
                      </div>

                      {/* Past event */}
                      {event.is_past && (
                        <span>
                          Past
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div>
              <p>No events created yet</p>
              <Link to="/create-event">
                Create Your First Event
              </Link>
            </div>
          )}
        </div>

        {/* Upcoming Events Attending */}
        <div>
          <div>
            <h3>Upcoming Events</h3>
            <Link>View All</Link>
          </div>

          {upcomingEvents.length > 0 ? (
            <div>
              {upcomingEvents.map(event => {
                return (
                  <div key={event.id}>
                    <div>
                      <div>
                        <h4>{event.title}</h4>
                        <p>
                          📅 {formatDateToLocal(event.date)}
                        </p>
                        <p>
                          🕐 {formatTimeToLocal(event.time)}
                        </p>
                        <p>
                          📍 {event.location}
                        </p>
                        <p>
                          👤 Created by {event.created_by_username}
                        </p>
                      </div>

                      {/* Attendance status */}
                      <div>
                        {event.user_rsvp_status === 'confirmed' && (
                          <span>
                            ✓ Going
                          </span>
                        )}
                        {event.user_rsvp_status === 'pending' && (
                          <span>
                            ⏳ Maybe
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div>
              <p>No upcoming events</p>
              <Link to="/events">
                Browse Events
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;