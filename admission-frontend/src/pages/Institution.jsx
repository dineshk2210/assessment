import { useEffect, useState } from "react";
import API from "../services/api";

function Institution() {
  const [institutions, setInstitutions] = useState([]);
  const [form, setForm] = useState({
    code: "",
    name: "",
    maxIntake: ""
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchInstitutions();
  }, []);

  const fetchInstitutions = async () => {
    const res = await API.get("/institutions");
    setInstitutions(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await API.post("/institutions", {
        ...form,
        maxIntake: parseInt(form.maxIntake)
      });
      setForm({ code: "", name: "", maxIntake: "" });
      fetchInstitutions();
    } catch (err) {
      alert("Failed to save institution.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Institutions</h1>
        <p className="subtitle">Manage education institutions and their intake capacities.</p>
      </div>

      <div className="card">
        <h2 className="mb-4">Create Institution</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Institution Code</label>
            <input
              placeholder="e.g. MIT, HARVARD"
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Institution Name</label>
            <input
              placeholder="Full name of the institution"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Intake Capacity</label>
            <input
              type="number"
              placeholder="Maximum number of students"
              value={form.maxIntake}
              onChange={(e) => setForm({ ...form, maxIntake: e.target.value })}
              required
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save Institution"}
          </button>
        </form>
      </div>

      <div className="card mt-4">
        <h2 className="mb-4">Institution List</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Code</th>
                <th>Name</th>
                <th>Intake Cap</th>
              </tr>
            </thead>
            <tbody>
              {institutions.map((inst) => (
                <tr key={inst.id}>
                  <td style={{ fontWeight: 600 }}>{inst.code}</td>
                  <td>{inst.name}</td>
                  <td>{inst.maxIntake}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Institution;