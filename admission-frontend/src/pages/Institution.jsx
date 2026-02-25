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
    <div className="page">
      <div className="page-content">
        <div className="card">
          <h2>Create Institution</h2>

          <form onSubmit={handleSubmit}>
            <input
              placeholder="Institution Code"
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value })}
              required
            />

            <input
              placeholder="Institution Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />

            <input
              type="number"
              placeholder="Institution Intake Cap"
              value={form.maxIntake}
              onChange={(e) => setForm({ ...form, maxIntake: e.target.value })}
              required
            />

            <button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Institution"}
            </button>
          </form>
        </div>

        <div className="card">
          <h3>Institution List</h3>
          <table style={{ width: "100%", textAlign: "left" }}>
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
                  <td>{inst.code}</td>
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