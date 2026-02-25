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
    <div>
      <div className="page-header">
        <h1>Programs</h1>
        <p className="subtitle">Configure and manage academic programs across institutions.</p>
      </div>

      <div className="card">
        <h2 className="mb-4">{editingId ? "Edit Program" : "Create Program"}</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="form-group">
              <label>Program Name</label>
              <input
                placeholder="e.g. Computer Science and Engineering"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Program Code</label>
              <input
                placeholder="e.g. CS101"
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Course Type</label>
              <select
                value={form.courseType}
                onChange={(e) =>
                  setForm({ ...form, courseType: e.target.value })
                }
              >
                <option value="UG">Undergraduate (UG)</option>
                <option value="PG">Postgraduate (PG)</option>
              </select>
            </div>

            <div className="form-group">
              <label>Academic Year</label>
              <input
                placeholder="e.g. 2024-25"
                value={form.academicYear}
                onChange={(e) =>
                  setForm({ ...form, academicYear: e.target.value })
                }
                required
              />
            </div>

            <div className="form-group">
              <label>Total Intake</label>
              <input
                type="number"
                placeholder="Total seats available"
                value={form.totalIntake}
                onChange={(e) =>
                  setForm({ ...form, totalIntake: e.target.value })
                }
                required
              />
            </div>

            <div className="form-group">
              <label>Institution</label>
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
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <button type="submit">{editingId ? "Update Program" : "Save Program"}</button>
            {editingId && <button type="button" onClick={cancelEdit} className="secondary">Cancel</button>}
          </div>
        </form>
      </div>

      <div className="card mt-4">
        <h2 className="mb-4">Program List</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Code</th>
                <th>Name</th>
                <th>Type</th>
                <th>Year</th>
                <th>Intake</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {programs.map((prog) => (
                <tr key={prog.id}>
                  <td style={{ fontWeight: 600 }}>{prog.code}</td>
                  <td>{prog.name}</td>
                  <td>{prog.courseType}</td>
                  <td>{prog.academicYear}</td>
                  <td>{prog.totalIntake}</td>
                  <td style={{ textAlign: 'right' }}>
                    <button onClick={() => handleEdit(prog)} className="secondary" style={{ padding: "0.25rem 0.75rem", fontSize: "0.75rem" }}>Edit</button>
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

export default Program;