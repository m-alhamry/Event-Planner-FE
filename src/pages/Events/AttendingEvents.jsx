import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AttendanceButtons from '../../components/AttendanceButtons';
import { getMyAttendingEvents } from '../../services/eventAPI';
import { formatDateToLocal, formatTimeToLocal, isEventToday, isEventSoon, isEventPast } from '../../utils/dateTimeUtil';

const AttendingEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAttendingEvents();
  }, []);

  const fetchAttendingEvents = async () => {
    try {
      const myAttendingEvents = await getMyAttendingEvents();
      setEvents(myAttendingEvents);
    } catch (error) {
      console.error('Error fetching attending events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAttendanceUpdate = () => {
    // Refresh events to update attendance status
    fetchAttendingEvents();
  };

  if (loading) {
    return <div className="loading">Loading your events...</div>;
  }

  // Separate events into categories
  const upcomingEvents = events.filter(event => isEventPast(event.date, event.time) === false);
  const pastEvents = events.filter(event => isEventPast(event.date, event.time) === true);

  return (
    <div>
      <div className="card-header">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="card-title">Events I'm Attending</h1>
            <p style={{ color: '#666' }}>Events you have joined</p>
          </div>
          <Link to="/events" className="btn btn-primary">
            Browse More Events
          </Link>
        </div>
      </div>

      {events.length > 0 ? (
        <>
          {/* Upcoming Events */}
          {upcomingEvents.length > 0 && (
            <div>
              <h2 style={{ marginBottom: '1rem', color: '#333' }}>
                Upcoming Events ({upcomingEvents.length})
              </h2>
              <div className="events-grid">
                {upcomingEvents.map(event => {
                  const isToday = isEventToday(event.date);
                  const isSoon = isEventSoon(event.date);

                  return (
                    <div key={event.id} className="event-card">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="event-title">{event.title}</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                          {isToday && (
                            <span
                              style={{
                                padding: '0.25rem 0.5rem',
                                borderRadius: '3px',
                                fontSize: '0.8rem',
                                backgroundColor: '#d1ecf1',
                                color: '#0c5460'
                              }}
                            >
                              Today!
                            </span>
                          )}
                          {isSoon && !isToday && (
                            <span
                              style={{
                                padding: '0.25rem 0.5rem',
                                borderRadius: '3px',
                                fontSize: '0.8rem',
                                backgroundColor: '#fff3cd',
                                color: '#856404'
                              }}
                            >
                              Soon
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="event-meta">
                        <div>📅 {formatDateToLocal(event.date)}</div>
                        <div>🕐 {formatTimeToLocal(event.time)}</div>
                        <div>📍 {event.location}</div>
                        <div>👤 Created by {event.created_by_username}</div>
                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                          <span>👥 {event.attendee_count} registered</span>
                          <span style={{ color: '#27ae60' }}>✓ {event.confirmed_count} going</span>
                          {event.pending_count > 0 && (
                            <span style={{ color: '#f39c12' }}>⏳ {event.pending_count} maybe</span>
                          )}
                        </div>
                      </div>

                      <div className="event-actions">
                        <Link
                          to={`/events/${event.id}`}
                          className="btn btn-info btn-small"
                        >
                          View Details
                        </Link>
                        <AttendanceButtons
                          event={{ ...event, user_attendance_status: event.user_attendance_status }}
                          onUpdate={handleAttendanceUpdate}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Past Events */}
          {pastEvents.length > 0 && (
            <div style={{ marginTop: upcomingEvents.length > 0 ? '3rem' : '0' }}>
              <h2 style={{ marginBottom: '1rem', color: '#333' }}>
                Past Events ({pastEvents.length})
              </h2>
              <div className="events-grid">
                {pastEvents.map(event => (
                  <div key={event.id} className="event-card" style={{ opacity: 0.8 }}>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="event-title">{event.title}</h3>
                      <span
                        style={{
                          padding: '0.25rem 0.5rem',
                          borderRadius: '3px',
                          fontSize: '0.8rem',
                          backgroundColor: '#f8d7da',
                          color: '#721c24'
                        }}
                      >
                        Past Event
                      </span>
                    </div>

                    <div className="event-meta">
                      <div>📅 {formatDateToLocal(event.date)}</div>
                      <div>🕐 {formatTimeToLocal(event.time)}</div>
                      <div>📍 {event.location}</div>
                      <div>👤 Created by {event.created_by_username}</div>
                      <div>👥 {event.attendees_count} attendees</div>
                    </div>

                    <div className="event-actions">
                      <Link
                        to={`/events/${event.id}`}
                        className="btn btn-info btn-small"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Summary Statistics */}
          <div className="card mt-2">
            <h3 className="card-title">Summary</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
              <div className="text-center">
                <h4 style={{ color: '#667eea', fontSize: '1.5rem' }}>{events.length}</h4>
                <p>Total Events</p>
              </div>
              <div className="text-center">
                <h4 style={{ color: '#27ae60', fontSize: '1.5rem' }}>{upcomingEvents.length}</h4>
                <p>Upcoming Events</p>
              </div>
              <div className="text-center">
                <h4 style={{ color: '#f39c12', fontSize: '1.5rem' }}>{pastEvents.length}</h4>
                <p>Past Events</p>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="empty-state">
          <h3>No events joined yet</h3>
          <p>Start by browsing and joining some interesting events!</p>
          <Link to="/events" className="btn btn-primary">
            Browse Events
          </Link>
        </div>
      )}
    </div>
  );
};

export default AttendingEvents;