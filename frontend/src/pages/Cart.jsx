import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {collection, updateDoc, doc,deleteDoc, onSnapshot} from "firebase/firestore";
import { auth, firestore } from "../firebase";

export default function Cart() {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();
  const user = auth.currentUser;

  
useEffect(() => {
  if (!user) return;

  const cartRef = collection(firestore, "users", user.uid, "cart");

  const unsubscribe = onSnapshot(cartRef, (snapshot) => {
    const items = snapshot.docs.map((doc) => ({
      ...doc.data(),
      docId: doc.id,
    }));

    setCart(items);
  });

  return () => unsubscribe();
}, [user]);

  const parsePrice = (priceStr) => {
    return Number(priceStr.replace(/[^\d.]/g, ""));
  };

  const updateQty = async (docId, qty) => {
    if (!user) return;

    const item = cart.find((i) => i.docId === docId);
    if (!item) return;

    const itemRef = doc(firestore, "users", user.uid, "cart", docId);

    if (qty <= 0) {
      await deleteDoc(itemRef);
      setCart(cart.filter((i) => i.docId !== docId));
    } else {
      await updateDoc(itemRef, { qty });
      setCart(cart.map((i) => (i.docId === docId ? { ...i, qty } : i)));
    }
  };

  const removeItem = async (docId) => {
    if (!user) return;

    await deleteDoc(doc(firestore, "users", user.uid, "cart", docId));
    setCart(cart.filter((i) => i.docId !== docId));
  };

  const total = cart.reduce(
    (sum, item) => sum + parsePrice(item.CurrentPrice) * item.qty,
    0
  );

  return (
  <div className="container mx-auto px-4 py-8 bg-gray-100 min-h-screen">
    <h1 className="text-3xl font-bold mb-6 text-[#232f3e] text-center">
      Your Shopping Cart
    </h1>

    {cart.length === 0 ? (
      <div className="flex flex-col items-center justify-center bg-white p-10 rounded-xl shadow-md max-w-md mx-auto">
        <img
          src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png"
          alt="Empty Cart"
          className="w-28 h-28 mb-4 opacity-80"
        />
        <p className="text-gray-600 text-lg mb-4 text-center">
          Your cart is currently empty.
        </p>
        <Link
          to="/Home"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-full transition duration-300"
        >
          Go Back to Shopping
        </Link>
      </div>
    ) : (
      <>
        <div className="space-y-6">
          {cart.map((item) => (
            <div
              key={item.docId}
              className="bg-white rounded-xl shadow p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <img
                  src={require(`../assets/${item.ImageName}.jpg`)}
                  alt={item.ProductName}
                  className="h-20 w-20 object-cover rounded border"
                  onError={(e) =>
                    (e.currentTarget.src = require("../assets/default.png"))
                  }
                />
                <div>
                  <h2 className="text-lg font-semibold">{item.ProductName}</h2>
                  <p className="text-gray-600 text-sm">{item.MarketedBy}</p>
                  <p className="text-green-700 font-bold">{item.CurrentPrice}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateQty(item.docId, item.qty - 1)}
                      className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
                    >
                      ➖
                    </button>
                    <span className="px-2 font-semibold">{item.qty}</span>
                    <button
                      onClick={() => updateQty(item.docId, item.qty + 1)}
                      className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
                    >
                      ➕
                    </button>
                  </div>
                </div>
              </div>
              <button
                onClick={() => removeItem(item.docId)}
                className="text-red-500 font-semibold hover:underline"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <div className="mt-10 bg-white p-6 rounded-xl shadow-md max-w-md ml-auto">
          <h3 className="text-xl font-semibold mb-4 border-b pb-2">Order Summary</h3>
          <div className="flex justify-between mb-2 text-gray-700">
            <span>Subtotal</span>
            <span>₹{total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg mt-4">
            <span>Total</span>
            <span>₹{total.toFixed(2)}</span>
          </div>
          <button
            onClick={() => navigate("/checkout")}
            className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Proceed to Checkout
          </button>
        </div>
      </>
    )}
  </div>
);
}
