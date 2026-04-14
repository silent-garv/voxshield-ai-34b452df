/**
 * History Screen — Displays past scam detection results.
 * Fetches data from backend API.
 */
import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, AlertTriangle, ShieldCheck, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { fetchHistory, type HistoryItem } from "@/services/apiService";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "Detection History — VoxShield AI" },
      { name: "description", content: "View past scam call detection results." },
    ],
  }),
  component: HistoryPage,
});

function HistoryPage() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchHistory()
      .then(setItems)
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Failed to load history")
      )
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex min-h-screen flex-col px-6 pb-24 pt-8">
      {/* Header */}
      <div className="mb-6 flex items-center gap-2">
        <Clock className="h-5 w-5 text-primary" />
        <h1 className="text-xl font-bold">Detection History</h1>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-1 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {/* Error State */}
      {error && (
        <Card className="border-destructive/20 bg-destructive/5">
          <CardContent className="p-4 text-center text-sm text-destructive">
            {error}
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {!loading && !error && items.length === 0 && (
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <ShieldCheck className="mb-3 h-12 w-12 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">No detections yet</p>
          <p className="text-xs text-muted-foreground/60">
            Start monitoring calls to see results here
          </p>
        </div>
      )}

      {/* History List */}
      <div className="space-y-3">
        {items.map((item, i) => {
          const isScam = item.riskScore > 70;
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="border-border/50 bg-card/50">
                <CardContent className="flex items-start gap-3 p-4">
                  <div
                    className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                      isScam ? "bg-danger/15" : "bg-success/15"
                    }`}
                  >
                    {isScam ? (
                      <AlertTriangle className="h-4 w-4 text-danger" />
                    ) : (
                      <ShieldCheck className="h-4 w-4 text-success" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs font-semibold ${
                          isScam ? "text-danger" : "text-success"
                        }`}
                      >
                        {isScam ? "SCAM DETECTED" : "SAFE"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Score: {item.riskScore}
                      </span>
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground line-clamp-2">
                      {item.explanation}
                    </p>
                    <span className="mt-1 block text-[10px] text-muted-foreground/60">
                      {new Date(item.timestamp).toLocaleString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
