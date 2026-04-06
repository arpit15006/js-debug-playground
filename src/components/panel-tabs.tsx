"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { usePlayground } from "@/lib/store";
import DomTree from "./dom-tree";
import EventFlow from "./event-flow";
import DebugLogs from "./debug-logs";
import ExplanationPanel from "./explanation-panel";
import SuggestionsPanel from "./suggestions-panel";
import PerformancePanel from "./performance-panel";
import {
  Hash,
  Zap,
  Terminal,
  BookOpen,
  Lightbulb,
  Gauge,
} from "lucide-react";

export default function PanelTabs() {
  const { state } = usePlayground();

  const bugCount = state.analysis?.bugs?.length || 0;
  const suggestionCount = state.analysis?.suggestions?.length || 0;
  const logCount = state.consoleLogs.length + state.errors.length;
  const eventCount = state.eventLogs.length;

  return (
    <Tabs defaultValue="logs" className="h-full flex flex-col">
      <div className="border-b border-border/50 bg-muted/20">
        <TabsList className="h-8 bg-transparent rounded-none border-0 px-2 gap-0">
          <TabsTrigger
            value="dom-tree"
            className="text-[11px] h-7 px-3 rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-400 data-[state=active]:bg-transparent data-[state=active]:text-indigo-400 data-[state=active]:shadow-none"
          >
            <Hash className="h-3 w-3 mr-1" />
            DOM Tree
          </TabsTrigger>
          <TabsTrigger
            value="events"
            className="text-[11px] h-7 px-3 rounded-none border-b-2 border-transparent data-[state=active]:border-emerald-400 data-[state=active]:bg-transparent data-[state=active]:text-emerald-400 data-[state=active]:shadow-none"
          >
            <Zap className="h-3 w-3 mr-1" />
            Events
            {eventCount > 0 && (
              <Badge variant="secondary" className="text-[9px] ml-1 h-4 px-1 py-0 bg-emerald-500/10 text-emerald-400">
                {eventCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="logs"
            className="text-[11px] h-7 px-3 rounded-none border-b-2 border-transparent data-[state=active]:border-cyan-400 data-[state=active]:bg-transparent data-[state=active]:text-cyan-400 data-[state=active]:shadow-none"
          >
            <Terminal className="h-3 w-3 mr-1" />
            Console
            {logCount > 0 && (
              <Badge variant="secondary" className={`text-[9px] ml-1 h-4 px-1 py-0 ${state.errors.length > 0 ? 'bg-red-500/10 text-red-400' : 'bg-cyan-500/10 text-cyan-400'}`}>
                {logCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="explanation"
            className="text-[11px] h-7 px-3 rounded-none border-b-2 border-transparent data-[state=active]:border-purple-400 data-[state=active]:bg-transparent data-[state=active]:text-purple-400 data-[state=active]:shadow-none"
          >
            <BookOpen className="h-3 w-3 mr-1" />
            Explain
          </TabsTrigger>
          <TabsTrigger
            value="suggestions"
            className="text-[11px] h-7 px-3 rounded-none border-b-2 border-transparent data-[state=active]:border-amber-400 data-[state=active]:bg-transparent data-[state=active]:text-amber-400 data-[state=active]:shadow-none"
          >
            <Lightbulb className="h-3 w-3 mr-1" />
            Suggestions
            {(bugCount + suggestionCount) > 0 && (
              <Badge variant="secondary" className="text-[9px] ml-1 h-4 px-1 py-0 bg-amber-500/10 text-amber-400">
                {bugCount + suggestionCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="performance"
            className="text-[11px] h-7 px-3 rounded-none border-b-2 border-transparent data-[state=active]:border-sky-400 data-[state=active]:bg-transparent data-[state=active]:text-sky-400 data-[state=active]:shadow-none"
          >
            <Gauge className="h-3 w-3 mr-1" />
            Performance
          </TabsTrigger>
        </TabsList>
      </div>
      <div className="flex-1 overflow-hidden">
        <TabsContent value="dom-tree" className="h-full mt-0 p-0">
          <DomTree />
        </TabsContent>
        <TabsContent value="events" className="h-full mt-0 p-0">
          <EventFlow />
        </TabsContent>
        <TabsContent value="logs" className="h-full mt-0 p-0">
          <DebugLogs />
        </TabsContent>
        <TabsContent value="explanation" className="h-full mt-0 p-0">
          <ExplanationPanel />
        </TabsContent>
        <TabsContent value="suggestions" className="h-full mt-0 p-0">
          <SuggestionsPanel />
        </TabsContent>
        <TabsContent value="performance" className="h-full mt-0 p-0">
          <PerformancePanel />
        </TabsContent>
      </div>
    </Tabs>
  );
}
