import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  X,
} from "lucide-react";

import { API_BASE } from "../../../config/api";
import { useUI } from "../../../context/UIContext";
import { clearStoredAuth } from "../../../utils/auth";
import { getDefaultRouteForRole } from "../../../utils/sidebarPermissions";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginForm() {
  const navigate = useNavigate();
  const { refreshUser } = useUI();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [bannerError, setBannerError] = useState("");

  const validate = () => {
    const newErrors = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!EMAIL_REGEX.test(email)) {
      newErrors.email = "Invalid email format";
    }

    if (!password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const getErrorMessage = (data) => {
    const detail = data?.detail;

    if (typeof detail === "string") {
      return detail;
    }

    if (Array.isArray(detail)) {
      return detail
        .map((item) => {
          if (typeof item === "string") {
            return item;
          }

          return item?.msg || item?.message || "Invalid input";
        })
        .join(", ");
    }

    if (detail && typeof detail === "object") {
      return detail.msg || detail.message || "Login failed.";
    }

    if (typeof data?.message === "string") {
      return data.message;
    }

    return "Login failed. Please check your email and password.";
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    setBannerError("");

    if (!validate()) {
      return;
    }

    setLoading(true);

    try {
      /*
       * FastAPI OAuth2PasswordRequestForm expects
       * application/x-www-form-urlencoded data.
       */
      const formData = new URLSearchParams();

      formData.append("username", email.trim());
      formData.append("password", password);
      formData.append("grant_type", "password");

      const response = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      });

      let data = {};

      try {
        data = await response.json();
      } catch {
        throw new Error(
          `Login failed with status ${response.status}.`
        );
      }

      if (!response.ok) {
        throw new Error(getErrorMessage(data));
      }

      if (!data.access_token) {
        throw new Error(
          "Login succeeded but no access token was returned."
        );
      }

      /*
       * Determine the role returned by the backend.
       */
      const role = data.role || "";

      const defaultRoute = getDefaultRouteForRole(role);

      if (!defaultRoute) {
        throw new Error(
          "Your account role is not configured for access."
        );
      }

      /*
       * Clear any previous authentication data.
       */
      clearStoredAuth();

      /*
       * Remember-me behavior.
       */
      const storage = remember
        ? localStorage
        : sessionStorage;

      storage.setItem("token", data.access_token);
      storage.setItem("role", role);
      storage.setItem(
        "name",
        data.name || email.trim().split("@")[0]
      );
      storage.setItem("email", email.trim());

      /*
       * Refresh the current user from the backend.
       */
      if (refreshUser) {
        const verified = await refreshUser();

        if (!verified) {
          throw new Error(
            "Unable to verify your account."
          );
        }

        if (role && verified.role !== role) {
          throw new Error(
            "User role verification failed."
          );
        }
      }

      /*
       * Login successful.
       */
      navigate(defaultRoute);

    } catch (err) {
      console.error("Login error:", err);

      setBannerError(
        err?.message ||
        "Unable to connect to the server."
      );

    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSSO = () => {
    window.location.href = `${API_BASE}/auth/google/login`;
  };

  return (
    <form
      onSubmit={handleLogin}
      className="premium-login-form flex flex-col gap-4"
    >
      {bannerError && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <AlertCircle size={16} />
            <span>{bannerError}</span>
          </div>

          <button
            type="button"
            onClick={() => setBannerError("")}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Email */}
      <div className="flex flex-col gap-1 relative">
        <label
          htmlFor="email"
          className="text-xs font-bold text-slate-500 uppercase"
        >
          Email Address
        </label>

        <div className="relative">
          <Mail
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl bg-slate-50 outline-none focus:border-blue-500 focus:bg-white transition-colors"
            placeholder="you@company.com"
            disabled={loading}
          />
        </div>

        {errors.email && (
          <span className="text-red-500 text-xs mt-1">
            {errors.email}
          </span>
        )}
      </div>

      {/* Password */}
      <div className="flex flex-col gap-1 relative">
        <label
          htmlFor="password"
          className="text-xs font-bold text-slate-500 uppercase"
        >
          Password
        </label>

        <div className="relative">
          <Lock
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-10 pr-10 py-3 border border-slate-200 rounded-xl bg-slate-50 outline-none focus:border-blue-500 focus:bg-white transition-colors"
            placeholder="••••••••"
            disabled={loading}
          />

          <button
            type="button"
            onClick={() =>
              setShowPassword(!showPassword)
            }
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
          >
            {showPassword ? (
              <EyeOff size={16} />
            ) : (
              <Eye size={16} />
            )}
          </button>
        </div>

        {errors.password && (
          <span className="text-red-500 text-xs mt-1">
            {errors.password}
          </span>
        )}
      </div>

      {/* Remember me / Forgot password */}
      <div className="flex justify-between items-center text-sm">
        <label className="flex items-center gap-2 cursor-pointer text-slate-600">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) =>
              setRemember(e.target.checked)
            }
            className="accent-blue-600"
          />

          Remember me
        </label>

        <Link
          to="/forgot-password"
          className="text-blue-600 font-semibold hover:underline"
        >
          Forgot Password?
        </Link>
      </div>

      {/* Login button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-blue-200 mt-2"
      >
        {loading
          ? "Signing In..."
          : "Sign In to ContractIQ"}
      </button>

      {/* Divider */}
      <div className="relative flex items-center justify-center my-2">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200"></div>
        </div>

        <span className="relative bg-white px-4 text-xs text-slate-400 uppercase">
          Or
        </span>
      </div>

      {/* Google */}
      <button
        type="button"
        onClick={handleGoogleSSO}
        className="w-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
      >
        <img
          src="https://www.svgrepo.com/show/475656/google-color.svg"
          alt="Google"
          className="w-5 h-5"
        />

        Continue with Google
      </button>
    </form>
  );
}