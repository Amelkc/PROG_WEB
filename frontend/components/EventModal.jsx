
import { useState } from 'react'
import { LoadingWrap } from './LoadingWrap';
import '../style/EditForm.css'

export function EditEventModal({ event, onClose, onSaved }) {
  {/* const { tokens, refreshToken } = useAuth(); */}
  const [form, setForm] = useState({
    title: event.title,
    description: event.description ?? "",
    location: event.location,
    start_datetime: event.start_datetime ? event.start_datetime.slice(0, 16) : "",
    end_datetime: event.end_datetime ? event.end_datetime.slice(0, 16) : "",
    max_participants: event.max_participants ?? "",
    status: event.status,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSave = async () => {
    setSaving(true); setError("");
    try {
      const payload = {
        ...form,
        start_datetime: form.start_datetime || null,
        end_datetime: form.end_datetime || null,
        max_participants: form.max_participants === "" ? null : Number(form.max_participants),
      };
       {/*const updated = await apiMutate(`/events/${event.id}/`, {
        method: "PATCH", body: payload, token: tokens.access, refreshToken,
      });*/}
      const updated = true
      onSaved(updated);
    } catch (e) {
      const msg = e.data
        ? Object.entries(e.data).map(([k, v]) => `${k}: ${[].concat(v).join(", ")}`).join(" | ")
        : e.message;
      setError(msg);
    } finally { setSaving(false); }
  };

  return (
    <div className='form-edit'>
      <div style={{ background: "var(--bg2)", border: "1px solid var(--border2)", borderRadius: "var(--radius-lg)", width: "100%", maxWidth: 520, padding: 32, maxHeight: "90vh", overflowY: "auto" }}>
        <div className='edit-title'>
          <div style={{  fontSize: 18, fontWeight: 700, color: "var(--text)" }}>Edit event</div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text3)", fontSize: 20, lineHeight: 1 }}>×</button>
        </div>

        {error && <div className="error-box" style={{ marginBottom: 16 }}>{error}</div>}

        <div style={{ display: "grid", gap: 14 }}>
          {[["Title", "title", "text"], ["Location", "location", "text"]].map(([label, key, type]) => (
            <div className="field" key={key}>
              <label>{label}</label>
              <input type={type} value={form[key]} onChange={set(key)} style={{ width: "100%" }} />
            </div>
          ))}

          <div className="field">
            <label>Description</label>
            <textarea value={form.description} onChange={set("description")}
              style={{ width: "100%", background: "var(--bg3)", border: "1px solid var(--border2)", borderRadius: "var(--radius)", padding: "9px 14px", color: "var(--text)", fontFamily: "var(--font-body)", fontSize: 14, resize: "vertical", minHeight: 80, outline: "none" }} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div className="field">
              <label>Start</label>
              <input type="datetime-local" value={form.start_datetime} onChange={set("start_datetime")} style={{ width: "100%" }} />
            </div>
            <div className="field">
              <label>End</label>
              <input type="datetime-local" value={form.end_datetime} onChange={set("end_datetime")} style={{ width: "100%" }} />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div className="field">
              <label>Max participants</label>
              <input type="number" min="1" value={form.max_participants} onChange={set("max_participants")} placeholder="Unlimited" style={{ width: "100%" }} />
            </div>
            <div className="field">
              <label>Status</label>
              <select value={form.status} onChange={set("status")} style={{ width: "100%" }}>
                <option value="open">Open</option>
                <option value="closed">Closed</option>
                <option value="postponed">Postponed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 24, justifyContent: "flex-end" }}>
          <button className="btn" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? <LoadingWrap /> : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

export function DeleteConfirmModal({ eventTitle, onCancel, onConfirm, deleting }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ background: "var(--bg2)", border: "1px solid var(--border2)", borderRadius: "var(--radius-lg)", width: "100%", maxWidth: 400, padding: 32 }}>
        <div style={{ fontFamily: "var(--font-head)", fontSize: 18, fontWeight: 700, color: "var(--text)", marginBottom: 10 }}>Delete event?</div>
        <div style={{ fontSize: 14, color: "var(--text2)", marginBottom: 24 }}>
          <strong style={{ color: "var(--text)" }}>{eventTitle}</strong> will be permanently deleted. This cannot be undone.
        </div>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button className="btn" onClick={onCancel}>Cancel</button>
          <button className="btn" onClick={onConfirm} disabled={deleting}
            style={{ background: "var(--red-bg)", borderColor: "rgba(248,113,113,0.3)", color: "var(--red)" }}>
            {deleting ? <><Spinner /> Deleting…</> : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}