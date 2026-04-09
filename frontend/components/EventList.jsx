
import { Link } from "react-router-dom";
import { StatusBadge } from './Badge';
import "../style/EventList.css";

function EventList({data}) {
  return (<div className="card" style={{ padding: 0 }}>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Location</th>
                    <th>Start</th>
                    <th>End</th>
                    <th>Capacity</th>
                    <th>Status</th>
                  </tr>
                </thead>
              <tbody>
                {data.length === 0 && (<tr><td colSpan={6} className="empty">No events</td></tr>)}
                {data.map(ev => (
                  <tr key={ev.id}>
                    <td><Link to={`/events/test`}>{ev.title}</Link></td>
                    <td>{ev.location}</td>
                    <td style={{ whiteSpace: "nowrap" }}>{ev.start_datetime ? new Date(ev.start_datetime).toLocaleDateString() : "—"}</td>
                    <td style={{ whiteSpace: "nowrap" }}>{ev.end_datetime ? new Date(ev.end_datetime).toLocaleDateString() : "—"}</td>
                    <td>{ev.max_participants ?? "∞"}</td>
                    <td><StatusBadge status={ev.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
  );
}

export {EventList}