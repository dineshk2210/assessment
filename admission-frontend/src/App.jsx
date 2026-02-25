import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
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
      <Link to="/dashboard">Dashboard</Link>
      {user.role === "ADMIN" && (
        <>
          <Link to="/institution">Institution</Link>
          <Link to="/program">Program</Link>
          <Link to="/quota">Quota</Link>
        </>
      )}
      {(user.role === "ADMIN" || user.role === "ADMISSION_OFFICER") && (
        <>
          <Link to="/applicant">Applicant</Link>
          <Link to="/allocation">Allocation</Link>
        </>
      )}
      <button onClick={logout} style={{ marginLeft: "auto", cursor: "pointer" }}>
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

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/institution"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <Institution />
            </ProtectedRoute>
          }
        />
        <Route
          path="/program"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <Program />
            </ProtectedRoute>
          }
        />
        <Route
          path="/quota"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <Quota />
            </ProtectedRoute>
          }
        />
        <Route
          path="/applicant"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "ADMISSION_OFFICER"]}>
              <Applicant />
            </ProtectedRoute>
          }
        />
        <Route
          path="/allocation"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "ADMISSION_OFFICER"]}>
              <Allocation />
            </ProtectedRoute>
          }
        />

        {/* Redirect root to dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;