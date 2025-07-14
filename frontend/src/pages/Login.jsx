import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); 
  const navigate = useNavigate();

  const getFriendlyError = "Incorrect email or password.";

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); 
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/Home");
    } catch (error) {
      setError(getFriendlyError); 
    }
  };

return (
  <div
    className="min-h-screen flex items-center justify-center bg-cover bg-center px-4 sm:px-6"
    style={{
      backgroundImage: `url(${require("../assets/LoginImage.png")})`,
    }}
  >
    <div className="absolute inset-0 bg-black bg-opacity-40"></div>

    <div className="relative z-10 w-full max-w-md">
      <div className="flex items-center justify-center space-x-2 mb-6">
        <img
          src={require("../assets/Appicon.png")}
          alt="HealthSync Logo"
          className="w-10 h-10 sm:w-12 sm:h-12"
        />
        <p className="text-3xl sm:text-4xl font-bold">
          <span className="text-white">Health</span>
          <span className="text-green-400">Sync</span>
        </p>
      </div>

      {/* Login Form */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-6 text-center">Sign in</h2>
        <form onSubmit={handleLogin}>
          <label className="block mb-1 font-semibold text-base">Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 mb-4 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
            required
          />

          <label className="block mb-1 font-semibold text-base">Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 mb-2 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
            required
          />

          {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

          <button
            type="submit"
            className="w-full bg-green-400 hover:bg-green-500 text-black font-semibold py-2 rounded text-lg transition"
          >
            Continue
          </button>
        </form>

        <div className="mt-4 text-sm text-gray-700 text-center">
          By continuing, you agree to our <span className="underline">Conditions of Use</span> and <span className="underline">Privacy Notice</span>.
        </div>
      </div>

      {/* Divider and Register */}
      <div className="flex items-center mt-6 mb-2">
        <div className="flex-1 border-t border-gray-300"></div>
        <span className="mx-2 text-gray-200 text-sm">New to HealthSync?</span>
        <div className="flex-1 border-t border-gray-300"></div>
      </div>

      <a href="/register" className="block">
        <button className="w-full bg-white border border-gray-400 rounded-3xl py-2 text-base font-semibold hover:bg-gray-50 transition">
          Create your HealthSync account
        </button>
      </a>
    </div>
  </div>
)}
