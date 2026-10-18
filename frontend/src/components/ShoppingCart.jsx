import React, { useContext, useState } from 'react';
import { CartContext } from './CartContext';
import { AuthContext } from './AuthContext';

const ShoppingCart = ({ isBox2Visible, toggleBoxVisibility, handleCloseButtonClick, isCartMsgVisible }) => {
    const { user } = useContext(AuthContext);
    const { cartItems, loading, error, addToCart, removeItem, changeQuantity, checkout } = useContext(CartContext);
    const [busy, setBusy] = useState(false);
    const [actionError, setActionError] = useState('');
    const [order, setOrder] = useState(null);

    const totalSum = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // runs one cart action at a time and shows the API's error message if it fails
    const run = async (action) => {
        setBusy(true);
        setActionError('');

        try {
            return await action();
        } catch (err) {
            setActionError(err.message);
            return undefined;
        } finally {
            setBusy(false);
        }
    };

    const addQuantity = (item) => run(() => addToCart(item));

    const removeOne = (item) => run(() => (
        item.quantity > 1 ? changeQuantity(item.id, item.quantity - 1) : removeItem(item.id)
    ));

    const handleCheckout = async () => {
        const createdOrder = await run(checkout);
        if (createdOrder) setOrder(createdOrder);
    };

    const renderContent = () => {
        if (!user) {
            return <p className="cart-empty-msg">Log in to see your cart</p>;
        }

        if (loading) {
            return <p role="status" className="cart-empty-msg">Loading your cart...</p>;
        }

        if (cartItems.length === 0 && order) {
            return (
                <div role="status" className="order-confirmation">
                    <p><b>Thank you for your order!</b></p>
                    <p>Order number: {order.orderId}</p>
                    <ul>
                        {order.items.map((item) => (
                            <li key={item.productId}>{item.quantity}x {item.name} ({item.price * item.quantity} kr)</li>
                        ))}
                    </ul>
                    <p>Total: <b>{order.totalPrice} kr</b></p>
                    <button className="auth-submit" onClick={() => setOrder(null)}><span>Continue shopping</span></button>
                </div>
            );
        }

        if (cartItems.length === 0) {
            return <p className="cart-empty-msg">Your cart is empty</p>;
        }

        return (
            <>
                <div>
                    {cartItems.map((item) => (
                        <div key={item.id} className="cart-flex-container">
                            <img src={item.image} alt={item.alt} style={{ width: "100px", height: "85px" }} className="cart-img" />
                            <div className="cart-item-info">
                                {item.name}
                                <br />
                                Price: <b>{item.price * item.quantity} kr</b>
                                <br />
                                Quantity:<br />
                                <div className="add-quantity-remove">
                                    <button className="cart-add-btn" disabled={busy} onClick={() => addQuantity(item)}><img src="icons/plus-solid.svg" alt="Plus Mark"></img><span> Add</span></button>
                                    <b className="quantity">{item.quantity}</b>
                                    <button className="cart-remove-btn" disabled={busy} onClick={() => removeOne(item)}><img src="icons/minus-solid.svg" alt="Minus Mark" className="icon"></img><span> Remove</span></button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex-container">
                    <p className="total-sum">Total sum: <b>{totalSum} kr</b></p>
                    <button className="checkout-btn" disabled={busy} onClick={handleCheckout}><img src="icons/cash-register-solid.svg" alt="Cash Register" className="icon shopping-btn"></img><span> Checkout</span></button>
                </div>
            </>
        );
    };

    return (
        <div className="shopping-cart">
            <button className="header-btn shopping-btn shopping-btn-layout" onClick={toggleBoxVisibility}><img src="icons/bag-shopping-solid.svg" alt="Shopping Cart" className="icon shopping-btn"></img><span className="shopping-btn"> Your Cart</span></button>

            {isBox2Visible && (
                <div className="shopping-box pop-up">
                    <div className="flex-container">
                        <h3 className="your-items">Your Items:</h3>
                        <button className="cart-close-btn close-btn close-btn-layout" onClick={handleCloseButtonClick}><img src="icons/xmark-solid.svg" alt="X Mark" className="icon close-btn"></img><span className="close-btn"> Close Cart</span></button>
                    </div>
                    {isCartMsgVisible && (
                        <div className="cart-msg-box">
                            <span>Your cart message</span>
                            <button className="close-btn close-btn-layout"><img src="icons/xmark-solid.svg" alt="X Mark" className="icon close-btn"></img>Close Message</button>
                        </div>
                    )}
                    {(error || actionError) && (
                        <p role="alert" className="auth-error">{actionError || error}</p>
                    )}
                    {renderContent()}
                </div>
            )}
        </div>
    );
};

export default ShoppingCart;
