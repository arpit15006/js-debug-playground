import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  ArrowRight,
  Code2,
  Terminal,
  Activity,
  Zap,
  Sparkles,
  GitBranch,
  MonitorPlay,
  Bug,
  Layout,
  Braces
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background selection:bg-indigo-500/30">
      {/* Navbar */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-border/40 bg-background/50 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-md bg-indigo-500/10 border border-indigo-500/20">
            <Braces className="h-5 w-5 text-indigo-400" />
          </div>
          <span className="font-bold tracking-tight text-lg">JS Debug Playground</span>
        </div>
        <nav className="flex items-center gap-4">
          <Link href="https://github.com/arpit15006/js-debug-playground" target="_blank" rel="noreferrer">
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground hidden md:flex">
              <GitBranch className="h-4 w-4" />
              GitHub
            </Button>
          </Link>
          <Link href="/editor">
            <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20">
              Open Playground
            </Button>
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative px-6 py-24 md:py-32 overflow-hidden flex flex-col items-center text-center">
          {/* Animated Background Elements */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-3xl -z-10 animate-pulse pointer-events-none" />
          <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />
          
          <Badge variant="outline" className="mb-6 py-1.5 px-4 text-xs tracking-wide bg-background/80 backdrop-blur uppercase border-indigo-500/30 text-indigo-400 gap-1.5 flex items-center shadow-lg shadow-indigo-500/5">
            <Sparkles className="h-3.5 w-3.5" />
            Llama 3.3 Powered Analysis
          </Badge>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-4xl mb-6 text-balance leading-tight">
            Debug AI-Generated Code <br className="hidden md:block" /> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-emerald-400">
              With Absolute Confidence
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 text-balance leading-relaxed">
            A professional sandbox to safely execute, track DOM mutations, visualize event flows, and get AI-powered explanations for any JavaScript snippet.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <Link href="/editor" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto h-12 px-8 text-base bg-white text-black hover:bg-zinc-200 transition-colors shadow-xl shadow-white/5 font-semibold group rounded-full">
                Launch Editor
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="https://github.com/arpit15006/js-debug-playground" target="_blank" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 px-8 text-base border-border/80 hover:bg-accent rounded-full">
                <GitBranch className="mr-2 h-4 w-4" />
                View on GitHub
              </Button>
            </Link>
          </div>

          <div className="mt-20 w-full max-w-5xl relative mx-auto group perspective-[2000px]">
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/20 to-transparent blur-2xl -z-10 rounded-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="rounded-xl border border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl overflow-hidden transform-gpu transition-transform duration-700 hover:scale-[1.01]">
              <div className="flex items-center px-4 py-3 bg-white/5 border-b border-white/10 gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <div className="ml-4 text-xs text-muted-foreground font-mono font-medium">playground.js</div>
              </div>
              <div className="p-6 text-left font-mono text-sm leading-relaxed overflow-hidden bg-[#0d0d12]">
                <div className="text-emerald-400/80 mb-2">{'// Execute safely in sandboxed iframe...'}</div>
                <div className="text-indigo-300">const<span className="text-foreground"> observer</span> = <span className="text-purple-400">new</span> <span className="text-emerald-300">MutationObserver</span>(<span className="text-foreground">(</span>mutations<span className="text-foreground">)</span> <span className="text-purple-400">{'=>'}</span> {'{'}</div>
                <div className="pl-4 text-foreground">mutations.<span className="text-blue-400">forEach</span>(<span className="text-foreground">(</span>m<span className="text-foreground">)</span> <span className="text-purple-400">{'=>'}</span> {'{'}</div>
                <div className="pl-8 text-yellow-300">console.<span className="text-blue-400">log</span>(<span className="text-green-400">'DOM Mutated!'</span>, m);</div>
                <div className="pl-4">{'}'});</div>
                <div>{'}'});</div>
                <div className="mt-4 flex items-center gap-2">
                  <span className="animate-pulse w-2 h-4 bg-indigo-500 inline-block" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-24 px-6 bg-muted/20 border-t border-border/40 relative">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Deep Insights Into Execution</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg text-balance">
                Everything you need to trace execution paths, discover infinite loops, and understand complex interactions.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="bg-background/50 border-border/50 backdrop-blur p-6 hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all duration-300 overflow-hidden relative group">
                <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-6 border border-emerald-500/20 group-hover:scale-110 transition-transform">
                  <Activity className="h-6 w-6 text-emerald-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">Sandboxed Engine</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Execute untrusted AI-generated code securely inside an isolated iframe. No cross-origin leaks or main-thread blocking.
                </p>
              </Card>

              <Card className="bg-background/50 border-border/50 backdrop-blur p-6 hover:border-indigo-500/30 hover:bg-indigo-500/5 transition-all duration-300 relative group">
                <div className="w-12 h-12 rounded-lg bg-indigo-500/10 flex items-center justify-center mb-6 border border-indigo-500/20 group-hover:scale-110 transition-transform">
                  <Layout className="h-6 w-6 text-indigo-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">Live DOM Visualizer</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Watch the DOM evolve in real-time. Nodes flash as mutations occur, turning complex DOM manipulations into easy-to-read trees.
                </p>
              </Card>

              <Card className="bg-background/50 border-border/50 backdrop-blur p-6 hover:border-amber-500/30 hover:bg-amber-500/5 transition-all duration-300 relative group">
                <div className="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center mb-6 border border-amber-500/20 group-hover:scale-110 transition-transform">
                  <Zap className="h-6 w-6 text-amber-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">Event Flow Tracker</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Trace `addEventListeners` dynamically. See exactly when, where, and in what phase events are propagating.
                </p>
              </Card>

              <Card className="bg-background/50 border-border/50 backdrop-blur p-6 hover:border-purple-500/30 hover:bg-purple-500/5 transition-all duration-300 relative group">
                <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center mb-6 border border-purple-500/20 group-hover:scale-110 transition-transform">
                  <Sparkles className="h-6 w-6 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">AI Explanations</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Connect your Groq API key and let Llama 3.3 analyze mysterious behavior, explaining complex code in plain English.
                </p>
              </Card>

              <Card className="bg-background/50 border-border/50 backdrop-blur p-6 hover:border-red-500/30 hover:bg-red-500/5 transition-all duration-300 relative group">
                <div className="w-12 h-12 rounded-lg bg-red-500/10 flex items-center justify-center mb-6 border border-red-500/20 group-hover:scale-110 transition-transform">
                  <Bug className="h-6 w-6 text-red-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">Static Bug Detection</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Instantly flag common anti-patterns such as DOM manipulation in loops, missing null checks, and memory leaks.
                </p>
              </Card>

              <Card className="bg-background/50 border-border/50 backdrop-blur p-6 hover:border-cyan-500/30 hover:bg-cyan-500/5 transition-all duration-300 relative group">
                <div className="w-12 h-12 rounded-lg bg-cyan-500/10 flex items-center justify-center mb-6 border border-cyan-500/20 group-hover:scale-110 transition-transform">
                  <MonitorPlay className="h-6 w-6 text-cyan-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">Unified DevTools UI</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  An interface inspired by Chrome DevTools and VS Code, offering an instantly familiar, resizable tabbed environment.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-indigo-500/5" />
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to debug faster?</h2>
            <p className="text-muted-foreground text-lg mb-10 max-w-2xl mx-auto">
              Start evaluating complex JavaScript and AI-generated code snippets in a perfectly sandboxed environment today. No setup required.
            </p>
            <Link href="/editor">
              <Button size="lg" className="h-14 px-10 text-lg bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-[0_0_40px_rgba(79,70,229,0.3)] hover:shadow-[0_0_60px_rgba(79,70,229,0.4)] transition-all">
                Open The Playground
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8 px-6 bg-background">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded bg-indigo-500/10 border border-indigo-500/20">
              <Braces className="h-4 w-4 text-indigo-400" />
            </div>
            <span className="font-semibold text-sm">JS Debug Playground</span>
          </div>
          <div className="text-sm text-muted-foreground">
            Built for developers evaluating AI code.
          </div>
          <div className="flex items-center gap-4">
            <Link href="/editor" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Editor
            </Link>
            <Link href="https://github.com/arpit15006/js-debug-playground" target="_blank" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              GitHub
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
