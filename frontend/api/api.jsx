import { useState, useEffect, useCallback } from "react";

import { useAuth } from "../context/AuthContext.jsx"; // adjust path as needed

const API_BASE = "http://localhost:8000/api";

export async function apiFetch(path, { token, method = "GET", body, params } = {}) {
  const url = new URL(`${API_BASE}${path}`);
  if (params) Object.entries(params).forEach(([k, v]) => v && url.searchParams.set(k, v));
  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw Object.assign(new Error(err.detail || "Request failed"), { status: res.status, data: err });
  }
  return res.status === 204 ? null : res.json();
}

export function useApi(path, deps = [], options = {}) {
  const { tokens, refreshToken } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    if (!path) return;
    setLoading(true); setError(null);
    try {
      let token = tokens.access;
      try {
        const result = await apiFetch(path, { token, ...options });
        setData(result);
      } catch (e) {
        if (e.status === 401) {
          token = await refreshToken();
          if (token) setData(await apiFetch(path, { token, ...options }));
        } else throw e;
      }
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }, [path, tokens.access, ...deps]);

  useEffect(() => { load(); }, [load]);
  return { data, loading, error, reload: load };
}


export async function apiMutate(path, { method, body, token, refreshToken } = {}) {
  try {
    return await apiFetch(path, { method, body, token });
  } catch (e) {
    if (e.status === 401 && refreshToken) {
      const newToken = await refreshToken();
      if (newToken) return apiFetch(path, { method, body, token: newToken });
    }
    throw e;
  }
}