import { Link } from "wouter";
import {
  Atom,
  BookOpen,
  MessageSquareText,
  Target,
  ShieldCheck,
  LineChart,
} from "lucide-react";

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

const features = [
  {
    icon: BookOpen,
    title: "Three-depth lectures",
    body: "Read every lecture Short, Medium, or Long — same examples, your pace.",
  },
  {
    icon: MessageSquareText,
    title: "Section-scoped AI tutor",
    body: "Ask about the exact paragraph you're on; answers stream back in real time.",
  },
  {
    icon: Target,
    title: "Adaptive practice",
    body: "Difficulty climbs after a streak and eases after a miss, with explanations.",
  },
  {
    icon: ShieldCheck,
    title: "Two-layer integrity",
    body: "Every submission is screened by a text classifier and a keystroke detector.",
  },
  {
    icon: LineChart,
    title: "Live analytics",
    body: "Attempts, accuracy, streak, and per-topic mastery — all at a glance.",
  },
  {
    icon: Atom,
    title: "29 topics, 4 weeks",
    body: "A full month of conceptual physics from motion to relativity and cosmology.",
  },
];

export default function Landing() {
  return (
    <div className="min-h-[100dvh] bg-background text-foreground">
      <header className="flex items-center justify-between px-6 py-5 max-w-6xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-primary rounded-md flex items-center justify-center text-primary-foreground font-serif font-bold text-lg">
            PT
          </div>
          <span className="font-serif font-semibold text-lg tracking-tight">
            Physics Think
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/sign-in">
            <button className="px-4 py-2 rounded-md text-sm font-medium border border-border hover:bg-secondary transition-colors">
              Sign in
            </button>
          </Link>
          <Link href="/sign-up">
            <button className="px-4 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:opacity-90 transition-opacity">
              Get started
            </button>
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6">
        <section className="text-center pt-16 pb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-card text-xs text-muted-foreground mb-6">
            <Atom className="w-3.5 h-3.5" />
            The Conceptual Physics Studio
          </div>
          <h1 className="font-serif font-bold text-4xl md:text-5xl tracking-tight max-w-3xl mx-auto leading-tight">
            A four-week college physics course that teaches, tutors, and grades
            itself
          </h1>
          <p className="text-muted-foreground text-lg mt-6 max-w-2xl mx-auto">
            Read the lecture at the depth you want, ask a tutor scoped to the
            exact section you're on, and drill problems that adapt to you — all
            AI-graded with built-in academic-integrity checks.
          </p>
          <div className="flex items-center justify-center gap-3 mt-9">
            <Link href="/sign-up">
              <button className="px-6 py-3 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:opacity-90 transition-opacity">
                Create your account
              </button>
            </Link>
            <Link href="/sign-in">
              <button className="px-6 py-3 rounded-md text-sm font-medium border border-border hover:bg-secondary transition-colors">
                Continue with Google
              </button>
            </Link>
          </div>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-20">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-xl border border-border bg-card p-5"
            >
              <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center mb-4">
                <f.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-serif font-semibold text-base mb-1.5">
                {f.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {f.body}
              </p>
            </div>
          ))}
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="max-w-6xl mx-auto px-6 py-6 text-xs text-muted-foreground text-center">
          Physics Think — Conceptual Physics MVP
        </div>
      </footer>
    </div>
  );
}
