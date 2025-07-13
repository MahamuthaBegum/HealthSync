import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { auth, firestore } from "../firebase";

export default function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) {
        navigate("/login");
        return;
      }
      setUser(u);
      const snapshot = await getDocs(collection(firestore, "users", u.uid, "wishlist"));
      const items = snapshot.docs.map((doc) => ({ _id: doc.id, ...doc.data() }));
      setWishlist(items);
    });
    return unsub;
  }, [navigate]);

  const removeFromWishlist = async (id) => {
    if (!user) return;
    await deleteDoc(doc(firestore, "users", user.uid, "wishlist", id));
    setWishlist((prev) => prev.filter((item) => item._id !== id));
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-4 text-center text-[#232f3e]">My Wishlist</h2>
      {wishlist.length === 0 ? (
        <p className="text-center text-gray-500">No items in wishlist.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {wishlist.map((item) => (
            <div key={item._id} className="bg-white p-4 rounded shadow text-center">
              <img
                src={require(`../assets/${item.ImageName}.jpg`)}
                alt={item.ProductName}
                className="h-24 w-24 mx-auto object-cover"
                onError={(e) => e.currentTarget.src = require("../assets/default.png")}
              />
              <h3 className="font-semibold mt-2">{item.ProductName}</h3>
              <p className="text-green-600 font-bold">{item.CurrentPrice}</p>
              <button
                onClick={() => removeFromWishlist(item._id)}
                className="mt-2 text-red-600 underline"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}