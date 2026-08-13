import React from "react";
import { Plus } from "lucide-react";

function InviteUserButton({ onClick }) {
  return (
    <button
      className="invite-user-btn"
      onClick={onClick}
    >
      <Plus size={18} />
      Invite User
    </button>
  );
}

export default InviteUserButton;