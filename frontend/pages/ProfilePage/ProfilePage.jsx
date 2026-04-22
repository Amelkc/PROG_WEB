import { useNavigate, useParams } from "react-router-dom";
import { ErrorBox } from "../../components/ErrorBox/ErrorBox";
import { LoadingWrap } from "../../components/LoadingWrap/LoadingWrap";
import { useAuth } from "../../context/AuthContext";
import { useState, useEffect} from "react";
import { apiMutate, useApi } from "../../api/api";
import { StatusBadge } from "../../components/Badge/Badge";
import { Spinner } from "../../components/Spinner/Spinner";

export function ProfilePage() {
  const { id: routeId } = useParams();
  const { user: me, tokens, refreshToken, updateUser, logout } = useAuth();
  const navigate = useNavigate();

  const targetId = routeId ?? me?.id;
  const isOwnProfile = String(targetId) === String(me?.id);
  const isAdmin = me?.is_staff;
  const canEdit = isOwnProfile || isAdmin;
 
  const { data: profileData, loading, error, reload } = useApi(`/participants/${targetId}/`, [targetId]);
 
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [pwForm, setPwForm] = useState({ current: "", new: "", confirm: "" });
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState("");
  const [pwSaving, setPwSaving] = useState(false);
 
  useEffect(() => {
    if (profileData) {
      setForm({
        first_name: profileData.first_name,
        last_name: profileData.last_name,
        email: profileData.email,
        username: profileData.username,
      });
    }
  }, [profileData]);
 
  if (loading) return <LoadingWrap />;
  if (error) return <ErrorBox msg={error} />;
  if (!profileData || !form) return null;
 
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));
 
  const handleSave = async () => {
    setSaving(true); setSaveError(""); setSaveSuccess("");
    try {
      const updated = await apiMutate(`/participants/${targetId}/`, {
        method: "PATCH", body: form, token: tokens.access, refreshToken,
      });
      if (isOwnProfile) updateUser(updated);
      setSaveSuccess("Profile updated successfully.");
      reload();
    } catch (e) {
      const msg = e.data
        ? Object.entries(e.data).map(([, v]) => [].concat(v).join(", ")).join(" | ")
        : e.message;
      setSaveError(msg);
    } finally { setSaving(false); }
  };
 
  const handlePasswordChange = async () => {
    setPwError(""); setPwSuccess("");
    if (pwForm.new !== pwForm.confirm) { setPwError("New passwords do not match."); return; }
    if (pwForm.new.length < 8) { setPwError("Password must be at least 8 characters."); return; }
    setPwSaving(true);
    const url = isAdmin && !isOwnProfile ? `/participants/${targetId}/set_password/` : `/participants/change_password/`;      
    try {
      await apiMutate(url, {
        method: "POST",
        body: isAdmin && !isOwnProfile
          ? { new_password: pwForm.new }
          : { current_password: pwForm.current, new_password: pwForm.new },
        token: tokens.access, refreshToken,
      });
      setPwSuccess("Password changed successfully.");
      setPwForm({ current: "", new: "", confirm: "" });
    } catch (e) {
      setPwError(e.data?.detail ?? e.message);
    } finally { setPwSaving(false); }
  };
 
  const handleDelete = async () => {
    setDeleting(true);
    try {
      await apiMutate(`/participants/${targetId}/`, { method: "DELETE", token: tokens.access, refreshToken });
      if (isOwnProfile) logout();
      else navigate("/participants", { replace: true });
    } catch (e) { setDeleting(false); setShowDeleteConfirm(false); }
  };
 
  return (
  <div className="profile-page">
    {!isOwnProfile && (
      <Link to="/participants" className="back">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M9 2L4 7l5 5"/>
        </svg>
        Back to participants
      </Link>
    )}

    <div className="page-header">
      <h2 className="page-title">
        {isOwnProfile ? "My profile" : `${profileData.first_name} ${profileData.last_name}`}
      </h2>
      <p className="page-sub">
        {isOwnProfile ? "Manage your account information" : "Editing as admin"}
      </p>
    </div>

    {showDeleteConfirm && (
      <DeleteConfirmModal
        eventTitle={`${profileData.first_name} ${profileData.last_name}'s account`}
        deleting={deleting}
        onCancel={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
      />
    )}

    <div className="profile-layout">

      <aside className="profile-aside">
        <div className="card profile-identity">
          <svg xmlns="http://www.w3.org/2000/svg" width="100px" height="100px" viewBox="0 0 16 16">
          <path d="m 8 1 c -1.65625 0 -3 1.34375 -3 3 s 1.34375 3 3 3 s 3 -1.34375 3 -3 s -1.34375 -3 -3 -3 z m -1.5 7 c -2.492188 0 -4.5 2.007812 -4.5 4.5 v 0.5 c 0 1.109375 0.890625 2 2 2 h 8 c 1.109375 0 2 -0.890625 2 -2 v -0.5 c 0 -2.492188 -2.007812 -4.5 -4.5 -4.5 z m 0 0" fill="#fff"/>
          </svg>
          <p className="profile-name-lg">{profileData.first_name} {profileData.last_name}</p>
          <p className="profile-meta">{profileData.email}</p>
          <StatusBadge status={profileData.is_staff ? "Admin" : "Viewer"}></StatusBadge>
     
        </div>

        {canEdit && (
            <button className="btn btn-danger-outline btn-full" onClick={() => setShowDeleteConfirm(true)}>
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M2 3h9M5 3V2h3v1M4 3l.5 8h4L9 3"/>
              </svg>
              {isOwnProfile ? "Delete my account" : "Delete account"}
            </button>
         
        )}
      </aside>

   
      <div className="profile-forms">

        <section className="card">
          <h3 className="section-title">Account information</h3>
          {saveError   && <p className="error-box">{saveError}</p>}
          {saveSuccess && <p className="success-box">{saveSuccess}</p>}

          <fieldset className="field-grid" disabled={!canEdit}>
            <div className="field">
              <label>First name</label>
              <input value={form.first_name} onChange={set("first_name")} />
            </div>
            <div className="field">
              <label>Last name</label>
              <input value={form.last_name} onChange={set("last_name")} />
            </div>
            <div className="field">
              <label>Username</label>
              <input value={form.username} onChange={set("username")} />
            </div>
            <div className="field">
              <label>Email</label>
              <input type="email" value={form.email} onChange={set("email")} />
            </div>
          </fieldset>

          {canEdit && (
            <footer className="form-footer">
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? <><Spinner /> Saving…</> : "Save changes"}
              </button>
            </footer>
          )}
        </section>

        {canEdit && (
          <section className="card">
            <h3 className="section-title">Change password</h3>
            {pwError   && <p className="error-box">{pwError}</p>}
            {pwSuccess && <p className="success-box">{pwSuccess}</p>}

            <fieldset className="field-grid">
              {isOwnProfile && (
                <div className="field field-full">
                  <label>Current password</label>
                  <input type="password" value={pwForm.current} placeholder="••••••••"
                    onChange={e => setPwForm(f => ({ ...f, current: e.target.value }))} />
                </div>
              )}
              <div className="field">
                <label>New password</label>
                <input type="password" value={pwForm.new} placeholder="min. 8 characters"
                  onChange={e => setPwForm(f => ({ ...f, new: e.target.value }))} />
              </div>
              <div className="field">
                <label>Confirm new password</label>
                <input type="password" value={pwForm.confirm} placeholder="••••••••"
                  onChange={e => setPwForm(f => ({ ...f, confirm: e.target.value }))} />
              </div>
            </fieldset>

            <footer className="form-footer">
              <button className="btn btn-primary" onClick={handlePasswordChange} disabled={pwSaving}>
                {pwSaving ? <><Spinner/> Updating…</> : "Update password"}
              </button>
            </footer>
          </section>
        )}

      </div>
    </div>
  </div>
);
}