"use client";

import React, { createContext, useContext, useReducer, useCallback, type ReactNode } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ConsoleEntry {
  id: string;
  level: "log" | "warn" | "error" | "info";
  args: string[];
  timestamp: number;
}

export interface DOMNode {
  tag: string;
  id?: string;
  className?: string;
  attributes: Record<string, string>;
  children: DOMNode[];
  textContent?: string;
  mutated?: boolean;
}

export interface DOMMutation {
  type: "childList" | "attributes" | "characterData";
  target: string;
  addedNodes: string[];
  removedNodes: string[];
  timestamp: number;
}

export interface EventEntry {
  id: string;
  eventType: string;
  target: string;
  handler: string;
  phase: "capture" | "target" | "bubble";
  timestamp: number;
}

export interface ErrorEntry {
  message: string;
  stack?: string;
  line?: number;
  col?: number;
  timestamp: number;
}

export interface AnalysisResult {
  bugs: BugEntry[];
  explanation: ExplanationSection[];
  suggestions: SuggestionEntry[];
}

export interface BugEntry {
  id: string;
  severity: "error" | "warning" | "info";
  title: string;
  description: string;
  line?: number;
}

export interface ExplanationSection {
  title: string;
  content: string;
  icon?: string;
}

export interface SuggestionEntry {
  id: string;
  category: "performance" | "best-practice" | "security";
  title: string;
  description: string;
}

export interface PerformanceMetrics {
  executionTime: number;
  domMutationCount: number;
  eventCount: number;
}

export interface PlaygroundState {
  code: string;
  consoleLogs: ConsoleEntry[];
  domTree: DOMNode | null;
  domMutations: DOMMutation[];
  eventLogs: EventEntry[];
  errors: ErrorEntry[];
  isRunning: boolean;
  analysis: AnalysisResult | null;
  performance: PerformanceMetrics | null;
  aiExplanation: string | null;
  aiLoading: boolean;
  executionCount: number;
  executionStatus: "idle" | "executing" | "tracking" | "ready";
}

// ─── Actions ──────────────────────────────────────────────────────────────────

type Action =
  | { type: "SET_CODE"; payload: string }
  | { type: "START_EXECUTION" }
  | { type: "STOP_EXECUTION" }
  | { type: "ADD_CONSOLE_LOG"; payload: ConsoleEntry }
  | { type: "SET_DOM_TREE"; payload: DOMNode }
  | { type: "ADD_DOM_MUTATION"; payload: DOMMutation }
  | { type: "ADD_EVENT_LOG"; payload: EventEntry }
  | { type: "ADD_ERROR"; payload: ErrorEntry }
  | { type: "SET_ANALYSIS"; payload: AnalysisResult }
  | { type: "SET_PERFORMANCE"; payload: PerformanceMetrics }
  | { type: "SET_AI_EXPLANATION"; payload: string | null }
  | { type: "SET_AI_LOADING"; payload: boolean }
  | { type: "SET_EXECUTION_STATUS"; payload: "idle" | "executing" | "tracking" | "ready" }
  | { type: "CLEAR_ALL" }
  | { type: "CLEAR_LOGS" };

// ─── Initial State ────────────────────────────────────────────────────────────

const initialState: PlaygroundState = {
  code: "",
  consoleLogs: [],
  domTree: null,
  domMutations: [],
  eventLogs: [],
  errors: [],
  isRunning: false,
  analysis: null,
  performance: null,
  aiExplanation: null,
  aiLoading: false,
  executionCount: 0,
  executionStatus: "idle",
};

// ─── Reducer ──────────────────────────────────────────────────────────────────

function playgroundReducer(state: PlaygroundState, action: Action): PlaygroundState {
  switch (action.type) {
    case "SET_CODE":
      return { ...state, code: action.payload };
    case "START_EXECUTION":
      return {
        ...state,
        isRunning: true,
        consoleLogs: [],
        domTree: null,
        domMutations: [],
        eventLogs: [],
        errors: [],
        performance: null,
        executionCount: state.executionCount + 1,
        executionStatus: "executing",
      };
    case "STOP_EXECUTION":
      return { ...state, isRunning: false, executionStatus: "ready" };
    case "ADD_CONSOLE_LOG":
      return { ...state, consoleLogs: [...state.consoleLogs, action.payload] };
    case "SET_DOM_TREE":
      return { ...state, domTree: action.payload };
    case "ADD_DOM_MUTATION":
      return {
        ...state,
        domMutations: [...state.domMutations, action.payload],
      };
    case "ADD_EVENT_LOG":
      return { ...state, eventLogs: [...state.eventLogs, action.payload] };
    case "ADD_ERROR":
      return { ...state, errors: [...state.errors, action.payload] };
    case "SET_ANALYSIS":
      return { ...state, analysis: action.payload };
    case "SET_PERFORMANCE":
      return { ...state, performance: action.payload };
    case "SET_AI_EXPLANATION":
      return { ...state, aiExplanation: action.payload };
    case "SET_AI_LOADING":
      return { ...state, aiLoading: action.payload };
    case "SET_EXECUTION_STATUS":
      return { ...state, executionStatus: action.payload };
    case "CLEAR_ALL":
      return {
        ...initialState,
        code: state.code,
        executionCount: state.executionCount,
      };
    case "CLEAR_LOGS":
      return {
        ...state,
        consoleLogs: [],
        errors: [],
      };
    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface PlaygroundContextType {
  state: PlaygroundState;
  dispatch: React.Dispatch<Action>;
  setCode: (code: string) => void;
  runCode: () => void;
  clearAll: () => void;
}

const PlaygroundContext = createContext<PlaygroundContextType | null>(null);

export function PlaygroundProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(playgroundReducer, initialState);

  const setCode = useCallback(
    (code: string) => dispatch({ type: "SET_CODE", payload: code }),
    []
  );

  const runCode = useCallback(
    () => dispatch({ type: "START_EXECUTION" }),
    []
  );

  const clearAll = useCallback(
    () => dispatch({ type: "CLEAR_ALL" }),
    []
  );

  return (
    <PlaygroundContext.Provider value={{ state, dispatch, setCode, runCode, clearAll }}>
      {children}
    </PlaygroundContext.Provider>
  );
}

export function usePlayground() {
  const context = useContext(PlaygroundContext);
  if (!context) {
    throw new Error("usePlayground must be used within a PlaygroundProvider");
  }
  return context;
}
