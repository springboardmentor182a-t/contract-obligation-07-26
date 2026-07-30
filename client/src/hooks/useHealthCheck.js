import { useState, useEffect } from "react";

export function useHealthCheck(intervalMs = 30000) {
  const [status, setStatus] = useState("CHECKING"); // CHECKING, OK, DEGRADED, OFFLINE
  const [details, setDetails] = useState({
    api: { status: "CHECKING", latency: null },
    database: { status: "CHECKING", latency: null },
    queue: { status: "CHECKING", msg: "" }
  });

  useEffect(() => {
    let active = true;
    let timerId;

    async function checkHealth() {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s timeout
        
        const start = Date.now();
        const API_BASE =
        (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL) ||
        process.env.REACT_APP_API_BASE_URL ||
        "https://contract-obligation-demo-group-c.onrender.com/api";
        const res = await fetch(`${API_BASE}/health`, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (!active) return;

        if (res.ok) {
          const data = await res.json();
          const latency = Date.now() - start;
          
          setStatus(data.status.toUpperCase());
          setDetails({
            api: { status: data.services?.api?.status?.toUpperCase() || "OK", latency: data.services?.api?.latency_ms || Math.round(latency) },
            database: { status: data.services?.database?.status?.toUpperCase() || "OK", latency: data.services?.database?.latency_ms },
            queue: { status: data.services?.queue?.status?.toUpperCase() || "OK", msg: data.services?.queue?.message || "" }
          });
        } else {
          // Degraded response (non-200)
          setStatus("DEGRADED");
          setDetails({
            api: { status: "DEGRADED", latency: null },
            database: { status: "DEGRADED", latency: null },
            queue: { status: "DEGRADED", msg: `Server responded with status ${res.status}` }
          });
        }
      } catch (err) {
        if (!active) return;
        console.warn("Health check request failed:", err);
        setStatus("OFFLINE");
        setDetails({
          api: { status: "OFFLINE", latency: null },
          database: { status: "OFFLINE", latency: null },
          queue: { status: "OFFLINE", msg: "Could not establish connection to host API" }
        });
      }
    }

    checkHealth();
    timerId = setInterval(checkHealth, intervalMs);

    return () => {
      active = false;
      clearInterval(timerId);
    };
  }, [intervalMs]);

  return { status, details };
}
