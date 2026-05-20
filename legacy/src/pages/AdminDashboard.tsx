import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import type { Campus, Level, Session, Profile } from "../lib/types";
import Navbar from "../components/layout/Navbar";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Plus, Pencil, Trash2, ChevronDown, ChevronRight, Loader as Loader2, Users, BookOpen, LayoutGrid, Settings, Eye, EyeOff, X } from "lucide-react";

type Tab = "campuses" | "students" | "settings";

interface CampusWithLevels extends Campus {
  levels: (Level & { sessions: Session[] })[];
  expanded: boolean;
}

export default function AdminDashboard() {
  const [tab, setTab] = useState<Tab>("campuses");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
        </div>

        <div className="mb-6 flex gap-1 border-b border-border">
          {([
            { id: "campuses", label: "Campuses", icon: LayoutGrid },
            { id: "students", label: "Students", icon: Users },
            { id: "settings", label: "Settings", icon: Settings },
          ] as { id: Tab; label: string; icon: React.ComponentType<{ className?: string }> }[]).map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors -mb-px ${
                tab === id
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>

        {tab === "campuses" && <CampusesTab />}
        {tab === "students" && <StudentsTab />}
        {tab === "settings" && <SettingsTab />}
      </div>
    </div>
  );
}

function CampusesTab() {
  const [campuses, setCampuses] = useState<CampusWithLevels[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCampusForm, setShowCampusForm] = useState(false);
  const [editingCampus, setEditingCampus] = useState<Campus | null>(null);
  const [showLevelForm, setShowLevelForm] = useState<string | null>(null);
  const [editingLevel, setEditingLevel] = useState<Level | null>(null);
  const [showSessionForm, setShowSessionForm] = useState<{ campusId: string; levelId: string } | null>(null);
  const [editingSession, setEditingSession] = useState<Session | null>(null);

  useEffect(() => {
    loadCampuses();
  }, []);

  async function loadCampuses() {
    const [campusRes, levelRes, sessionRes] = await Promise.all([
      supabase.from("campuses").select("*").order("display_order"),
      supabase.from("levels").select("*").order("level_order"),
      supabase.from("sessions").select("*, session_types(*)").order("session_order"),
    ]);

    const allCampuses: Campus[] = campusRes.data ?? [];
    const allLevels: Level[] = levelRes.data ?? [];
    const allSessions: Session[] = sessionRes.data ?? [];

    const merged: CampusWithLevels[] = allCampuses.map((campus) => ({
      ...campus,
      expanded: false,
      levels: allLevels
        .filter((l) => l.campus_id === campus.id)
        .map((level) => ({
          ...level,
          sessions: allSessions.filter((s) => s.level_id === level.id),
        })),
    }));
    setCampuses(merged);
    setLoading(false);
  }

  function toggleCampus(id: string) {
    setCampuses((prev) => prev.map((c) => c.id === id ? { ...c, expanded: !c.expanded } : c));
  }

  async function toggleCampusStatus(campus: Campus) {
    const newStatus = campus.status === "published" ? "draft" : "published";
    await supabase.from("campuses").update({ status: newStatus }).eq("id", campus.id);
    setCampuses((prev) => prev.map((c) => c.id === campus.id ? { ...c, status: newStatus } : c));
  }

  async function deleteCampus(id: string) {
    if (!confirm("Delete this campus and all its levels and sessions?")) return;
    await supabase.from("campuses").delete().eq("id", id);
    setCampuses((prev) => prev.filter((c) => c.id !== id));
  }

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;
  }

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Button size="sm" onClick={() => { setEditingCampus(null); setShowCampusForm(true); }} className="gap-2">
          <Plus className="h-4 w-4" /> New Campus
        </Button>
      </div>

      {showCampusForm && (
        <CampusForm
          campus={editingCampus}
          onSave={() => { setShowCampusForm(false); loadCampuses(); }}
          onCancel={() => setShowCampusForm(false)}
        />
      )}

      <div className="space-y-3">
        {campuses.map((campus) => (
          <div key={campus.id} className="rounded border border-border bg-card overflow-hidden">
            <div className="flex items-center gap-3 p-4">
              <button onClick={() => toggleCampus(campus.id)} className="flex items-center gap-3 flex-1 min-w-0 text-left">
                <span className="text-xl">{campus.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground">{campus.name}</span>
                    <Badge variant={campus.status === "published" ? "success" : "outline"} className="text-xs capitalize">
                      {campus.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{campus.levels.length} levels &middot; {campus.levels.reduce((a, l) => a + l.sessions.length, 0)} sessions</p>
                </div>
                <ChevronDown className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${campus.expanded ? "rotate-180" : ""}`} />
              </button>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => toggleCampusStatus(campus)}
                  className="flex h-7 w-7 items-center justify-center rounded hover:bg-secondary transition-colors text-muted-foreground"
                  title={campus.status === "published" ? "Unpublish" : "Publish"}
                >
                  {campus.status === "published" ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                </button>
                <button
                  onClick={() => { setEditingCampus(campus); setShowCampusForm(true); }}
                  className="flex h-7 w-7 items-center justify-center rounded hover:bg-secondary transition-colors text-muted-foreground"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => deleteCampus(campus.id)}
                  className="flex h-7 w-7 items-center justify-center rounded hover:bg-secondary transition-colors text-red-400"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {campus.expanded && (
              <div className="border-t border-border px-4 pb-4 pt-3">
                {campus.levels.map((level) => (
                  <div key={level.id} className="mb-2 rounded border border-border/50 bg-secondary/30">
                    <div className="flex items-center gap-3 p-3">
                      <span className="text-xs font-bold text-primary w-5 shrink-0 text-center">{level.level_order}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">{level.name}</p>
                        <p className="text-xs text-muted-foreground">{level.sessions.length} sessions</p>
                      </div>
                      <div className="flex gap-1.5 shrink-0">
                        <button
                          onClick={() => { setShowSessionForm({ campusId: campus.id, levelId: level.id }); setEditingSession(null); }}
                          className="flex h-6 w-6 items-center justify-center rounded hover:bg-secondary transition-colors text-muted-foreground"
                          title="Add session"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => { setEditingLevel(level); setShowLevelForm(campus.id); }}
                          className="flex h-6 w-6 items-center justify-center rounded hover:bg-secondary transition-colors text-muted-foreground"
                        >
                          <Pencil className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                    {level.sessions.map((session) => (
                      <div key={session.id} className="flex items-center gap-3 border-t border-border/30 px-3 py-2">
                        <span className="text-xs text-muted-foreground w-5 text-center">{session.session_order}</span>
                        <p className="flex-1 text-xs text-foreground truncate">{session.title}</p>
                        <div className="flex items-center gap-2 shrink-0">
                          <Badge variant={session.status === "published" ? "success" : "outline"} className="text-xs capitalize">{session.status}</Badge>
                          <button
                            onClick={() => { setEditingSession(session); setShowSessionForm({ campusId: campus.id, levelId: level.id }); }}
                            className="flex h-5 w-5 items-center justify-center rounded hover:bg-secondary transition-colors text-muted-foreground"
                          >
                            <Pencil className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-2 gap-1.5 text-xs"
                  onClick={() => { setEditingLevel(null); setShowLevelForm(campus.id); }}
                >
                  <Plus className="h-3 w-3" /> Add Level
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>

      {showLevelForm && (
        <Modal onClose={() => { setShowLevelForm(null); setEditingLevel(null); }}>
          <LevelForm
            campusId={showLevelForm}
            level={editingLevel}
            onSave={() => { setShowLevelForm(null); setEditingLevel(null); loadCampuses(); }}
            onCancel={() => { setShowLevelForm(null); setEditingLevel(null); }}
          />
        </Modal>
      )}

      {showSessionForm && (
        <Modal onClose={() => { setShowSessionForm(null); setEditingSession(null); }}>
          <SessionForm
            levelId={showSessionForm.levelId}
            session={editingSession}
            onSave={() => { setShowSessionForm(null); setEditingSession(null); loadCampuses(); }}
            onCancel={() => { setShowSessionForm(null); setEditingSession(null); }}
          />
        </Modal>
      )}
    </div>
  );
}

function CampusForm({ campus, onSave, onCancel }: { campus: Campus | null; onSave: () => void; onCancel: () => void }) {
  const [name, setName] = useState(campus?.name ?? "");
  const [slug, setSlug] = useState(campus?.slug ?? "");
  const [emoji, setEmoji] = useState(campus?.emoji ?? "📚");
  const [color, setColor] = useState(campus?.color ?? "#f59e0b");
  const [description, setDescription] = useState(campus?.description ?? "");
  const [badgeEmoji, setBadgeEmoji] = useState(campus?.badge_emoji ?? "🏆");
  const [badgeName, setBadgeName] = useState(campus?.badge_name ?? "");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const payload = { name, slug, emoji, color, description, badge_emoji: badgeEmoji, badge_name: badgeName };
    if (campus) {
      await supabase.from("campuses").update(payload).eq("id", campus.id);
    } else {
      await supabase.from("campuses").insert({ ...payload, status: "draft", display_order: 99 });
    }
    onSave();
  }

  return (
    <form onSubmit={handleSubmit} className="rounded border border-border bg-card p-5 mb-4">
      <h3 className="font-semibold text-foreground mb-4">{campus ? "Edit Campus" : "New Campus"}</h3>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1"><label className="text-xs font-medium text-muted-foreground">Name</label><Input value={name} onChange={(e) => { setName(e.target.value); if (!campus) setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-")); }} required /></div>
        <div className="space-y-1"><label className="text-xs font-medium text-muted-foreground">Slug</label><Input value={slug} onChange={(e) => setSlug(e.target.value)} required /></div>
        <div className="space-y-1"><label className="text-xs font-medium text-muted-foreground">Emoji</label><Input value={emoji} onChange={(e) => setEmoji(e.target.value)} required /></div>
        <div className="space-y-1"><label className="text-xs font-medium text-muted-foreground">Color</label><Input type="color" value={color} onChange={(e) => setColor(e.target.value)} /></div>
        <div className="col-span-full space-y-1"><label className="text-xs font-medium text-muted-foreground">Description</label><Input value={description} onChange={(e) => setDescription(e.target.value)} /></div>
        <div className="space-y-1"><label className="text-xs font-medium text-muted-foreground">Badge Emoji</label><Input value={badgeEmoji} onChange={(e) => setBadgeEmoji(e.target.value)} /></div>
        <div className="space-y-1"><label className="text-xs font-medium text-muted-foreground">Badge Name</label><Input value={badgeName} onChange={(e) => setBadgeName(e.target.value)} /></div>
      </div>
      <div className="mt-4 flex gap-2">
        <Button type="submit" size="sm" disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
        <Button type="button" variant="ghost" size="sm" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
}

function LevelForm({ campusId, level, onSave, onCancel }: { campusId: string; level: Level | null; onSave: () => void; onCancel: () => void }) {
  const [name, setName] = useState(level?.name ?? "");
  const [description, setDescription] = useState(level?.description ?? "");
  const [order, setOrder] = useState(level?.level_order ?? 1);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const payload = { campus_id: campusId, name, description, level_order: order, unlock_rule: "complete_prior" as const };
    if (level) {
      await supabase.from("levels").update(payload).eq("id", level.id);
    } else {
      await supabase.from("levels").insert(payload);
    }
    onSave();
  }

  return (
    <form onSubmit={handleSubmit}>
      <h3 className="font-semibold text-foreground mb-4">{level ? "Edit Level" : "New Level"}</h3>
      <div className="space-y-3">
        <div className="space-y-1"><label className="text-xs font-medium text-muted-foreground">Level Name</label><Input value={name} onChange={(e) => setName(e.target.value)} required /></div>
        <div className="space-y-1"><label className="text-xs font-medium text-muted-foreground">Description</label><Input value={description} onChange={(e) => setDescription(e.target.value)} /></div>
        <div className="space-y-1"><label className="text-xs font-medium text-muted-foreground">Order</label><Input type="number" value={order} onChange={(e) => setOrder(Number(e.target.value))} min={1} required /></div>
      </div>
      <div className="mt-4 flex gap-2">
        <Button type="submit" size="sm" disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
        <Button type="button" variant="ghost" size="sm" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
}

function SessionForm({ levelId, session, onSave, onCancel }: { levelId: string; session: Session | null; onSave: () => void; onCancel: () => void }) {
  const [title, setTitle] = useState(session?.title ?? "");
  const [order, setOrder] = useState(session?.session_order ?? 1);
  const [typeSlug, setTypeSlug] = useState("video");
  const [duration, setDuration] = useState(session?.duration_min ?? 20);
  const [isRequired, setIsRequired] = useState(session?.is_required ?? true);
  const [isGate, setIsGate] = useState(session?.is_gate ?? false);
  const [contentUrl, setContentUrl] = useState(session?.content_url ?? "");
  const [status, setStatus] = useState<"draft" | "published">(session?.status ?? "draft");
  const [saving, setSaving] = useState(false);
  const [sessionTypes, setSessionTypes] = useState<{ id: string; slug: string; name: string }[]>([]);

  useEffect(() => {
    supabase.from("session_types").select("id, slug, name").then(({ data }) => {
      setSessionTypes(data ?? []);
      if (!session && data?.length) setTypeSlug(data[0].slug);
    });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const sessionType = sessionTypes.find((t) => t.slug === typeSlug);
    const payload = {
      level_id: levelId,
      session_type_id: sessionType?.id,
      title,
      session_order: order,
      duration_min: duration,
      is_required: isRequired,
      is_gate: isGate,
      content_url: contentUrl || null,
      status,
    };
    if (session) {
      await supabase.from("sessions").update(payload).eq("id", session.id);
    } else {
      await supabase.from("sessions").insert(payload);
    }
    onSave();
  }

  return (
    <form onSubmit={handleSubmit}>
      <h3 className="font-semibold text-foreground mb-4">{session ? "Edit Session" : "New Session"}</h3>
      <div className="space-y-3">
        <div className="space-y-1"><label className="text-xs font-medium text-muted-foreground">Title</label><Input value={title} onChange={(e) => setTitle(e.target.value)} required /></div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Type</label>
            <select value={typeSlug} onChange={(e) => setTypeSlug(e.target.value)} className="flex h-10 w-full rounded border border-border bg-secondary px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              {sessionTypes.map((t) => <option key={t.id} value={t.slug}>{t.name}</option>)}
            </select>
          </div>
          <div className="space-y-1"><label className="text-xs font-medium text-muted-foreground">Order</label><Input type="number" value={order} onChange={(e) => setOrder(Number(e.target.value))} min={1} /></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1"><label className="text-xs font-medium text-muted-foreground">Duration (min)</label><Input type="number" value={duration} onChange={(e) => setDuration(Number(e.target.value))} min={1} /></div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value as "draft" | "published")} className="flex h-10 w-full rounded border border-border bg-secondary px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>
        <div className="space-y-1"><label className="text-xs font-medium text-muted-foreground">Content URL</label><Input value={contentUrl} onChange={(e) => setContentUrl(e.target.value)} placeholder="https://..." /></div>
        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={isRequired} onChange={(e) => setIsRequired(e.target.checked)} className="h-4 w-4 accent-blue-500" />
            Required
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={isGate} onChange={(e) => setIsGate(e.target.checked)} className="h-4 w-4 accent-blue-500" />
            Gate assessment
          </label>
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        <Button type="submit" size="sm" disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
        <Button type="button" variant="ghost" size="sm" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
}

function StudentsTab() {
  const [students, setStudents] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("profiles").select("*").order("created_at", { ascending: false }).then(({ data }) => {
      setStudents(data ?? []);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;

  return (
    <div className="rounded border border-border overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-secondary/50">
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Name</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Role</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Joined</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id} className="border-b border-border/50 last:border-0 hover:bg-secondary/30 transition-colors">
              <td className="px-4 py-3 font-medium text-foreground">{student.full_name ?? "—"}</td>
              <td className="px-4 py-3 text-muted-foreground">{student.email}</td>
              <td className="px-4 py-3"><Badge variant="outline" className="capitalize text-xs">{student.role}</Badge></td>
              <td className="px-4 py-3"><Badge variant={student.subscription_status === "active" || student.subscription_status === "trialing" ? "success" : "outline"} className="capitalize text-xs">{student.subscription_status ?? "no plan"}</Badge></td>
              <td className="px-4 py-3 text-muted-foreground">{new Date(student.created_at).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SettingsTab() {
  return (
    <div className="rounded border border-border bg-card p-6">
      <h3 className="font-semibold text-foreground mb-4">Platform Settings</h3>
      <p className="text-sm text-muted-foreground">Settings management coming soon.</p>
    </div>
  );
}

function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md rounded border border-border bg-card p-6 shadow-xl">
        <button onClick={onClose} className="absolute right-4 top-4 text-muted-foreground hover:text-foreground transition-colors">
          <X className="h-4 w-4" />
        </button>
        {children}
      </div>
    </div>
  );
}
