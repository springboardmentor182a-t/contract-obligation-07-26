import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FormInput from "../../../components/Form/FormInput";
import { signup } from "../services/signup";
import useVerifyPassword from "../hooks/useVerifyPassword";
import { useUI } from "../../../context/UIContext";

const ROLES = [
  "Administrator",
  "Legal Manager",
  "Compliance Officer",
  "Contract Manager",
  "Department Head",
  "Employee",
];

export default function SignupForm() {
  const [name, setName] = useState("");
  const [organization, setOrganization] = useState("");
  const [department, setDepartment] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { setUser } = useUI();
  const { verify } = useVerifyPassword();

  async function handleSubmit(e) {
    e.preventDefault();

    const check = verify(password);

    if (!check.valid) {
      setError(check.message);
      return;
    }

    if (!role) {
      setError("Please select a role.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const user = await signup({
        name,
        organization,
        department,
        phone,
        email,
        password,
        role,
      });

      setUser(user);

      navigate("/");
    } catch (err) {
      setError(
        err?.response?.data?.detail ||
        err?.message ||
        "Unable to create account."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <FormInput
        label="Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Arjun Mehta"
        required
      />

      <FormInput
        label="Organization"
        value={organization}
        onChange={(e) => setOrganization(e.target.value)}
        placeholder="ContractIQ"
        required
      />

      <FormInput
        label="Department"
        value={department}
        onChange={(e) => setDepartment(e.target.value)}
        placeholder="IT Operations"
        required
      />

      <FormInput
        label="Phone"
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="9876543210"
        required
      />

      <FormInput
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@contractiq.com"
        required
      />

      <FormInput
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="At least 8 characters"
        required
      />

      {/* ROLE */}
      <div className="auth-field">
        <label htmlFor="signup-role">Select Role</label>

        <select
          id="signup-role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
        >
          <option value="">Select a role</option>

          {ROLES.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      {error && <div className="auth-error">{error}</div>}

      <button
        type="submit"
        className="quick-action auth-submit"
        disabled={loading}
      >
        {loading ? "Creating account..." : "Create Account"}
      </button>
    </form>
  );
}