import { useEffect, useState } from "react";
import API from "../services/api";

function Allocation() {
  const [applicants, setApplicants] = useState([]);
  const [institutions, setInstitutions] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [admissions, setAdmissions] = useState([]);

  const [form, setForm] = useState({
    applicantId: "",
    institutionId: "",
    programId: "",
    quotaType: "KCET",
    allotmentNumber: "",
    flow: "Government" // "Government" or "Management"
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchApplicants();
    fetchInstitutions();
    fetchAdmissions();
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
      const res = await API.get(`/programs/institution/${instId}`);
      setPrograms(res.data);
    } else {
      setPrograms([]);
    }
  };

  const fetchAdmissions = async () => {
    const res = await API.get("/admissions");
    setAdmissions(res.data);
  };

  const handleFlowChange = (selectedFlow) => {
    setForm({
      ...form,
      flow: selectedFlow,
      quotaType: selectedFlow === "Government" ? "KCET" : "Management",
      allotmentNumber: ""
    });
  };

  const handleApplicantChange = async (id) => {
    const applicant = applicants.find(a => a.id === parseInt(id));
    const instId = applicant?.institution?.id || "";

    // Fetch programs for that institution if it changed
    if (instId) {
      const res = await API.get(`/programs/institution/${instId}`);
      setPrograms(res.data);
    } else {
      setPrograms([]);
    }

    setForm({
      ...form,
      applicantId: id,
      institutionId: instId,
      programId: applicant?.program?.id || "",
      quotaType: form.flow === "Government" ? (applicant?.quotaType || "KCET") : "Management"
    });
  };

  const allocateSeat = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const queryParams = new URLSearchParams({
        applicantId: form.applicantId,
        programId: form.programId,
        quotaType: form.quotaType
      });

      if (form.flow === "Government" && form.allotmentNumber) {
        queryParams.append("allotmentNumber", form.allotmentNumber);
      }

      await API.post(`/admissions/allocate?${queryParams.toString()}`);
      fetchAdmissions();
      alert("Seat allocated successfully!");
      setForm({ ...form, applicantId: "", allotmentNumber: "" });
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
    try {
      await API.post(`/admissions/confirm/${id}`);
      fetchAdmissions();
      alert("Admission confirmed successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to confirm admission.");
    }
  };

  return (
    <div className="page">
      <div className="card">
        <h2>Seat Allocation</h2>

        <div className="flow-selector" style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
          <button
            className={form.flow === "Government" ? "btn-active" : ""}
            onClick={() => handleFlowChange("Government")}
            type="button"
          >
            Government Flow
          </button>
          <button
            className={form.flow === "Management" ? "btn-active" : ""}
            onClick={() => handleFlowChange("Management")}
            type="button"
          >
            Management Flow
          </button>
        </div>

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
                  {a.name} (Docs: {a.documentStatus})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Institute</label>
            <select
              value={form.institutionId}
              onChange={(e) => handleInstitutionChange(e.target.value)}
              required
            >
              <option value="">Select Institute</option>
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
            >
              <option value="">Select Program</option>
              {programs.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.code})
                </option>
              ))}
            </select>
          </div>

          {form.flow === "Government" ? (
            <>
              <div className="form-group">
                <label>Allotment Number</label>
                <input
                  type="text"
                  placeholder="Enter KCET/COMEDK Allotment No."
                  value={form.allotmentNumber}
                  onChange={(e) => setForm({ ...form, allotmentNumber: e.target.value })}
                  required={form.flow === "Government"}
                />
              </div>

              <div className="form-group">
                <label>Quota Type</label>
                <select
                  value={form.quotaType}
                  onChange={(e) => setForm({ ...form, quotaType: e.target.value })}
                >
                  <option value="KCET">KCET</option>
                  <option value="COMEDK">COMEDK</option>
                </select>
              </div>
            </>
          ) : (
            <div className="form-group">
              <label>Quota Type</label>
              <select
                value={form.quotaType}
                disabled
              >
                <option value="Management">Management</option>
              </select>
            </div>
          )}

          <button type="submit" disabled={loading}>
            {loading ? "Allocating..." : form.flow === "Government" ? "Lock Seat" : "Allocate Seat"}
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