import { useState } from 'react';
import { joinEvent, confirmAttendance, declineAttendance, leaveEvent } from '../services/attendeeAPI';
import { isEventPast } from '../utils/dateTimeUtil';

const AttendanceButtons = ({ event, onUpdate, disabled = false }) => {
  const [loading, setLoading] = useState(false);

  // Get event properties
  const user_attendance_status = event.user_attendance_status;
  const is_past = isEventPast(event.date, event.time);

  // Handle join event
  const handleJoinEvent = async () => {
    setLoading(true);
    try {
      await joinEvent(event.id);
      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      let errorMessage = 'Failed to join event.';
      if (error.response && error.response.data && error.response.data.error) {
        errorMessage = error.response.data.error;
      }
      alert(errorMessage);
    }
    setLoading(false);
  };

  // Handle confirm attendance
  const handleConfirmAttendance = async () => {
    setLoading(true);
    try {
      await confirmAttendance(event.id);
      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      alert('Failed to confirm attendance.');
    }
    setLoading(false);
  };

  // Handle decline attendance
  const handleDeclineAttendance = async () => {
    setLoading(true);
    try {
      await declineAttendance(event.id);
      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      alert('Failed to decline attendance.');
    }
    setLoading(false);
  };

  // Handle leave event
  const handleLeaveEvent = async () => {
    const confirmLeave = window.confirm('Are you sure you want to leave this event?');
    if (confirmLeave) {
      setLoading(true);
      try {
        await leaveEvent(event.id);
        if (onUpdate) {
          onUpdate();
        }
      } catch (error) {
        alert('Failed to leave event.');
      }
      setLoading(false);
    }
  };

  // If event is past, show event ended message
  if (is_past === true) {
    return (
      <span 
        style={{ 
          padding: '0.4rem 0.8rem',
          borderRadius: '5px',
          fontSize: '0.9rem',
          backgroundColor: '#e2e3e5',
          color: '#6c757d',
          border: '1px solid #d6d8db'
        }}
      >
        Event Ended
      </span>
    );
  }

  // If user is not registered, show join button
  if (user_attendance_status === 'not_registered') {
    return (
      <button
        onClick={handleJoinEvent}
        className="btn btn-primary btn-small"
        disabled={loading || disabled}
      >
        {loading ? 'Joining...' : 'Join Event'}
      </button>
    );
  }

  // If user status is pending, show confirm and leave buttons
  if (user_attendance_status === 'pending') {
    return (
      <div className="attendance-buttons" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <button
          onClick={handleConfirmAttendance}
          className="btn btn-success btn-small"
          disabled={loading || disabled}
        >
          {loading ? 'Confirming...' : '✓ Going'}
        </button>
        <button
          onClick={handleLeaveEvent}
          className="btn btn-danger btn-small"
          disabled={loading || disabled}
        >
          {loading ? 'Leaving...' : 'Leave Event'}
        </button>
      </div>
    );
  }

  // If user status is confirmed, show confirmed status and options
  if (user_attendance_status === 'confirmed') {
    return (
      <div className="attendance-buttons" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <span 
          style={{ 
            padding: '0.4rem 0.8rem',
            borderRadius: '5px',
            fontSize: '0.9rem',
            backgroundColor: '#d4edda',
            color: '#155724',
            border: '1px solid #c3e6cb',
            fontWeight: '500'
          }}
        >
          ✓ Going
        </span>
        <button
          onClick={handleDeclineAttendance}
          className="btn btn-warning btn-small"
          disabled={loading || disabled}
          style={{ fontSize: '0.8rem' }}
        >
          {loading ? 'Updating...' : 'Maybe'}
        </button>
        <button
          onClick={handleLeaveEvent}
          className="btn btn-danger btn-small"
          disabled={loading || disabled}
          style={{ fontSize: '0.8rem' }}
        >
          {loading ? 'Leaving...' : 'Leave Event'}
        </button>
      </div>
    );
  }

  // Default case - return nothing
  return null;
};

export default AttendanceButtons;