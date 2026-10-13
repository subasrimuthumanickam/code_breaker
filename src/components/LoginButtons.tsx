import { useState } from "react";

const API_URL = "http://localhost:5000/api"; // change to your backend URL

export type Player = {
  id: number;
  name: string;
  type: "user" | "guest";
};

type Props = { onLogin: (player: Player) => void };

// One id per device, saved in the browser so the same player comes back next time
function getDeviceId(): string {
  let id = localStorage.getItem("deviceId");
  if (!id) {
    id =
      (crypto as any).randomUUID?.() ??
      `${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
    localStorage.setItem("deviceId", id as string);
  }
  return id as string;
}

export default function LoginButtons({ onLogin }: Props) {
  const [loading, setLoading] = useState<"login" | "guest" | null>(null);
  const [error, setError] = useState("");

  const send = async (mode: "login" | "guest") => {
    if (loading) return;
    try {
      setLoading(mode);
      setError("");

      // 1. Frontend sends request to backend
      const res = await fetch(`${API_URL}/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deviceId: getDeviceId() }),
      });

      // 2. Backend sends response in JSON format
      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || "Something went wrong");
        return;
      }
      onLogin(data.player);
    } catch {
      setError("Cannot connect to server");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div style={styles.wrap}>
      <button
        onClick={() => send("login")}
        disabled={!!loading}
        style={{ ...styles.base, ...styles.primary, opacity: loading ? 0.8 : 1 }}
      >
        <UserIcon />
        <span style={styles.label}>
          {loading === "login" ? "Please wait..." : "Login"}
        </span>
        <ArrowIcon />
      </button>

      <button
        onClick={() => send("guest")}
        disabled={!!loading}
        style={{ ...styles.base, ...styles.secondary, opacity: loading ? 0.8 : 1 }}
      >
        <GuestIcon />
        <span style={styles.label}>
          {loading === "guest" ? "Please wait..." : "Play as Guest"}
        </span>
        <ArrowIcon />
      </button>

      {error && <p style={styles.error}>{error}</p>}
    </div>
  );
}

/* ---------- icons (inline SVG, no extra package needed) ---------- */
const UserIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff">
    <circle cx="12" cy="8" r="4.2" />
    <path d="M3.5 21c0-4.4 3.8-7 8.5-7s8.5 2.6 8.5 7z" />
  </svg>
);

const GuestIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c9c4ff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 11h18" />
    <path d="M6 11l1.6-5.5a1.5 1.5 0 0 1 1.4-1h6a1.5 1.5 0 0 1 1.4 1L18 11" />
    <circle cx="8" cy="16.5" r="2.5" />
    <circle cx="16" cy="16.5" r="2.5" />
    <path d="M10.5 16.5h3" />
  </svg>
);

const ArrowIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14" />
    <path d="M13 6l6 6-6 6" />
  </svg>
);

/* ---------- styles (match the dark card theme / button look) ---------- */
const styles: Record<string, React.CSSProperties> = {
  wrap: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: 14,
  },
  base: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    padding: "15px 22px",
    borderRadius: 999,
    fontSize: 17,
    fontWeight: 700,
    color: "#fff",
    cursor: "pointer",
    border: "none",
    boxSizing: "border-box",
  },
  primary: {
    background: "linear-gradient(90deg, #3b82f6 0%, #6d4aff 55%, #8b3dff 100%)",
    boxShadow: "0 8px 24px rgba(91, 63, 217, 0.45)",
  },
  secondary: {
    background: "rgba(40, 36, 120, 0.35)",
    border: "2px solid #5b6cff",
    color: "#e6e3ff",
  },
  label: { flex: 1, textAlign: "center" },
  error: {
    color: "#ff6b6b",
    fontSize: 13,
    textAlign: "center",
    margin: "4px 0 0",
  },
};
