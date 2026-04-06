# JS Debug Playground

A high-performance, sandboxed environment for executing, visualizing, and debugging JavaScript code. Built specifically for engineers to evaluate and debug AI-generated code snippets with deep introspection into DOM mutations, event propagation, and runtime behavior.

## Core Features

### Sandboxed Execution Engine
Code is executed within an isolated iframe sandbox using the `srcdoc` attribute and strict `sandbox` permissions. This ensures that user-provided or AI-generated code cannot access the main thread or compromise the application state.

### Real-time DOM Visualization
- **Live DOM Tree**: A recursive, high-density visualization of the document structure.
- **Visual Mutation Flashing**: Utilizing MutationObserver, the tool identifies and highlights modified nodes with a visual flash, allowing developers to see exactly which parts of the UI are changing during execution.

### Advanced Event Tracking
- **Lifecycle Instrumentation**: Patches `EventTarget.prototype.addEventListener` to capture all event bindings.
- **Propagation Analysis**: Tracks both capture and bubble phases, providing a chronological log of event firing, target elements, and handler execution.

### Integrated Debugging Suite
- **Monaco Editor Integration**: Provides a VS Code-like editing experience with full syntax highlighting.
- **In-Editor Error Highlighting**: Runtime errors captured from the sandbox are mapped back to the source code, rendering native red squiggles and hover details within the editor.
- **High-Density Console**: A specialized log viewer with precise timestamps and stack trace introspection.

### AI-Powered Analysis
- **Intelligent Explanations**: Integrates with the Groq API (Llama 3.3 70B) to provide plain-English explanations of complex logic or mysterious bugs.
- **Static Bug Detection**: An automated analyzer that flags common anti-patterns such as DOM manipulation within loops or missing null checks.

### Performance Monitoring
- **Execution Metrics**: Tracks total execution time, DOM mutation frequency, and total event listener count to provide a snapshot of code efficiency.

## Technical Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with Vanilla CSS specialized tokens
- **UI Components**: Shadcn UI (Base UI compatible)
- **Editor**: Monaco Editor (@monaco-editor/react)
- **State Management**: React Context + useReducer for centralized debug state
- **AI Backend**: Groq API Proxy (Edge Compatible)

## Project Architecture

### Directory Structure
- `src/app`: Next.js application routes and API proxy.
- `src/components`: Specialized debug panels (DOM Tree, Event Flow, Logs).
- `src/lib`: Core logic including the sandbox instrumentation layer and the centralized store.
- `src/lib/iframe-template.ts`: The instrumentation bootloader injected into the sandbox.

### Instrumentation Layer
The tool uses a sophisticated instrumentation script that:
1. Overrides global `console` methods to pipe data back to the parent window.
2. Implements a global `onerror` handler for runtime tracking.
3. Uses `MutationObserver` to diff the DOM state before and after execution.
4. Wraps native browser APIs to provide deep transparency into the JS execution context.

## Getting Started

### Prerequisites
- Node.js 18 or higher
- A Groq API Key (optional, for AI features)

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   Create a `.env.local` file and add:
   ```env
   GROQ_API_KEY=your_api_key_here
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Development and Deployment

The project is optimized for Vercel. Ensure that your `GROQ_API_KEY` is added to the Vercel project's environment variables to enable the AI Explanation features in production.

## License
MIT
