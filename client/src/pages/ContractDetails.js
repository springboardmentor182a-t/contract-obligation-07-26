import React from "react";
import { useNavigate } from "react-router-dom";

function ContractDetails() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>Contract Details</h1>

      <table cellPadding="10">
        <tbody>
          <tr>
            <td><b>Contract ID</b></td>
            <td>CNT001</td>
          </tr>

          <tr>
            <td><b>Title</b></td>
            <td>Software Development Agreement</td>
          </tr>

          <tr>
            <td><b>Client</b></td>
            <td>ABC Pvt Ltd</td>
          </tr>

          <tr>
            <td><b>Status</b></td>
            <td>Active</td>
          </tr>

          <tr>
            <td><b>Start Date</b></td>
            <td>01-07-2026</td>
          </tr>

          <tr>
            <td><b>End Date</b></td>
            <td>30-06-2027</td>
          </tr>

          <tr>
            <td><b>Description</b></td>
            <td>Software development contract for client.</td>
          </tr>
        </tbody>
      </table>

      <br />

      <button onClick={() => navigate("/")}>Back</button>
    </div>
  );
}

export default ContractDetails;