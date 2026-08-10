"use client";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  Share2,
  ShieldCheck,
  Zap,
  CheckCircle2,
} from "lucide-react";
import ThemeToggle from "@/components/theme-toggle";

const DEMO_OPTIONS = [
  { id: "a", label: "Remote" },
  { id: "b", label: "Hybrid" },
  { id: "c", label: "Office" },
];

const DEMO_VOTES = { a: 58, b: 27, c: 15 };

export default function Home() {
  const [selected, setSelected] = useState<string | null>(null);
  const [voted, setVoted] = useState(false);
  const [votes, setVotes] = useState(DEMO_VOTES);

  const handleVote = () => {
    if (!selected) return;
    setVotes((prev) => ({
      ...prev,
      [selected]: prev[selected as keyof typeof prev] + 1,
    }));
    setVoted(true);
  };

  const total = Object.values(votes).reduce((s, v) => s + v, 0);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <span className="text-lg font-semibold tracking-tight">Opinio</span>
          <div className="flex items-center gap-3">
            <ThemeToggle /> {/* ✅ just add this */}
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Log in
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">Sign up</Button>
            </Link>
          </div>
        </div>
      </nav>
      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-16 flex flex-col lg:flex-row items-center gap-14">
        {/* Left — copy */}
        <div className="flex-1 space-y-6">
          <Badge variant="secondary" className="text-xs font-medium">
            Free to get started
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight tracking-tight">
            Ask anything.
            <br />
            <span className="text-muted-foreground font-normal">
              Get answers fast.
            </span>
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed max-w-md">
            Create a poll in seconds, share the link, and watch results roll in
            live. No sign-in needed to vote.
          </p>
          <div className="flex items-center gap-3 pt-2">
            <Link href="/signup">
              <Button size="lg" className="px-8">
                Create your first poll
              </Button>
            </Link>
          </div>
        </div>

        {/* Right — interactive demo poll */}
        <div className="flex-1 w-full max-w-sm">
          <div className="rounded-2xl border border-border bg-card p-6 space-y-4 shadow-sm">
            <div>
              <p className="text-xs text-muted-foreground mb-1">
                Live demo · try voting
              </p>
              <h2 className="text-base font-semibold">
                Where do you work best?
              </h2>
            </div>

            {!voted ? (
              <>
                <div className="space-y-2">
                  {DEMO_OPTIONS.map((opt) => (
                    <label
                      key={opt.id}
                      className={`flex items-center gap-3 border rounded-lg px-4 py-2.5 cursor-pointer transition-colors text-sm ${
                        selected === opt.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:bg-muted/40"
                      }`}
                    >
                      <input
                        type="radio"
                        name="demo"
                        value={opt.id}
                        checked={selected === opt.id}
                        onChange={() => setSelected(opt.id)}
                        className="accent-primary"
                      />
                      {opt.label}
                    </label>
                  ))}
                </div>
                <Button
                  className="w-full"
                  disabled={!selected}
                  onClick={handleVote}
                >
                  Submit vote
                </Button>
              </>
            ) : (
              <div className="space-y-3">
                {DEMO_OPTIONS.map((opt) => {
                  const pct = Math.round(
                    (votes[opt.id as keyof typeof votes] / total) * 100,
                  );
                  return (
                    <div key={opt.id}>
                      <div className="flex justify-between text-sm mb-1">
                        <span
                          className={opt.id === selected ? "font-medium" : ""}
                        >
                          {opt.label}
                        </span>
                        <span className="text-muted-foreground">{pct}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all duration-700"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
                <p className="text-xs text-muted-foreground pt-1">
                  {total} votes
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
      {/* How it works */}
      <section className="border-t border-border bg-muted/30">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium mb-10">
            How it works
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
            {[
              {
                step: "1",
                title: "Create a poll",
                body: "Write your question, add options, set an expiry date. Done in under a minute.",
              },
              {
                step: "2",
                title: "Share the link",
                body: "Copy your poll link and send it anywhere — Slack, WhatsApp, email, anywhere.",
              },
              {
                step: "3",
                title: "See live results",
                body: "Watch votes come in and view a full breakdown on your analytics dashboard.",
              },
            ].map((s) => (
              <div key={s.step} className="space-y-3">
                <span className="text-3xl font-bold text-muted-foreground/30">
                  {s.step}
                </span>
                <h3 className="font-semibold text-base">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium mb-10">
          Features
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[
            {
              icon: BarChart3,
              title: "Live analytics",
              body: "Real-time vote counts with percentage breakdowns for every option.",
            },
            {
              icon: ShieldCheck,
              title: "Anonymous voting",
              body: "Let people vote freely without logging in, tracked by browser fingerprint.",
            },
            {
              icon: Share2,
              title: "Instant sharing",
              body: "One link, shareable anywhere. No account needed for voters.",
            },
            {
              icon: Zap,
              title: "Auto-expiry",
              body: "Set polls to expire automatically so results stay timely and relevant.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="flex gap-4 p-5 rounded-xl border border-border bg-card"
            >
              <div className="mt-0.5 shrink-0">
                <f.icon className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold text-sm">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {f.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
      {/* CTA */}
      <section className="border-t border-border bg-muted/30">
        <div className="max-w-5xl mx-auto px-6 py-20 text-center space-y-6">
          <h2 className="text-3xl font-bold tracking-tight">
            Ready to get answers?
          </h2>
          <p className="text-muted-foreground max-w-sm mx-auto">
            Create your first poll for free. No credit card required.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link href="/signup">
              <Button size="lg" className="px-10">
                Get started free
              </Button>
            </Link>
          </div>
          <div className="flex items-center justify-center gap-4 pt-2 text-xs text-muted-foreground">
            {["Free forever", "No credit card", "Setup in 60s"].map((t) => (
              <span key={t} className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className="border-t border-border">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between text-xs text-muted-foreground">
          <span>© 2026 Opinio</span>
          <div className="flex gap-4">
            <Link
              href="/login"
              className="hover:text-foreground transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="hover:text-foreground transition-colors"
            >
              Sign up
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
