import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Notifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('notifications') || '[]';
      const list = JSON.parse(raw);
      setNotifications(Array.isArray(list) ? list : []);
    } catch {
      setNotifications([]);
    }
  }, []);

  const sorted = useMemo(() => {
    return [...notifications].sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
  }, [notifications]);

  const clearAll = () => {
    localStorage.removeItem('notifications');
    setNotifications([]);
  };

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ marginBottom: 16 }}>Notifications</h2>
      {sorted.length === 0 ? (
        <p>No notifications yet.</p>
      ) : (
        <>
          <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'space-between' }}>
            <div>{sorted.length} notification{sorted.length > 1 ? 's' : ''}</div>
            <button onClick={clearAll}>Clear all</button>
          </div>
          <div style={{
            border: '1px solid #eee', borderRadius: 12, overflow: 'hidden', maxHeight: '70vh', overflowY: 'auto'
          }}>
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
              <thead>
                <tr style={{ background: '#fafafa' }}>
                  <th style={{ textAlign: 'left', padding: '12px 10px' }}>Title</th>
                  <th style={{ textAlign: 'left', padding: '12px 10px' }}>Time</th>
                  <th style={{ textAlign: 'left', padding: '12px 10px' }}>Book</th>
                  <th style={{ padding: '12px 10px' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((n, idx) => (
                  <tr key={(n.id || '') + '-' + idx}>
                    <td style={{ padding: '10px' }}>{n.title || 'New books available'}</td>
                    <td style={{ padding: '10px' }}>{n.timestamp ? new Date(n.timestamp).toLocaleString() : '-'}</td>
                    <td style={{ padding: '10px' }}>
                      {n.book ? (
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                          {n.book.thumbnail ? <img src={n.book.thumbnail} alt="thumb" style={{ width: 32, height: 48, objectFit: 'cover', borderRadius: 4 }} /> : null}
                          <div>
                            <div style={{ fontWeight: 600 }}>{n.book.title}</div>
                            <div style={{ color: '#666' }}>{n.book.author}</div>
                          </div>
                        </div>
                      ) : (
                        <span>-</span>
                      )}
                    </td>
                    <td style={{ padding: '10px', textAlign: 'center' }}>
                      {n.book?.id ? (
                        <button onClick={() => navigate(`/books/${encodeURIComponent(n.book.id)}`)}>View</button>
                      ) : (
                        <button onClick={() => navigate('/booklist')}>Browse</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
      <div style={{ marginTop: 16 }}>
        <button onClick={() => navigate('/booklist')}>Back to Books</button>
      </div>
    </div>
  );
};

export default Notifications;




