"use client";

import dynamic from "next/dynamic";
import { PlaygroundProvider, usePlayground } from "@/lib/store";
import { defaultTemplate } from "@/lib/templates";
import Header from "@/components/header";
import PreviewPanel from "@/components/preview-panel";
import PanelTabs from "@/components/panel-tabs";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

// Dynamically import Monaco editor (SSR disabled)
const CodeEditor = dynamic(() => import("@/components/code-editor"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full w-full bg-[#0f0d1a]">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-400" />
        <span className="text-sm text-muted-foreground">Loading editor...</span>
      </div>
    </div>
  ),
});

// ─── Playground Layout (inner component) ──────────────────────────────────────

function PlaygroundLayout() {
  const { state, setCode, runCode } = usePlayground();

  // Set default template on mount
  useEffect(() => {
    if (!state.code) {
      setCode(defaultTemplate.code);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="h-screen overflow-hidden flex flex-col bg-background">
      <Header />
      <ResizablePanelGroup orientation="vertical" className="flex-1">
        {/* Top: Editor + Preview */}
        <ResizablePanel defaultSize={60} minSize={30}>
          <ResizablePanelGroup orientation="horizontal">
            {/* Editor */}
            <ResizablePanel defaultSize={50} minSize={25}>
              <div className="h-full flex flex-col">
                <div className="flex items-center px-3 py-1.5 border-b border-border/50 bg-muted/20">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                  </div>
                  <span className="ml-3 text-xs text-muted-foreground font-mono">
                    script.js
                  </span>
                  <span className="ml-auto text-[10px] text-muted-foreground">
                    JavaScript
                  </span>
                </div>
                <div className="flex-1 overflow-hidden">
                  <CodeEditor
                    value={state.code}
                    onChange={setCode}
                    onRun={runCode}
                  />
                </div>
              </div>
            </ResizablePanel>

            <ResizableHandle withHandle className="bg-border/30 hover:bg-indigo-500/30 transition-colors" />

            {/* Preview */}
            <ResizablePanel defaultSize={50} minSize={20}>
              <PreviewPanel />
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>

        <ResizableHandle withHandle className="bg-border/30 hover:bg-indigo-500/30 transition-colors" />

        {/* Bottom: Tabbed Panels */}
        <ResizablePanel defaultSize={40} minSize={15}>
          <PanelTabs />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}

// ─── Page Export ───────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <PlaygroundProvider>
      <PlaygroundLayout />
    </PlaygroundProvider>
  );
}
