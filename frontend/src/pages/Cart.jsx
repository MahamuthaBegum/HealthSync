import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { auth, firestore } from "../firebase";

export default function Cart() {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchCart = async () => {
      if (!user) return;

      const cartRef = collection(firestore, "users", user.uid, "cart");
      const snapshot = await getDocs(cartRef);

      const items = snapshot.docs.map((doc) => ({
        ...doc.data(),
        docId: doc.id,
      }));

      setCart(items);
    };

    fetchCart();
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
      <h1 className="text-3xl font-bold mb-6 text-[#232f3e]">Your Shopping Cart</h1>

      {cart.length === 0 ? (
        <p className="text-gray-600">
          Your cart is empty.{" "}
          <Link to="/" className="text-blue-500 underline">
            Go back to shopping
          </Link>
        </p>
      ) : (
        <>
          <div className="space-y-6">
            {cart.map((item) => (
              <div
                key={item.docId}
                className="bg-white rounded shadow p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={require(`../assets/${item.ImageName}.jpg`)}
                    alt={item.ProductName}
                    className="h-20 w-20 object-cover rounded"
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
                        className="bg-gray-300 px-2 py-1 rounded"
                      >
                        ➖
                      </button>
                      <span className="px-2">{item.qty}</span>
                      <button
                        onClick={() => updateQty(item.docId, item.qty + 1)}
                        className="bg-gray-300 px-2 py-1 rounded"
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

          <div className="mt-8 bg-white p-6 rounded shadow-md">
            <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
            <div className="flex justify-between mb-2">
              <span>Subtotal</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg mt-4">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
            <button
              onClick={() => navigate("/checkout")}
              className="w-full mt-6 bg-blue-600 text-white py-3 rounded hover:bg-blue-700"
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}
