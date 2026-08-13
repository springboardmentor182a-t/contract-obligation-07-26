import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FormInput from "../../../components/Form/FormInput";
import { login } from "../services/login";
import { useUI } from "../../../context/UIContext";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { setUser } = useUI();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const user = await login(email, password);
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
      <FormInput label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@contractiq.com" />
      <FormInput label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" />
      {error && <div className="auth-error">{error}</div>}
      <button type="submit" className="quick-action auth-submit" disabled={loading}>
        {loading ? "Signing in..." : "Sign In"}
      </button>
    </form>
  );
}
