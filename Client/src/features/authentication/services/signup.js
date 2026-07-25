const BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";


export const signupService = async (userData) => {
  try {
    // Frontend roles now exactly match backend UserRole Enum
    let mappedRole = userData.role;

    // Map frontend variable names to backend SQLAlchemy model fields
    const payload = {
      role: mappedRole,
      full_name: userData.name,
      email: userData.email,
      phone: userData.phone,
      password: userData.password,
      employee_id: userData.employeeId,
      company_name: userData.companyName || "",
      department: userData.department,
      designation: userData.designation,
      location: userData.officeLocation
    };

    console.log(payload);

    const response = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
    console.log(response);

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || JSON.stringify(data));
    }

    console.log("User Registered:", data);
    return data;
  } catch (error) {
    console.error("Error:", error.message);
    throw error;
  }
};

