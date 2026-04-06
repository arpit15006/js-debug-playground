// ─── Static Code Analyzer ─────────────────────────────────────────────────────
// Regex/pattern-based analysis: bugs, explanations, and optimization suggestions

import type { AnalysisResult, BugEntry, ExplanationSection, SuggestionEntry } from "./store";

let bugIdCounter = 0;
let suggestionIdCounter = 0;

function nextBugId() {
  return `bug-${++bugIdCounter}`;
}

function nextSuggestionId() {
  return `sug-${++suggestionIdCounter}`;
}

// ─── Bug Detection ────────────────────────────────────────────────────────────

function detectBugs(code: string): BugEntry[] {
  const bugs: BugEntry[] = [];
  const lines = code.split("\n");

  // 1. Unused variables
  const varDeclRegex = /(?:const|let|var)\s+(\w+)\s*=/g;
  let match;
  while ((match = varDeclRegex.exec(code)) !== null) {
    const varName = match[1];
    // Check if referenced elsewhere (not just the declaration)
    const usageRegex = new RegExp(`\\b${varName}\\b`, "g");
    const allMatches = code.match(usageRegex);
    if (allMatches && allMatches.length <= 1) {
      const lineNum = code.substring(0, match.index).split("\n").length;
      bugs.push({
        id: nextBugId(),
        severity: "warning",
        title: `Unused variable: "${varName}"`,
        description: `Variable "${varName}" is declared but never used elsewhere in the code. Consider removing it to keep code clean.`,
        line: lineNum,
      });
    }
  }

  // 2. DOM manipulation inside loops
  const loopRegex = /(?:for\s*\(|while\s*\(|\.forEach\s*\()/g;
  while ((match = loopRegex.exec(code)) !== null) {
    // Find the loop body (approximate - look ahead for innerHTML, appendChild, etc.)
    const afterMatch = code.substring(match.index, Math.min(match.index + 500, code.length));
    const domOps = ["innerHTML", "outerHTML", "document.write", "insertAdjacentHTML"];
    for (const op of domOps) {
      if (afterMatch.includes(op)) {
        const lineNum = code.substring(0, match.index).split("\n").length;
        bugs.push({
          id: nextBugId(),
          severity: "error",
          title: `DOM manipulation inside loop`,
          description: `Found "${op}" inside a loop starting at line ${lineNum}. This causes layout reflows on each iteration and destroys existing event listeners. Use DocumentFragment or batch operations instead.`,
          line: lineNum,
        });
        break;
      }
    }
  }

  // 3. Multiple event listeners on same element pattern
  const addEventRegex = /(\w+)\.addEventListener\s*\(\s*['"](\w+)['"]/g;
  const eventListenerMap: Record<string, { event: string; count: number; line: number }[]> = {};
  while ((match = addEventRegex.exec(code)) !== null) {
    const element = match[1];
    const event = match[2];
    const key = `${element}:${event}`;
    const lineNum = code.substring(0, match.index).split("\n").length;
    if (!eventListenerMap[key]) {
      eventListenerMap[key] = [];
    }
    eventListenerMap[key].push({ event, count: 1, line: lineNum });
  }
  for (const [key, entries] of Object.entries(eventListenerMap)) {
    if (entries.length > 1) {
      const [element, event] = key.split(":");
      bugs.push({
        id: nextBugId(),
        severity: "warning",
        title: `Multiple "${event}" listeners on "${element}"`,
        description: `Found ${entries.length} "${event}" event listeners attached to "${element}". Consider combining them into a single handler or using event delegation.`,
        line: entries[0].line,
      });
    }
  }

  // 4. Missing null checks on querySelector
  const qsRegex = /(?:const|let|var)\s+(\w+)\s*=\s*document\.querySelector\s*\([^)]+\)/g;
  while ((match = qsRegex.exec(code)) !== null) {
    const varName = match[1];
    const lineNum = code.substring(0, match.index).split("\n").length;
    // Check if there's a null check after
    const afterDecl = code.substring(match.index + match[0].length);
    const hasNullCheck =
      afterDecl.includes(`if (${varName})`) ||
      afterDecl.includes(`if(${varName})`) ||
      afterDecl.includes(`${varName}?`) ||
      afterDecl.includes(`${varName} &&`) ||
      afterDecl.includes(`${varName}!`);

    if (!hasNullCheck) {
      // Check if the variable is used after declaration
      const usageRegex = new RegExp(`${varName}\\.(\\w+)`, "g");
      if (usageRegex.test(afterDecl)) {
        bugs.push({
          id: nextBugId(),
          severity: "warning",
          title: `Missing null check for "${varName}"`,
          description: `"document.querySelector" can return null if element not found. Add a null check before accessing properties of "${varName}".`,
          line: lineNum,
        });
      }
    }
  }

  // 5. document.write usage
  if (code.includes("document.write")) {
    const lineNum = code.split("\n").findIndex((l) => l.includes("document.write")) + 1;
    bugs.push({
      id: nextBugId(),
      severity: "error",
      title: "Usage of document.write()",
      description:
        'document.write() overwrites the entire document when called after page load. Use DOM manipulation methods instead.',
      line: lineNum,
    });
  }

  // 6. Infinite loop detection (basic)
  const infiniteLoopRegex = /while\s*\(\s*true\s*\)/g;
  while ((match = infiniteLoopRegex.exec(code)) !== null) {
    const lineNum = code.substring(0, match.index).split("\n").length;
    const bodyAfter = code.substring(match.index, match.index + 300);
    if (!bodyAfter.includes("break") && !bodyAfter.includes("return")) {
      bugs.push({
        id: nextBugId(),
        severity: "error",
        title: "Potential infinite loop",
        description:
          "while(true) loop without a visible break or return statement. This will freeze the browser tab.",
        line: lineNum,
      });
    }
  }

  return bugs;
}

// ─── Code Explanation ─────────────────────────────────────────────────────────

function generateExplanation(code: string): ExplanationSection[] {
  const sections: ExplanationSection[] = [];

  // Overview
  const functionCount = (code.match(/function\s+\w+/g) || []).length;
  const arrowFnCount = (code.match(/=>\s*[{(]/g) || []).length;
  const varCount = (code.match(/(?:const|let|var)\s+/g) || []).length;
  const domQueryCount = (code.match(/document\.(querySelector|getElementById|getElementsBy|createElement)/g) || []).length;

  sections.push({
    title: "📋 Code Overview",
    content: `This code contains ${functionCount + arrowFnCount} function(s), ${varCount} variable declaration(s), and ${domQueryCount} DOM operation(s).`,
    icon: "📋",
  });

  // DOM Operations
  const createEls = code.match(/document\.createElement\s*\(\s*['"](\w+)['"]\s*\)/g);
  const queryEls = code.match(/document\.querySelector(All)?\s*\([^)]+\)/g);
  const byIdEls = code.match(/document\.getElementById\s*\([^)]+\)/g);

  if (createEls || queryEls || byIdEls) {
    const parts: string[] = [];
    if (createEls) parts.push(`Creates ${createEls.length} element(s) using createElement`);
    if (queryEls) parts.push(`Queries ${queryEls.length} element(s) using querySelector`);
    if (byIdEls) parts.push(`Finds ${byIdEls.length} element(s) by ID`);
    sections.push({
      title: "🏗️ DOM Operations",
      content: parts.join(". ") + ".",
      icon: "🏗️",
    });
  }

  // Event Handling
  const eventListeners = code.match(/addEventListener\s*\(\s*['"](\w+)['"]/g);
  if (eventListeners) {
    const eventTypes = eventListeners.map((e) => {
      const m = e.match(/['"](\w+)['"]/);
      return m ? m[1] : "unknown";
    });
    const uniqueEvents = [...new Set(eventTypes)];
    sections.push({
      title: "🖱️ Event Handling",
      content: `Registers ${eventListeners.length} event listener(s) for: ${uniqueEvents.join(", ")}. Events attached to DOM elements will trigger handler functions when user interacts.`,
      icon: "🖱️",
    });
  }

  // Styling
  const styleOps = code.match(/\.style\.\w+\s*=/g);
  const cssTextOps = code.match(/\.style\.cssText\s*=/g);
  const classOps = code.match(/\.className\s*=|\.classList\./g);
  if (styleOps || cssTextOps || classOps) {
    const count = (styleOps?.length || 0) + (cssTextOps?.length || 0) + (classOps?.length || 0);
    sections.push({
      title: "🎨 Styling",
      content: `Applies ${count} style modification(s) to elements. ${cssTextOps ? "Uses cssText for batch style application." : "Uses individual style properties."}`,
      icon: "🎨",
    });
  }

  // State Management
  const letVars = code.match(/let\s+\w+\s*=/g);
  if (letVars && letVars.length > 0) {
    sections.push({
      title: "📊 State Management",
      content: `Uses ${letVars.length} mutable variable(s) (let) for state tracking. State changes likely trigger DOM updates.`,
      icon: "📊",
    });
  }

  // Control Flow
  const ifs = (code.match(/\bif\s*\(/g) || []).length;
  const loops = (code.match(/\b(for|while|forEach|map|filter|reduce)\s*[\(.]/g) || []).length;
  if (ifs > 0 || loops > 0) {
    sections.push({
      title: "🔀 Control Flow",
      content: `Contains ${ifs} conditional(s) and ${loops} loop/iterator(s). ${loops > 0 ? "Loops may create multiple DOM elements or process data sets." : ""}`,
      icon: "🔀",
    });
  }

  // Console Output
  const consoleCalls = code.match(/console\.(log|warn|error|info)\s*\(/g);
  if (consoleCalls) {
    const groups: Record<string, number> = {};
    consoleCalls.forEach((c) => {
      const m = c.match(/console\.(\w+)/);
      if (m) groups[m[1]] = (groups[m[1]] || 0) + 1;
    });
    const summary = Object.entries(groups)
      .map(([k, v]) => `${v} ${k}`)
      .join(", ");
    sections.push({
      title: "🖥️ Console Output",
      content: `Outputs ${consoleCalls.length} message(s) to console: ${summary}.`,
      icon: "🖥️",
    });
  }

  return sections;
}

// ─── Optimization Suggestions ─────────────────────────────────────────────────

function generateSuggestions(code: string): SuggestionEntry[] {
  const suggestions: SuggestionEntry[] = [];

  // 1. Event delegation
  const addEventMatches = code.match(/addEventListener/g);
  if (addEventMatches && addEventMatches.length > 3) {
    suggestions.push({
      id: nextSuggestionId(),
      category: "performance",
      title: "Use event delegation",
      description: `Found ${addEventMatches.length} event listeners. Consider using event delegation — attach a single listener to a parent element and use event.target to handle child events. This reduces memory usage and improves performance.`,
    });
  }

  // 2. DOM queries in loops
  const domQueryInLoop = /(?:for|while|forEach|map)\s*[\(.][\s\S]*?document\.(querySelector|getElementById|getElementsBy)/;
  if (domQueryInLoop.test(code)) {
    suggestions.push({
      id: nextSuggestionId(),
      category: "performance",
      title: "Cache DOM queries outside loops",
      description:
        "DOM queries inside loops trigger layout recalculations on each iteration. Move document.querySelector calls outside the loop and reuse the cached reference.",
    });
  }

  // 3. innerHTML for text-only content
  if (code.includes("innerHTML") && !code.includes("<")) {
    suggestions.push({
      id: nextSuggestionId(),
      category: "best-practice",
      title: 'Use textContent instead of innerHTML',
      description:
        "When setting text-only content, use textContent instead of innerHTML. It's faster (no HTML parsing), safer (prevents XSS), and doesn't destroy existing event listeners.",
    });
  }

  // 4. innerHTML for building content
  if (code.includes("innerHTML +=") || code.includes("innerHTML =")) {
    suggestions.push({
      id: nextSuggestionId(),
      category: "performance",
      title: "Use DocumentFragment for batch insertions",
      description:
        "Using innerHTML += in a loop causes the browser to re-parse the entire HTML content each time. Use DocumentFragment to batch multiple DOM insertions into a single operation.",
    });
  }

  // 5. Inline styles
  const inlineStyleCount = (code.match(/\.style\.\w+\s*=/g) || []).length;
  if (inlineStyleCount > 5) {
    suggestions.push({
      id: nextSuggestionId(),
      category: "best-practice",
      title: "Consider using CSS classes",
      description: `Found ${inlineStyleCount} inline style assignments. Consider defining CSS classes and using classList.add() for cleaner, more maintainable styling.`,
    });
  }

  // 6. var usage
  if (/\bvar\s+/.test(code)) {
    suggestions.push({
      id: nextSuggestionId(),
      category: "best-practice",
      title: 'Use "const" and "let" instead of "var"',
      description:
        '"var" has function scope and is hoisted, which can lead to unexpected behavior. Use "const" for values that don\'t change and "let" for values that do.',
    });
  }

  // 7. Synchronous layout reads after writes
  const layoutThrash = /\.style\.[\s\S]*?\.(offsetWidth|offsetHeight|getBoundingClientRect|clientWidth|scrollTop)/;
  if (layoutThrash.test(code)) {
    suggestions.push({
      id: nextSuggestionId(),
      category: "performance",
      title: "Avoid layout thrashing",
      description:
        "Reading layout properties (offsetWidth, getBoundingClientRect) after style changes forces synchronous layout recalculation. Batch reads and writes separately.",
    });
  }

  // 8. setTimeout with string argument
  if (/setTimeout\s*\(\s*['"]/.test(code)) {
    suggestions.push({
      id: nextSuggestionId(),
      category: "security",
      title: "Avoid passing strings to setTimeout",
      description:
        "Passing a string to setTimeout uses eval() internally, which is a security risk. Pass a function reference or arrow function instead.",
    });
  }

  return suggestions;
}

// ─── Main Analysis Function ───────────────────────────────────────────────────

export function analyzeCode(code: string): AnalysisResult {
  bugIdCounter = 0;
  suggestionIdCounter = 0;

  return {
    bugs: detectBugs(code),
    explanation: generateExplanation(code),
    suggestions: generateSuggestions(code),
  };
}
