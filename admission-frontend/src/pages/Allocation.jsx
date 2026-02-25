import { useEffect, useState } from "react";
import API from "../services/api";

function Allocation() {
  const [applicants, setApplicants] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [admissions, setAdmissions] = useState([]);

  const [form, setForm] = useState({
    applicantId: "",
    programId: "",
    quotaType: "KCET"
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchApplicants();
    fetchPrograms();
    fetchAdmissions();
  }, []);

  const fetchApplicants = async () => {
    const res = await API.get("/applicants");
    setApplicants(res.data);
  };

  const fetchPrograms = async () => {
    const res = await API.get("/programs");
    setPrograms(res.data);
  };

  const fetchAdmissions = async () => {
    const res = await API.get("/admissions");
    setAdmissions(res.data);
  };

  const handleApplicantChange = (id) => {
    const applicant = applicants.find(a => a.id === parseInt(id));
    setForm({
      ...form,
      applicantId: id,
      programId: applicant?.program?.id || "",
      quotaType: applicant?.quotaType || "KCET"
    });
  };

  const allocateSeat = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await API.post(
        `/admissions/allocate?applicantId=${form.applicantId}&programId=${form.programId}&quotaType=${form.quotaType}`
      );
      fetchAdmissions();
      alert("Seat allocated successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to allocate seat.");
    } finally {
      setLoading(false);
    }
  };

  const markFeePaid = async (id) => {
    await API.put(`/admissions/${id}/fee?status=Paid`);
    fetchAdmissions();
  };

  const confirmAdmission = async (id) => {
    await API.post(`/admissions/confirm/${id}`);
    fetchAdmissions();
  };

  return (
    <div className="page">
      <div className="card">
        <h2>Seat Allocation</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <form onSubmit={allocateSeat}>
          <div className="form-group">
            <label>Applicant</label>
            <select
              value={form.applicantId}
              onChange={(e) => handleApplicantChange(e.target.value)}
              required
            >
              <option value="">Select Applicant</option>
              {applicants.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name} ({a.documentStatus})
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
            >
              <option value="">Select Program</option>
              {programs.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.code})
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

          <button type="submit" disabled={loading}>
            {loading ? "Allocating..." : "Allocate Seat"}
          </button>
        </form>
      </div>

      <div className="card">
        <h3>Admissions List</h3>
        <table style={{ width: "100%", textAlign: "left" }}>
          <thead>
            <tr>
              <th>Applicant</th>
              <th>Program</th>
              <th>Status</th>
              <th>Fees</th>
              <th>Admission No.</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {admissions.map((adm) => (
              <tr key={adm.id}>
                <td>{adm.applicant?.name}</td>
                <td>{adm.program?.code}</td>
                <td>{adm.status}</td>
                <td>{adm.feeStatus}</td>
                <td style={{ fontSize: "0.8em" }}>{adm.admissionNumber || "N/A"}</td>
                <td>
                  {adm.feeStatus !== "Paid" && (
                    <button onClick={() => markFeePaid(adm.id)}>Paid</button>
                  )}
                  {adm.status !== "Confirmed" && adm.feeStatus === "Paid" && (
                    <button onClick={() => confirmAdmission(adm.id)}>Confirm</button>
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

export default Allocation;