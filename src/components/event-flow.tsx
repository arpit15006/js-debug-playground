"use client";

import { usePlayground } from "@/lib/store";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Zap, MousePointer, ArrowRight, Radio } from "lucide-react";

export default function EventFlow() {
  const { state } = usePlayground();

  if (state.eventLogs.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        <div className="text-center space-y-2">
          <Zap className="h-8 w-8 mx-auto opacity-40" />
          <p className="text-sm">No events tracked yet</p>
          <p className="text-xs opacity-60">Events will appear here when code runs</p>
        </div>
      </div>
    );
  }

  // Group events by type for summary
  const eventSummary: Record<string, number> = {};
  state.eventLogs.forEach((e) => {
    eventSummary[e.eventType] = (eventSummary[e.eventType] || 0) + 1;
  });

  const eventColorMap: Record<string, string> = {
    click: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    input: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    change: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    keydown: "bg-purple-500/15 text-purple-400 border-purple-500/30",
    keyup: "bg-purple-500/15 text-purple-400 border-purple-500/30",
    submit: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
    mouseover: "bg-pink-500/15 text-pink-400 border-pink-500/30",
    mouseout: "bg-pink-500/15 text-pink-400 border-pink-500/30",
    focus: "bg-indigo-500/15 text-indigo-400 border-indigo-500/30",
    blur: "bg-slate-500/15 text-slate-400 border-slate-500/30",
  };

  const getEventColor = (type: string) =>
    eventColorMap[type] || "bg-gray-500/15 text-gray-400 border-gray-500/30";

  return (
    <ScrollArea className="h-full">
      <div className="p-3">
        {/* Summary badges */}
        <div className="flex flex-wrap gap-2 mb-3">
          {Object.entries(eventSummary).map(([type, count]) => (
            <Badge
              key={type}
              variant="outline"
              className={`text-[10px] ${getEventColor(type)}`}
            >
              {type}: {count}
            </Badge>
          ))}
        </div>

        {/* Event table header */}
        <div className="flex items-center gap-2 border-b border-border/50 pb-1 mb-1 px-2 text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
          <div className="w-[80px]">Timestamp</div>
          <div className="w-[70px]">Event</div>
          <div className="flex-1">Target</div>
          <div className="w-[80px]">Handler</div>
          <div className="w-[50px] text-right">Phase</div>
        </div>

        {/* Event dense list */}
        <div className="flex flex-col">
          {state.eventLogs.map((entry, index) => (
            <div
              key={entry.id}
              className="flex items-center gap-2 px-2 py-[3px] text-[11px] font-mono hover:bg-muted/50 transition-colors border-b border-border/20 animate-fade-in group"
              style={{ animationDelay: `${index * 20}ms` }}
            >
              {/* Timestamp */}
              <div className="w-[80px] text-muted-foreground opacity-60">
                {new Date(entry.timestamp).toISOString().substring(11, 23)}
              </div>

              {/* Event type */}
              <div className="w-[70px]">
                <span className={`px-1 rounded-sm ${getEventColor(entry.eventType).split(" ")[1]}`}>
                  {entry.eventType}
                </span>
              </div>

              {/* Target */}
              <div className="flex-1 text-emerald-400 truncate">
                {entry.target}
              </div>

              {/* Handler */}
              <div className="w-[80px] text-amber-400 truncate">
                {entry.handler}()
              </div>

              {/* Phase */}
              <div className="w-[50px] text-right text-indigo-400/70 truncate">
                {entry.phase}
              </div>
            </div>
          ))}
        </div>
      </div>
    </ScrollArea>
  );
}
