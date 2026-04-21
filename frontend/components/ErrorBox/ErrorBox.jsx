import "./ErrorBox.css";

export function ErrorBox({ msg }) {
    return (
    <div className="error-box">Error: {msg}</div>);
}
 