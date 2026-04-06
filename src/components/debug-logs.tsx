"use client";

import { usePlayground } from "@/lib/store";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Terminal, AlertTriangle, XCircle, Info } from "lucide-react";
import { useEffect, useRef } from "react";

export default function DebugLogs() {
  const { state } = usePlayground();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new logs
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [state.consoleLogs, state.errors]);

  const allLogs = [
    ...state.consoleLogs.map((log) => ({
      type: "console" as const,
      level: log.level,
      content: log.args.join(" "),
      timestamp: log.timestamp,
      key: log.id,
    })),
    ...state.errors.map((err, i) => ({
      type: "error" as const,
      level: "error" as const,
      content: err.message + (err.line ? ` (line ${err.line})` : ""),
      timestamp: err.timestamp,
      key: `err-${i}`,
      stack: err.stack,
    })),
  ].sort((a, b) => a.timestamp - b.timestamp);

  if (allLogs.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        <div className="text-center space-y-2">
          <Terminal className="h-8 w-8 mx-auto opacity-40" />
          <p className="text-sm">Console output will appear here</p>
        </div>
      </div>
    );
  }

  const levelConfig = {
    log: {
      icon: <Terminal className="h-3 w-3" />,
      color: "text-foreground",
      bg: "",
      badge: "bg-muted text-muted-foreground",
    },
    info: {
      icon: <Info className="h-3 w-3" />,
      color: "text-blue-400",
      bg: "bg-blue-500/5",
      badge: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    },
    warn: {
      icon: <AlertTriangle className="h-3 w-3" />,
      color: "text-amber-400",
      bg: "bg-amber-500/5",
      badge: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    },
    error: {
      icon: <XCircle className="h-3 w-3" />,
      color: "text-red-400",
      bg: "bg-red-500/5",
      badge: "bg-red-500/10 text-red-400 border-red-500/20",
    },
  };

  return (
    <ScrollArea className="h-full" ref={scrollRef}>
      <div className="font-mono text-xs">
        {/* Log count summary */}
        <div className="flex items-center gap-2 px-3 py-1.5 border-b border-border/30 bg-muted/20 sticky top-0 z-10">
          <span className="text-muted-foreground text-[11px]">{allLogs.length} messages</span>
          {state.errors.length > 0 && (
            <Badge variant="outline" className="text-[10px] bg-red-500/10 text-red-400 border-red-500/20">
              {state.errors.length} error(s)
            </Badge>
          )}
          {state.consoleLogs.filter((l) => l.level === "warn").length > 0 && (
            <Badge variant="outline" className="text-[10px] bg-amber-500/10 text-amber-400 border-amber-500/20">
              {state.consoleLogs.filter((l) => l.level === "warn").length} warning(s)
            </Badge>
          )}
        </div>

        {allLogs.map((log, index) => {
          const config = levelConfig[log.level] || levelConfig.log;
          return (
            <div
              key={log.key}
              className={`console-line flex items-start gap-2 ${config.bg} ${config.color} animate-fade-in py-1 border-b border-border/20`}
              style={{ animationDelay: `${index * 20}ms` }}
            >
              <span className="shrink-0 mt-[1px] opacity-70">{config.icon}</span>
              <span className="text-[10px] text-muted-foreground/60 w-[78px] shrink-0 font-mono tracking-tight">
                {new Date(log.timestamp).toISOString().substring(11, 23)}
              </span>
              <div className="flex-1 flex flex-col">
                <span className="whitespace-pre-wrap break-all leading-tight">{log.content}</span>
                {"stack" in log && log.stack && (
                  <details className="mt-1">
                    <summary className="text-[10px] text-muted-foreground cursor-pointer hover:text-foreground">
                      Stack Trace
                    </summary>
                    <pre className="text-[10px] text-red-400/60 mt-1 pl-2 border-l border-red-500/30 whitespace-pre-wrap overflow-x-auto">
                      {log.stack}
                    </pre>
                  </details>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
}
