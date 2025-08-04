import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getEvents } from '../../services/eventAPI';
import { formatTimeToLocal, formatDateToLocal, isEventPast } from '../../utils/dateTimeUtil';
import AttendanceButtons from '../../components/AttendanceButtons';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  // Fetch events when component mounts or filters change
  useEffect(() => {
    fetchEvents();
  }, [searchTerm, dateFilter]);

  const fetchEvents = async () => {
    try {
      // Create params object
      const params = {};

      // Add search term if exists
      if (searchTerm) {
        params.search = searchTerm;
      }

      // Add date filter if exists
      if (dateFilter) {
        params.date = dateFilter;
      }

      // Call API
      const eventsData = await getEvents(params);

      // Set events data
      setEvents(eventsData);
    } catch (error) {
      alert('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  // Function to handle attendance update
  const handleAttendanceUpdate = () => {
    // Refresh events data
    fetchEvents();
  };

  // Function to handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
  };

  // Function to handle date filter change
  const handleDateChange = (e) => {
    const value = e.target.value;
    setDateFilter(value);
  };

  // Function to clear filters
  const handleClearFilters = () => {
    setSearchTerm('');
    setDateFilter('');
  };

  // Show loading if still loading
  if (loading === true) {
    return <div className="loading">Loading events...</div>;
  }

  return (
    <div>
      {/* Header section */}
      <div className="card-header">
        <h1 className="card-title">All Events</h1>
        <p style={{ color: '#666' }}>
          Discover and join amazing events happening around you
        </p>
      </div>

      {/* Search and Filter section */}
      <div className="search-filter">
        <input
          type="text"
          placeholder="Search events by title, owner username, description, or location..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="form-input search-input"
        />
        <input
          type="date"
          value={dateFilter}
          onChange={handleDateChange}
          className="form-input"
        />
        <button
          onClick={handleClearFilters}
          className="btn btn-secondary"
        >
          Clear Filters
        </button>
      </div>

      {/* Events list or empty state */}
      {events.length > 0 ? (
        <div className="events-grid">
          {events.map(event => {
            const isPast = isEventPast(event.date, event.time)
            return (
              <div key={event.id} className="event-card">
                {/* Event title and past indicator */}
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

                {/* Event metadata */}
                <div className="event-meta">
                  <div>📅 {formatDateToLocal(event.date)}</div>
                  <div>🕐 {formatTimeToLocal(event.time)}</div>
                  <div>📍 {event.location}</div>
                  <div>👤 Created by {event.created_by_username}</div>

                  {/* Attendance counts */}
                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <span>👥 {event.attendee_count} registered</span>
                    <span style={{ color: '#27ae60' }}>✓ {event.confirmed_count} going</span>
                    {event.pending_count > 0 && (
                      <span style={{ color: '#f39c12' }}>⏳ {event.pending_count} maybe</span>
                    )}
                  </div>
                </div>

                {/* Event actions */}
                <div className="event-actions">
                  <Link
                    to={`/events/${event.id}`}
                    className="btn btn-info btn-small"
                  >
                    View Details
                  </Link>

                  <AttendanceButtons
                    event={{ ...event }}
                    onUpdate={handleAttendanceUpdate}
                  />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="empty-state">
          <h3>No events found</h3>
          <p>Try adjusting your search criteria or check back later for new events.</p>
          <Link to="/create-event" className="btn btn-primary">
            Create the First Event
          </Link>
        </div>
      )}
    </div>
  );
};

export default Events;