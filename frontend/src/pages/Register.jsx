import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import auth from "../firebase";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Registered successfully!");
      navigate("/");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
   <div className="h-screen overflow-hidden bg-gray-100 flex items-center justify-center flex-col px-4">

      <img
        src={require("../assets/Appicon.png")}
        alt="Amazon Logo"
        className="w-28 mb-2"
        style={{ minWidth: 80, maxWidth: 100 }}
      />
      <div
        className="bg-white rounded-xl shadow-md border border-gray-200 w-full max-w-md p-6 flex flex-col justify-center"
        style={{ minHeight: 0 }}
      >
        <h2 className="text-2xl font-semibold mb-4">Create account</h2>
        <form onSubmit={handleRegister} className="flex flex-col gap-2">
          <label className="block mb-0 font-semibold text-base">Your name</label>
          <input
            type="text"
            placeholder="First and last name"
            className="w-full px-3 py-2 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoComplete="name"
          />
          <label className="block mb-0 font-semibold text-base">Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full px-3 py-2 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
          <label className="block mb-0 font-semibold text-base">Password</label>
          <input
            type="password"
            placeholder="At least 6 characters"
            className="w-full px-3 py-2 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
          />
          <div className="flex items-center text-xs text-gray-700 mb-1">
            <svg
              className="w-4 h-4 text-blue-500 mr-1"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4M12 8h.01" />
            </svg>
            Passwords must be at least 6 characters.
          </div>
          <label className="block mb-0 font-semibold text-base">
            Password again
          </label>
          <input
            type="password"
            placeholder="Re-enter password"
            className="w-full px-3 py-2 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            autoComplete="new-password"
          />
          {error && (
            <div className="text-red-600 text-sm mb-1">{error}</div>
          )}
          <button
            type="submit"
            className="w-full bg-green-400 hover:bg-green-500 text-black font-semibold py-2 rounded text-lg transition mt-2"
            style={{ minHeight: 40 }}
          >
            Create your HealthSync account
          </button>
        </form>
        <div className="mt-3 text-xs text-gray-700">
          By creating an account or logging in, you agree to HealthSync's Conditions of Use and Privacy Policy.
        </div>
      </div>
      <div className="w-full max-w-md mt-6">
        <hr />
        <div className="flex justify-center mt-3 text-sm text-gray-700">
          Already have an account?
          <a href="/login" className="ml-1 text-blue-600 hover:underline">
            Sign in
          </a>
        </div>
      </div>
    </div>
  );
}
