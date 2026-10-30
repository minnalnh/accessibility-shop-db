import React, { useContext } from "react";
import { CartContext } from "./CartContext";
import { AuthContext } from "./AuthContext";

const Product = ({
  id,
  name,
  size,
  material,
  description,
  brand,
  price,
  image,
  alt,
}) => {
  const { user } = useContext(AuthContext);
  const { addToCart, notifyAdded, notifyError } = useContext(CartContext);

  const product = { id, name, price, image, alt };

  const handleAddToCart = async () => {
    try {
      await addToCart(product);
      notifyAdded(product);
    } catch (error) {
      notifyError(error.message, user ? "error" : "login");
    }
  };

  return (
    <section className="product item gap-3">
      <section className="product-img-container">
        <img src={image} alt={alt} className="product-img"></img>
      </section>
      <section className="product-info-container">
        <h2 className="product-name">{name}</h2>
        <p className="product-price">
          Price: <b>{price} kr</b>
        </p>
        <p className="product-description">{description}</p>
        <section className="cart-btn-container">
          <button className="cart-btn" onClick={handleAddToCart}>
            <img src="icons/plus-solid.svg" alt="Plus Mark"></img>
            <span> Add to Cart</span>
          </button>
        </section>
      </section>
    </section>
  );
};

export default Product;
