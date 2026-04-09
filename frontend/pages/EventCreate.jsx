import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth, API_BASE } from '../context/AuthContext';

function EventCreate() {
  const { tokens } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    location: '',
    description: '',
    start_datetime: '',
    end_datetime: '',
    max_participants: '',
    status: 'open',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        ...formData,
        start_datetime: formData.start_datetime
          ? new Date(formData.start_datetime).toISOString()
          : null,
        end_datetime: formData.end_datetime
          ? new Date(formData.end_datetime).toISOString()
          : null,
        max_participants: formData.max_participants
          ? Number(formData.max_participants)
          : null,
      };

      console.log("PAYLOAD SENT:", payload);

      const res = await fetch(`${API_BASE}/events/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokens.access}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);
      console.log("API RESPONSE:", data);

      if (!res.ok) {
        throw new Error(
          data?.detail ||
          JSON.stringify(data) ||
          'Erreur création'
        );
      }

      navigate('/events');
    } catch (err) {
      setError(err.message || 'Erreur création');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="event-create-page">
      <div className="page-header">
        <h1>Create New Event</h1>
        <Link to="/events" className="back-btn">
          ← Back to Events
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="event-form">
        <div className="field">
          <label>Title <span className="required">*</span></label>
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Event title"
            required
          />
        </div>

        <div className="field">
          <label>Location <span className="required">*</span></label>
          <input
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Event location"
            required
          />
        </div>

        <div className="field">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Event description"
            rows="4"
          />
        </div>

        <div className="field-row">
          <div className="field">
            <label>Start Date {formData.status !== "postponed" && <span className="required">*</span>}</label>
            <input
              type="datetime-local"
              name="start_datetime"
              value={formData.start_datetime}
              onChange={handleChange}
              required={formData.status !== "postponed"}
            />
          </div>

          <div className="field">
            <label>End Date {formData.status !== "postponed" && <span className="required">*</span>}</label>
            <input
              type="datetime-local"
              name="end_datetime"
              value={formData.end_datetime}
              onChange={handleChange}
              required={formData.status !== "postponed"}
            />
          </div>
        </div>

        <div className="field">
          <label>Capacity</label>
          <input
            type="number"
            name="max_participants"
            value={formData.max_participants}
            onChange={handleChange}
            placeholder="Max participants"
            min="1"
          />
        </div>

        <div className="field">
          <label>Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="open">Open</option>
            <option value="closed">Closed</option>
            <option value="postponed">Postponed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {error && <div className="error">{error}</div>}

        <div className="form-actions">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => navigate('/events')}
            disabled={loading}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Event'}
          </button>
        </div>
      </form>
    </div>
  );
}

export { EventCreate };