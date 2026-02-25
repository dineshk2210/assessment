import { useEffect, useState } from "react";
import API from "../services/api";

function Applicant() {
  const [applicants, setApplicants] = useState([]);
  const [institutions, setInstitutions] = useState([]);
  const [programs, setPrograms] = useState([]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    category: "GM",
    marks: "",
    quotaType: "KCET",
    institutionId: "",
    programId: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchApplicants();
    fetchInstitutions();
  }, []);

  const fetchApplicants = async () => {
    const res = await API.get("/applicants");
    setApplicants(res.data);
  };

  const fetchInstitutions = async () => {
    const res = await API.get("/institutions");
    setInstitutions(res.data);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await API.post("/applicants", {
        name: form.name,
        email: form.email,
        phone: form.phone,
        category: form.category,
        marks: parseFloat(form.marks),
        quotaType: form.quotaType,
        institution: form.institutionId ? { id: parseInt(form.institutionId) } : null,
        program: form.programId ? { id: parseInt(form.programId) } : null
      });

      setForm({
        name: "",
        email: "",
        phone: "",
        category: "GM",
        marks: "",
        quotaType: "KCET",
        institutionId: "",
        programId: ""
      });
      setPrograms([]);

      fetchApplicants();
      alert("Applicant created successfully!");
    } catch (err) {
      setError("Failed to create applicant. Please check your data.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const verifyDocuments = async (id) => {
    await API.put(`/applicants/${id}/verify`);
    fetchApplicants();
  };

  return (
    <div className="page">
      <div className="card">
        <h2>Create Applicant</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />

          <input
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />

          <input
            placeholder="Phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            required
          />

          <div className="form-group">
            <label>Reservation Category</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              <option value="GM">General Merit (GM)</option>
              <option value="SC">Scheduled Caste (SC)</option>
              <option value="ST">Scheduled Tribe (ST)</option>
              <option value="OBC">Other Backward Classes (OBC)</option>
              <option value="EWS">Economically Weaker Section (EWS)</option>
            </select>
          </div>

          <input
            type="number"
            step="0.01"
            placeholder="Marks / Percentage"
            value={form.marks}
            onChange={(e) => setForm({ ...form, marks: e.target.value })}
            required
          />

          <div className="form-group">
            <label>Institution</label>
            <select
              value={form.institutionId}
              onChange={(e) => handleInstitutionChange(e.target.value)}
              required
            >
              <option value="">Select Institution</option>
              {institutions.map(inst => (
                <option key={inst.id} value={inst.id}>{inst.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Program</label>
            <select
              value={form.programId}
              onChange={(e) => setForm({ ...form, programId: e.target.value })}
              required
              disabled={!form.institutionId}
            >
              <option value="">Select Program</option>
              {programs.map(prog => (
                <option key={prog.id} value={prog.id}>{prog.name} ({prog.code})</option>
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

          <button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save Applicant"}
          </button>
        </form>
      </div>

      <div className="card">
        <h3>Applicant List</h3>
        <table style={{ width: "100%", textAlign: "left" }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Institute</th>
              <th>Program</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {applicants.map((app) => (
              <tr key={app.id}>
                <td>{app.name}</td>
                <td>{app.program?.institution?.name || "N/A"}</td>
                <td>{app.program?.name || "N/A"}</td>
                <td>{app.documentStatus}</td>
                <td>
                  {app.documentStatus !== "Verified" && (
                    <button
                      onClick={() => verifyDocuments(app.id)}
                    >
                      Verify
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Applicant;