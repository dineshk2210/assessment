import { useEffect, useState } from "react";
import API from "../services/api";

function Program() {
  const [programs, setPrograms] = useState([]);
  const [institutions, setInstitutions] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    code: "",
    courseType: "UG",
    entryType: "Regular",
    academicYear: "",
    totalIntake: "",
    institutionId: ""
  });

  const [error, setError] = useState("");

  useEffect(() => {
    fetchPrograms();
    fetchInstitutions();
  }, []);

  const fetchPrograms = async () => {
    try {
      const res = await API.get("/programs");
      setPrograms(res.data);
    } catch (err) {
      console.error("Error fetching programs", err);
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

  const handleEdit = (prog) => {
    setEditingId(prog.id);
    setForm({
      name: prog.name,
      code: prog.code,
      courseType: prog.courseType,
      entryType: prog.entryType,
      academicYear: prog.academicYear,
      totalIntake: prog.totalIntake.toString(),
      institutionId: prog.institution ? prog.institution.id.toString() : ""
    });
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({
      name: "",
      code: "",
      courseType: "UG",
      entryType: "Regular",
      academicYear: "",
      totalIntake: "",
      institutionId: ""
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const payload = {
      name: form.name,
      code: form.code,
      courseType: form.courseType,
      entryType: form.entryType,
      academicYear: form.academicYear,
      totalIntake: parseInt(form.totalIntake),
      institution: {
        id: parseInt(form.institutionId)
      }
    };

    try {
      if (editingId) {
        await API.put(`/programs/${editingId}`, payload);
        alert("Program updated successfully");
      } else {
        await API.post("/programs", payload);
        alert("Program created successfully");
      }

      setForm({
        name: "",
        code: "",
        courseType: "UG",
        entryType: "Regular",
        academicYear: "",
        totalIntake: "",
        institutionId: ""
      });
      setEditingId(null);
      fetchPrograms();
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
    }
  };

  return (
    <div className="page">
      <div className="card">
        <h2>{editingId ? "Edit Program" : "Create Program"}</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            placeholder="Program Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />

          <input
            placeholder="Program Code"
            value={form.code}
            onChange={(e) => setForm({ ...form, code: e.target.value })}
            required
          />

          <select
            value={form.courseType}
            onChange={(e) =>
              setForm({ ...form, courseType: e.target.value })
            }
          >
            <option value="UG">UG</option>
            <option value="PG">PG</option>
          </select>

          <input
            placeholder="Academic Year"
            value={form.academicYear}
            onChange={(e) =>
              setForm({ ...form, academicYear: e.target.value })
            }
            required
          />

          <input
            type="number"
            placeholder="Total Intake"
            value={form.totalIntake}
            onChange={(e) =>
              setForm({ ...form, totalIntake: e.target.value })
            }
            required
          />

          <select
            value={form.institutionId}
            onChange={(e) =>
              setForm({ ...form, institutionId: e.target.value })
            }
            required
          >
            <option value="">Select Institution</option>
            {institutions.map((inst) => (
              <option key={inst.id} value={inst.id}>
                {inst.name}
              </option>
            ))}
          </select>

          <div style={{ display: "flex", gap: "10px" }}>
            <button type="submit">{editingId ? "Update Program" : "Save Program"}</button>
            {editingId && <button type="button" onClick={cancelEdit} style={{ background: "#666" }}>Cancel</button>}
          </div>
        </form>
      </div>

      <div className="card">
        <h3>Program List</h3>
        <table style={{ width: "100%", textAlign: "left" }}>
          <thead>
            <tr>
              <th>Code</th>
              <th>Name</th>
              <th>Intake</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {programs.map((prog) => (
              <tr key={prog.id}>
                <td>{prog.code}</td>
                <td>{prog.name}</td>
                <td>{prog.totalIntake}</td>
                <td>
                  <button onClick={() => handleEdit(prog)} style={{ padding: "4px 8px", fontSize: "0.8rem" }}>Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Program;