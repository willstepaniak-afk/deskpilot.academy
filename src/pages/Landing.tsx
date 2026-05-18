import { useLocation } from "wouter";
import Navbar from "../components/layout/Navbar";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  CirclePlay as PlayCircle, Brain, Users, Award, ChartBar as BarChart3, ChevronRight,
  CircleCheck as CheckCircle, Zap, BookOpen, TrendingUp, Shield, Clock
} from "lucide-react";

const CAMPUSES = [
  { emoji: "💻", name: "Digital Retailing & AI", description: "Master the digital showroom and AI-powered selling tools.", levels: 4, sessions: 18 },
  { emoji: "🏦", name: "F&I Mastery", description: "From menu basics to advanced objection handling and PVR optimization.", levels: 4, sessions: 16 },
  { emoji: "📊", name: "Desking & Deal Structure", description: "Gross protection, pencil strategy, and deal structuring discipline.", levels: 3, sessions: 14 },
  { emoji: "🤝", name: "Sales Fundamentals", description: "The complete road to the sale — meet to delivery.", levels: 4, sessions: 20 },
  { emoji: "🔧", name: "Fixed Ops", description: "Service drive revenue, customer retention, and advisor performance.", levels: 3, sessions: 12 },
  { emoji: "🚗", name: "Used Vehicle Ops", description: "Acquisition, appraisal, pricing strategy, and turn rate management.", levels: 3, sessions: 14 },
  { emoji: "📈", name: "Management & Leadership", description: "Desk management, team development, and performance culture.", levels: 4, sessions: 16 },
  { emoji: "⚖️", name: "Compliance & Ethics", description: "ECOA, MLA, state-specific rules, and deal compliance guardrails.", levels: 2, sessions: 10 },
  { emoji: "🏛️", name: "Lender Intelligence", description: "Lender profiles, routing strategy, and rate markup optimization.", levels: 3, sessions: 12 },
];

const FEATURES = [
  {
    icon: PlayCircle,
    title: "On-Demand Video",
    description: "Expert-led training you can pause, rewind, and revisit. Structured modules with clear progression.",
  },
  {
    icon: Brain,
    title: "AI Deal Simulations",
    description: "Practice with realistic customer personas powered by AI. Get scored on deal structure, lender selection, and F&I execution.",
  },
  {
    icon: Users,
    title: "Live Coaching",
    description: "Scheduled sessions with instructors. Role-play, Q&A, and deal review with expert feedback.",
  },
  {
    icon: Award,
    title: "Campus Certifications",
    description: "Earn verified certificates for each campus you complete. Share on LinkedIn, track across your team.",
  },
  {
    icon: BarChart3,
    title: "Performance Analytics",
    description: "Track progress, identify gaps, and benchmark against industry standards at the individual and team level.",
  },
  {
    icon: Shield,
    title: "Compliance Built In",
    description: "Every deal scenario includes compliance guardrails. Learn the rules as you learn the process.",
  },
];

const STATS = [
  { value: "9", label: "Training Campuses" },
  { value: "140+", label: "Sessions" },
  { value: "25+", label: "AI Simulations" },
  { value: "+$287", label: "Avg PVR Lift" },
];

export default function Landing() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero — primary conversion moment */}
      <section className="relative overflow-hidden border-b border-border">
        {/* Gradient glow behind hero */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,hsl(217,91%,60%,0.15),transparent)]" />
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 relative">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="primary" className="mb-6">Now available — All 9 campuses</Badge>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl leading-[1.1]">
              The training platform built for{" "}
              <span className="text-primary">automotive professionals</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Video courses, AI deal simulations, live coaching, and certifications — built around the actual desk process. Not theory. Operator-level training that moves gross.
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" onClick={() => navigate("/signup")} className="w-full sm:w-auto gap-2 animate-pulse-glow">
                Start 7-Day Free Trial
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg" onClick={() => navigate("/login")} className="w-full sm:w-auto">
                Log In
              </Button>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">No credit card required during trial.</p>
          </div>
        </div>
      </section>

      {/* Stats — social proof bar */}
      <section className="border-b border-border bg-secondary/50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-bold text-primary">{stat.value}</p>
                <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-b border-border py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight">Five ways to train. One platform.</h2>
            <p className="mt-4 text-muted-foreground">Every format has a purpose. Use them in the right combination and progression accelerates.</p>
          </div>
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(({ icon: Icon, title, description }) => (
              <div key={title} className="group rounded-lg border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-foreground">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Campuses */}
      <section className="border-b border-border py-20 bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight">9 campuses. Every role covered.</h2>
            <p className="mt-4 text-muted-foreground">From the sales floor to the desk to fixed ops — each campus is a complete curriculum, not a playlist.</p>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CAMPUSES.map((campus) => (
              <div
                key={campus.name}
                onClick={() => navigate("/signup")}
                className="group cursor-pointer rounded-lg border border-border bg-card p-5 transition-all hover:border-primary/30 hover:shadow-md hover:shadow-primary/5"
              >
                <div className="flex items-start gap-4">
                  <span className="text-3xl leading-none">{campus.emoji}</span>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{campus.name}</h3>
                    <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{campus.description}</p>
                    <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <BookOpen className="h-3 w-3" />
                        {campus.levels} levels
                      </span>
                      <span className="flex items-center gap-1">
                        <PlayCircle className="h-3 w-3" />
                        {campus.sessions} sessions
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-0.5 shrink-0 mt-0.5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing — second major conversion moment */}
      <section className="border-b border-border py-20" id="pricing">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight">Simple, all-inclusive pricing</h2>
            <p className="mt-4 text-muted-foreground">One subscription. All 9 campuses. Every format. All new content as it ships.</p>
          </div>
          <div className="mx-auto mt-12 max-w-md">
            <div className="rounded-xl border border-primary/30 bg-card p-8 shadow-lg shadow-primary/5 relative overflow-hidden">
              {/* Subtle gradient accent at top */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary" />
              <div className="flex items-baseline justify-between">
                <div>
                  <p className="text-sm font-semibold text-primary uppercase tracking-wider">All-Access</p>
                  <p className="mt-2 text-5xl font-bold text-foreground">$99</p>
                  <p className="text-sm text-muted-foreground">per month</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">or</p>
                  <p className="text-2xl font-bold text-foreground">$899</p>
                  <p className="text-sm text-muted-foreground">per year</p>
                  <Badge variant="success" className="mt-1 text-xs">Save $289</Badge>
                </div>
              </div>
              <ul className="mt-8 space-y-3">
                {[
                  "All 9 training campuses",
                  "140+ on-demand sessions",
                  "25+ AI deal simulations",
                  "Live coaching sessions",
                  "Campus certifications",
                  "Performance analytics",
                  "New content as it ships",
                ].map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 shrink-0 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                size="lg"
                className="mt-8 w-full"
                onClick={() => navigate("/signup")}
              >
                Start 7-Day Free Trial
              </Button>
              <p className="mt-3 text-center text-xs text-muted-foreground">No credit card required during trial</p>
            </div>

            <div className="mt-6 rounded-lg border border-border bg-card/50 p-6 text-center">
              <p className="font-medium text-foreground">Team or dealership group?</p>
              <p className="mt-1 text-sm text-muted-foreground">Volume pricing available for 5+ seats. Dealer group rates for multi-rooftop deployments.</p>
              <p className="mt-3 text-sm text-primary font-medium">Contact us for enterprise pricing</p>
            </div>
          </div>
        </div>
      </section>

      {/* Social proof */}
      <section className="border-b border-border py-20 bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight">Built from real desk experience</h2>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
              DeskPilot Academy is built by operators who've run desks, managed F&I departments, and trained finance managers at every level.
            </p>
          </div>
          <div className="mx-auto mt-12 grid max-w-4xl gap-6 sm:grid-cols-3">
            {[
              { icon: TrendingUp, title: "+34%", subtitle: "Average assessment score improvement after completing F&I Mastery campus" },
              { icon: Zap, title: "2x faster", subtitle: "Deal desk confidence scores among graduates vs. non-trained managers" },
              { icon: Clock, title: "Under 45min", subtitle: "Average session length — designed for the gaps in a working dealer day" },
            ].map(({ icon: Icon, title, subtitle }) => (
              <div key={title} className="rounded-lg border border-border bg-card p-6 text-center">
                <Icon className="mx-auto h-8 w-8 text-primary mb-3" />
                <p className="text-2xl font-bold text-foreground">{title}</p>
                <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA — last conversion opportunity */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_120%,hsl(12,90%,55%,0.08),transparent)]" />
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8 relative">
          <h2 className="text-3xl font-bold tracking-tight">Ready to move the needle?</h2>
          <p className="mt-4 text-muted-foreground">Start training today. No credit card needed for the trial.</p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" onClick={() => navigate("/signup")} className="gap-2">
              Initialize Training
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="lg" onClick={() => navigate("/login")}>
              Already a member? Log In
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-primary text-xs font-bold text-primary-foreground">DP</div>
              <span className="text-sm font-medium">DeskPilot Academy</span>
            </div>
            <p className="text-xs text-muted-foreground">&copy; 2026 DeskPilot Academy. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
