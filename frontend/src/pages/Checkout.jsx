import React, { useState, useEffect } from "react";
import PayPalButton from "./Paypal";

const Checkout = () => {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    pincode: "",
    phone: ""
  });

  const [totalAmount, setTotalAmount] = useState(0);
  const [alert, setAlert] = useState(null);
  const [formValid, setFormValid] = useState(false);

  useEffect(() => {
    setTotalAmount(1250.75); 
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const showAlert = (message, type = "info") => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 3000);
  };

  const validateForm = () => {
    const { name, address, pincode, phone } = formData;
    if (!name || !address || !pincode || !phone) {
      showAlert("Please fill out all fields", "error");
      return false;
    }

    if (!/^\d{10}$/.test(phone) || !/^\d{6}$/.test(pincode)) {
      showAlert("Please enter valid phone and pincode.", "error");
      return false;
    }

    return true;
  };

  const handlePayPalSuccess = (order) => {
    showAlert(`PayPal Payment Successful! Order ID: ${order.id}`, "success");

  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const isValid = validateForm();
    setFormValid(isValid);
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Checkout
      </h2>

      {alert && (
        <div
          className={`p-3 mb-6 rounded text-white font-medium ${
            alert.type === "error" ? "bg-red-500" : "bg-green-500"
          }`}
        >
          {alert.message}
        </div>
      )}

      {!formValid ? (
        <form
          onSubmit={handleSubmit}
          className="space-y-4 bg-white p-6 rounded-lg shadow-lg"
        >
          <div>
            <label htmlFor="name" className="block mb-1 text-sm font-medium">
              Full Name
            </label>
            <input
              id="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="address" className="block mb-1 text-sm font-medium">
              Address
            </label>
            <input
              id="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter your address"
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-4">
            <div className="w-1/2">
              <label
                htmlFor="pincode"
                className="block mb-1 text-sm font-medium"
              >
                Pincode
              </label>
              <input
                id="pincode"
                value={formData.pincode}
                onChange={handleChange}
                placeholder="Enter your pincode "
                className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="w-1/2">
              <label htmlFor="phone" className="block mb-1 text-sm font-medium">
                Phone
              </label>
              <input
                id="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone"
                className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white font-semibold px-6 py-2 rounded hover:bg-blue-700 transition duration-200 w-full"
          >
            Proceed to Pay
          </button>
        </form>
      ) : (
        <div className="mt-6">
          <PayPalButton amount={totalAmount} onSuccess={handlePayPalSuccess} />
        </div>
      )}
    </div>
  );
};

export default Checkout;
