import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Correct import
import axios from "axios";

const categories = [
  "Covid Essentials", "Diabetes", "Cardiac Care", "Stomach Care", "Ayurvedic",
  "Homeopathy", "Fitness", "Baby Care", "Devices", "Surgicals",
  "Treatments", "Skin Care"
];

export default function Home() {
  const navigate = useNavigate(); // ✅ Correct placement inside the Home function

  const [categoryProducts, setCategoryProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [selected, setSelected] = useState(categories[0]);
  const [searchText, setSearchText] = useState("");
  const [isGlobalSearch, setIsGlobalSearch] = useState(false);

  // ...rest of your code


  useEffect(() => {
    axios
      .get(`https://healthsync-6w2s.onrender.com/api/products?category=${encodeURIComponent(selected)}`)
      .then((res) => {
        setCategoryProducts(res.data);
        setDisplayedProducts(res.data);
        setIsGlobalSearch(false);
      })
      .catch(console.error);
  }, [selected]);

  useEffect(() => {
    if (!isGlobalSearch) {
      const filtered = categoryProducts.filter((p) =>
        p.ProductName.toLowerCase().includes(searchText.toLowerCase())
      );
      setDisplayedProducts(filtered);
    }
  }, [searchText, categoryProducts, isGlobalSearch]);

  const handleSearchClick = () => {
    if (!searchText.trim()) return;
    axios
      .get(`http://localhost:5000/api/products`)
      .then((res) => {
        const globalResults = res.data.filter((p) =>
          p.ProductName.toLowerCase().includes(searchText.toLowerCase())
        );
        setDisplayedProducts(globalResults);
        setIsGlobalSearch(true);
      })
      .catch(console.error);
  };

  const handleCategoryClick = (cat) => {
    setSelected(cat);
    setSearchText("");
    setIsGlobalSearch(false);
  };

  const handleAddToCart = (p) => {
    const existing = JSON.parse(localStorage.getItem("cart")) || [];
    const found = existing.find(item => item._id === p._id);

    let updatedCart;
    if (found) {
      updatedCart = existing.map(item =>
        item._id === p._id ? { ...item, qty: item.qty + 1 } : item
      );
    } else {
      updatedCart = [...existing, { ...p, qty: 1 }];
    }

    localStorage.setItem("cart", JSON.stringify(updatedCart));
    alert("Product added to cart!");
  };


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
          <input
            type="text"
            placeholder="Search for medicine & wellness products..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="h-10 w-full px-3 outline-none text-black rounded-tl-lg rounded-bl-lg"
          />
          <button
            className="h-10 px-4 bg-yellow-400 rounded-r flex items-center"
            onClick={handleSearchClick}
          >
            <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          </button>
        </div>
        <div className="ml-6 flex items-center gap-4">
          <a href="">🔓 Sign out</a>
          <a href="">💖 WishList</a>
        <div className="cursor-pointer" onClick={() => navigate("/cart")}>
  🛒 Cart
</div>

        </div>
      </div>

      {/* Category Bar */}
      <div className="bg-[#232f3e] text-white flex items-center px-4 py-2 gap-4 overflow-x-auto">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryClick(cat)}
            className={`px-3 py-1 rounded text-sm ${selected === cat && !isGlobalSearch
                ? "bg-yellow-400 text-black"
                : "hover:underline"
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product Section */}
      <div className="bg-gray-100 p-8 min-h-[calc(100vh-128px)]">
        {!isGlobalSearch && (
          <h2 className="text-2xl font-bold mb-4 text-[#232f3e]">
            Featured Products - {selected}
          </h2>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {displayedProducts.map((p) => (
            <div
              key={p._id}
              className="bg-white rounded-lg shadow p-4 flex flex-col items-center"
            >
              <img
                src={require(`../assets/${p.ImageName}.jpg`)}
                alt={p.ProductName}
                className="h-24 w-24 object-cover mb-2 rounded"
                onError={(e) => {
                  e.currentTarget.src = require("../assets/default.png");
                }}
              />
              <h3 className="font-semibold text-center text-md">{p.ProductName}</h3>
              <p className="text-red-500 font-bold text-sm">{p.Discount}</p>
              <p className="text-green-700 font-bold">{p.CurrentPrice}</p>
              <p className="line-through text-sm text-gray-500">{p.MRP}</p>
              <p className="text-sm text-gray-600 text-center">{p.MarketedBy}</p>
              <p className={`text-sm font-medium ${p.Availability === 'In Stock' ? 'text-green-600' : 'text-red-500'}`}>
                {p.Availability}
              </p>
              <button onClick={() => handleAddToCart(p)} className="bg-yellow-400 px-4 py-2 rounded">
                Add to Cart
              </button>
            </div>
          ))}
        </div>

        {displayedProducts.length === 0 && (
          <p className="text-center text-gray-500 mt-8">
            No matching products found {isGlobalSearch ? "globally." : `in "${selected}" category.`}
          </p>
        )}
      </div>
    </div>
  );
}