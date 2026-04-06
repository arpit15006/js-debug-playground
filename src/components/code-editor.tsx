"use client";

import { useRef, useCallback, useEffect } from "react";
import Editor, { type OnMount, type OnChange } from "@monaco-editor/react";
import { Loader2 } from "lucide-react";
import { usePlayground } from "@/lib/store";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  onRun?: () => void;
}

export default function CodeEditor({ value, onChange, onRun }: CodeEditorProps) {
  const { state } = usePlayground();
  const editorRef = useRef<Parameters<OnMount>[0] | null>(null);
  const monacoRef = useRef<any>(null);

  const handleEditorDidMount: OnMount = useCallback((editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    // Define a custom dark theme matching our design
    monaco.editor.defineTheme("js-debug-dark", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "comment", foreground: "6b7280", fontStyle: "italic" },
        { token: "keyword", foreground: "c084fc" },
        { token: "string", foreground: "86efac" },
        { token: "number", foreground: "fbbf24" },
        { token: "regexp", foreground: "f87171" },
        { token: "type", foreground: "67e8f9" },
        { token: "variable", foreground: "e2e8f0" },
        { token: "delimiter", foreground: "94a3b8" },
        { token: "tag", foreground: "f87171" },
        { token: "attribute.name", foreground: "fbbf24" },
        { token: "attribute.value", foreground: "86efac" },
      ],
      colors: {
        "editor.background": "#0f0d1a",
        "editor.foreground": "#e2e8f0",
        "editor.lineHighlightBackground": "#1e1b3a",
        "editor.selectionBackground": "#4f46e540",
        "editor.inactiveSelectionBackground": "#4f46e520",
        "editorCursor.foreground": "#818cf8",
        "editorLineNumber.foreground": "#475569",
        "editorLineNumber.activeForeground": "#818cf8",
        "editorIndentGuide.background": "#1e293b",
        "editorIndentGuide.activeBackground": "#334155",
        "editor.selectionHighlightBackground": "#4f46e520",
        "editorBracketMatch.background": "#4f46e530",
        "editorBracketMatch.border": "#818cf8",
        "scrollbarSlider.background": "#334155",
        "scrollbarSlider.hoverBackground": "#475569",
        "editorWidget.background": "#1e1b3a",
        "editorWidget.border": "#2e2a4a",
        "editorSuggestWidget.background": "#1e1b3a",
        "editorSuggestWidget.border": "#2e2a4a",
        "editorSuggestWidget.selectedBackground": "#4f46e530",
      },
    });

    monaco.editor.setTheme("js-debug-dark");

    // Add Ctrl+Enter shortcut to run code
    editor.addAction({
      id: "run-code",
      label: "Run Code",
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter],
      run: () => {
        onRun?.();
      },
    });

    // Focus the editor
    editor.focus();
  }, [onRun]);

  const handleChange: OnChange = useCallback(
    (value) => {
      onChange(value || "");
    },
    [onChange]
  );

  // Update onRun binding when it changes
  useEffect(() => {
    if (editorRef.current) {
      // Re-register the run action with updated callback
    }
  }, [onRun]);

  // Sync state.errors into Monaco markers
  useEffect(() => {
    if (editorRef.current && monacoRef.current) {
      const model = editorRef.current.getModel();
      if (!model) return;

      const markers = state.errors.map((err) => {
        const line = err.line || 1;
        const col = err.col || 1;
        return {
          startLineNumber: line,
          startColumn: col,
          endLineNumber: line,
          endColumn: col + 100, // span the line basically
          message: err.message,
          severity: monacoRef.current.MarkerSeverity.Error,
        };
      });

      monacoRef.current.editor.setModelMarkers(model, "js-debug", markers);
    }
  }, [state.errors]);

  return (
    <div className="h-full w-full overflow-hidden">
      <Editor
        height="100%"
        defaultLanguage="javascript"
        value={value}
        onChange={handleChange}
        onMount={handleEditorDidMount}
        loading={
          <div className="flex items-center justify-center h-full w-full bg-[#0f0d1a]">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-400" />
              <span className="text-sm text-muted-foreground">Loading editor...</span>
            </div>
          </div>
        }
        options={{
          fontSize: 14,
          fontFamily: '"Geist Mono", "JetBrains Mono", "Fira Code", monospace',
          fontLigatures: true,
          minimap: { enabled: true, scale: 1, size: "proportional" },
          scrollBeyondLastLine: false,
          renderWhitespace: "selection",
          bracketPairColorization: { enabled: true },
          autoClosingBrackets: "always",
          autoClosingQuotes: "always",
          autoIndent: "full",
          formatOnPaste: true,
          tabSize: 2,
          wordWrap: "on",
          lineNumbers: "on",
          glyphMargin: false,
          folding: true,
          lineDecorationsWidth: 10,
          lineNumbersMinChars: 3,
          padding: { top: 12, bottom: 12 },
          smoothScrolling: true,
          cursorBlinking: "smooth",
          cursorSmoothCaretAnimation: "on",
          renderLineHighlight: "all",
          suggestOnTriggerCharacters: true,
          quickSuggestions: true,
          scrollbar: {
            vertical: "auto",
            horizontal: "auto",
            verticalScrollbarSize: 8,
            horizontalScrollbarSize: 8,
          },
        }}
      />
    </div>
  );
}
