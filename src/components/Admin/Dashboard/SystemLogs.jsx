import React, { useState, useEffect, useRef, useCallback } from "react";

const LOGS_HEIGHT = "calc(100vh - 50px)";

const SystemLogs = () => {
  const [logs, setLogs] = useState([]);
  const [hasMoreLogs, setHasMoreLogs] = useState(true);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const logsEndRef = useRef(null);

  // Safe ref assignment
  const setLogsEndRef = useCallback((node) => {
    logsEndRef.current = node;
  }, []);

  /* ── FETCH LOGS (PAGINATED) ── */
  const fetchLogs = async (reset = false) => {
    try {
      setLoading(!reset);
      const { api } = await import("@/lib/axiosHeader");
      const res = await api.get(`/logs?page=${reset ? 1 : page}&limit=20`);
      const newLogs = res.data.logs || [];

      setLogs((prev) => (reset ? newLogs : [...prev, ...newLogs]));
      setHasMoreLogs(res.data.pagination?.page < res.data.pagination?.pages);
      if (reset) setPage(2);
      else setPage((p) => p + 1);
    } catch (e) {
      console.error("Failed to load logs", e);
    } finally {
      setLoading(false);
    }
  };

  // Initial load for logs
  useEffect(() => {
    fetchLogs(true);
  }, []);

  // Infinite scroll observer for logs
  useEffect(() => {
    if (!hasMoreLogs || loading) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          fetchLogs();
        }
      },
      { threshold: 0.1 }
    );

    const currentNode = logsEndRef.current;
    if (currentNode) {
      observer.observe(currentNode);
    }

    return () => {
      if (currentNode) {
        observer.unobserve(currentNode);
      }
    };
  }, [hasMoreLogs, loading, logs]);

  const formatLogTime = (iso) => {
    const now = Date.now();
    const diff = now - new Date(iso).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return "just now";
    if (minutes < 60) return `${minutes} min${minutes > 1 ? "s" : ""} ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    return new Date(iso).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      className="rounded-xl shadow p-4 sm:p-6 bg-card flex flex-col h-[400px] "
      style={{ height: LOGS_HEIGHT }}
    >
      <h2 className="text-lg sm:text-xl font-semibold mb-4">System Logs</h2>

      <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
        {logs.length === 0 && !loading ? (
          <p className="text-center text-muted-foreground">No logs yet.</p>
        ) : (
          <>
            {logs.map((log) => (
              <div key={log._id} className="border-l-4 border-blue-500 pl-4">
                <p className="font-medium text-foreground text-sm sm:text-base">
                  {log.message}
                </p>
                <span className="text-xs sm:text-sm text-muted-foreground">
                  {log.createdByName} • {formatLogTime(log.createdAt)}
                </span>
              </div>
            ))}

            {/* Infinite Scroll Trigger */}
            {hasMoreLogs && (
              <div
                ref={setLogsEndRef}
                className="py-2 text-center text-sm text-muted-foreground"
              >
                Loading more...
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SystemLogs;
