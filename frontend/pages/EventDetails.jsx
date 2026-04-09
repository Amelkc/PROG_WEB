import { ParticipantTable } from "../components/ParticipantTable";
import { StatusBadge } from '../components/Badge';
import { Link, NavLink } from "react-router-dom";
import { DeleteConfirmModal, EditEventModal} from '../components/EventModal'
import { useState, useEffect } from 'react'
import {LoadingWrap} from '../components/LoadingWrap'
import {ErrorBox} from '../components/ErrorBox'




function EventDetails() {
 
  const { id } = useParams();
  const { user, tokens, refreshToken } = useAuth();
  const navigate = useNavigate();

  const { data: eventData, loading, error, reload: reloadEvent } = useApi(`/events/${id}/`);
  const { data: registrations, loading: rl, reload: reloadRegs } = useApi(`/registrations/?event=${id}`, [id]);
  
  const [event, setEvent] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [regLoading, setRegLoading] = useState(false);
  const [regError, setRegError] = useState("");
  const [regSuccess, setRegSuccess] = useState("");
  
  useEffect(() => { if (eventData) setEvent(eventData); }, [eventData]);

  if (loading) return <LoadingWrap />;
  if (error) return <ErrorBox msg={error} />;
  if (!event) return null;


  
  const isAdmin = user?.is_staff;
  const regs = registrations?.results ?? registrations ?? [];
  const myReg = regs.find(r => r.participant === user?.id);
  const isRegistered = !!myReg;
  const isFull = event.max_participants && regs.length >= event.max_participants;
  const canRegister = event.status === "open" && !isFull;


  const handleRegister = async () => {
    setRegLoading(true); setRegError(""); setRegSuccess("");
    try {
      await apiMutate("/registrations/", {
        method: "POST",
        body: { event: event.id, participant: user.id },
        token: tokens.access, refreshToken,
      });
      setRegSuccess("You are now registered for this event.");
      reloadRegs();
    } catch (e) {
      const msg = e.data
        ? Object.entries(e.data).map(([k, v]) => `${[].concat(v).join(", ")}`).join(" | ")
        : e.message;
      setRegError(msg);
    } finally { setRegLoading(false); }
  };

  const handleUnregister = async () => {
    setRegLoading(true); setRegError(""); setRegSuccess("");
    try {
      await apiMutate(`/registrations/${myReg.id}/`, {
        method: "DELETE", token: tokens.access, refreshToken,
      });
      setRegSuccess("You have been unregistered.");
      reloadRegs();
    } catch (e) { setRegError(e.message); }
    finally { setRegLoading(false); }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await apiMutate(`/events/${event.id}/`, { method: "DELETE", token: tokens.access, refreshToken });
      navigate("/events", { replace: true });
    } catch (e) { setDeleting(false); setShowDelete(false); }
  };

  const fields = [
    ["Location", event.location],
    ["Start", event.start_datetime ? new Date(event.start_datetime).toLocaleString() : "—"],
    ["End", event.end_datetime ? new Date(event.end_datetime).toLocaleString() : "—"],
    ["Capacity", event.max_participants ?? "Unlimited"],
    ["Registered", regs.length],
    ["Status", <StatusBadge status={event.status} />],
  ];

  return (
    <div>
      {showEdit && (
        <EditEventModal event={event} onClose={() => setShowEdit(false)}
          onSaved={(updated) => { setEvent(updated); setShowEdit(false); }} />
      )}
      {showDelete && (
        <DeleteConfirmModal eventTitle={event.title} deleting={deleting}
          onCancel={() => setShowDelete(false)} onConfirm={handleDelete} />
      )}

      <Link to="/events" className="back">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 2L4 7l5 5"/></svg>
        Back to events
      </Link>

      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div className="page-title">{event.title}</div>
  
          </div>
          {event.description && <div className="page-sub" style={{ marginTop: 8, maxWidth: 600 }}>{event.description}</div>}
        </div>
        {isAdmin && (
          <div style={{ display: "flex", gap: 10, flexShrink: 0, marginTop: 4 }}>
            <button className="btn btn-sm" onClick={() => setShowEdit(true)}>
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 2l2 2-7 7H2V9L9 2z"/></svg>
              Edit
            </button>
            <button className="btn btn-sm" onClick={() => setShowDelete(true)}
              style={{ color: "var(--red)", borderColor: "rgba(248,113,113,0.3)" }}>
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 3h9M5 3V2h3v1M4 3l.5 8h4L9 3"/></svg>
              Delete
            </button>
          </div>
        )}
      </div>

      <div className="detail-grid">
        <div>
          <div className="card" style={{ marginBottom: 24 }}>
            <div className="section-title">Event details</div>
            {fields.map(([k, v]) => (
              <div key={k} className="detail-row">
                <span className="detail-key">{k} : </span>
                <span className="detail-val">{v}</span>
              </div>
            ))}
          </div>

          <div className="card">
            <div className="section-title">Registered participants</div>
            {rl ? <LoadingWrap /> : regs.length === 0 ? <div className="empty">No participants registered yet</div> : 
            
                <ParticipantTable registrations={ regs }/>
              
            }
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="card">
  
            {regError && <div className="error-box" style={{ marginBottom: 12, fontSize: 13 }}>{regError}</div>}
            {regSuccess && (
              <div style={{ background: "var(--green-bg)", border: "1px solid rgba(62,207,142,0.2)", borderRadius: "var(--radius)", padding: "10px 14px", fontSize: 13, color: "var(--green)", marginBottom: 12 }}>
                {regSuccess}
              </div>
            )}
            {isRegistered ? (
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--green)", flexShrink: 0 }} />
                  <span style={{ fontSize: 14, color: "var(--green)", fontWeight: 500 }}>You're registered</span>
                </div>
                <button className="btn btn-sm" style={{ width: "100%", justifyContent: "center", color: "var(--text2)" }}
                  onClick={handleUnregister} disabled={regLoading}>
                  {regLoading ? <LoadingWrap/> : "Unregister"}
                </button>
              </div>
            ) : (
              <div>
                {!canRegister
                  ? <div style={{ fontSize: 13, color: "var(--text3)" }}>
                      {isFull ? "This event is full." : `Registration is not available (${event.status}).`}
                    </div>
                  : (
                    <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }}
                      onClick={handleRegister} disabled={regLoading}>
                      {regLoading ? <> <Spinner/>Registering…</> : "Register for this event"}
                    </button>
                  )
                }
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


export {EventDetails}
 