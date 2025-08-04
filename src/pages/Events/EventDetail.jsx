import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import AttendanceButtons from '../../components/AttendanceButtons';
import { getEvent, deleteEvent } from '../../services/eventAPI';
import { getEventAttendees } from '../../services/attendeeAPI';
import { formatDateToLocal, formatTimeToLocal, formatDateTimeToLocal, isEventPast } from '../../utils/dateTimeUtil';

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  // State variables
  const [event, setEvent] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data when component mounts
  useEffect(() => {
    fetchEventData();
  }, [id]);

  // Function to fetch all event data
  const fetchEventData = async () => {
    try {
      // Fetch event details
      const eventResponse = await getEvent(id);
      setEvent(eventResponse);

      // Fetch attendees
      const attendeesResponse = await getEventAttendees(id);
      setAttendees(attendeesResponse);

    } catch (error) {
      // Check if event not found
      if (error.response && error.response.status === 404) {
        alert('Event not found');
        navigate('/events');
      } else {
        alert('Failed to load event data');
      }
    } finally {
      setLoading(false);
    }
  };

  // Function to handle attendance update
  const handleAttendanceUpdate = () => {
    // Refresh event data
    fetchEventData();
  };

  // Function to handle delete event
  const handleDeleteEvent = async () => {
    const confirmDelete = window.confirm('Are you sure you want to delete this event? This action cannot be undone.');

    if (confirmDelete) {
      try {
        await deleteEvent(id);
        alert('Event deleted successfully');
        navigate('/my-events');
      } catch (error) {
        alert('Failed to delete event.');
      }
    }
  };

  // Show loading if still loading
  if (loading === true) {
    return <div className="loading">Loading event details...</div>;
  }

  // Show error if no event found
  if (!event) {
    return <div className="empty-state">Event not found</div>;
  }

  // Check if current user is the creator
  const isCreator = user !== null && user.id === event.created_by.id;

  const isPast = isEventPast(event.date, event.time)

  return (
    <div>
      <div className="card">
        {/* Header section */}
        <div className="card-header">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="card-title">{event.title}</h1>
              {isPast && (
                <span
                  style={{
                    padding: '0.25rem 0.5rem',
                    borderRadius: '3px',
                    fontSize: '0.9rem',
                    backgroundColor: '#f8d7da',
                    color: '#721c24',
                    marginTop: '0.5rem',
                    display: 'inline-block'
                  }}
                >
                  This event has ended
                </span>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex gap-1">
              <Link to="/events" className="btn btn-secondary btn-small">
                ← Back to Events
              </Link>
              {isCreator && (
                <>
                  <Link
                    to={`/events/${id}/edit`}
                    className="btn btn-info btn-small"
                  >
                    Edit Event
                  </Link>
                  <button
                    onClick={handleDeleteEvent}
                    className="btn btn-danger btn-small"
                  >
                    Delete Event
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Main content grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>

          {/* Event Details Column */}
          <div>
            <h3 style={{ marginBottom: '1rem', color: '#333' }}>
              Event Details
            </h3>

            {/* Event information */}
            <div style={{ marginBottom: '1rem' }}>
              <strong>📅 Date:</strong> {formatDateToLocal(event.date)}
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <strong>🕐 Time:</strong> {formatTimeToLocal(event.time)}
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <strong>📍 Location:</strong> {event.location}
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <strong>👤 Created by:</strong> {event.created_by.first_name} {event.created_by.last_name} ({event.created_by.username})
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <strong>📝 Description:</strong>
              <p style={{ marginTop: '0.5rem', lineHeight: '1.6' }}>{event.description}</p>
            </div>

            {/* Complete event time display */}
            <div style={{
              marginBottom: '2rem',
              padding: '1rem',
              backgroundColor: isPast ? '#f8d7da' : '#f8f9fa',
              borderRadius: '5px',
              border: isPast ? '1px solid #f5c6cb' : '1px solid #e9ecef'
            }}>
              <strong>🗓️ Complete Event Time:</strong>
              <div style={{ marginTop: '0.5rem', fontSize: '1.1rem', color: isPast ? '#721c24' : '#495057' }}>
                {formatDateTimeToLocal(event.date, event.time)}
              </div>
              {isEventPast(event.date, event.time) && (
                <div style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#721c24' }}>
                  ⚠️ This event has already ended
                </div>
              )}
            </div>

            {/* Attendance section */}
            <div style={{ marginBottom: '2rem' }}>
              <h4 style={{ marginBottom: '1rem', color: '#333' }}>Attendance Status</h4>
              <AttendanceButtons
                event={{ ...event }}
                onUpdate={handleAttendanceUpdate}
              />

              {/* Show current status */}
              {event.user_attendance_status !== 'not_registered' && !isPast && (
                <div style={{ marginTop: '1rem', padding: '0.75rem', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
                  <strong>Your Status: </strong>
                  {event.user_attendance_status === 'confirmed' && (
                    <span style={{ color: '#27ae60' }}>✓ Going - You're definitely attending!</span>
                  )}
                  {event.user_attendance_status === 'pending' && (
                    <span style={{ color: '#f39c12' }}>⏳ Maybe - Please confirm if you're going</span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Attendees list */}
          <div>
            <h4 style={{ marginBottom: '1rem', color: '#333' }}>Who's Going</h4>
            {attendees.length > 0 ? (
              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {attendees.map(attendee => {
                  return (
                    <div
                      key={attendee.id}
                      style={{
                        padding: '0.75rem',
                        borderBottom: '1px solid #eee',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <div>
                        <strong>
                          {attendee.user.first_name} {attendee.user.last_name}
                        </strong>
                        <br />
                        <small style={{ color: '#666' }}>@{attendee.user.username}</small>
                      </div>
                      <span
                        style={{
                          padding: '0.25rem 0.5rem',
                          borderRadius: '3px',
                          fontSize: '0.8rem',
                          backgroundColor: attendee.confirmed ? '#d4edda' : '#fff3cd',
                          color: attendee.confirmed ? '#155724' : '#856404'
                        }}
                      >
                        {attendee.confirmed ? '✓ Going' : '⏳ Maybe'}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="empty-state">
                <p>No one has joined yet</p>
                {!isCreator && !isPast && event.user_attendance_status === 'not_registered' && (
                  <div style={{ marginTop: '1rem' }}>
                    <AttendanceButtons
                      event={{ ...event }}
                      onUpdate={handleAttendanceUpdate}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
