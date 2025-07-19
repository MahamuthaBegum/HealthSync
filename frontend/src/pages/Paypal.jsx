import { useEffect, useRef, useState } from "react";

export default function PayPalButton({ amount = "99.99", onSuccess }) {
  const paypalRef = useRef();
  const [sdkReady, setSdkReady] = useState(false);
useEffect(() => {
  const addPayPalScript = async () => {
    if (window.paypal) {
      setSdkReady(true);
      return;
    }

    const script = document.createElement("script");
   script.src = `https://www.paypal.com/sdk/js?client-id=${process.env.REACT_APP_PAYPAL_CLIENT_ID}&currency=USD`;
    script.type = "text/javascript";
    script.async = true;
    script.onload = () => setSdkReady(true);
    script.onerror = () => console.error("Failed to load PayPal SDK");
    document.body.appendChild(script);
  };

  addPayPalScript();

  return () => {
    if (paypalRef.current) {
      paypalRef.current.innerHTML = "";
    }
  };
}, []);


  useEffect(() => {
    if (sdkReady) {
      window.paypal.Buttons({
        createOrder: (data, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value: amount.toString(),
                },
              },
            ],
          });
        },
        onApprove: async (data, actions) => {
          const order = await actions.order.capture();
          console.log(" PayPal Payment Successful!", order);
          if (onSuccess) onSuccess(order);
        },
        onError: (err) => {
          console.error("PayPal Checkout Error", err);
        },
      }).render(paypalRef.current);
    }
  }, [sdkReady, amount, onSuccess]);

  return (
    <div className="flex flex-col items-center mt-8">
      {!sdkReady ? (
        <p className="text-blue-500">Loading PayPal...</p>
      ) : (
        <div ref={paypalRef} className="w-full" />
      )}
    </div>
  );
}
