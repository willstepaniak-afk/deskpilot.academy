import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";
import type { Campus, Enrollment } from "../lib/types";
import Navbar from "../components/layout/Navbar";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { BookOpen, CirclePlay as PlayCircle, Award, ChevronRight, TrendingUp, Loader as Loader2 } from "lucide-react";

interface CampusWithEnrollment extends Campus {
  enrollment: Enrollment | null;
}

export default function Dashboard() {
  const { profile } = useAuth();
  const [, navigate] = useLocation();
  const [campuses, setCampuses] = useState<CampusWithEnrollment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [campusRes, enrollRes] = await Promise.all([
        supabase.from("campuses").select("*").eq("status", "published").order("display_order"),
        supabase.from("enrollments").select("*").eq("student_id", profile?.id ?? ""),
      ]);

      const campusList: Campus[] = campusRes.data ?? [];
      const enrollments: Enrollment[] = enrollRes.data ?? [];

      const merged = campusList.map((c) => ({
        ...c,
        enrollment: enrollments.find((e) => e.campus_id === c.id) ?? null,
      }));
      setCampuses(merged);
      setLoading(false);
    }
    if (profile?.id) load();
  }, [profile?.id]);

  const enrolledCount = campuses.filter((c) => c.enrollment).length;
  const completedCount = campuses.filter((c) => c.enrollment?.status === "completed").length;
  const badgeCount = profile?.badges?.length ?? 0;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Welcome back, {profile?.full_name?.split(" ")[0] ?? "there"}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">Pick up where you left off.</p>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "Campuses enrolled", value: enrolledCount, icon: BookOpen },
            { label: "Sessions completed", value: 0, icon: PlayCircle },
            { label: "Campuses completed", value: completedCount, icon: TrendingUp },
            { label: "Badges earned", value: badgeCount, icon: Award },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="rounded-lg border border-border bg-card p-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Icon className="h-4 w-4 text-primary/70" />
                <span className="text-xs">{label}</span>
              </div>
              <p className="mt-2 text-2xl font-bold text-foreground">{value}</p>
            </div>
          ))}
        </div>

        {/* Badges */}
        {badgeCount > 0 && (
          <div className="mb-8 rounded-lg border border-border bg-card p-5">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Earned Badges</h2>
            <div className="flex flex-wrap gap-3">
              {profile?.badges?.map((badge, i) => (
                <div key={i} title={profile.badge_names?.[i]} className="flex h-10 w-10 cursor-default items-center justify-center rounded-lg border border-primary/20 bg-primary/5 text-xl">
                  {badge}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Campus grid */}
        <div>
          <h2 className="mb-4 text-lg font-semibold">Training Campuses</h2>
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {campuses.map((campus) => (
                <CampusCard
                  key={campus.id}
                  campus={campus}
                  onClick={() => navigate(`/campus/${campus.slug}`)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CampusCard({ campus, onClick }: { campus: CampusWithEnrollment; onClick: () => void }) {
  const enrollment = campus.enrollment;
  const isCompleted = enrollment?.status === "completed";
  const isEnrolled = !!enrollment && !isCompleted;
  const progress = enrollment?.progress_pct ?? 0;

  return (
    <div
      onClick={onClick}
      className="group cursor-pointer rounded-lg border border-border bg-card p-5 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5"
    >
      <div className="flex items-start gap-4">
        <span className="text-2xl leading-none shrink-0">{campus.emoji}</span>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-foreground leading-tight group-hover:text-primary transition-colors">{campus.name}</h3>
            {isCompleted && <Badge variant="success" className="shrink-0 text-xs">Done</Badge>}
          </div>
          <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed line-clamp-2">{campus.description}</p>

          {isEnrolled && (
            <div className="mt-3">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-secondary">
                <div
                  className="h-1.5 rounded-full bg-primary transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          <div className="mt-4 flex items-center justify-between">
            <Button
              size="sm"
              variant={isEnrolled ? "default" : "outline"}
              className="gap-1.5 text-xs h-7 px-3"
            >
              {isCompleted ? "Review" : isEnrolled ? "Continue" : "Start"}
              <ChevronRight className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
