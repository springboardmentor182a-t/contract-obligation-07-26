import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FormInput from "../../../components/Form/FormInput";
import { signup } from "../services/signup";
import useVerifyPassword from "../hooks/useVerifyPassword";
import { useUI } from "../../../context/UIContext";

export default function SignupForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
    setLoading(true);
    setError(null);
    try {
      const user = await signup(name, email, password);
      setUser(user);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <FormInput label="Full Name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Arjun Mehta" />
      <FormInput label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@contractiq.com" />
      <FormInput label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters" />
      {error && <div className="auth-error">{error}</div>}
      <button type="submit" className="quick-action auth-submit" disabled={loading}>
        {loading ? "Creating account..." : "Create Account"}
      </button>
    </form>
  );
}
