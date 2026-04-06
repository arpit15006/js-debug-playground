"use client";

import { useRef, useEffect, useCallback } from "react";
import { usePlayground } from "@/lib/store";
import { generateIframeHTML } from "@/lib/iframe-template";
import { analyzeCode } from "@/lib/analyzer";
import { Card } from "@/components/ui/card";

export default function PreviewPanel() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { state, dispatch } = usePlayground();

  // Handle messages from iframe
  const handleMessage = useCallback(
    (event: MessageEvent) => {
      const data = event.data;
      if (!data || !data.type) return;

      switch (data.type) {
        case "console":
          dispatch({
            type: "ADD_CONSOLE_LOG",
            payload: {
              id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
              level: data.level,
              args: data.args,
              timestamp: data.timestamp,
            },
          });
          break;

        case "error":
          dispatch({
            type: "ADD_ERROR",
            payload: {
              message: data.message,
              stack: data.stack,
              line: data.line,
              col: data.col,
              timestamp: data.timestamp,
            },
          });
          break;

        case "dom-snapshot":
          if (data.tree) {
            dispatch({ type: "SET_DOM_TREE", payload: data.tree });
          }
          break;

        case "dom-mutation":
          dispatch({
            type: "ADD_DOM_MUTATION",
            payload: {
              type: data.mutationType,
              target: data.target,
              addedNodes: data.addedNodes || [],
              removedNodes: data.removedNodes || [],
              timestamp: data.timestamp,
            },
          });
          break;

        case "event-track":
        case "event-fired":
          dispatch({
            type: "ADD_EVENT_LOG",
            payload: {
              id: `evt-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
              eventType: data.eventType,
              target: data.target,
              handler: data.handler,
              phase: data.phase,
              timestamp: data.timestamp,
            },
          });
          break;

        case "performance":
          dispatch({
            type: "SET_PERFORMANCE",
            payload: {
              executionTime: data.executionTime,
              domMutationCount: data.domMutationCount,
              eventCount: data.eventCount,
            },
          });
          break;

        case "ready":
          dispatch({ type: "STOP_EXECUTION" });
          break;
      }
    },
    [dispatch]
  );

  useEffect(() => {
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [handleMessage]);

  // Execute code when isRunning becomes true
  useEffect(() => {
    if (state.isRunning && iframeRef.current) {
      dispatch({ type: "SET_EXECUTION_STATUS", payload: "executing" });
      
      // Run static analysis
      const analysis = analyzeCode(state.code);
      dispatch({ type: "SET_ANALYSIS", payload: analysis });

      // Artificial delay to show off the "Executing..." state before "Tracking DOM..."
      setTimeout(() => {
        dispatch({ type: "SET_EXECUTION_STATUS", payload: "tracking" });
        
        // Inject code into sandboxed iframe
        const html = generateIframeHTML(state.code);
        if (iframeRef.current) {
          iframeRef.current.srcdoc = html;
        }
      }, 400);
    }
  }, [state.isRunning, state.executionCount]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Card className="h-full border-border/50 bg-card/50 overflow-hidden flex flex-col">
      <div className="flex items-center px-3 py-1.5 border-b border-border/50 bg-muted/30">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
        </div>
        <span className="ml-3 text-xs text-muted-foreground font-mono">output://preview</span>
        {state.isRunning && (
          <span className="ml-auto text-xs text-indigo-400 animate-pulse">Executing...</span>
        )}
      </div>
      <div className="flex-1 relative">
        <iframe
          ref={iframeRef}
          sandbox="allow-scripts"
          className="w-full h-full border-0"
          title="Code Output Preview"
          style={{ background: "#0c0a1a" }}
        />
        {!state.domTree && !state.isRunning && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#0c0a1a]">
            <div className="text-center space-y-3">
              <div className="text-4xl">▶️</div>
              <p className="text-sm text-muted-foreground">
                Click <kbd className="px-2 py-0.5 bg-muted rounded text-xs font-mono">Run</kbd> or
                press <kbd className="px-2 py-0.5 bg-muted rounded text-xs font-mono">Ctrl+Enter</kbd> to execute
              </p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
