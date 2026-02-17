import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";

export default function Auth() {
  const navigate = useNavigate();
  const { login, register } = useAuthStore();

  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/");
  }, [navigate]);

  const validate = () => {
    setError("");
    if (!form.email.trim()) {
      setError("Email is required");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setError("Please enter a valid email");
      return false;
    }
    if (!form.password) {
      setError("Password is required");
      return false;
    }
    if (!isLogin) {
      if (!form.name.trim()) {
        setError("Name is required");
        return false;
      }
      if (form.password.length < 6) {
        setError("Password must be at least 6 characters");
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setError("");
    try {
      if (isLogin) {
        await login(form.email, form.password);
      } else {
        await register(form.name, form.email, form.password);
      }
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = () => {
    setIsLogin(!isLogin);
    setError("");
    setForm({ name: "", email: form.email, password: "" });
  };

  return (
    <div className="min-h-screen animated-bg flex items-center justify-center text-white p-4">
      <div className="backdrop-blur-md bg-white/5 border border-white/10 p-10 rounded-2xl shadow-2xl w-full max-w-md transition-all duration-300 glow-hover">
        <h1 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          {isLogin ? "Sign In" : "Create Account"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <p className="text-sm text-red-400 bg-red-500/10 p-2 rounded-lg">
              {error}
            </p>
          )}

          {!isLogin && (
            <input
              type="text"
              placeholder="Full Name"
              value={form.name}
              className="w-full p-3 rounded-lg bg-white/10 border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          )}

          <input
            type="email"
            placeholder="Email"
            value={form.email}
            className="w-full p-3 rounded-lg bg-white/10 border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <input
            type="password"
            placeholder="Password"
            value={form.password}
            className="w-full p-3 rounded-lg bg-white/10 border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-lg font-semibold hover:scale-[1.02] transition disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {loading ? "Please wait..." : isLogin ? "Sign In" : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-sm mt-6 text-gray-400">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button
            type="button"
            onClick={handleToggle}
            className="ml-2 text-blue-400 hover:text-blue-300 hover:underline transition"
          >
            {isLogin ? "Sign Up" : "Sign In"}
          </button>
        </p>
      </div>
    </div>
  );
}
