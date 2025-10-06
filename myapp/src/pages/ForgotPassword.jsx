import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');
    try {
      const res = await fetch('http://127.0.0.1:5000/api/auth/forgot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const raw = await res.text();
      let data = {};
      try { data = raw ? JSON.parse(raw) : {}; } catch {}
      if (!res.ok) throw new Error(data?.message || raw || 'Failed');
      setMessage('If your email exists, a reset link was generated. Token shown below for demo.');
      if (data?.token) {
        setMessage((m) => m + ` Token: ${data.token}`);
      }
    } catch (e) {
      setMessage(e.message || 'Request failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-stage">
      <div className="auth-card login-container">
        <h2>Forgot Password</h2>
        <form onSubmit={submit} className="login-form">
          <input
            type="email"
            placeholder="Your email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button type="submit" disabled={submitting}>{submitting ? 'Sending...' : 'Send reset link'}</button>
        </form>
        {message && <p style={{ marginTop: 12 }}>{message}</p>}
        <div style={{ marginTop: 8 }}>
          <Link to="/reset">Have a token? Reset password</Link>
        </div>
        <div style={{ marginTop: 8 }}>
          <Link to="/login">Back to login</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
