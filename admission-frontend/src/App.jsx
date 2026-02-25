import { BrowserRouter, Routes, Route, NavLink, Link, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Institution from "./pages/Institution";
import Program from "./pages/Program";
import Applicant from "./pages/Applicant";
import Allocation from "./pages/Allocation";
import Quota from "./pages/Quota";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <nav>
      <div className="nav-logo" style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--primary)', fontFamily: 'Outfit' }}>
        ADMISSION <span style={{ color: 'var(--text-main)' }}>PRO</span>
      </div>
      <NavLink to="/dashboard">Dashboard</NavLink>
      {user.role === "ADMIN" && (
        <>
          <NavLink to="/institution">Institution</NavLink>
          <NavLink to="/program">Program</NavLink>
          <NavLink to="/quota">Quota</NavLink>
        </>
      )}
      {(user.role === "ADMIN" || user.role === "ADMISSION_OFFICER") && (
        <>
          <NavLink to="/applicant">Applicant</NavLink>
          <NavLink to="/allocation">Allocation</NavLink>
        </>
      )}
      <button onClick={logout} className="logout-btn">
        Logout ({user.username})
      </button>
    </nav>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes wrapped in .page container */}
        <Route
          path="/*"
          element={
            <main className="page">
              <Routes>
                <Route
                  path="dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="institution"
                  element={
                    <ProtectedRoute allowedRoles={["ADMIN"]}>
                      <Institution />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="program"
                  element={
                    <ProtectedRoute allowedRoles={["ADMIN"]}>
                      <Program />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="quota"
                  element={
                    <ProtectedRoute allowedRoles={["ADMIN"]}>
                      <Quota />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="applicant"
                  element={
                    <ProtectedRoute allowedRoles={["ADMIN", "ADMISSION_OFFICER"]}>
                      <Applicant />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="allocation"
                  element={
                    <ProtectedRoute allowedRoles={["ADMIN", "ADMISSION_OFFICER"]}>
                      <Allocation />
                    </ProtectedRoute>
                  }
                />
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </main>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;