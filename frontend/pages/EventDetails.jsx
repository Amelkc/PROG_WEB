import { ParticipantTable } from "../components/ParticipantTable";
import { StatusBadge } from '../components/Badge';
import { Link, useParams, useNavigate } from "react-router-dom";
import { DeleteConfirmModal, EditEventModal } from '../components/EventModal'
import { useState, useEffect } from 'react'
import { LoadingWrap } from '../components/LoadingWrap'
import { ErrorBox } from '../components/ErrorBox'
import { Spinner } from "../components/Spinner";
import { useAuth } from "../context/AuthContext";
import { useApi, apiMutate } from "../api/api";
import "../style/EventDetails.css";



function EventDetails() {
 
  const { id } = useParams();
  const { user, tokens, refreshToken } = useAuth();
  const navigate = useNavigate();

  const { data: eventData, loading, error, reload: reloadEvent } = useApi(`/events/${id}/`, [id]);
  const { data: registrations, loading: rl, reload: reloadRegs } = useApi(`/registrations/?event=${id}`, [id]);
  
  const [event, setEvent] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [regLoading, setRegLoading] = useState(false);
  const [regError, setRegError] = useState("");
  const [regSuccess, setRegSuccess] = useState("");
  
  useEffect(() => { if (eventData) setEvent(eventData); }, [eventData]);


  if (loading) return <LoadingWrap />;
  if (error) return <ErrorBox msg={error} />;
  if (!event) return null;


  const isAdmin = user?.is_staff || user?.is_superuser;
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
      reloadEvent();
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
      reloadEvent();
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
    <div className="event-details-page">
      {showEdit && (
        <EditEventModal event={event} onClose={() => setShowEdit(false)}
          onSaved={(updated) => { setEvent(updated); setShowEdit(false); reloadEvent(); }} />
      )}
      {showDelete && (
        <DeleteConfirmModal eventTitle={event.title} deleting={deleting}
          onCancel={() => setShowDelete(false)} onConfirm={handleDelete} />
      )}

      {showParticipants && (
        <div className="modal-backdrop" onClick={() => setShowParticipants(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <div className="section-title">Registered participants</div>
              <button className="btn btn-sm" onClick={() => setShowParticipants(false)}>Close</button>
            </div>

            {rl ? <LoadingWrap /> : regs.length === 0 ? <div className="empty">No participants registered yet</div> :
              <ParticipantTable registrations={regs} />
            }
          </div>
        </div>
      )}


      <Link to="/events" className="back">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 2L4 7l5 5"/></svg>
        Back to events
      </Link>


      <div className="page-header">
        <div>
          <div className="title-row">
            <div className="page-title">{event.title}</div>
          </div>
          {event.description && <div className="page-sub">{event.description}</div>}
        </div>

        {isAdmin && (
          <div className="header-actions">
            <button className="btn btn-sm" onClick={() => setShowEdit(true)}>
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 2l2 2-7 7H2V9L9 2z"/></svg>
              Edit
            </button>
            <button className="btn btn-sm"
              onClick={() => setShowDelete(true)}
              style={{ color: "var(--red)", borderColor: "rgba(248,113,113,0.3)" }}>
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 3h9M5 3V2h3v1M4 3l.5 8h4L9 3"/></svg>
              Delete
            </button>
          </div>
        )}
      </div>


      <div className="detail-grid">
        <div>
          <div className="card card-spaced">
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

            {rl ? (
              <LoadingWrap />
            ) : (
              <div className="participants-summary">
                <div className="participants-count">
                  {regs.length} participant{regs.length !== 1 ? "s" : ""}
                </div>

                {isAdmin && (
                  <button className="details-trigger" onClick={() => setShowParticipants(true)}>
                    + Details
                  </button>
                )}
              </div>
            )}
          </div>
        </div>


        <div className="side-column">
          <div className="card">
            {regError && <div className="error-box">{regError}</div>}
            {regSuccess && (
              <div className="success-box">
                {regSuccess}
              </div>
            )}

            {isRegistered ? (
              <div>
                <div className="registered-head">
                  <div className="registered-dot" />
                  <span className="registered-text">You're registered</span>
                </div>

                <button className="btn btn-sm full-btn unregister-btn"
                  onClick={handleUnregister} disabled={regLoading}>
                  {regLoading ? <LoadingWrap /> : "Unregister"}
                </button>
              </div>
            ) : (
              <div>
                {!canRegister
                  ? <div className="detail-val">
                      {isFull ? "This event is full." : `Registration is not available (${event.status}).`}
                    </div>
                  : (
                    <button className="btn btn-primary full-btn"
                      onClick={handleRegister} disabled={regLoading}>
                      {regLoading ? <><Spinner /> Registering…</> : "Register for this event"}
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



export { EventDetails }