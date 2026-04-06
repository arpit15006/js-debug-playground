"use client";

import { usePlayground } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { Gauge, Clock, GitBranch, Zap } from "lucide-react";

export default function PerformancePanel() {
  const { state } = usePlayground();

  if (!state.performance) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        <div className="text-center space-y-2">
          <Gauge className="h-8 w-8 mx-auto opacity-40" />
          <p className="text-sm">Performance metrics will appear here</p>
          <p className="text-xs opacity-60">Run code to measure performance</p>
        </div>
      </div>
    );
  }

  const metrics = [
    {
      icon: <Clock className="h-5 w-5" />,
      label: "Execution Time",
      value: `${state.performance.executionTime}`,
      unit: "ms",
      color: state.performance.executionTime < 50
        ? "text-emerald-400"
        : state.performance.executionTime < 200
        ? "text-amber-400"
        : "text-red-400",
      bg: state.performance.executionTime < 50
        ? "bg-emerald-500/10 border-emerald-500/20"
        : state.performance.executionTime < 200
        ? "bg-amber-500/10 border-amber-500/20"
        : "bg-red-500/10 border-red-500/20",
      status: state.performance.executionTime < 50
        ? "Fast"
        : state.performance.executionTime < 200
        ? "Moderate"
        : "Slow",
    },
    {
      icon: <GitBranch className="h-5 w-5" />,
      label: "DOM Mutations",
      value: `${state.performance.domMutationCount}`,
      unit: "changes",
      color: state.performance.domMutationCount < 20
        ? "text-emerald-400"
        : state.performance.domMutationCount < 100
        ? "text-amber-400"
        : "text-red-400",
      bg: state.performance.domMutationCount < 20
        ? "bg-emerald-500/10 border-emerald-500/20"
        : state.performance.domMutationCount < 100
        ? "bg-amber-500/10 border-amber-500/20"
        : "bg-red-500/10 border-red-500/20",
      status: state.performance.domMutationCount < 20
        ? "Efficient"
        : state.performance.domMutationCount < 100
        ? "Moderate"
        : "Heavy",
    },
    {
      icon: <Zap className="h-5 w-5" />,
      label: "Event Listeners",
      value: `${state.performance.eventCount}`,
      unit: "registered",
      color: state.performance.eventCount < 10
        ? "text-emerald-400"
        : state.performance.eventCount < 30
        ? "text-amber-400"
        : "text-red-400",
      bg: state.performance.eventCount < 10
        ? "bg-emerald-500/10 border-emerald-500/20"
        : state.performance.eventCount < 30
        ? "bg-amber-500/10 border-amber-500/20"
        : "bg-red-500/10 border-red-500/20",
      status: state.performance.eventCount < 10
        ? "Good"
        : state.performance.eventCount < 30
        ? "Moderate"
        : "Many",
    },
  ];

  return (
    <div className="h-full p-4">
      <div className="grid grid-cols-3 gap-3 h-full">
        {metrics.map((metric, index) => (
          <Card
            key={metric.label}
            className={`p-4 ${metric.bg} border flex flex-col items-center justify-center text-center animate-fade-in`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className={`${metric.color} mb-2 opacity-80`}>{metric.icon}</div>
            <div className="stat-number">
              <span className={`text-3xl font-bold ${metric.color} font-mono`}>
                {metric.value}
              </span>
              <span className="text-xs text-muted-foreground ml-1">{metric.unit}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">{metric.label}</p>
            <span className={`text-[10px] mt-1 ${metric.color} font-medium`}>
              {metric.status}
            </span>
          </Card>
        ))}
      </div>
    </div>
  );
}
