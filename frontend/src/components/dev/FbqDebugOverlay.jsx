"use client";
import { useEffect, useState } from "react";
import { isDebugEnabled } from "@/utils/fbq";

export default function FbqDebugOverlay() {
  const [events, setEvents] = useState([]);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const onEvent = (e) => {
      setEvents((prev) => [{
        ts: e.detail?.timestamp || Date.now(),
        event: e.detail?.event,
        params: e.detail?.params,
      }, ...prev].slice(0, 8));
    };
    const onToggle = () => setEnabled(isDebugEnabled());

    setEnabled(isDebugEnabled());
    window.addEventListener("fbq:tracked", onEvent);
    window.addEventListener("popstate", onToggle);
    window.addEventListener("pushstate", onToggle);
    window.addEventListener("replacestate", onToggle);

    return () => {
      window.removeEventListener("fbq:tracked", onEvent);
      window.removeEventListener("popstate", onToggle);
      window.removeEventListener("pushstate", onToggle);
      window.removeEventListener("replacestate", onToggle);
    };
  }, []);

  if (!enabled) return null;

  return (
    <div style={{
      position: "fixed",
      bottom: 12,
      right: 12,
      width: 360,
      maxHeight: "50vh",
      overflowY: "auto",
      background: "rgba(17,17,17,0.9)",
      color: "#fff",
      fontSize: 12,
      borderRadius: 8,
      padding: 12,
      zIndex: 999999,
      boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
      border: "1px solid rgba(255,255,255,0.1)",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <strong>Meta Pixel Events</strong>
        <button
          onClick={() => setEvents([])}
          style={{ background: "transparent", color: "#aaa", border: "1px solid #444", borderRadius: 6, padding: "2px 8px", cursor: "pointer" }}
        >Clear</button>
      </div>
      {events.length === 0 ? (
        <div style={{ color: "#bbb" }}>No events yet. Trigger actions on the site.</div>
      ) : (
        events.map((ev, idx) => (
          <div key={idx} style={{ marginBottom: 10, paddingBottom: 10, borderBottom: "1px dashed #333" }}>
            <div style={{ fontWeight: 600 }}>{ev.event}</div>
            <div style={{ color: "#aaa" }}>{new Date(ev.ts).toLocaleTimeString()}</div>
            <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-word", background: "#111", padding: 8, borderRadius: 6, marginTop: 6 }}>
              {JSON.stringify(ev.params, null, 2)}
            </pre>
          </div>
        ))
      )}
    </div>
  );
}
