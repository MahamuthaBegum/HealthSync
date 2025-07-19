import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { collection, doc, getDocs, setDoc, deleteDoc } from "firebase/firestore";
import { auth, firestore } from "../firebase";
import axios from "axios";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";

const categories = [
  "Covid Essentials", "Diabetes", "Cardiac Care", "Stomach Care", "Ayurvedic",
  "Homeopathy", "Fitness", "Baby Care", "Devices", "Surgicals",
  "Treatments", "Skin Care"
];

const extractNumber = (str) => {
  if (typeof str !== 'string') return 0;
  const match = str.match(/[\d.]+/); 
  return match ? parseFloat(match[0]) : 0; 
};

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
  if (!user) {
    alert("Please log in to add to cart");
    return;
  }

  try {
    console.log("User UID:", user.uid);
    console.log("Product ID:", product._id);
    
    const cartRef = doc(firestore, "users", user.uid, "cart", product._id);
    await setDoc(cartRef, {
      ...product,
      qty: 1,
      addedAt: new Date()
    });
    console.log("Product added to Firestore");
    alert("Added to cart!");
  } catch (error) {
    console.error("Error adding to cart:", error.message);
    alert("Failed to add to cart. Please try again.");
  }
};

const toggleWishlist = async (product) => {
  if (!user) {
    alert("Please log in to add to wishlist");
    return;
  }

  const wishlistRef = doc(firestore, "users", user.uid, "wishlist", product._id);

  try {
    if (wishlistIds.includes(product._id)) {
      await deleteDoc(wishlistRef);
      setWishlistIds((prev) => prev.filter((id) => id !== product._id));
    } else {
      await setDoc(wishlistRef, {
        _id: product._id,
        ProductName: product.ProductName,
        CurrentPrice: product.CurrentPrice,
        ImageName: product.ImageName,
        MRP: product.MRP,
        MarketedBy: product.MarketedBy || "",
      }); 
      setWishlistIds((prev) => [...prev, product._id]);
      // alert("Added to wishlist!");
    }
  } catch (error) {
    console.error("Error toggling wishlist:", error);
    alert("Failed to update wishlist. Please try again.");
  }
};


  const handleSignOut = () => {
    signOut(auth).then(() => {
      window.location.href = "/";
    }).catch((error) => {
      console.error("Error signing out:", error);
      alert("Failed to sign out. Please try again.");
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
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      {/* Navbar */}
      <div className="bg-[#131921] text-white flex items-center px-4 py-2 shadow-md">
        <img src={require("../assets/Appicon.png")} alt="HealthSync Logo" className="w-10 h-10" />
        <div className="mr-6 text-2xl font-bold">
          <span>Health</span><span className="text-green-400">Sync</span>
        </div>
        <div className="flex-1 flex items-center max-w-2xl mx-auto">
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search for medicines, health products..."
            className="h-10 w-full px-3 text-gray-900 rounded-l-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <button
            className="h-10 px-4 bg-yellow-500 text-gray-900 rounded-r-md hover:bg-yellow-600 transition-colors flex items-center justify-center"
            onClick={handleSearchClick}
            aria-label="Search"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        <div className="ml-6 flex items-center gap-4 text-sm font-medium">
          <button onClick={handleSignOut} className="flex items-center gap-1 hover:text-yellow-400 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h10a1 1 0 001-1V4a1 1 0 00-1-1H3zm3.293 8.293a1 1 0 011.414 0L10 12.586l2.293-2.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Sign Out
          </button>
          <button onClick={() => navigate("/wishlist")} className="flex items-center gap-1 hover:text-yellow-400 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
            Wishlist
          </button>
          <button onClick={() => navigate("/cart")} className="flex items-center gap-1 hover:text-yellow-400 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553L16.5 4H5.124a1 1 0 00-.974 1.242l.39.78zm9 7a1 1 0 100 2 1 1 0 000-2z" />
            </svg>
            Cart
          </button>
        </div>
      </div>

      {/* Categories */}
      <div className="flex overflow-x-auto gap-3 bg-[#232f3e] p-4 text-white shadow-inner scrollbar-hide">
        {categories.map((cat) => (
          <button key={cat} onClick={() => handleCategoryClick(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200
            ${selected === cat && !isGlobalSearch ? "bg-yellow-400 text-gray-900 shadow-lg" : "bg-gray-700 hover:bg-gray-600"}`}>
            {cat}
          </button>
        ))}
      </div>

      {/* Products */}
      <div className="bg-gray-100 p-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {displayedProducts.map((p) => (
          <div key={p._id} className="bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 relative overflow-hidden flex flex-col">
            {/* Discount Badge */}
            {p.Discount && (
              <div className="absolute top-0 left-0 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-br-lg z-10">
                {p.Discount} OFF
              </div>
            )}
            
            {/* Wishlist Button */}

<button onClick={() => toggleWishlist(p)} className="absolute top-2 right-2 text-2xl z-10">
  {wishlistIds.includes(p._id) ? (
    <AiFillHeart className="text-red-500" />
  ) : (
    <AiOutlineHeart className="text-gray-400 hover:text-red-500 transition-colors" />
  )}
</button>

            <div className="flex flex-col items-center pt-8 pb-4 flex-grow text-center"> 
              <img
                src={require(`../assets/${p.ImageName}.jpg`)}
                alt={p.ProductName}
                className="h-28 w-28 object-contain mb-4 border border-gray-200 p-1 rounded" 
                onError={(e) => e.currentTarget.src = require("../assets/default.png")}
              />
              
              <div className="text-left w-full px-2">
                <h3 className="font-semibold text-lg leading-tight mb-1 min-h-[3rem] text-gray-900"> 
                  {p.ProductName}
                </h3>
                {p.MarketedBy && (
                  <p className="text-sm text-gray-600 mb-2">Mkt: {p.MarketedBy}</p>
                )}

                <div className="flex items-baseline gap-2 mb-2">
                  {p.CurrentPrice && (
                    <p className="text-2xl font-bold text-gray-900">
                      ₹ {extractNumber(p.CurrentPrice).toFixed(2)}
                    </p>
                  )}
                  {p.MRP && (
                    <p className="line-through text-sm text-gray-500">
                      MRP Rs. {extractNumber(p.MRP).toFixed(2)}
                    </p>
                  )}
                </div>
              </div>
            </div>
            
            <button
              onClick={() => handleAddToCart(p)}
              className="mt-auto w-full bg-[#10847e] text-white py-2 rounded-md font-semibold hover:bg-[#0e6f6a] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#10847e]"
            >
              ADD TO CART
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}