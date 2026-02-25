import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Signup = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("ADMISSION_OFFICER");
    const [error, setError] = useState("");
    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await signup(username, password, role);
            navigate("/dashboard");
        } catch (err) {
            setError("Signup failed. Choose a different username.");
        }
    };

    return (
        <div className="auth-container">
            <form className="auth-form" onSubmit={handleSubmit}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ fontWeight: 800, fontSize: '1.5rem', color: 'var(--primary)', fontFamily: 'Outfit' }}>
                        ADMISSION <span style={{ color: 'var(--text-main)' }}>PRO</span>
                    </div>
                    <p className="subtitle">Create an account to manage admissions.</p>
                </div>
                {error && <p className="error">{error}</p>}
                <div className="form-group">
                    <label>Username</label>
                    <input
                        type="text"
                        placeholder="Choose a username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input
                        type="password"
                        placeholder="Create a password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Role</label>
                    <select value={role} onChange={(e) => setRole(e.target.value)}>
                        <option value="ADMIN">Admin</option>
                        <option value="ADMISSION_OFFICER">Admission Officer</option>
                        <option value="MANAGEMENT">Management</option>
                    </select>
                </div>
                <button type="submit" style={{ width: '100%', marginTop: '1rem' }}>Signup</button>
                <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--secondary)' }}>
                    Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>Login here</Link>
                </p>
            </form>
        </div>
    );
};

export default Signup;
