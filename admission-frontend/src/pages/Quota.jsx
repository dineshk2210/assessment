import { useEffect, useState } from "react";
import API from "../services/api";

function Quota() {
    const [quotas, setQuotas] = useState([]);
    const [institutions, setInstitutions] = useState([]);
    const [programs, setPrograms] = useState([]);
    const [editingId, setEditingId] = useState(null);

    const [form, setForm] = useState({
        institutionId: "",
        programId: "",
        quotaType: "KCET",
        seatLimit: ""
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchQuotas();
        fetchInstitutions();
    }, []);

    const fetchQuotas = async () => {
        try {
            const res = await API.get("/quotas");
            setQuotas(res.data);
        } catch (err) {
            console.error("Error fetching quotas", err);
        }
    };

    const fetchInstitutions = async () => {
        try {
            const res = await API.get("/institutions");
            setInstitutions(res.data);
        } catch (err) {
            console.error("Error fetching institutions", err);
        }
    };

    const handleInstitutionChange = async (instId) => {
        setForm({ ...form, institutionId: instId, programId: "" });
        if (instId) {
            try {
                const res = await API.get(`/programs/institution/${instId}`);
                setPrograms(res.data);
            } catch (err) {
                console.error("Error fetching programs", err);
            }
        } else {
            setPrograms([]);
        }
    };

    const handleEdit = async (q) => {
        setEditingId(q.id);
        const instId = q.program?.institution?.id || "";

        // Fetch programs for that institution first
        if (instId) {
            try {
                const res = await API.get(`/programs/institution/${instId}`);
                setPrograms(res.data);
            } catch (err) {
                console.error("Error fetching programs for edit", err);
            }
        }

        setForm({
            institutionId: instId.toString(),
            programId: q.program ? q.program.id.toString() : "",
            quotaType: q.quotaType,
            seatLimit: q.seatLimit.toString()
        });
        setError("");
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setForm({
            institutionId: "",
            programId: "",
            quotaType: "KCET",
            seatLimit: ""
        });
        setPrograms([]);
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const payload = {
            quotaType: form.quotaType,
            seatLimit: parseInt(form.seatLimit),
            program: {
                id: parseInt(form.programId)
            }
        };

        try {
            if (editingId) {
                await API.put(`/quotas/${editingId}`, payload);
                alert("Quota updated successfully");
            } else {
                await API.post("/quotas", payload);
                alert("Quota created successfully");
            }

            cancelEdit();
            fetchQuotas();
        } catch (err) {
            setError(err.response?.data?.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="page-header">
                <h1>Seat Quotas</h1>
                <p className="subtitle">Define and manage seat limits for different admission quotas.</p>
            </div>

            <div className="card">
                <h2 className="mb-4">{editingId ? "Edit Quota" : "Manage Quota"}</h2>
                {error && <p className="error">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div className="form-group">
                            <label>Institution</label>
                            <select
                                value={form.institutionId}
                                onChange={(e) => handleInstitutionChange(e.target.value)}
                                required
                                disabled={!!editingId}
                            >
                                <option value="">Select Institution</option>
                                {institutions.map((inst) => (
                                    <option key={inst.id} value={inst.id}>
                                        {inst.name} ({inst.code})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Program</label>
                            <select
                                value={form.programId}
                                onChange={(e) => setForm({ ...form, programId: e.target.value })}
                                required
                                disabled={!!editingId || !form.institutionId}
                            >
                                <option value="">Select Program</option>
                                {programs.map((p) => (
                                    <option key={p.id} value={p.id}>
                                        {p.name} (Intake: {p.totalIntake})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Quota Type</label>
                            <select
                                value={form.quotaType}
                                onChange={(e) => setForm({ ...form, quotaType: e.target.value })}
                            >
                                <option value="KCET">KCET</option>
                                <option value="COMEDK">COMEDK</option>
                                <option value="Management">Management</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Seat Limit</label>
                            <input
                                type="number"
                                placeholder="Number of seats"
                                value={form.seatLimit}
                                onChange={(e) => setForm({ ...form, seatLimit: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                        <button type="submit" disabled={loading}>
                            {loading ? "Saving..." : (editingId ? "Update Quota" : "Save Quota")}
                        </button>
                        {editingId && <button type="button" onClick={cancelEdit} className="secondary">Cancel</button>}
                    </div>
                </form>
            </div>

            <div className="card mt-4">
                <h2 className="mb-4">Quota List</h2>
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Institute</th>
                                <th>Program</th>
                                <th>Type</th>
                                <th>Limit</th>
                                <th style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {quotas.map((q) => (
                                <tr key={q.id}>
                                    <td>{q.program?.institution?.name || "N/A"}</td>
                                    <td>{q.program?.name}</td>
                                    <td style={{ fontWeight: 600 }}>{q.quotaType}</td>
                                    <td>{q.seatLimit}</td>
                                    <td style={{ textAlign: 'right' }}>
                                        <button onClick={() => handleEdit(q)} className="secondary" style={{ padding: "0.25rem 0.75rem", fontSize: "0.75rem" }}>Edit</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Quota;
