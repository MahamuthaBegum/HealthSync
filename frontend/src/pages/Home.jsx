import { useEffect, useState } from "react";
import axios from "axios";

const categories = [
  "Covid Essentials", "Diabetes", "Cardiac Care", "Stomach Care", "Ayurvedic",
  "Homeopathy", "Fitness", "Mom & Baby", "Devices", "Surgicals",
  "Treatments", "Skin Care", "Personal Care"
];

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [selected, setSelected] = useState(categories[0]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/products?limit=6")
      .then(res => setFeatured(res.data))
      .catch(console.error);
  }, []);

  return (
    <div className="min-h-screen bg-[#232f3e]">
      {/* Navbar */}
      <div className="bg-[#131921] text-white flex items-center px-4 py-2">
        <img
          src={require("../assets/Appicon.png")}
          alt="Logo"
          className="w-10 h-10 mr-4"
        />
        <div className="mr-6 text-2xl font-bold">
          <span className="text-white">Health</span>
          <span className="text-green-400">Sync</span>
        </div>
        <div className="flex-1 flex items-center">
          {/* <select className="h-10 rounded-l bg-gray-100 text-black px-2 border-none outline-none">
            <option>All</option>
            <option>Medicines</option>
            <option>Wellness</option>
          </select> */}
          <input
            type="text"
            placeholder="Search for medicine & wellness products..."
            className="h-10 w-full px-3 outline-none text-black rounded-tl-lg rounded-bl-lg"
          />
          <button className="h-10 px-4 bg-yellow-400 rounded-r flex items-center">
            <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          </button>
        </div>
        <div className="ml-6 flex items-center gap-4">
          <div>
            <a href="">🔓 Sign out</a>
          </div>
          <div>
           <a href="">💖 WishList</a>
          </div>
          <div>
           <a href="">🛒 Cart</a> 
          </div>
        </div>
      </div>

      {/* Category Bar */}
      <div className="bg-[#232f3e] text-white flex items-center px-4 py-2 gap-4 overflow-x-auto">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelected(cat)}
            className={`px-3 py-1 rounded text-sm ${selected === cat ? "bg-yellow-400 text-black" : "hover:underline"}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Featured Products */}
      <div className="bg-gray-100 p-8 min-h-[calc(100vh-128px)]">
        <h2 className="text-2xl font-bold mb-4 text-[#232f3e]">Featured Medicines</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featured.map((p) => (
            <div
              key={p._id}
              className="bg-white rounded-lg shadow p-4 flex flex-col items-center"
            >
              <img
                src={p.image}
                alt={p.name}
                className="h-24 w-24 object-cover mb-2 rounded"
              />
              <h3 className="font-medium">{p.name}</h3>
              <p className="text-gray-600 text-sm">{p.description}</p>
              <div className="mt-2 text-green-700 font-bold">
                ₹{p.price}
              </div>
              <button className="mt-2 bg-yellow-400 text-black px-3 py-1 rounded-full font-semibold">
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
