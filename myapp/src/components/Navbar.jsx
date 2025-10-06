import React, { useContext } from 'react';
import { CartContext } from '../contexts/Cartcontext';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import '../styles/Cart.css';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, calculateTotal } = useContext(CartContext);
  const navigate = useNavigate();

  const handleRemove = (bookId) => {
    removeFromCart(bookId);
  };

  const handleUpdateQuantity = (bookId, event) => {
    const quantity = parseInt(event.target.value, 10);
    if (!isNaN(quantity)) {
      updateQuantity(bookId, quantity);
    }
  };

  return (
    <div className="cart-page">
      <header className="cart-header">
        <div className="logo">📚 My Bookstore</div>
        <div className="header-actions">
          <button className="back-button" onClick={() => navigate('/booklist')}>
            <FaArrowLeft size={20} /> Back to Book List
          </button>
        </div>
      </header>

      <main className="cart-content">
        <h1>Shopping Cart</h1>
        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <div>
            <ul>
              {cart.map((item) => (
                <li key={item.id} className="cart-item">
                  <img src={item.thumbnail} alt={item.title} />
                  <div>
                    <h3>{item.title}</h3>
                    <p>Author: {item.author}</p>
                    <p>Price: Rs. {item.price}</p>
                    <div>
                      <label>Quantity:</label>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleUpdateQuantity(item.id, e)}
                      />
                    </div>
                    <p>Total: Rs. {item.price * item.quantity}</p>
                    <button onClick={() => handleRemove(item.id)}>Remove</button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="cart-summary">
              <h3>Total Price: Rs. {calculateTotal()}</h3>
              <button onClick={() => navigate('/checkout')}>Proceed to Checkout</button>
            </div>
          </div>
        )}
      </main>

      <footer className="cart-footer">
        <p>&copy; 2025 My Bookstore. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default Cart;
