import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, } from "../firebase";
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
  <div
    className="min-h-screen bg-cover bg-center px-4 flex items-center justify-center relative"
    style={{
      backgroundImage: `url(${require("../assets/LoginImage.png")})`,
    }}
  >
    <div className="absolute inset-0 bg-black bg-opacity-40"></div>

    <div className="relative z-10 w-full max-w-md space-y-6">
      <div className="flex items-center justify-center space-x-2">
        <img
          src={require("../assets/Appicon.png")}
          alt="HealthSync Logo"
          className="w-12 h-12"
        />
        <p className="text-3xl sm:text-4xl font-bold text-white">
          <span className="text-white">Health</span>
          <span className="text-green-400">Sync</span>
        </p>
      </div>

      {/* Form card */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 w-full p-6 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-4">Create account</h2>
        <form onSubmit={handleRegister} className="flex flex-col gap-3">
          <div>
            <label className="font-semibold text-sm">Your name</label>
            <input
              type="text"
              placeholder="First and last name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoComplete="name"
              className="w-full px-3 py-2 mt-1 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          <div>
            <label className="font-semibold text-sm">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full px-3 py-2 mt-1 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          <div>
            <label className="font-semibold text-sm">Password</label>
            <input
              type="password"
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
              className="w-full px-3 py-2 mt-1 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <p className="text-xs text-gray-600 mt-1">
              Passwords must be at least 6 characters.
            </p>
          </div>

          <div>
            <label className="font-semibold text-sm">Password again</label>
            <input
              type="password"
              placeholder="Re-enter password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              autoComplete="new-password"
              className="w-full px-3 py-2 mt-1 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm">{error}</div>
          )}

          <button
            type="submit"
            className="w-full bg-green-400 hover:bg-green-500 text-black font-semibold py-2 rounded text-lg transition"
          >
            Create your HealthSync account
          </button>
        </form>

        <div className="mt-3 text-xs text-gray-700">
          By creating an account or logging in, you agree to HealthSync's{" "}
          <span className="underline">Conditions of Use</span> and{" "}
          <span className="underline">Privacy Policy</span>.
        </div>
      </div>

      {/* Footer Link */}
      <div className="w-full text-center text-white text-sm">
        Already have an account?
        <a href="/" className="ml-1 text-blue-300 hover:underline">
          Sign in
        </a>
      </div>
    </div>
  </div>
);
}
