// src/pages/ProductDetail.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(console.error);
  }, [id]);

  const handleAddToCart = () => {
    // store in localStorage or context
    alert("Added to cart!");
  };

  if (!product) return <div className="p-4">Loading...</div>;
  return (
    <div className="container mx-auto p-4 flex flex-col md:flex-row gap-6">
      <img src={product.image} alt={product.name} className="w-full md:w-1/2 h-auto object-cover" />
      <div className="md:w-1/2 space-y-4">
        <h2 className="text-xl font-bold">{product.name}</h2>
        <p className="text-gray-700">{product.description}</p>
        <p className="text-2xl font-semibold">₹{product.price}</p>
        <button onClick={handleAddToCart} className="bg-green-500 text-white py-2 px-6 rounded">
          Add to Cart
        </button>
      </div>
    </div>
  );
}
