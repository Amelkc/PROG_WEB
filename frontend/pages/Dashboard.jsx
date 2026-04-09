
import { LoadingWrap } from "../components/LoadingWrap";
import { useApi } from "../api/api.jsx"
import { useAuth } from "../context/AuthContext.jsx";
import "../style/Dashboard.css"

export function DashboardPage() {
  const { data: events, loading: el } = useApi("/events/");
  const { data: participants, loading: pl } = useApi("/participants/");
  const { data: registrations, loading: rl } = useApi("/registrations/");
  const { user } = useAuth();

  if (el || pl || rl) return <LoadingWrap />;

  const evList = events?.results ?? events ?? [];
  const pList = participants?.results ?? participants ?? [];
  const rList = registrations?.results ?? registrations ?? [];

  const open = evList.filter(e => e.status === "open").length;
  const cancelled = evList.filter(e => e.status === "cancelled").length;

  const recentEvents = [...evList].slice(-4).reverse();

  return (
    <div className="dashboard">

      <header className="dashboard-header">
        <h2>Dashboard</h2>
        <p>Welcome back, {user?.first_name}.</p>
      </header>

      <div className="stats-grid">
        {[
          { label: "Total Events",   value: evList.length, note: `${open} open`,           mod: "accent" },
          { label: "Participants",   value: pList.length,  note: "registered users",        mod: "green"  },
          { label: "Registrations",  value: rList.length,  note: "across all events",       mod: "accent" },
          { label: "Cancelled",      value: cancelled,     note: "events",                  mod: "red"    },
        ].map(({ label, value, note, mod }) => (
          <div key={label} className="stat-card">
            <span className="stat-label">{label}</span>
            <span className="stat-value">{value}</span>
            <span className={`stat-note stat-note--${mod}`}>{note}</span>
          </div>
        ))}
      </div>

      <div className="card">
        <h3 className="section-title">Event breakdown</h3>
        {["open", "closed", "postponed", "cancelled"].map(s => {
          const count = evList.filter(e => e.status === s).length;
          const pct   = evList.length ? Math.round((count / evList.length) * 100) : 0;
          return (
            <div key={s} className="breakdown-row">
              <div className="breakdown-meta">
                <span className="breakdown-label">{s}</span>
                <span className="breakdown-count">{count} ({pct}%)</span>
              </div>
              <div className="breakdown-track">
                <div className="breakdown-bar" style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}