import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyEvents, deleteEvent } from '../../services/eventAPI';
import { formatDateToLocal, formatTimeToLocal, isEventPast } from '../../utils/dateTimeUtil';

const MyEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyEvents();
  }, []);

  const fetchMyEvents = async () => {
    try {
      const myEvents = await getMyEvents();
      setEvents(myEvents);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId, eventTitle) => {
    if (window.confirm(`Are you sure you want to delete "${eventTitle}"? This action cannot be undone.`)) {
      try {
        await deleteEvent(eventId);
        // Remove the deleted event from the list
        setEvents(events.filter(event => event.id !== eventId));
      } catch (error) {
        alert('Failed to delete event.');
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading your events...</div>;
  }

  return (
    <div>
      <div className="card-header">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="card-title">My Events</h1>
            <p style={{ color: '#666' }}>Events you have created</p>
          </div>
          <Link to="/create-event" className="btn btn-primary">
            Create New Event
          </Link>
        </div>
      </div>

      {events.length > 0 ? (
        <div className="events-grid">
          {events.map(event => {
            const isPast = isEventPast(event.date, event.time)
            return (
              <div key={event.id} className="event-card">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="event-title">{event.title}</h3>
                  {isPast && (
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
                  )}
                </div>
                
                <div className="event-meta">
                  <div>📅 {formatDateToLocal(event.date)}</div>
                  <div>🕐 {formatTimeToLocal(event.time)}</div>
                  <div>📍 {event.location}</div>
                  <div>👥 {event.attendee_count} attendees</div>
                </div>

                <div className="event-actions">
                  <Link 
                    to={`/events/${event.id}`} 
                    className="btn btn-info btn-small"
                  >
                    View Details
                  </Link>
                  
                  {!isPast && (
                    <Link 
                      to={`/events/${event.id}/edit`} 
                      className="btn btn-secondary btn-small"
                    >
                      Edit
                    </Link>
                  )}
                  
                  <button
                    onClick={() => handleDeleteEvent(event.id, event.title)}
                    className="btn btn-danger btn-small"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="empty-state">
          <h3>No events created yet</h3>
          <p>Start by creating your first event to bring people together!</p>
          <Link to="/create-event" className="btn btn-primary">
            Create Your First Event
          </Link>
        </div>
      )}

      {/* Summary Statistics */}
      {events.length > 0 && (
        <div className="card mt-2">
          <h3 className="card-title">Summary</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
            <div className="text-center">
              <h4 style={{ color: '#667eea', fontSize: '1.5rem' }}>{events.length}</h4>
              <p>Total Events</p>
            </div>
            <div className="text-center">
              <h4 style={{ color: '#27ae60', fontSize: '1.5rem' }}>
                {events.filter(event => isEventPast(event.date, event.time) === false).length}
              </h4>
              <p>Upcoming Events</p>
            </div>
            <div className="text-center">
              <h4 style={{ color: '#f39c12', fontSize: '1.5rem' }}>
                {events.reduce((total, event) => total + event.attendee_count, 0)}
              </h4>
              <p>Total Attendees</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyEvents;