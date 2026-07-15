const BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

export const getReportsAnalytics = async (reportType = 'contract', days = 30) => {
  try {
    const token = localStorage.getItem("access_token");
    // Ensure the endpoint matches the backend routes exactly
    const endpoint = `${reportType}-reports`;

    const response = await fetch(`${BASE_URL}/reports/${endpoint}/${days}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || data.message || `Failed to fetch ${reportType} reports`);
    }

    return data;
  } catch (error) {
    console.error(`${reportType} Reports Fetch Error:`, error.message);
    throw error;
  }
};

export const getChartData = async (reportType = 'contract') => {
  try {
    const token = localStorage.getItem("access_token");
    let endpoint = "";
    switch (reportType) {
      case "contract": endpoint = "contract-quarter-graph"; break;
      case "compliance": endpoint = "compliance-status-graph"; break;
      case "obligation": endpoint = "obligation-status-graph"; break;
      case "renewal": endpoint = "renewal-monthly-graph"; break;
      case "audit": endpoint = "audit-action-graph"; break;
      default: endpoint = "contract-quarter-graph";
    }

    const response = await fetch(`${BASE_URL}/reports/${endpoint}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (!response.ok) {
      console.warn(`Failed to fetch ${endpoint} graph:`, data.detail || data.message);
      return [];
    }

    return data;
  } catch (error) {
    console.error(`Chart Fetch Error (${reportType}):`, error.message);
    return [];
  }
};

export const getSavedReports = async () => {
  try {
    const token = localStorage.getItem("access_token");
    const response = await fetch(`${BASE_URL}/reports/saved-reports`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || data.message || "Failed to fetch saved reports");
    }

    return data;
  } catch (error) {
    console.error("Saved Reports Fetch Error:", error.message);
    throw error;
  }
};

export const generateReport = async (payload) => {
  try {
    const token = localStorage.getItem("access_token");
    const response = await fetch(`${BASE_URL}/reports/generate-report`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || data.message || "Failed to generate report");
    }

    return data;
  } catch (error) {
    console.error("Generate Report Error:", error.message);
    throw error;
  }
};
