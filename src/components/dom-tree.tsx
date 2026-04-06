"use client";

import { usePlayground, type DOMNode } from "@/lib/store";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, ChevronDown, Hash, Type, Box } from "lucide-react";
import { useState, useCallback } from "react";

// ─── Recursive DOM Tree Node ──────────────────────────────────────────────────

function DOMTreeNode({ node, depth = 0 }: { node: DOMNode; depth?: number }) {
  const [expanded, setExpanded] = useState(depth < 3);
  const hasChildren = node.children && node.children.length > 0;
  const isText = node.tag === "#text";

  const toggle = useCallback(() => {
    if (hasChildren) setExpanded((e) => !e);
  }, [hasChildren]);

  return (
    <div className="animate-fade-in font-mono" style={{ animationDelay: `${depth * 30}ms` }}>
      <div
        className={`flex items-center gap-1 px-1 py-[2px] hover:bg-muted/50 rounded-sm cursor-pointer group transition-colors ${
          node.mutated ? "flash-mutation" : ""
        }`}
        style={{ paddingLeft: `${depth * 14 + 4}px` }}
        onClick={toggle}
      >
        {/* Expand/Collapse arrow */}
        {hasChildren ? (
          expanded ? (
            <ChevronDown className="h-3 w-3 text-muted-foreground shrink-0 opacity-70 group-hover:opacity-100" />
          ) : (
            <ChevronRight className="h-3 w-3 text-muted-foreground shrink-0 opacity-70 group-hover:opacity-100" />
          )
        ) : (
          <span className="w-3 shrink-0" />
        )}

        {/* Node content */}
        {isText ? (
          <span className="flex items-center gap-1.5 opacity-90">
            <span className="text-[11px] text-emerald-400 truncate max-w-[400px]">
              &quot;{node.textContent}&quot;
            </span>
          </span>
        ) : (
          <span className="flex items-center gap-1 opacity-90">
            <span className="text-[11px]">
              <span className="text-pink-400">&lt;{node.tag}</span>
              {node.id && (
                <span className="text-sky-400"> id=&quot;<span className="text-blue-300">{node.id}</span>&quot;</span>
              )}
              {node.className && (
                <span className="text-sky-400"> class=&quot;<span className="text-blue-300">{String(node.className).substring(0, 30)}{String(node.className).length > 30 ? '...' : ''}</span>&quot;</span>
              )}
              {Object.entries(node.attributes || {})
                .filter(([k]) => k !== "id" && k !== "class")
                .slice(0, 3)
                .map(([key, val]) => (
                  <span key={key} className="text-emerald-400">
                    {" "}
                    {key}=&quot;<span className="text-emerald-200">{String(val).substring(0, 20)}</span>&quot;
                  </span>
                ))}
              <span className="text-pink-400">&gt;</span>
            </span>
            {hasChildren && !expanded && (
              <span className="text-[10px] text-muted-foreground ml-1 bg-muted/40 px-1 rounded">
                ... 
              </span>
            )}
          </span>
        )}
      </div>

      {/* Children */}
      {expanded &&
        hasChildren &&
        node.children.map((child, i) => (
          <DOMTreeNode key={`${child.tag}-${i}`} node={child} depth={depth + 1} />
        ))}

      {/* Closing tag */}
      {expanded && hasChildren && !isText && (
        <div
          className="text-xs font-mono text-indigo-400/60 px-2 py-0.5"
          style={{ paddingLeft: `${depth * 16 + 8 + 16}px` }}
        >
          &lt;/{node.tag}&gt;
        </div>
      )}
    </div>
  );
}

// ─── DOM Tree Panel ───────────────────────────────────────────────────────────

export default function DomTree() {
  const { state } = usePlayground();

  if (!state.domTree) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        <div className="text-center space-y-2">
          <Hash className="h-8 w-8 mx-auto opacity-40" />
          <p className="text-sm">Run code to see the DOM tree</p>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-2">
        <div className="flex items-center gap-2 px-2 mb-2">
          <span className="text-xs text-muted-foreground">DOM Structure</span>
          <Badge variant="outline" className="text-[10px]">
            {countNodes(state.domTree)} nodes
          </Badge>
          {state.domMutations.length > 0 && (
            <Badge variant="secondary" className="text-[10px] bg-amber-500/10 text-amber-400 border-amber-500/20">
              {state.domMutations.length} mutations
            </Badge>
          )}
        </div>
        <DOMTreeNode node={state.domTree} />
      </div>
    </ScrollArea>
  );
}

function countNodes(node: DOMNode): number {
  let count = 1;
  if (node.children) {
    for (const child of node.children) {
      count += countNodes(child);
    }
  }
  return count;
}
