import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./CartPage.css";
import { FaShoppingCart } from "react-icons/fa";

const CartPage = () => {
  const {
    cartItems,
    removeItemFromCart,
    updateItemQuantity,
    getCartTotal,
    clearCart,
  } = useCart();

  // Minimum order value
  const MINIMUM_ORDER_VALUE = 250;

  // Check if order meets minimum value
  const isOrderValid = () => {
    return getCartTotal() >= MINIMUM_ORDER_VALUE;
  };

  // Helper to get/set customer name in sessionStorage
  const getCustomerName = () => sessionStorage.getItem("customerName") || "";
  const setCustomerName = (name) =>
    sessionStorage.setItem("customerName", name);

  const handleQuantityChange = (id, quantity) => {
    const numQuantity = parseInt(quantity, 10);
    if (numQuantity >= 1) {
      updateItemQuantity(id, numQuantity);
    } else if (numQuantity <= 0) {
      removeItemFromCart(id);
    }
  };

  const generateWhatsAppMessage = (customerName) => {
    let message = `Hello Bansal Nursery, my name is ${customerName}. I'd like to order the following items:\n\n`;
    cartItems.forEach((item) => {
      message += `${item.name} (x${item.quantity}) - ₹${(
        item.price * item.quantity
      ).toFixed(2)}\n`;
    });
    message += `\nSubtotal: ₹${getCartTotal().toFixed(2)}\n`;
    message += `Shipping: As per delivery location\n`;
    message += `Total: ₹${getCartTotal().toFixed(2)} + shipping\n\n`;
    message += "Please confirm my order.";
    return encodeURIComponent(message);
  };

  const handleWhatsAppOrder = () => {
    // Check minimum order value
    if (!isOrderValid()) {
      alert(
        `Minimum order value is ₹${MINIMUM_ORDER_VALUE}. Please add more items to your cart.`
      );
      return;
    }

    const nurseryPhoneNumber = "9549416150";
    if (nurseryPhoneNumber === "91XXXXXXXXXX") {
      alert("WhatsApp number not configured by the developer yet.");
      return;
    }
    let customerName = getCustomerName();
    if (!customerName) {
      customerName = prompt(
        "Please enter your name to personalize your order:"
      );
      if (!customerName || !customerName.trim()) {
        alert("Name is required to place an order via WhatsApp.");
        return;
      }
      setCustomerName(customerName.trim());
    }
    const message = generateWhatsAppMessage(customerName);
    const whatsappUrl = `https://wa.me/${nurseryPhoneNumber}?text=${message}`;
    window.open(whatsappUrl, "_blank");
  };

  if (cartItems.length === 0) {
    return (
      <div className="page-container cart-page empty-cart">
        <div className="cart-empty-message">
          <FaShoppingCart className="empty-cart-icon" />
          <h2>Your Cart is Empty</h2>
          <p>Looks like you haven't added any products yet. Start browsing!</p>
          <a href="/#products-section" className="btn-shop-now">
            Shop for Products
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container cart-page">
      <h1>Your Shopping Cart</h1>

      <div className="cart-container">
        <div className="cart-items-container">
          {cartItems.map((item) => (
            <div key={item.id} className="cart-item">
              <div className="cart-item-image-container">
                <img
                  src={item.image}
                  alt={item.name}
                  className="cart-item-image"
                />
              </div>
              <div className="cart-item-details">
                <div className="cart-item-header">
                  <h3>{item.name}</h3>
                  <button
                    onClick={() => removeItemFromCart(item.id)}
                    className="btn-remove-item"
                    aria-label="Remove item"
                  >
                    ×
                  </button>
                </div>
                <p className="item-price">₹{item.price.toFixed(2)}</p>
                <div className="cart-item-quantity">
                  <label htmlFor={`quantity-${item.id}`}>Quantity:</label>
                  <div className="quantity-controls">
                    <button
                      className="quantity-btn minus-btn"
                      onClick={() =>
                        handleQuantityChange(item.id, item.quantity - 1)
                      }
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      id={`quantity-${item.id}`}
                      value={item.quantity}
                      onChange={(e) =>
                        handleQuantityChange(item.id, e.target.value)
                      }
                      min="1"
                      className="quantity-input"
                    />
                    <button
                      className="quantity-btn plus-btn"
                      onClick={() =>
                        handleQuantityChange(item.id, item.quantity + 1)
                      }
                    >
                      +
                    </button>
                  </div>
                </div>
                <p className="item-subtotal">
                  Subtotal:{" "}
                  <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h3>Order Summary</h3>
          <div className="summary-row">
            <span>Total Items:</span>
            <span>
              {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
            </span>
          </div>
          <div className="summary-row">
            <span>Subtotal:</span>
            <span>₹{getCartTotal().toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping:</span>
            <span>As per delivery location</span>
          </div>
          <div className="summary-row total">
            <span>Total Amount:</span>
            <span className="total-amount">
              ₹{getCartTotal().toFixed(2)}{" "}
              <span className="plus-shipping">+ shipping</span>
            </span>
          </div>

          {!isOrderValid() && (
            <div className="minimum-order-warning">
              Minimum order value: ₹{MINIMUM_ORDER_VALUE}
            </div>
          )}

          <div className="cart-actions">
            <button
              onClick={clearCart}
              className="btn-secondary btn-clear-cart"
            >
              Clear Cart
            </button>
            <button
              onClick={handleWhatsAppOrder}
              className="btn-primary btn-whatsapp-order"
              disabled={!isOrderValid()}
            >
              Order via WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
