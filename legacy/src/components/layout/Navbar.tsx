import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../ui/button";
import { Bell, ChevronDown, LogOut, Settings, User } from "lucide-react";

export default function Navbar() {
  const { user, profile, signOut } = useAuth();
  const [, navigate] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-white/5 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href={user ? "/dashboard" : "/"} className="flex items-center gap-2.5 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary font-bold text-primary-foreground text-sm transition-transform group-hover:scale-105">
            DP
          </div>
          <span className="font-semibold text-foreground tracking-tight">DeskPilot Academy</span>
        </Link>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <button className="relative flex h-9 w-9 items-center justify-center rounded-md hover:bg-secondary transition-colors">
                <Bell className="h-4 w-4 text-muted-foreground" />
              </button>

              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-2 rounded-md px-3 py-1.5 hover:bg-secondary transition-colors"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">
                    {profile?.full_name?.charAt(0)?.toUpperCase() ?? "U"}
                  </div>
                  <span className="hidden text-sm font-medium sm:block">{profile?.full_name ?? profile?.email?.split("@")[0]}</span>
                  <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                </button>

                {menuOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                    <div className="absolute right-0 top-full z-20 mt-2 w-52 rounded-lg border border-border bg-card shadow-xl shadow-black/20">
                      <div className="border-b border-border px-4 py-3">
                        <p className="text-xs text-muted-foreground">{profile?.email}</p>
                        <p className="text-xs font-semibold capitalize text-primary mt-0.5">{profile?.role}</p>
                      </div>
                      {profile?.role === "admin" && (
                        <button
                          onClick={() => { setMenuOpen(false); navigate("/admin"); }}
                          className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-secondary transition-colors"
                        >
                          <Settings className="h-4 w-4 text-muted-foreground" />
                          Admin Dashboard
                        </button>
                      )}
                      <button
                        onClick={() => { setMenuOpen(false); navigate("/dashboard"); }}
                        className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-secondary transition-colors"
                      >
                        <User className="h-4 w-4 text-muted-foreground" />
                        Dashboard
                      </button>
                      <button
                        onClick={() => { setMenuOpen(false); signOut(); }}
                        className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-red-400 hover:bg-secondary transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => navigate("/login")}>
                Log In
              </Button>
              <Button size="sm" onClick={() => navigate("/signup")}>
                Start Free Trial
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
