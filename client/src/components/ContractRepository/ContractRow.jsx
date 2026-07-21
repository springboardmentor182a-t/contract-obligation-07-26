import React from "react";
import { Eye, Pencil, Trash2 } from "lucide-react";

const ContractRow = ({ contract, onView }) => {
  return (
    <tr>
      <td>{contract.contract_number}</td>

      <td>{contract.contract_name}</td>

      <td>{contract.vendor}</td>

      <td>{contract.contract_type}</td>

      <td>₹{contract.contract_value}</td>

      <td>
        <span
          className={`status-badge ${contract.status
            ?.toLowerCase()
            .replace(/\s+/g, "-")}`}
        >
          {contract.status}
        </span>
      </td>

      <td>{contract.end_date}</td>

      <td className="action-buttons">
        <button
          className="action-btn"
          onClick={() => onView(contract)}
        >
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