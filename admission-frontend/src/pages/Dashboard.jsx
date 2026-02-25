import { useEffect, useState } from "react";
import API from "../services/api";

function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    API.get("/dashboard").then(res => setData(res.data));
  }, []);

  if (!data) return <div className="page">Loading...</div>;

  return (
    <div>
      <div className="page-header">
        <h1>Dashboard</h1>
        <p className="subtitle">Overview of current admission status and system metrics.</p>
      </div>

      <div className="stats-grid mb-4">
        <div className="stat-box">
          <h3>{data.totalIntake}</h3>
          <p>Total Intake</p>
        </div>
        <div className="stat-box">
          <h3>{data.totalAdmitted}</h3>
          <p>Total Admitted</p>
        </div>
        <div className="stat-box">
          <h3>{data.verifiedApplicants}</h3>
          <p>Verified</p>
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

      <div className="card mt-4">
        <div className="flex justify-between items-center mb-4">
          <h2 style={{ margin: 0 }}>Quota Statistics</h2>
          <span className="subtitle" style={{ fontSize: '0.875rem' }}>Real-time seat allocation tracking</span>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
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
                <tr key={index}>
                  <td>{q.institution}</td>
                  <td>{q.program}</td>
                  <td>{q.quotaType}</td>
                  <td>{q.filled}</td>
                  <td>{q.limit}</td>
                  <td style={{ fontWeight: "700", color: q.remaining <= 0 ? "var(--danger)" : "var(--success)" }}>
                    {q.remaining}
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

export default Dashboard;