import { Route, Switch, Redirect } from "wouter";
import { useAuth } from "./context/AuthContext";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import CampusDetail from "./pages/CampusDetail";
import AdminDashboard from "./pages/AdminDashboard";

function ProtectedRoute({ component: Component, adminOnly = false }: { component: React.ComponentType; adminOnly?: boolean }) {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      </div>
    );
  }

  if (!user) return <Redirect to="/login" />;
  if (adminOnly && profile?.role !== "admin") return <Redirect to="/dashboard" />;

  return <Component />;
}

function PublicOnlyRoute({ component: Component }: { component: React.ComponentType }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      </div>
    );
  }

  if (user) return <Redirect to="/dashboard" />;
  return <Component />;
}

export default function App() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/login">
        <PublicOnlyRoute component={Login} />
      </Route>
      <Route path="/signup">
        <PublicOnlyRoute component={Signup} />
      </Route>
      <Route path="/dashboard">
        <ProtectedRoute component={Dashboard} />
      </Route>
      <Route path="/campus/:slug">
        <ProtectedRoute component={CampusDetail} />
      </Route>
      <Route path="/admin">
        <ProtectedRoute component={AdminDashboard} adminOnly />
      </Route>
      <Route>
        <Redirect to="/" />
      </Route>
    </Switch>
  );
}
