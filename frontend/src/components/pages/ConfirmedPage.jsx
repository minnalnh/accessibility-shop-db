import React from "react";
import { useLocation, Link } from "react-router-dom";

const ConfirmedPage = () => {
  const { state } = useLocation();
  const order = state?.order;

  if (!order) {
    return (
      <section className="mx-auto mt-[10rem] max-w-3xl p-6 text-center">
        <h1 className="text-3xl font-bold">No order found</h1>
        <Link to="/" className="mt-4 inline-block underline">
          Continue shopping
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto mt-[10rem] max-w-3xl p-6">
      <h1 className="mb-4 text-3xl font-bold text-center">
        Order is confirmed!
      </h1>

      <p className="mb-6 text-center">Thank you for your order.</p>

      <h2 className="mb-4 text-xl font-semibold">Your order</h2>

      {order.items.map((item) => (
        <div
          key={item.productId}
          className="flex items-center justify-between gap-4 border-b py-4"
        >
          <div>
            <h3 className="font-medium">{item.name}</h3>
            <p>Quantity: {item.quantity}</p>
          </div>

          <p className="font-semibold">{item.price * item.quantity} kr</p>
        </div>
      ))}

      <p className="mt-6 text-right text-xl font-bold">
        Total: {order.totalPrice} kr
      </p>

      <div className="mt-6 text-center">
        <Link
          to="/"
          className="inline-block rounded bg-black px-6 py-3 text-white"
        >
          Continue shopping
        </Link>
      </div>
    </section>
  );
};

export default ConfirmedPage;
