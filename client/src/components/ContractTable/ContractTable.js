import { useNavigate } from "react-router-dom";

import StatusBadge from "../StatusBadge/StatusBadge";
import ProgressBar from "../ProgressBar/ProgressBar";

import {
  FiMoreVertical,
  FiEye,
} from "react-icons/fi";

import "../../styles/table.css";

function ContractTable({ contracts }) {
  const navigate = useNavigate();

  const openContractDetails = (id) => {
    navigate(`/contract-details/${id}`);
  };

  return (
    <div className="table-card">
      <table>
        <thead>
          <tr>
            <th>Contract</th>
            <th>Category</th>
            <th>Owner</th>
            <th>Value</th>
            <th>Status</th>
            <th>Compliance</th>
            <th>Renewal</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {contracts.length > 0 ? (
            contracts.map((item) => (
              <tr key={item.id}>
                <td>
                  <div className="company">
                    <div className="company-logo">
                      {(item.company || "?").charAt(0)}
                    </div>

                    <div>
                      <h4
                        onClick={() => openContractDetails(item.id)}
                        style={{
                          cursor: "pointer",
                          color: "#5B3DF5",
                          fontWeight: "600",
                        }}
                      >
                        {item.contract || "N/A"}
                      </h4>

                      <p>{item.company || "N/A"}</p>
                    </div>
                  </div>
                </td>

                <td>{item.category || "-"}</td>

                <td>
                  <div className="owner">
                    <div className="owner-avatar">
                      {(item.owner || "?").charAt(0)}
                    </div>

                    {item.owner || "-"}
                  </div>
                </td>

                <td>{item.value || "-"}</td>

                <td>
                  <StatusBadge status={item.status} />
                </td>

                <td>
                  <ProgressBar value={item.compliance} />
                </td>

                <td>{item.renewal || "-"}</td>

                <td>
                  <div className="actions">
                    <FiEye
                      style={{ cursor: "pointer" }}
                      onClick={() => openContractDetails(item.id)}
                    />

                    <FiMoreVertical />
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="8"
                style={{
                  textAlign: "center",
                  padding: "30px",
                  color: "#888",
                }}
              >
                No contracts found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ContractTable;