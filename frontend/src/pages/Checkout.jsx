import React, { useState, useEffect } from "react";

const Checkout = () => {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    pincode: "",
    phone: ""
  });

  const [totalAmount, setTotalAmount] = useState(0);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    setTotalAmount(1250.75); // replace with actual cart total if needed
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const showAlert = (message, type = "info") => {
    setAlert({ message, type });
  };

  const handlePayment = () => {
    const razorpayKey = "rzp_test_YOUR_KEY_ID"; // replace with your test key

    if (razorpayKey === "rzp_test_YOUR_KEY_ID") {
      showAlert("Please add your Razorpay Test Key.", "error");
      return;
    }

    const options = {
      key: razorpayKey,
      amount: Math.round(totalAmount * 100),
      currency: "INR",
      name: "HealthSync Store",
      description: "Order Payment",
      image: "https://placehold.co/100x100/000000/FFFFFF?text=Logo",
      handler: function (response) {
        showAlert("Payment Successful! ID: " + response.razorpay_payment_id, "success");
      },
      prefill: {
        name: formData.name,
        contact: formData.phone,
        email: "test@example.com"
      },
      notes: {
        address: formData.address,
        pincode: formData.pincode
      },
      theme: { color: "#3B82F6" }
    };

    const rzp = new window.Razorpay(options);
    rzp.on("payment.failed", function (response) {
      showAlert("Payment Failed: " + response.error.description, "error");
    });

    rzp.open();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Manual empty field check
    const { name, address, pincode, phone } = formData;
    if (!name || !address || !pincode || !phone) {
      showAlert("Please fill out all fields", "error");
      return;
    }

    // Pattern check for phone and pincode
    if (!/^\d{10}$/.test(phone) || !/^\d{6}$/.test(pincode)) {
      showAlert("Please enter valid phone and pincode.", "error");
      return;
    }

    handlePayment();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Checkout</h2>

        {["name", "address", "pincode", "phone"].map((field) => (
          <div className="mb-4" key={field}>
            <label htmlFor={field} className="block text-sm font-medium text-gray-700 mb-1">
              {field.charAt(0).toUpperCase() + field.slice(1)}
            </label>
            {field === "address" ? (
              <textarea
                id={field}
                rows="3"
                className="w-full border rounded px-3 py-2"
                value={formData[field]}
                onChange={handleChange}
                required
              />
            ) : (
              <input
                type={field === "phone" || field === "pincode" ? "tel" : "text"}
                id={field}
                pattern={field === "phone" ? "[0-9]{10}" : field === "pincode" ? "[0-9]{6}" : undefined}
                className="w-full border rounded px-3 py-2"
                value={formData[field]}
                onChange={handleChange}
                required
              />
            )}
          </div>
        ))}

        <div className="flex justify-between items-center mb-4 border-t pt-4">
          <span className="text-lg font-semibold">Total:</span>
          <span className="text-xl font-bold text-blue-600">₹{totalAmount.toFixed(2)}</span>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition"
        >
          Pay with Razorpay
        </button>
      </form>

      {alert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-80 text-center">
            <p className="mb-4">{alert.message}</p>
            <button
              onClick={() => setAlert(null)}
              className={`px-4 py-2 rounded text-white ${
                alert.type === "success"
                  ? "bg-green-600"
                  : alert.type === "error"
                  ? "bg-red-600"
                  : "bg-blue-600"
              }`}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;

