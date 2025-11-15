import React, { useEffect, useRef, useCallback, useState } from "react";
import { useCrudOperations } from "@/hooks/useCrudOperations";
import { format } from "date-fns";

const LOGS_HEIGHT = "calc(100vh - 50px)";

const formatLogTime = (iso) => {
  const date = new Date(iso);
  return format(date, "MMM d, yyyy • HH:mm");
};

const SystemLogs = () => {
  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMoreLogs, setHasMoreLogs] = useState(true);
  const logsEndRef = useRef(null);

  const { loading } = useCrudOperations("logs");

  const setLogsEndRef = useCallback((node) => {
    logsEndRef.current = node;
  }, []);

  const fetchLogs = async (reset = false) => {
    try {
      const { api } = await import("@/lib/axiosHeader");
      const res = await api.get(`/logs?page=${reset ? 1 : page}&limit=20`);
      const newLogs = res.data.logs || [];

      setLogs((prev) => (reset ? newLogs : [...prev, ...newLogs]));
      setHasMoreLogs(res.data.pagination?.page < res.data.pagination?.pages);
      if (reset) setPage(2);
      else setPage((p) => p + 1);
    } catch (e) {
      console.error("Failed to load logs", e);
    }
  };

  useEffect(() => {
    fetchLogs(true);
  }, []);

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
    if (currentNode) observer.observe(currentNode);

    return () => {
      if (currentNode) observer.unobserve(currentNode);
    };
  }, [hasMoreLogs, loading]);

  return (
    <div
      className="rounded-xl shadow p-4 sm:p-6 bg-card flex flex-col"
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

                {/* Name + Full Date & Time */}
                <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground mt-1">
                  <span className="font-medium">{log.createdByName}</span>
                  <span className="text-muted-foreground/70">•</span>
                  <span>{formatLogTime(log.createdAt)}</span>
                </div>
              </div>
            ))}

           
          </>
        )}
      </div>
    </div>
  );
};

export default SystemLogs;
