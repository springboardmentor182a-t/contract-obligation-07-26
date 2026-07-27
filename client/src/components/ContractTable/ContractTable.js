import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { API_BASE_URL } from "../../data/constants";

import StatusBadge from "../../components/StatusBadge/StatusBadge";
import ProgressBar from "../../components/ProgressBar/ProgressBar";

import {
  FiEye,
  FiMoreVertical,
  FiEdit2,
  FiTrash2,
} from "react-icons/fi";

import "../../styles/table.css";

function ContractTable({ contracts }) {
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(null);

  const openContractDetails = (id) => {
    navigate(`/contracts/${id}`);
  };

  const editContract = (id) => {
    navigate(`/edit-contract/${id}`);
  };

  const deleteContract = async (id) => {
    const confirmDelete = window.confirm(
      "Delete this contract?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/contracts/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Delete failed");
      }

      alert("Contract deleted.");

      navigate("/contracts");
    } catch (err) {
      alert(err.message);
    }
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
                  <div
                    className="actions"
                    style={{ position: "relative" }}
                  >
                    <FiEye
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        openContractDetails(item.id)
                      }
                    />

                    <FiMoreVertical
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        setOpenMenu(
                          openMenu === item.id ? null : item.id
                        )
                      }
                    />

                    {openMenu === item.id && (
                      <div className="dropdown-menu">
                        <div
                          className="dropdown-item"
                          onClick={() => editContract(item.id)}
                        >
                          <FiEdit2 /> Edit
                        </div>

                        <div
                          className="dropdown-item delete"
                          onClick={() => deleteContract(item.id)}
                        >
                          <FiTrash2 /> Delete
                        </div>
                      </div>
                    )}
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