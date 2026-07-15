const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://flow-bot-d075.onrender.com";

export async function fetchWithAuth(path: string, options: RequestInit = {}) {
  const token = localStorage.getItem("flowbot_token");
  
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (res.status === 401) {
    // Session expired — redirect to login
    if (typeof window !== "undefined") {
      localStorage.removeItem("flowbot_token");
      window.location.href = "/login";
    }
  }

  return res;
}
