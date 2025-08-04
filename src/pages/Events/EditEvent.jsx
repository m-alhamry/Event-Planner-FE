import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getEvent, updateEvent } from '../../services/eventAPI';
import { formatDateToForm } from '../../utils/dateTimeUtil';

const EditEvent = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      const event = await getEvent(id);
      // Check if user is the creator
      if (user.id !== null && event.created_by.id !== user.id) {
        navigate('/events');
        return;
      }

      setFormData({
        title: event.title,
        description: event.description,
        date: formatDateToForm(event.date),
        time: event.time,
        location: event.location,
      });
    } catch (error) {
      navigate('/events');
    } finally {
      setInitialLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      await updateEvent(id, formData);
      navigate(`/events/${id}`);
    } catch (error) {
      if (error.response?.data) {
        setErrors(error.response.data);
      } else {
        setErrors({ general: 'Failed to update event. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return <div className="loading">Loading event...</div>;
  }

  // Get today's date for min date validation
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div className="card-header">
        <h1 className="card-title">Edit Event</h1>
        <p style={{ color: '#666' }}>Update your event details</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title" className="form-label">
            Event Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="form-input"
            placeholder="Enter event title"
            required
          />
          {errors.title && <div className="error-message">{errors.title}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="description" className="form-label">
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="form-input form-textarea"
            placeholder="Describe your event..."
            required
          />
          {errors.description && <div className="error-message">{errors.description}</div>}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label htmlFor="date" className="form-label">
              Date *
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="form-input"
              min={today}
              required
            />
            {errors.date && <div className="error-message">{errors.date}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="time" className="form-label">
              Time *
            </label>
            <input
              type="time"
              id="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="form-input"
              required
            />
            {errors.time && <div className="error-message">{errors.time}</div>}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="location" className="form-label">
            Location *
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="form-input"
            placeholder="Enter event location"
            required
          />
          {errors.location && <div className="error-message">{errors.location}</div>}
        </div>

        {errors.general && <div className="error-message">{errors.general}</div>}

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={() => navigate(`/events/${id}`)}
            className="btn btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Updating Event...' : 'Update Event'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditEvent;