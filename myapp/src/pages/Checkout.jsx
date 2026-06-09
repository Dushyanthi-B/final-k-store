import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import jsPDF from 'jspdf';
import '../styles/Checkout.css';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';
import { CartContext } from '../contexts/Cartcontext';
import API_URL from '../config/api';

const Checkout = () => {
  const { clearCart } = useContext(CartContext);
  const navigate = useNavigate();
  const location = useLocation();
  const cartItems = location.state?.cartItems || [];

  const [shippingInfo, setShippingInfo] = useState({
    name: '',
    address: '',
    city: '',
    postalCode: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('');
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [invoiceGenerated, setInvoiceGenerated] = useState(false);
  const [orderHistory, setOrderHistory] = useState([]);
  const [orderId, setOrderId] = useState(null);

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  useEffect(() => {
    if (orderConfirmed) {
      fetchOrderHistory();
    }
  }, [orderConfirmed]);

  const fetchOrderHistory = async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/orders/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setOrderHistory(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching order history:', error);
    }
  };

  const handleShippingChange = (e) => {
    setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
  };

  const handleConfirmOrder = async () => {
    if (
      shippingInfo.name &&
      shippingInfo.address &&
      shippingInfo.city &&
      shippingInfo.postalCode &&
      paymentMethod
    ) {
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (!token) {
          alert('Please log in to place an order.');
          return;
        }
        const items = cartItems.map((item) => ({
          bookId: item.id || item._id || item.bookId || item.isbn || item.title,
          title: item.title,
          quantity: item.quantity,
          price: item.price,
          image: item.image,
        }));
        const subtotal = items.reduce((s, it) => s + it.price * it.quantity, 0);
        const shipping = 0;
        const total = subtotal + shipping;
        const address = {
          fullName: shippingInfo.name,
          line1: shippingInfo.address,
          city: shippingInfo.city,
          postalCode: shippingInfo.postalCode,
        };
        const res = await fetch(`${API_URL}/api/orders`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ items, subtotal, shipping, total, address }),
        });
        const text = await res.text();
        let created = {};
        try { created = text ? JSON.parse(text) : {}; } catch {}
        if (!res.ok) {
          const message = created?.message || `Order error (${res.status})`;
          throw new Error(message);
        }
        setOrderId(created._id);
        setOrderConfirmed(true);
        generateInvoice();
        clearCart();
        setInvoiceGenerated(true);
      } catch (e) {
        console.error('Order creation failed', e);
        alert('Failed to place order. Please try again.');
      }
    } else {
      alert('Please complete all fields before confirming your order.');
    }
  };

  const generateInvoice = () => {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });

    const drawHeader = () => {
      try {
      } catch {}
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(20);
      doc.text('K-Books', 40, 60);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text('123 Main Street, Negombo, 11500', 40, 76);
      doc.text('Email: kanishkan4848@gmail.coml | Phone: +94 77 896 4525', 40, 90);
      doc.setDrawColor(200);
      doc.line(40, 100, 555, 100);
    };

    drawHeader();

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('Invoice', 40, 124);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 110, 124);

    doc.setFont('helvetica', 'bold');
    doc.text('Bill To:', 40, 150);
    doc.setFont('helvetica', 'normal');
    doc.text(`${shippingInfo.name}`, 40, 166);
    doc.text(`${shippingInfo.address}`, 40, 182);
    doc.text(`${shippingInfo.city} - ${shippingInfo.postalCode}`, 40, 198);

    let y = 230;
    doc.setFont('helvetica', 'bold');
    doc.setFillColor(245, 245, 245);
    doc.rect(40, y - 14, 515, 22, 'F');
    doc.text('Item', 50, y);
    doc.text('Qty', 360, y);
    doc.text('Price', 410, y);
    doc.text('Amount', 480, y);

    doc.setFont('helvetica', 'normal');
    let rowY = y + 24;
    cartItems.forEach((item) => {
      const amount = item.price * item.quantity;
      doc.text(String(item.title), 50, rowY);
      doc.text(String(item.quantity), 360, rowY);
      doc.text(`Rs.${item.price}`, 410, rowY);
      doc.text(`Rs.${amount}`, 480, rowY);
      rowY += 20;
    });

    const subtotal = cartItems.reduce((s, it) => s + it.price * it.quantity, 0);
    const shippingCost = 0;
    const grandTotal = subtotal + shippingCost;
    rowY += 10;
    doc.setFont('helvetica', 'bold');
    doc.text('Subtotal:', 410, rowY);
    doc.setFont('helvetica', 'normal');
    doc.text(`Rs.${subtotal}`, 480, rowY);
    rowY += 18;
    doc.setFont('helvetica', 'bold');
    doc.text('Shipping:', 410, rowY);
    doc.setFont('helvetica', 'normal');
    doc.text(`Rs.${shippingCost}`, 480, rowY);
    rowY += 18;
    doc.setFont('helvetica', 'bold');
    doc.text('Total:', 410, rowY);
    doc.setFont('helvetica', 'normal');
    doc.text(`Rs.${grandTotal}`, 480, rowY);

    doc.setDrawColor(220);
    doc.line(40, 760, 555, 760);
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(10);
    doc.text('Thank you for your purchase!', 40, 780);
    doc.text('K-Books • kanishkan4848@gmail.coml • +94 77 896 4525', 40, 796);

    doc.save('invoice.pdf');
    setInvoiceGenerated(true);
  };

  const handleLogout = () => {
    alert("Logged out successfully");
    navigate('/home');
  };

  return (
    <div className="page-wrapper">
      <SiteHeader />

      <main className="checkout-body">
        <h1>Checkout</h1>

        {!orderConfirmed ? (
          <>
            <section className="section">
              <h2>Shipping Information</h2>
              <input className="btn" style={{height:40, minWidth:'unset', width:'100%'}} type="text" name="name" placeholder="Full Name" onChange={handleShippingChange} />
              <input className="btn" style={{height:40, minWidth:'unset', width:'100%'}} type="text" name="address" placeholder="Address" onChange={handleShippingChange} />
              <input className="btn" style={{height:40, minWidth:'unset', width:'100%'}} type="text" name="city" placeholder="City" onChange={handleShippingChange} />
              <input className="btn" style={{height:40, minWidth:'unset', width:'100%'}} type="text" name="postalCode" placeholder="Postal Code" onChange={handleShippingChange} />
            </section>

            <section className="section">
              <h2>Payment Method</h2>
              <select className="btn" style={{height:40, minWidth:'unset'}} onChange={(e) => setPaymentMethod(e.target.value)}>
                <option value="">Select Payment Method</option>
                <option value="Cash on Delivery">Cash on Delivery</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Bank Transfer">Bank Transfer</option>
              </select>
            </section>

            <section className="section">
              <h2>Order Summary</h2>
              <ul>
                {cartItems.map((item, i) => (
                  <li key={i}>
                    {item.title} x{item.quantity} - Rs.{item.price * item.quantity}
                  </li>
                ))}
              </ul>
              <strong>Total: Rs.{total}</strong>
            </section>

            <button className="btn btn-primary confirm-btn" onClick={handleConfirmOrder}>
              Confirm Order
            </button>
          </>
        ) : (
          <section className="confirmation">
            <h2>Order Confirmed ✅</h2>
            <p>Thank you, {shippingInfo.name}! Your order has been placed.</p>

            {invoiceGenerated ? (
              <p>Your invoice has been downloaded and your cart is cleared.</p>
            ) : null}
          </section>
        )}

        {orderConfirmed && (
          <section className="order-history">
            <h2>Your Order History</h2>
            <div className="order-history-container">
              {orderHistory.length === 0 ? (
                <p className="no-orders">You have no previous orders.</p>
              ) : (
                <div className="order-cards">
                  {orderHistory.slice(0, 5).map((order, index) => (
                    <div key={index} className="order-card">
                      <div className="order-header">
                        <span className="order-id">Order #{order._id.slice(-8)}</span>
                        <span className="order-date">{new Date(order.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="order-details">
                        <span className="order-total">Rs. {order.total}</span>
                        <span className="order-status">{order.status || 'Completed'}</span>
                      </div>
                    </div>
                  ))}
                  {orderHistory.length > 5 && (
                    <div className="more-orders">
                      <p>... and {orderHistory.length - 5} more orders</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>
        )}
      </main>

      <SiteFooter />
    </div>
  );
};

export default Checkout;
