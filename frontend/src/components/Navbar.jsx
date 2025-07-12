import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full bg-gradient-to-r from-blue-600 to-indigo-600 shadow z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        <Link
          to="/"
          className="flex items-center font-extrabold text-white tracking-tight hover:text-yellow-300 transition-colors"
        >
          <img
            src={require("../assets/Appicon.png")}
            alt="App Icon"
            className="w-8 h-8 mr-2"
          />
          HealthSync
        </Link>
        <div className="space-x-6">
          <Link
            to="/products"
            className="text-white hover:text-yellow-300 font-medium transition-colors"
          >
            Products
          </Link>
          <Link
            to="/cart"
            className="text-white hover:text-yellow-300 font-medium transition-colors"
          >
            Cart
          </Link>
          <Link
            to="/login"
            className="text-white hover:text-yellow-300 font-medium transition-colors"
          >
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
}
