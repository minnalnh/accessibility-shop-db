import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../CartContext";

const CheckoutPage = () => {
  const { cartItems, loading, error, checkout } = useContext(CartContext);
  const [busy, setBusy] = useState(false);
  const [orderError, setOrderError] = useState("");
  const navigate = useNavigate();

  const totalSum = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const handleConfirm = async () => {
    setBusy(true);
    setOrderError("");

    try {
      const order = await checkout();
      navigate("/confirmed-page", { state: { order } });
    } catch (err) {
      setOrderError(err.message);
      setBusy(false);
    }
  };

  const renderContent = () => {
    if (loading) {
      return <p>Loading your cart...</p>;
    }

    if (error) {
      return <p role="alert">{error}</p>;
    }

    if (cartItems.length === 0) {
      return <p>Your cart is empty.</p>;
    }

    return (
      <>
        <h2>Your order</h2>
        <section className="cart-items-list flex flex-col items-center gap-7">
          {cartItems.map((item) => (
            <article
              key={item.id}
              className="cart-item flex w-full max-w-[40rem] flex-row gap-7 border"
            >
              <img src={item.image} alt={item.alt} width="100" />
              <section className="cart-item__info">
                <h3>{item.name}</h3>
                <p>Quantity: {item.quantity}</p>
                <p>Price: {item.price * item.quantity} kr</p>
              </section>
            </article>
          ))}
          <h2>Total: {totalSum} kr</h2>
          {orderError && <p role="alert">{orderError}</p>}
          <button
            className="confirm-btn"
            disabled={busy}
            onClick={handleConfirm}
          >
            Confirm order
          </button>
        </section>
      </>
    );
  };

  return (
    <section className="mt-[10rem] px-4">
      <h1 className="text-center">Checkout</h1>

      {renderContent()}
    </section>
  );
};

export default CheckoutPage;
