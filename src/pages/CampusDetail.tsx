import { useEffect, useState } from "react";
import { useParams, useLocation } from "wouter";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";
import type { Campus, Level, Session, Enrollment, LevelProgress, StudentProgress } from "../lib/types";
import Navbar from "../components/layout/Navbar";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  ChevronRight, ChevronDown, Lock, CircleCheck as CheckCircle, CirclePlay as PlayCircle,
  Brain, Users, ClipboardList, MessageSquare, Clock, Loader as Loader2, CircleAlert as AlertCircle, BookOpen
} from "lucide-react";

type LevelWithData = Level & {
  sessions: (Session & { progress: StudentProgress | null })[];
  progress: LevelProgress | null;
};

const SESSION_TYPE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  video: PlayCircle,
  ai_sim: Brain,
  live: Users,
  assessment: ClipboardList,
  discussion: MessageSquare,
};

const SESSION_TYPE_LABELS: Record<string, string> = {
  video: "Video",
  ai_sim: "AI Simulation",
  live: "Live Session",
  assessment: "Assessment",
  discussion: "Discussion",
};

export default function CampusDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { profile } = useAuth();
  const [, navigate] = useLocation();
  const [campus, setCampus] = useState<Campus | null>(null);
  const [levels, setLevels] = useState<LevelWithData[]>([]);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [expandedLevels, setExpandedLevels] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    async function load() {
      if (!slug || !profile?.id) return;

      const { data: campusData } = await supabase
        .from("campuses")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();

      if (!campusData) { navigate("/dashboard"); return; }
      setCampus(campusData);

      const [levelsRes, sessionsRes, enrollmentRes, levelProgressRes, studentProgressRes] = await Promise.all([
        supabase.from("levels").select("*").eq("campus_id", campusData.id).order("level_order"),
        supabase.from("sessions").select("*, session_types(*)").eq("status", "published"),
        supabase.from("enrollments").select("*").eq("student_id", profile.id).eq("campus_id", campusData.id).maybeSingle(),
        supabase.from("level_progress").select("*").eq("student_id", profile.id),
        supabase.from("student_progress").select("*").eq("student_id", profile.id),
      ]);

      const allLevels: Level[] = levelsRes.data ?? [];
      const allSessions: Session[] = sessionsRes.data ?? [];
      const allLevelProgress: LevelProgress[] = levelProgressRes.data ?? [];
      const allStudentProgress: StudentProgress[] = studentProgressRes.data ?? [];

      const merged: LevelWithData[] = allLevels.map((level) => {
        const levelSessions = allSessions
          .filter((s) => s.level_id === level.id)
          .sort((a, b) => a.session_order - b.session_order)
          .map((s) => ({
            ...s,
            progress: allStudentProgress.find((sp) => sp.session_id === s.id) ?? null,
          }));

        return {
          ...level,
          sessions: levelSessions,
          progress: allLevelProgress.find((lp) => lp.level_id === level.id) ?? null,
        };
      });

      setLevels(merged);
      setEnrollment(enrollmentRes.data);
      if (merged.length > 0) {
        setExpandedLevels(new Set([merged[0].id]));
      }
      setLoading(false);
    }
    load();
  }, [slug, profile?.id]);

  async function handleEnroll() {
    if (!campus || !profile?.id) return;
    setEnrolling(true);

    const { data: enrollData } = await supabase
      .from("enrollments")
      .insert({
        student_id: profile.id,
        campus_id: campus.id,
        status: "active",
        enrolled_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (enrollData && levels.length > 0) {
      await supabase.from("level_progress").insert({
        student_id: profile.id,
        level_id: levels[0].id,
        enrollment_id: enrollData.id,
        status: "unlocked",
        unlocked_at: new Date().toISOString(),
      });
      setEnrollment(enrollData);
      setLevels((prev) =>
        prev.map((l, i) =>
          i === 0
            ? { ...l, progress: { ...l.progress!, status: "unlocked", unlocked_at: new Date().toISOString() } as LevelProgress }
            : l
        )
      );
    }
    setEnrolling(false);
  }

  function toggleLevel(levelId: string) {
    setExpandedLevels((prev) => {
      const next = new Set(prev);
      if (next.has(levelId)) next.delete(levelId);
      else next.add(levelId);
      return next;
    });
  }

  function getLevelStatus(level: LevelWithData): "locked" | "unlocked" | "in_progress" | "completed" {
    if (!enrollment) return "locked";
    if (!level.progress) return "locked";
    return level.progress.status;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!campus) return null;

  const totalSessions = levels.reduce((acc, l) => acc + l.sessions.length, 0);
  const completedSessions = levels.reduce(
    (acc, l) => acc + l.sessions.filter((s) => s.progress?.status === "completed" || s.progress?.status === "passed").length,
    0
  );
  const progressPct = totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Campus header */}
        <div className="mb-8">
          <button onClick={() => navigate("/dashboard")} className="mb-4 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ChevronRight className="h-3.5 w-3.5 rotate-180" />
            Back to Dashboard
          </button>
          <div className="flex items-start gap-5">
            <span className="text-4xl leading-none">{campus.emoji}</span>
            <div className="flex-1">
              <h1 className="text-2xl font-bold tracking-tight">{campus.name}</h1>
              <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{campus.description}</p>
              <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><BookOpen className="h-3 w-3" />{levels.length} levels</span>
                <span className="flex items-center gap-1"><PlayCircle className="h-3 w-3" />{totalSessions} sessions</span>
                {enrollment && (
                  <span className="flex items-center gap-1"><CheckCircle className="h-3 w-3 text-primary" />{completedSessions}/{totalSessions} completed</span>
                )}
              </div>
            </div>
          </div>

          {enrollment ? (
            <div className="mt-5">
              <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                <span>Campus progress</span>
                <span>{progressPct}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-secondary">
                <div className="h-2 rounded-full bg-primary transition-all duration-500" style={{ width: `${progressPct}%` }} />
              </div>
            </div>
          ) : (
            <div className="mt-5">
              <Button onClick={handleEnroll} disabled={enrolling} className="gap-2">
                {enrolling ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {enrolling ? "Enrolling..." : "Start This Campus"}
              </Button>
            </div>
          )}
        </div>

        {/* Levels */}
        <div className="space-y-3">
          {levels.map((level, index) => {
            const status = getLevelStatus(level);
            const isLocked = status === "locked";
            const isExpanded = expandedLevels.has(level.id);
            const completedInLevel = level.sessions.filter(
              (s) => s.progress?.status === "completed" || s.progress?.status === "passed"
            ).length;
            const requiredInLevel = level.sessions.filter((s) => s.is_required).length;

            return (
              <div key={level.id} className={`rounded-lg border ${isLocked ? "border-border opacity-60" : "border-border"} bg-card overflow-hidden`}>
                <button
                  onClick={() => !isLocked && toggleLevel(level.id)}
                  disabled={isLocked}
                  className={`flex w-full items-center gap-4 p-4 text-left transition-colors ${!isLocked ? "hover:bg-secondary/50" : "cursor-not-allowed"}`}
                >
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold
                    ${status === "completed" ? "border-primary bg-primary text-primary-foreground" : isLocked ? "border-muted text-muted-foreground" : "border-primary text-primary"}`}>
                    {status === "completed" ? <CheckCircle className="h-4 w-4" /> : isLocked ? <Lock className="h-4 w-4" /> : index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground">{level.name}</h3>
                      {status === "completed" && <Badge variant="success" className="text-xs">Completed</Badge>}
                      {status === "in_progress" && <Badge variant="primary" className="text-xs">In Progress</Badge>}
                      {isLocked && <Badge variant="outline" className="text-xs">Locked</Badge>}
                    </div>
                    {level.description && <p className="mt-0.5 text-xs text-muted-foreground truncate">{level.description}</p>}
                    {!isLocked && (
                      <p className="mt-0.5 text-xs text-muted-foreground">{completedInLevel}/{requiredInLevel} required sessions</p>
                    )}
                  </div>
                  {!isLocked && (
                    <ChevronDown className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                  )}
                </button>

                {isExpanded && !isLocked && (
                  <div className="border-t border-border">
                    {level.sessions.length === 0 ? (
                      <div className="px-4 py-6 text-center text-sm text-muted-foreground">No sessions published yet.</div>
                    ) : (
                      level.sessions.map((session) => (
                        <SessionRow key={session.id} session={session} />
                      ))
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function SessionRow({ session }: { session: Session & { progress: StudentProgress | null } }) {
  const typeSlug = (session as unknown as { session_types?: { slug: string } }).session_types?.slug ?? "video";
  const Icon = SESSION_TYPE_ICONS[typeSlug] ?? PlayCircle;
  const typeLabel = SESSION_TYPE_LABELS[typeSlug] ?? "Session";
  const isDone = session.progress?.status === "completed" || session.progress?.status === "passed";
  const isFailed = session.progress?.status === "failed";

  return (
    <div className="flex items-center gap-4 border-t border-border/50 px-4 py-3 first:border-t-0 transition-colors hover:bg-secondary/30">
      <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${isDone ? "bg-primary/15 text-primary" : "bg-secondary text-muted-foreground"}`}>
        <Icon className="h-3.5 w-3.5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className={`text-sm font-medium ${isDone ? "text-muted-foreground line-through decoration-primary/30" : "text-foreground"}`}>{session.title}</p>
          {session.is_gate && <Badge variant="warning" className="text-xs">Gate</Badge>}
          {!session.is_required && <Badge variant="outline" className="text-xs">Optional</Badge>}
        </div>
        <div className="flex items-center gap-3 mt-0.5 text-xs text-muted-foreground">
          <span>{typeLabel}</span>
          {session.duration_min && (
            <span className="flex items-center gap-0.5"><Clock className="h-3 w-3" />{session.duration_min}min</span>
          )}
        </div>
      </div>
      <div className="shrink-0">
        {isDone ? (
          <CheckCircle className="h-4 w-4 text-primary" />
        ) : isFailed ? (
          <AlertCircle className="h-4 w-4 text-red-400" />
        ) : (
          <div className="h-4 w-4 rounded-full border-2 border-muted" />
        )}
      </div>
    </div>
  );
}
