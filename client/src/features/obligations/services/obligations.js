import { apiFetch } from "../../../utils/apiFetch";

export const listObligations = (token, params = {}) => {
  const query = new URLSearchParams(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== "")
  ).toString();
  return apiFetch(`/api/obligations${query ? `?${query}` : ""}`, { token });
};

export const createObligation = (token, payload) =>
  apiFetch("/api/obligations", { method: "POST", token, body: payload });

export const updateCompletionStatus = (token, obligationId, completionStatus) =>
  apiFetch(`/api/obligations/${obligationId}/completion-status`, {
    method: "PATCH",
    token,
    body: { completion_status: completionStatus },
  });
