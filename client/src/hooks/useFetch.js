import { useState, useEffect, useCallback, useRef } from "react";
import { API_BASE } from "../config/api";
export default function useFetch(url, options) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(!!url);
  const [error, setError] = useState(null);
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const run = useCallback(async (overrideUrl) => {
    const target = overrideUrl || url;
    if (!target) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(target, optionsRef.current);
      if (!res.ok) throw new Error("Request failed with status " + res.status);
      const contentType = res.headers.get("content-type") || "";
      const body = contentType.includes("application/json") ? await res.json() : await res.text();
      setData(body);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  return { data, loading, error, refetch: run };
}
