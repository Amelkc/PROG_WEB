import { useState } from 'react';
import { LoadingWrap } from '../LoadingWrap/LoadingWrap';
import { Spinner } from '../Spinner';
import { useAuth } from '../../context/AuthContext';
import { apiMutate } from '../../api/api';
import './EventModal.css';

export function EditEventModal({ event, onClose, onSaved }) {
  const { tokens, refreshToken } = useAuth();

  const [form, setForm] = useState({
    title: event.title || "",
    description: event.description ?? "",
    location: event.location || "",
    start_datetime: event.start_datetime ? toDatetimeLocalValue(event.start_datetime) : "",
    end_datetime: event.end_datetime ? toDatetimeLocalValue(event.end_datetime) : "",
    max_participants: event.max_participants ?? "",
    status: event.status || "open",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function toDatetimeLocalValue(value) {
    const date = new Date(value);
    if (isNaN(date.getTime())) return "";
    const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 16);
  }

  function toIsoOrNull(value) {
    if (!value) return null;
    const date = new Date(value);
    if (isNaN(date.getTime())) return null;
    return date.toISOString();
  }

  const set = (key) => (e) => {
    setForm((prev) => ({
      ...prev,
      [key]: e.target.value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        location: form.location.trim(),
        start_datetime: toIsoOrNull(form.start_datetime),
        end_datetime: toIsoOrNull(form.end_datetime),
        max_participants: form.max_participants === "" ? null : Number(form.max_participants),
        status: form.status,
      };

      const updated = await apiMutate(`/events/${event.id}/`, {
        method: "PATCH",
        body: payload,
        token: tokens.access,
        refreshToken,
      });

      onSaved(updated);
    } catch (e) {
      const msg = e?.data
        ? Object.entries(e.data)
            .map(([k, v]) => `${k}: ${[].concat(v).join(", ")}`)
            .join(" | ")
        : e?.message || "Unable to save changes.";

      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card edit-modal-card">
        <div className="modal-head">
          <div className="modal-title">Edit event</div>
          <button className="modal-icon-btn" type="button" onClick={onClose}>
            ×
          </button>
        </div>

        {error && <div className="error-box modal-error-box">{error}</div>}

        <form className="edit-event-form" onSubmit={handleSave}>
          <div className="field">
            <label>Title</label>
            <input type="text" value={form.title} onChange={set("title")} />
          </div>

          <div className="field">
            <label>Location</label>
            <input type="text" value={form.location} onChange={set("location")} />
          </div>

          <div className="field">
            <label>Description</label>
            <textarea value={form.description} onChange={set("description")} />
          </div>

          <div className="form-grid two-cols">
            <div className="field">
              <label>Start</label>
              <input
                type="datetime-local"
                value={form.start_datetime}
                onChange={set("start_datetime")}
              />
            </div>

            <div className="field">
              <label>End</label>
              <input
                type="datetime-local"
                value={form.end_datetime}
                onChange={set("end_datetime")}
              />
            </div>
          </div>

          <div className="form-grid two-cols">
            <div className="field">
              <label>Max participants</label>
              <input
                type="number"
                min="1"
                value={form.max_participants}
                onChange={set("max_participants")}
                placeholder="Unlimited"
              />
            </div>

            <div className="field">
              <label>Status</label>
              <select value={form.status} onChange={set("status")}>
                <option value="open">Open</option>
                <option value="closed">Closed</option>
                <option value="postponed">Postponed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="modal-actions">
            <button className="btn btn-secondary" onClick={onClose} type="button">
              Cancel
            </button>

            <button className="btn btn-primary" disabled={saving} type="submit">
              {saving ? <LoadingWrap /> : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function DeleteConfirmModal({ eventTitle, onCancel, onConfirm, deleting }) {
  return (
    <div className="modal-backdrop">
      <div className="modal-card confirm-modal-card">
        <div className="confirm-modal-title">Delete event?</div>

        <div className="confirm-modal-text">
          <strong>{eventTitle}</strong> will be permanently deleted. This cannot be undone.
        </div>

        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={onCancel} type="button">
            Cancel
          </button>

          <button
            className="btn btn-danger"
            onClick={onConfirm}
            disabled={deleting}
            type="button"
          >
            {deleting ? <><Spinner /> Deleting…</> : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}