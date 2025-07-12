// src/pages/Products.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Products() {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    axios.get("http://localhost:5000/api/products")
      .then(res => setProducts(res.data))
      .catch(console.error);
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
        {products.map(p => (
          <Link key={p._id} to={`/product/${p._id}`} className="border rounded p-3 hover:shadow">
            <img src={p.image} alt={p.name} className="h-40 w-full object-cover mb-2" />
            <h2 className="font-semibold">{p.name}</h2>
            <p className="text-blue-600">₹{p.price}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
