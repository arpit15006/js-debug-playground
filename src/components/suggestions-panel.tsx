"use client";

import { usePlayground } from "@/lib/store";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, Zap, Shield, CheckCircle } from "lucide-react";

export default function SuggestionsPanel() {
  const { state } = usePlayground();

  const bugs = state.analysis?.bugs || [];
  const suggestions = state.analysis?.suggestions || [];
  const hasContent = bugs.length > 0 || suggestions.length > 0;

  if (!hasContent) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        <div className="text-center space-y-2">
          <Lightbulb className="h-8 w-8 mx-auto opacity-40" />
          <p className="text-sm">Suggestions & bug reports will appear here</p>
          <p className="text-xs opacity-60">Run code to analyze for improvements</p>
        </div>
      </div>
    );
  }

  const categoryIcons = {
    performance: <Zap className="h-3.5 w-3.5" />,
    "best-practice": <CheckCircle className="h-3.5 w-3.5" />,
    security: <Shield className="h-3.5 w-3.5" />,
  };

  const categoryColors = {
    performance: "border-amber-500/30 bg-amber-500/5",
    "best-practice": "border-blue-500/30 bg-blue-500/5",
    security: "border-red-500/30 bg-red-500/5",
  };

  const severityColors = {
    error: "border-red-500/30 bg-red-500/5 text-red-400",
    warning: "border-amber-500/30 bg-amber-500/5 text-amber-400",
    info: "border-blue-500/30 bg-blue-500/5 text-blue-400",
  };

  const severityBadge = {
    error: "bg-red-500/15 text-red-400 border-red-500/30",
    warning: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    info: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  };

  return (
    <ScrollArea className="h-full">
      <div className="p-3 space-y-3">
        {/* Bugs Section */}
        {bugs.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                🐛 Issues Detected
              </span>
              <Badge variant="outline" className="text-[10px] bg-red-500/10 text-red-400 border-red-500/20">
                {bugs.length}
              </Badge>
            </div>
            <div className="space-y-2">
              {bugs.map((bug, index) => (
                <Alert
                  key={bug.id}
                  className={`${severityColors[bug.severity]} animate-fade-in`}
                  style={{ animationDelay: `${index * 60}ms` }}
                >
                  <AlertTitle className="flex items-center gap-2 text-xs font-semibold">
                    <Badge variant="outline" className={`text-[10px] ${severityBadge[bug.severity]}`}>
                      {bug.severity.toUpperCase()}
                    </Badge>
                    {bug.title}
                    {bug.line && (
                      <span className="text-[10px] text-muted-foreground ml-auto font-mono">
                        line {bug.line}
                      </span>
                    )}
                  </AlertTitle>
                  <AlertDescription className="text-xs text-muted-foreground mt-1">
                    {bug.description}
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          </div>
        )}

        {/* Suggestions Section */}
        {suggestions.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2 mt-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                💡 Optimization Suggestions
              </span>
              <Badge variant="outline" className="text-[10px]">
                {suggestions.length}
              </Badge>
            </div>
            <div className="space-y-2">
              {suggestions.map((sug, index) => (
                <Alert
                  key={sug.id}
                  className={`${categoryColors[sug.category]} animate-fade-in`}
                  style={{ animationDelay: `${(bugs.length + index) * 60}ms` }}
                >
                  <AlertTitle className="flex items-center gap-2 text-xs font-semibold">
                    {categoryIcons[sug.category]}
                    {sug.title}
                    <Badge variant="outline" className="text-[9px] ml-auto opacity-60">
                      {sug.category}
                    </Badge>
                  </AlertTitle>
                  <AlertDescription className="text-xs text-muted-foreground mt-1">
                    {sug.description}
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
