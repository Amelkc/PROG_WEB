
import { LoadingWrap } from "./LoadingWrap";


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
    <div>
      <div className="page-header">
        <div className="page-title">Dashboard</div>
        <div className="page-sub">Welcome back, {user?.first_name}. Here's your overview.</div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Events</div>
          <div className="stat-value">{evList.length}</div>
          <div className="stat-change stat-accent">{open} open</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Participants</div>
          <div className="stat-value">{pList.length}</div>
          <div className="stat-change stat-green">registered users</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Registrations</div>
          <div className="stat-value">{rList.length}</div>
          <div className="stat-change stat-accent">across all events</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Cancelled</div>
          <div className="stat-value">{cancelled}</div>
          <div className="stat-change" style={{ color: "var(--red)" }}>events</div>
        </div>
      </div>

  

        <div className="card">
          <div className="section-title">Event breakdown</div>
          {["open", "closed", "postponed", "cancelled"].map(s => {
            const count = evList.filter(e => e.status === s).length;
            const pct = evList.length ? Math.round((count / evList.length) * 100) : 0;
            return (
              <div key={s} style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 5 }}>
                  <span style={{ textTransform: "capitalize", color: "var(--text2)" }}>{s}</span>
                  <span style={{ color: "var(--text3)" }}>{count} ({pct}%)</span>
                </div>
                <div style={{ height: 4, background: "var(--bg4)", borderRadius: 2 }}>
                  <div style={{ height: "100%", width: `${pct}%`, background: "var(--accent)", borderRadius: 2, transition: "width 0.6s ease" }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
 
  );
}