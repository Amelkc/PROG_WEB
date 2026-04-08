import { ParticipantTable } from "./ParticipantTable";
import { StatusBadge } from './Badge';
import { Link, NavLink } from "react-router-dom";
import { DeleteConfirmModal, EditEventModal} from './EventModal'
import { useState, useEffect } from 'react'
import {LoadingWrap} from './LoadingWrap'
import {ErrorBox} from './ErrorBox'

export const mockEvent = {
  id: 1,
  title: "Machine Learning Study Day",
  description: "A full-day workshop on transformer architectures and vision models. Hands-on sessions with DINOv2 and ViT fine-tuning on medical imaging datasets.",
  location: "Salle 3B, Campus Paris-Saclay",
  start_datetime: "2026-04-15T09:00:00Z",
  end_datetime:   "2026-04-15T18:00:00Z",
  max_participants: 5,
  status: "open",
};

export const mockRegistrations = {
  results: [
    {
      id: 1,
      event: 1,
      participant: 1,
      participant_detail: {
        id: 1,
        first_name: "Amel",
        last_name: "K",
        email: "amel.k@example.com",
      },
    },
    {
      id: 2,
      event: 1,
      participant: 2,
      participant_detail: {
        id: 2,
        first_name: "Lucas",
        last_name: "Martin",
        email: "lucas.martin@example.com",
      },
    },
    {
      id: 3,
      event: 1,
      participant: 3,
      participant_detail: {
        id: 3,
        first_name: "Sofia",
        last_name: "Benali",
        email: "sofia.benali@example.com",
      },
    },
    {
      id: 4,
      event: 1,
      participant: 4,
      // no participant_detail → tests the ?? fallback
      participant_detail: null,
    },
  ],
};






function EventDetails() {
  {/**
  const { id } = useParams();
  const { user, tokens, refreshToken } = useAuth();
  const navigate = useNavigate();

  const { data: eventData, loading, error, reload: reloadEvent } = useApi(`/events/${id}/`);
  const { data: registrations, loading: rl, reload: reloadRegs } = useApi(`/registrations/?event=${id}`, [id]);
   */}
  const [event, setEvent] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [regLoading, setRegLoading] = useState(false);
  const [regError, setRegError] = useState("");
  const [regSuccess, setRegSuccess] = useState("");
  
  const eventData = mockEvent;
  useEffect(() => { if (eventData) setEvent(eventData); }, [eventData]);
  const loading = false;
  const error = null;
  if (loading) return <LoadingWrap />;
  if (error) return <ErrorBox msg={error} />;
  if (!event) return null;

  const registrations = mockRegistrations;
const regs = registrations?.results ?? []; 
  const rl= false ;
  const isAdmin = true;
  const isFull = event.max_participants && regs.length >= event.max_participants;
  const canRegister = event.status === "open" && !isFull;
  const isRegistered = false;
  
  {/*
  const isAdmin = user?.is_staff;
  const regs = registrations?.results ?? registrations ?? [];
  const myReg = regs.find(r => r.participant === user?.id);
  const isRegistered = !!myReg;
  const isFull = event.max_participants && regs.length >= event.max_participants;
  const canRegister = event.status === "open" && !isFull;
  */}

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
                      {regLoading ? <> <LoadingWrap/>Registering…</> : "Register for this event"}
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
 