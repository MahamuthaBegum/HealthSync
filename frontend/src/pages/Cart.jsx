// src/pages/Cart.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Cart() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(stored);
  }, []);

  const removeItem = (id) => {
    const updated = cart.filter(i => i._id !== id);
    localStorage.setItem("cart", JSON.stringify(updated));
    setCart(updated);
  };

  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Shopping Cart</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty. <Link className="text-blue-500" to="/">Go shopping</Link>.</p>
      ) : (
        <>
          <ul>
            {cart.map(item => (
              <li key={item._id} className="flex justify-between mb-4">
                <div>
                  <h2>{item.name}</h2>
                  <p>₹{item.price} x {item.qty}</p>
                </div>
                <button onClick={() => removeItem(item._id)} className="text-red-500">Remove</button>
              </li>
            ))}
          </ul>
          <div className="text-right text-xl font-semibold">Total: ₹{total}</div>
          <button className="mt-4 bg-blue-600 text-white py-2 px-4 rounded">
            Proceed to Checkout
          </button>
        </>
      )}
    </div>
  );
}
