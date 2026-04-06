"use client";

import { usePlayground } from "@/lib/store";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BookOpen } from "lucide-react";

export default function ExplanationPanel() {
  const { state } = usePlayground();

  if (!state.analysis || state.analysis.explanation.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        <div className="text-center space-y-2">
          <BookOpen className="h-8 w-8 mx-auto opacity-40" />
          <p className="text-sm">Code explanation will appear here</p>
          <p className="text-xs opacity-60">Run code to generate analysis</p>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-3 space-y-2">
        {/* AI Explanation section */}
        {state.aiExplanation && (
          <Card className="p-3 border-indigo-500/20 bg-indigo-500/5">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm">🤖</span>
              <h4 className="text-xs font-semibold text-indigo-400">AI Explanation</h4>
            </div>
            <p className="text-xs text-foreground/80 whitespace-pre-wrap leading-relaxed">
              {state.aiExplanation}
            </p>
          </Card>
        )}

        {state.aiLoading && (
          <Card className="p-3 border-indigo-500/20 bg-indigo-500/5">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs text-indigo-400">AI is analyzing your code...</span>
            </div>
          </Card>
        )}

        {/* Static explanation sections */}
        {state.analysis.explanation.map((section, index) => (
          <div key={index} className="animate-fade-in" style={{ animationDelay: `${index * 80}ms` }}>
            <Card className="p-3 border-border/30 bg-muted/20 hover:bg-muted/30 transition-colors">
              <h4 className="text-xs font-semibold mb-1.5 flex items-center gap-1.5">
                <span>{section.icon || "📝"}</span>
                {section.title}
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {section.content}
              </p>
            </Card>
            {index < state.analysis!.explanation.length - 1 && (
              <Separator className="my-1 opacity-30" />
            )}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
