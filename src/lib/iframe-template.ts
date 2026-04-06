// ─── iframe Template Generator ────────────────────────────────────────────────
// Generates the full HTML string injected into iframe srcdoc with instrumentation

export function generateIframeHTML(userCode: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: system-ui, -apple-system, sans-serif;
      background: #0c0a1a;
      color: #e2e8f0;
      min-height: 100vh;
    }
  </style>
</head>
<body>
  <script>
    // ─── Instrumentation Layer ───────────────────────────────────────────
    (function() {
      const __startTime = performance.now();
      let __mutationCount = 0;
      let __eventCount = 0;
      let __recentMutations = new Set();

      // 1. Override console methods
      const __origConsole = {
        log: console.log.bind(console),
        warn: console.warn.bind(console),
        error: console.error.bind(console),
        info: console.info.bind(console),
      };

      function __serializeArgs(args) {
        return Array.from(args).map(arg => {
          try {
            if (arg === null) return 'null';
            if (arg === undefined) return 'undefined';
            if (typeof arg === 'object') return JSON.stringify(arg, null, 2);
            return String(arg);
          } catch (e) {
            return String(arg);
          }
        });
      }

      ['log', 'warn', 'error', 'info'].forEach(level => {
        console[level] = function(...args) {
          __origConsole[level](...args);
          window.parent.postMessage({
            type: 'console',
            level: level,
            args: __serializeArgs(args),
            timestamp: Date.now(),
          }, '*');
        };
      });

      // 2. Error handler
      window.onerror = function(message, source, line, col, error) {
        // Adjust line number because code runs inside a script block
        // In iframe srcdoc, script starts around line 208, so subtract offset roughly.
        // For simplicity, Next.js or raw errors might vary, we pass it forward.
        window.parent.postMessage({
          type: 'error',
          message: String(message),
          stack: error ? error.stack : '',
          line: line ? Math.max(1, line - 207) : undefined,
          col: col,
          timestamp: Date.now(),
        }, '*');
        return true;
      };

      window.addEventListener('unhandledrejection', function(event) {
        window.parent.postMessage({
          type: 'error',
          message: 'Unhandled Promise Rejection: ' + String(event.reason),
          stack: event.reason && event.reason.stack ? event.reason.stack : '',
          timestamp: Date.now(),
        }, '*');
      });

      // 3. MutationObserver for DOM changes
      const __observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
          __mutationCount++;
          const target = mutation.target.tagName
            ? mutation.target.tagName.toLowerCase() +
              (mutation.target.id ? '#' + mutation.target.id : '') +
              (mutation.target.className ? '.' + String(mutation.target.className).split(' ').join('.') : '')
            : '#text';

          window.parent.postMessage({
            type: 'dom-mutation',
            mutationType: mutation.type,
            target: target,
            addedNodes: Array.from(mutation.addedNodes).map(n =>
              n.tagName ? n.tagName.toLowerCase() : '#text'
            ),
            removedNodes: Array.from(mutation.removedNodes).map(n =>
              n.tagName ? n.tagName.toLowerCase() : '#text'
            ),
            timestamp: Date.now(),
          }, '*');
          
          if (mutation.target && mutation.target.nodeType === Node.ELEMENT_NODE) {
            __recentMutations.add(mutation.target);
          }
          mutation.addedNodes.forEach(n => {
            if (n.nodeType === Node.ELEMENT_NODE) __recentMutations.add(n);
          });
        });
      });

      // Start observing once body is ready
      __observer.observe(document.body, {
        childList: true,
        attributes: true,
        characterData: true,
        subtree: true,
      });

      // 4. Patch addEventListener to track event bindings
      const __origAddEventListener = EventTarget.prototype.addEventListener;
      EventTarget.prototype.addEventListener = function(type, listener, options) {
        __eventCount++;
        const targetDesc = this.tagName
          ? this.tagName.toLowerCase() +
            (this.id ? '#' + this.id : '') +
            (this.className ? '.' + String(this.className).split(' ').join('.') : '')
          : 'window';

        const handlerName = listener.name || 'anonymous';

        window.parent.postMessage({
          type: 'event-track',
          eventType: type,
          target: targetDesc,
          handler: handlerName,
          phase: options && options.capture ? 'capture' : 'bubble',
          timestamp: Date.now(),
        }, '*');

        // Wrap listener to track actual execution
        const wrappedListener = function(event) {
          window.parent.postMessage({
            type: 'event-fired',
            eventType: type,
            target: targetDesc,
            handler: handlerName,
            phase: event.eventPhase === 1 ? 'capture' : event.eventPhase === 2 ? 'target' : 'bubble',
            timestamp: Date.now(),
          }, '*');
          return listener.call(this, event);
        };

        return __origAddEventListener.call(this, type, wrappedListener, options);
      };

      // 5. DOM tree serialization
      function __serializeDOMTree(node) {
        if (node.nodeType === Node.TEXT_NODE) {
          const text = node.textContent.trim();
          if (!text) return null;
          return { tag: '#text', textContent: text, attributes: {}, children: [] };
        }
        if (node.nodeType !== Node.ELEMENT_NODE) return null;
        if (node.tagName === 'SCRIPT') return null;

        const attrs = {};
        Array.from(node.attributes || []).forEach(attr => {
          if (attr.name !== 'style') {
            attrs[attr.name] = attr.value;
          }
        });

        const children = Array.from(node.childNodes)
          .map(child => __serializeDOMTree(child))
          .filter(Boolean);

        return {
          tag: node.tagName.toLowerCase(),
          id: node.id || undefined,
          className: node.className || undefined,
          attributes: attrs,
          children: children,
          mutated: __recentMutations.has(node),
        };
      }

      // 6. Send DOM snapshot and performance after user code completes
      function __sendSnapshot() {
        const endTime = performance.now();
        const tree = __serializeDOMTree(document.body);
        window.parent.postMessage({
          type: 'dom-snapshot',
          tree: tree,
          timestamp: Date.now(),
        }, '*');

        window.parent.postMessage({
          type: 'performance',
          executionTime: Math.round((endTime - __startTime) * 100) / 100,
          domMutationCount: __mutationCount,
          eventCount: __eventCount,
          timestamp: Date.now(),
        }, '*');

        window.parent.postMessage({ type: 'ready' }, '*');
        __recentMutations.clear(); // Clear mutations after snapshot
      }

      // Execute user code and then send snapshot
      try {
        // Execute user code
        ${userCode}
        
        // Send snapshot after a brief delay to capture final DOM state
        setTimeout(__sendSnapshot, 100);
      } catch (e) {
        window.parent.postMessage({
          type: 'error',
          message: e.message,
          stack: e.stack,
          timestamp: Date.now(),
        }, '*');
        setTimeout(__sendSnapshot, 100);
      }
    })();
  </script>
</body>
</html>`;
}
