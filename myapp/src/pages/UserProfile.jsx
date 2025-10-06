import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/UserProfile.css';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    profile: '',
    gender: '',
    dateOfBirth: '',
    nationality: '',
  });

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    const storedUserStr = localStorage.getItem('user') || sessionStorage.getItem('user');
    const storedUser = storedUserStr ? JSON.parse(storedUserStr) : null;

    // Fallback: show stored user immediately if present
    if (storedUser) {
      setUser(storedUser);
      setFormData({
        username: storedUser.username || '',
        profile: storedUser.profile || '',
        gender: storedUser.gender || '',
        dateOfBirth: storedUser.dateOfBirth ? storedUser.dateOfBirth.slice(0, 10) : '',
        nationality: storedUser.nationality || '',
      });
    }

    const fetchProfile = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const res = await axios.get('http://127.0.0.1:5000/api/users/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
        setFormData({
          username: res.data.username || '',
          profile: res.data.profile || '',
          gender: res.data.gender || '',
          dateOfBirth: res.data.dateOfBirth ? res.data.dateOfBirth.slice(0, 10) : '',
          nationality: res.data.nationality || '',
        });
      } catch (e) {
        // Fallback to legacy endpoint if users route not found
        try {
          const id = storedUser?._id;
          if (!id) throw e;
          const res2 = await axios.get(`http://127.0.0.1:5000/api/auth/${id}`);
          setUser(res2.data);
          setFormData({
            username: res2.data.username || '',
            profile: res2.data.profile || '',
            gender: res2.data.gender || '',
            dateOfBirth: res2.data.dateOfBirth ? String(res2.data.dateOfBirth).slice(0, 10) : '',
            nationality: res2.data.nationality || '',
          });
        } catch (e2) {
          console.error('Failed to load profile', e2);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    if (activeTab !== 'orders') return;
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    const fetchOrders = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/orders/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(res.data || []);
      } catch (e) {
        console.error('Failed to load orders', e);
      }
    };
    if (token) fetchOrders();
  }, [activeTab]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleBackClick = () => {
    navigate('/booklist');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.username || !formData.profile || !formData.gender || !formData.dateOfBirth || !formData.nationality) {
      alert('All fields are required!');
      return;
    }

    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to update your profile.');
      return;
    }
    setIsSaving(true);

    axios
      .put('http://127.0.0.1:5000/api/users/me', formData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUser(res.data);
        // Persist updated user back to storage so UI reflects changes across the app
        const preferLocal = !!localStorage.getItem('token');
        const store = preferLocal ? localStorage : sessionStorage;
        try {
          store.setItem('user', JSON.stringify(res.data));
        } catch {}
        setIsEditing(false);
        alert('Profile updated successfully!');
      })
      .catch((err) => {
        // If users route not found, fallback to legacy /api/auth/user/:id
        const status = err?.response?.status;
        if (status === 404) {
          const preferLocal = !!localStorage.getItem('token');
          const store = preferLocal ? localStorage : sessionStorage;
          const storedUserStr2 = store.getItem('user');
          const storedUser2 = storedUserStr2 ? JSON.parse(storedUserStr2) : null;
          const id = storedUser2?._id || user?._id;
          if (id) {
            axios
              .put(`http://127.0.0.1:5000/api/auth/user/${id}`, formData)
              .then((res2) => {
                setUser(res2.data);
                try { store.setItem('user', JSON.stringify(res2.data)); } catch {}
                setIsEditing(false);
                alert('Profile updated successfully!');
              })
              .catch((err2) => {
                console.error('Update failed:', err2);
                const message2 = err2?.response?.data?.message || err2?.message || 'Update failed';
                alert(message2);
              })
              .finally(() => setIsSaving(false));
            return;
          }
        }
        console.error('Update failed:', err);
        const message = err?.response?.data?.message || err?.message || 'Update failed';
        alert(message);
      })
      .finally(() => setIsSaving(false));
  };

  if (isLoading) return <p>Loading profile...</p>;

  const downloadInvoice = (order) => {
    const formatCurrency = (n) => `Rs. ${Number(n || 0).toLocaleString()}`;
    const orderNumber = `#${String(order._id || '').slice(-8)}`;
    const dateStr = order.createdAt ? new Date(order.createdAt).toLocaleString() : '-';
    const address = order.address || {};
    const itemsRows = (order.items || []).map((it, idx) => `
      <tr>
        <td>${idx + 1}</td>
        <td>${it.title || ''}</td>
        <td style="text-align:center;">${it.quantity || 0}</td>
        <td style="text-align:right;">${formatCurrency(it.price || 0)}</td>
        <td style="text-align:right;">${formatCurrency((it.quantity || 0) * (it.price || 0))}</td>
      </tr>
    `).join('');
    const filename = `Invoice-${orderNumber.replace('#', '')}.pdf`;
    const html = `
<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Invoice ${orderNumber}</title>
  <style>
    body { font-family: -apple-system, Segoe UI, Roboto, Arial, sans-serif; margin: 24px; color: #111827; }
    .invoice { max-width: 900px; margin: 0 auto; }
    h1 { margin: 0 0 4px 0; font-size: 22px; }
    .meta { color: #6b7280; margin-bottom: 16px; }
    .section { margin-top: 16px; }
    table { width: 100%; border-collapse: collapse; }
    thead th { text-align: left; border-bottom: 1px solid #e5e7eb; padding: 8px 6px; background: #f9fafb; }
    tbody td { padding: 8px 6px; border-bottom: 1px solid #f3f4f6; }
    tfoot td { padding: 8px 6px; }
    .totals td { border-top: 1px solid #e5e7eb; }
    .right { text-align: right; }
    .muted { color: #6b7280; }
    @media print { .no-print { display: none; } }
  </style>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
  </head>
  <body>
    <div class="invoice">
      <div style="display:flex; justify-content: space-between; align-items: baseline;">
        <h1>K-Books Invoice</h1>
        <div class="muted">${orderNumber}</div>
      </div>
      <div class="meta">Date: ${dateStr} · Status: ${order.status || 'confirmed'}</div>
      <div class="section" style="display:flex; gap:32px; flex-wrap:wrap;">
        <div>
          <div class="muted">Billed To</div>
          <div>${address.fullName || '-'}</div>
          <div>${address.line1 || ''}</div>
          <div>${address.line2 || ''}</div>
          <div>${[address.city, address.state, address.postalCode].filter(Boolean).join(', ')}</div>
          <div>${address.country || ''}</div>
        </div>
      </div>
      <div class="section">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Item</th>
              <th style="text-align:center;">Qty</th>
              <th class="right">Price</th>
              <th class="right">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${itemsRows}
          </tbody>
          <tfoot>
            <tr class="totals">
              <td colspan="4" class="right">Subtotal</td>
              <td class="right">${formatCurrency(order.subtotal)}</td>
            </tr>
            <tr>
              <td colspan="4" class="right">Shipping</td>
              <td class="right">${formatCurrency(order.shipping)}</td>
            </tr>
            <tr>
              <td colspan="4" class="right"><strong>Total</strong></td>
              <td class="right"><strong>${formatCurrency(order.total)}</strong></td>
            </tr>
          </tfoot>
        </table>
      </div>
      <div class="section muted">Thank you for your purchase!</div>
      <div class="no-print" style="margin-top:16px; display:flex; gap:8px;">
        <button id="previewBtn" style="padding:8px 12px;">Preview</button>
        <button id="dlBtn" style="padding:8px 12px;">Download PDF</button>
      </div>
    </div>
    <script>
      (function(){
        function savePdf(){
          if (!window.html2pdf) return;
          var elem = document.querySelector('.invoice');
          var opt = { filename: '${filename}', margin: 10, image: { type: 'jpeg', quality: 0.98 }, html2canvas: { scale: 2 }, jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' } };
          window.html2pdf().from(elem).set(opt).save();
        }
        function waitForLibAndSave(){
          if (window.html2pdf) { savePdf(); return; }
          var tries = 0; var iv = setInterval(function(){
            tries++;
            if (window.html2pdf) { clearInterval(iv); savePdf(); }
            else if (tries > 50) { clearInterval(iv); }
          }, 100);
        }
        document.getElementById('dlBtn').addEventListener('click', waitForLibAndSave);
        document.getElementById('previewBtn').addEventListener('click', function(){ window.print(); });
      })();
    </script>
  </body>
</html>`;
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.open();
    win.document.write(html);
    win.document.close();
  };

  return (
    <div className="page-wrapper">
      <SiteHeader />
      <div className="tab-buttons">
        <button
          onClick={() => setActiveTab('profile')}
          className={activeTab === 'profile' ? 'active' : ''}
        >
          Profile
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={activeTab === 'orders' ? 'active' : ''}
        >
          Order History
        </button>
      </div>

      <div className="centered-container">
        <div className={`profile-card ${activeTab === 'orders' ? 'orders' : ''}`}>
          {activeTab === 'profile' && (
            <>
              <h2>Welcome, {user?.username || 'User'}!</h2>
              {!isEditing ? (
                <>
                  <div className="details">
                    <p><strong>Username:</strong> {user?.username || 'N/A'}</p>
                    <p><strong>Profile:</strong> {user?.profile || 'N/A'}</p>
                    <p><strong>Gender:</strong> {user?.gender || 'N/A'}</p>
                    <p><strong>Date of Birth:</strong> {user?.dateOfBirth ? new Date(user.dateOfBirth).toDateString() : 'N/A'}</p>
                    <p><strong>Nationality:</strong> {user?.nationality || 'N/A'}</p>
                  </div>
                  <button className="btn btn-outline" onClick={handleEditClick}>Edit</button>
                </>
              ) : (
                <form onSubmit={handleSubmit} className="form">
                  <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="Username" />
                  <input type="text" name="profile" value={formData.profile} onChange={handleChange} placeholder="Profile" />
                  <input type="text" name="gender" value={formData.gender} onChange={handleChange} placeholder="Gender" />
                  <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} />
                  <input type="text" name="nationality" value={formData.nationality} onChange={handleChange} placeholder="Nationality" />
                  <button className="btn btn-primary" type="submit" disabled={isSaving}>{isSaving ? 'Saving...' : 'Save Changes'}</button>
                </form>
              )}
            </>
          )}

{activeTab === 'orders' && (
  <div className="order-history">
    <h3>Order History</h3>
    {orders.length === 0 ? (
      <p className="no-orders">No orders yet.</p>
    ) : (
      <div className="order-table-wrapper">
        <table className="order-table">
          <thead>
            <tr>
              <th>Order #</th>
              <th>Date</th>
              <th>Total (Rs.)</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{`#${String(order._id || '').slice(-8)}`}</td>
                <td>{order.createdAt ? new Date(order.createdAt).toLocaleString() : '-'}</td>
                <td>{order.total}</td>
                <td>{order.status || 'Confirmed'}</td>
                <td>
                  <button onClick={() => downloadInvoice(order)}>Download Invoice</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
)}

          <button className="btn btn-ghost back-btn" onClick={handleBackClick}>Back</button>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
};

export default UserProfile;
