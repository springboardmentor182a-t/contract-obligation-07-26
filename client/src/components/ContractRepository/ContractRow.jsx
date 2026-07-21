import React from "react";
import { Eye, Pencil, Trash2 } from "lucide-react";

const ContractRow = ({ contract }) => {
  return (
    <tr>
      <td>{contract.id}</td>
      <td>{contract.title}</td>
      <td>{contract.vendor}</td>
      <td>{contract.type}</td>
      <td>{contract.value}</td>

      <td>
        <span className={`status-badge ${contract.status.toLowerCase().replace(/\s/g, "-")}`}>
          {contract.status}
        </span>
      </td>

      <td>
        <span className={`risk-badge ${contract.risk.toLowerCase()}`}>
          {contract.risk}
        </span>
      </td>

      <td>{contract.endDate}</td>

      <td className="action-buttons">
        <button title="View Contract">
          <Eye size={16} />
        </button>
        <button title="Edit Contract">
          <Pencil size={16} />
        </button>
        <button title="Delete Contract">
          <Trash2 size={16} />
        </button>
      </td>
    </tr>
  );
};

export default ContractRow;