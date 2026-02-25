import { useEffect, useState } from "react";
import API from "../services/api";

function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    API.get("/dashboard").then(res => setData(res.data));
  }, []);

  if (!data) return <div className="page">Loading...</div>;

  return (
    <div className="page">
      <div className="stats-grid">
        <div className="stat-box">
          <h3>{data.totalIntake}</h3>
          <p>Total Intake</p>
        </div>
        <div className="stat-box">
          <h3>{data.totalAdmitted}</h3>
          <p>Total Admitted/Allocated</p>
        </div>
        <div className="stat-box">
          <h3>{data.verifiedApplicants}</h3>
          <p>Verified Applicants</p>
        </div>
        <div className="stat-box">
          <h3>{data.pendingDocuments}</h3>
          <p>Pending Verification</p>
        </div>
        <div className="stat-box">
          <h3>{data.feePending}</h3>
          <p>Fee Pending</p>
        </div>
      </div>

      <div className="card">
        <h3>Quota Statistics</h3>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ textAlign: "left", borderBottom: "1px solid #ddd" }}>
              <th>Institute</th>
              <th>Program</th>
              <th>Quota</th>
              <th>Filled</th>
              <th>Limit</th>
              <th>Remaining</th>
            </tr>
          </thead>
          <tbody>
            {data.quotaStats.map((q, index) => (
              <tr key={index} style={{ borderBottom: "1px solid #eee" }}>
                <td>{q.institution}</td>
                <td>{q.program}</td>
                <td>{q.quotaType}</td>
                <td>{q.filled}</td>
                <td>{q.limit}</td>
                <td style={{ fontWeight: "bold", color: q.remaining <= 0 ? "red" : "green" }}>
                  {q.remaining}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dashboard;