import { useState } from "react";
import { useLocation, Link } from "wouter";
import { supabase } from "../lib/supabase";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { CircleCheck as CheckCircle } from "lucide-react";

export default function Signup() {
  const [, navigate] = useLocation();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      navigate("/dashboard");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      {/* Subtle ambient glow */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_50%_50%_at_50%_30%,hsl(12,90%,55%,0.05),transparent)]" />

      <div className="w-full max-w-sm relative">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary font-bold text-primary-foreground text-sm">DP</div>
            <span className="font-semibold text-foreground">DeskPilot Academy</span>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">Start your free trial</h1>
          <p className="mt-2 text-sm text-muted-foreground">7 days free, no credit card required</p>
        </div>

        {/* Trust signals above form */}
        <div className="mb-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><CheckCircle className="h-3 w-3 text-primary" />All 9 campuses</span>
          <span className="flex items-center gap-1"><CheckCircle className="h-3 w-3 text-primary" />Cancel anytime</span>
          <span className="flex items-center gap-1"><CheckCircle className="h-3 w-3 text-primary" />No card needed</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground" htmlFor="name">Full Name</label>
            <Input
              id="name"
              type="text"
              placeholder="Your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              autoComplete="name"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground" htmlFor="email">Email</label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground" htmlFor="password">Password</label>
            <Input
              id="password"
              type="password"
              placeholder="Create a password (8+ characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              autoComplete="new-password"
            />
          </div>

          {error && (
            <div className="rounded-md border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-400">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading ? "Creating account..." : "Create Free Account"}
          </Button>
        </form>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          By creating an account you agree to our terms of service and privacy policy.
        </p>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
