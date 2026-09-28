import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Toast from "./components/Toast.jsx";
import IntroLanding from "./pages/IntroLanding.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Feed from "./pages/Feed.jsx";
import GeneralChat from "./pages/GeneralChat.jsx";
import CreatePost from "./pages/CreatePost.jsx";
import Profile from "./pages/Profile.jsx";

export function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("campuspulse_user") || "null");
  } catch {
    return null;
  }
}

function ProtectedRoute({ user, children }) {
  return user ? children : <Navigate to="/login" replace />;
}

function AppShell({ user, onLogout, toast, setToast, children }) {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.pathname]);

  return (
    <div className="app-shell">
      <Navbar user={user} onLogout={onLogout} />
      <main>{children}</main>
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}

export default function App() {
  const navigate = useNavigate();
  const [user, setUser] = useState(getStoredUser);
  const [toast, setToast] = useState(null);

  const persistSession = (session) => {
    localStorage.setItem("campuspulse_token", session.token);
    localStorage.setItem("campuspulse_user", JSON.stringify(session.user));
    setUser(session.user);
  };

  const logout = () => {
    localStorage.removeItem("campuspulse_token");
    localStorage.removeItem("campuspulse_user");
    setUser(null);
    setToast({ type: "success", message: "You have been signed out." });
    navigate("/");
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          <AppShell user={user} onLogout={logout} toast={toast} setToast={setToast}>
            <IntroLanding user={user} />
          </AppShell>
        }
      />
      <Route
        path="/login"
        element={
          user ? (
            <Navigate to="/feed" replace />
          ) : (
            <AppShell user={user} onLogout={logout} toast={toast} setToast={setToast}>
              <Login onLogin={persistSession} />
            </AppShell>
          )
        }
      />
      <Route
        path="/signup"
        element={
          user ? (
            <Navigate to="/feed" replace />
          ) : (
            <AppShell user={user} onLogout={logout} toast={toast} setToast={setToast}>
              <Signup onSignup={persistSession} />
            </AppShell>
          )
        }
      />
      <Route
        path="/feed"
        element={
          <ProtectedRoute user={user}>
            <AppShell user={user} onLogout={logout} toast={toast} setToast={setToast}>
              <Feed user={user} onToast={setToast} />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/chat"
        element={
          <ProtectedRoute user={user}>
            <AppShell user={user} onLogout={logout} toast={toast} setToast={setToast}>
              <GeneralChat user={user} onToast={setToast} />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/create"
        element={
          <ProtectedRoute user={user}>
            <AppShell user={user} onLogout={logout} toast={toast} setToast={setToast}>
              <CreatePost user={user} onToast={setToast} />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute user={user}>
            <AppShell user={user} onLogout={logout} toast={toast} setToast={setToast}>
              <Profile user={user} />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
