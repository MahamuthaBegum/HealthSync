import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { collection, doc, getDocs, setDoc, deleteDoc } from "firebase/firestore";
import { auth, firestore } from "../firebase";
import axios from "axios";

const categories = [
  "Covid Essentials", "Diabetes", "Cardiac Care", "Stomach Care", "Ayurvedic",
  "Homeopathy", "Fitness", "Baby Care", "Devices", "Surgicals",
  "Treatments", "Skin Care"
];

export default function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [categoryProducts, setCategoryProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [selected, setSelected] = useState(categories[0]);
  const [searchText, setSearchText] = useState("");
  const [isGlobalSearch, setIsGlobalSearch] = useState(false);
  const [wishlistIds, setWishlistIds] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (u) setUser(u);
      else navigate("/login");
    });
    return unsubscribe;
  }, [navigate]);

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

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!user) return;
      const snapshot = await getDocs(collection(firestore, "users", user.uid, "wishlist"));
      const ids = snapshot.docs.map((doc) => doc.id);
      setWishlistIds(ids);
    };
    fetchWishlist();
  }, [user]);

  const handleAddToCart = async (product) => {
    if (!user) return alert("Please log in to add to cart");

    const cartRef = doc(firestore, "users", user.uid, "cart", product._id);
    await setDoc(cartRef, { ...product, qty: 1 });
    alert("Added to cart!");
  };

  const toggleWishlist = async (product) => {
    if (!user) return alert("Please log in to add to wishlist");

    const wishlistRef = doc(firestore, "users", user.uid, "wishlist", product._id);
    if (wishlistIds.includes(product._id)) {
      await deleteDoc(wishlistRef);
      setWishlistIds((prev) => prev.filter((id) => id !== product._id));
    } else {
      await setDoc(wishlistRef, product);
      setWishlistIds((prev) => [...prev, product._id]);
    }
  };

  const handleSignOut = () => {
    signOut(auth).then(() => {
      window.location.href = "/";
    });
  };

  const handleSearchClick = () => {
    if (!searchText.trim()) return;
    axios.get(`https://healthsync-6w2s.onrender.com/api/products`)
      .then((res) => {
        const filtered = res.data.filter((p) =>
          p.ProductName.toLowerCase().includes(searchText.toLowerCase())
        );
        setDisplayedProducts(filtered);
        setIsGlobalSearch(true);
      }).catch(console.error);
  };

  const handleCategoryClick = (cat) => {
    setSelected(cat);
    setSearchText("");
    setIsGlobalSearch(false);
  };

  return (
    <div className="min-h-screen bg-[#232f3e] text-black">
      {/* Navbar */}
      <div className="bg-[#131921] text-white flex items-center px-4 py-2">
        <img src={require("../assets/Appicon.png")} alt="Logo" className="w-10 h-10" />
        <div className="mr-6 text-2xl font-bold">
          <span>Health</span><span className="text-green-400">Sync</span>
        </div>
        <div className="flex-1 flex items-center">
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search..."
            className="h-10 w-full px-3 text-black rounded-tl-lg rounded-bl-lg"
          />
          <button
            className="h-10 px-4 bg-yellow-400 rounded-r"
            onClick={handleSearchClick}
          >🔍</button>
        </div>
        <div className="ml-6 flex items-center gap-4">
          <button onClick={handleSignOut}>🔓 Sign Out</button>
          <button onClick={() => navigate("/wishlist")}>💖 WishList</button>
          <button onClick={() => navigate("/cart")}>🛒 Cart</button>
        </div>
      </div>

      {/* Categories */}
      <div className="flex overflow-x-auto gap-2 bg-[#232f3e] p-4 text-white">
        {categories.map((cat) => (
          <button key={cat} onClick={() => handleCategoryClick(cat)}
            className={`px-3 py-1 rounded ${selected === cat && !isGlobalSearch ? "bg-yellow-400 text-black" : ""}`}>
            {cat}
          </button>
        ))}
      </div>

      {/* Products */}
      <div className="bg-gray-100 p-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {displayedProducts.map((p) => (
          <div key={p._id} className="bg-white p-4 rounded shadow text-center relative">
            <button onClick={() => toggleWishlist(p)} className="absolute top-2 right-2 text-xl">
              {wishlistIds.includes(p._id) ? "❤️" : "🤍"}
            </button>
            <img
              src={require(`../assets/${p.ImageName}.jpg`)}
              alt={p.ProductName}
              className="h-24 w-24 mx-auto object-cover"
              onError={(e) => e.currentTarget.src = require("../assets/default.png")}
            />
            <h3 className="font-semibold mt-2">{p.ProductName}</h3>
            <p className="text-red-500">{p.Discount}</p>
            <p className="text-green-700 font-bold">{p.CurrentPrice}</p>
            <p className="line-through text-sm text-gray-500">{p.MRP}</p>
            <p className="text-sm text-gray-600">{p.MarketedBy}</p>
            <p className={`text-sm ${p.Availability === "In Stock" ? "text-green-600" : "text-red-500"}`}>
              {p.Availability}
            </p>
            <button onClick={() => handleAddToCart(p)} className="mt-2 bg-yellow-400 px-4 py-1 rounded">
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
