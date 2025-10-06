import React, { useEffect, useState, useContext, useRef } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/BookList.css';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';
import { CartContext } from '../contexts/Cartcontext';
import { FaShoppingCart } from 'react-icons/fa';
import { FaUser } from 'react-icons/fa'; // npm install react-icons
import { FaBell } from 'react-icons/fa';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [newBooksCount, setNewBooksCount] = useState(0);
  const navigate = useNavigate();

  const { cart, addToCart } = useContext(CartContext);
  const seenIdsRef = useRef(new Set());
  const pollRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      const storedBooks = JSON.parse(localStorage.getItem('books'));
      if (storedBooks) {
        // Deduplicate any previously cached data
        const map = new Map();
        for (const b of storedBooks) {
          if (!map.has(b.id)) map.set(b.id, b);
        }
        const uniqueStored = Array.from(map.values());
        setBooks(uniqueStored);
        setFiltered(uniqueStored);
        // initialize seen ids from cache
        try {
          const cachedSeen = JSON.parse(localStorage.getItem('seen_book_ids') || '[]');
          seenIdsRef.current = new Set(Array.isArray(cachedSeen) ? cachedSeen : []);
          // if none cached, set to current to avoid first-run spam
          if (seenIdsRef.current.size === 0) {
            const ids = uniqueStored.map(b => b.id);
            seenIdsRef.current = new Set(ids);
            localStorage.setItem('seen_book_ids', JSON.stringify(ids));
          }
        } catch {}
      }
      fetchBooks();
      // start polling for new books every 60s
      pollRef.current = setInterval(() => {
        fetchBooks(true);
      }, 60000);
    }
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [navigate]);

  const fetchBooks = async (isPoll = false) => {
    try {
      const categories = ['react', 'fiction', 'science', 'programming', 'history'];
      let booksData = [];
  
      const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
      for (let category of categories) {
        const url = `https://www.googleapis.com/books/v1/volumes?q=${category}`;
        const res = await axios.get(url, {
          params: apiKey ? { key: apiKey } : undefined,
          validateStatus: (s) => s >= 200 && s < 300, // throw manually on 401
        }).catch((e) => {
          // Re-throw axios error with status for handling below
          throw e;
        });
        
        // Check if the response has data
        if (!res.data || !res.data.items) {
          console.error('No items found in API response:', res);
          continue;
        }
  
        const items = res.data.items.map((book) => ({
          id: book.id,
          title: book.volumeInfo.title,
          author: book.volumeInfo.authors?.[0] || 'Unknown',
          price: Math.floor(Math.random() * 1000) + 100,
          stock: Math.floor(Math.random() * 10) + 1,
          description: book.volumeInfo.description || 'No description available.',
          thumbnail: book.volumeInfo.imageLinks?.thumbnail,
          category,
        }));
  
        booksData = [...booksData, ...items];
      }
  
      // Deduplicate by id to avoid duplicate React keys when the same volume appears in multiple categories
      const uniqueMap = new Map();
      for (const b of booksData) {
        if (!uniqueMap.has(b.id)) uniqueMap.set(b.id, b);
      }
      const uniqueBooks = Array.from(uniqueMap.values());

      setBooks(uniqueBooks);
      setFiltered(uniqueBooks);
      localStorage.setItem('books', JSON.stringify(uniqueBooks));

      // New books detection
      const incomingIds = uniqueBooks.map(b => b.id);
      const seenSet = seenIdsRef.current;
      const newIds = incomingIds.filter(id => !seenSet.has(id));
      if (newIds.length > 0) {
        setNewBooksCount(prev => prev + newIds.length);
        // merge into seen and persist
        newIds.forEach(id => seenSet.add(id));
        localStorage.setItem('seen_book_ids', JSON.stringify(Array.from(seenSet)));
        // Choose one representative new book for the notification entry
        const sample = uniqueBooks.find(b => b.id === newIds[0]) || uniqueBooks[0] || null;
        // Notify user and persist entry
        notifyNewBooks(newIds.length, sample);
      }
    } catch (err) {
      const status = err?.response?.status;
      if (status === 401) {
        console.error('Error fetching books: 401 Unauthorized. Provide VITE_GOOGLE_API_KEY in your .env and restart dev server.');
      } else {
        console.error('Error fetching books:', err);
      }
    }
  };

  const notifyNewBooks = (count, sampleBook = null) => {
    const title = `${count} new book${count > 1 ? 's' : ''} added`;
    // Always persist to notifications page
    try {
      const entry = { id: `new-${Date.now()}`, title, timestamp: Date.now(), book: sampleBook };
      const raw = localStorage.getItem('notifications') || '[]';
      const list = Array.isArray(JSON.parse(raw)) ? JSON.parse(raw) : [];
      const next = [entry, ...list].slice(0, 100); // keep latest 100
      localStorage.setItem('notifications', JSON.stringify(next));
    } catch {}
    // Fire system notification if permitted
    try {
      if ('Notification' in window) {
        if (Notification.permission === 'granted') {
          new Notification('K-Books', { body: title, icon: '/vite.svg' });
          return;
        }
        if (Notification.permission === 'default') {
          Notification.requestPermission().then((perm) => {
            if (perm === 'granted') new Notification('K-Books', { body: title, icon: '/vite.svg' });
          });
          return;
        }
      }
    } catch {}
    // Fallback: in-app banner will show
  };
  

  const handleSearch = (e) => {
    const keyword = e.target.value.toLowerCase();
    setSearch(keyword);
    filterBooks(keyword, selectedCategory);
  };

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);
    filterBooks(search, category);
  };

  const filterBooks = (searchKeyword, category) => {
    const filteredBooks = books.filter(
      (book) =>
        (book.title.toLowerCase().includes(searchKeyword) ||
          book.author.toLowerCase().includes(searchKeyword)) &&
        (category === '' || book.category === category)
    );
    setFiltered(filteredBooks);
  };

  const handleSort = () => {
    const sorted = [...filtered].sort((a, b) =>
      sortOrder === 'asc' ? a.price - b.price : b.price - a.price
    );
    setFiltered(sorted);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const groupByCategory = (books) => {
    return books.reduce((acc, book) => {
      if (!acc[book.category]) {
        acc[book.category] = [];
      }
      acc[book.category].push(book);
      return acc;
    }, {});
  };

  const categorizedBooks = groupByCategory(filtered);

  return (
    <div className="page-wrapper">
   <SiteHeader />


      <div className="booklist-container">
        {newBooksCount > 0 && (
          <div style={{
            position: 'sticky',
            top: 0,
            zIndex: 10,
            background: '#e6ffed',
            border: '1px solid #b7eb8f',
            color: '#135200',
            padding: '10px 12px',
            borderRadius: 8,
            marginBottom: 12,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span>{newBooksCount} new book{newBooksCount > 1 ? 's' : ''} available</span>
            <button onClick={() => setNewBooksCount(0)} style={{
              background: '#52c41a', color: 'white', border: 'none', borderRadius: 6, padding: '6px 10px', cursor: 'pointer'
            }}>Dismiss</button>
          </div>
        )}
        <div className="controls">
          <input
            type="text"
            placeholder="Search by title or author"
            value={search}
            onChange={handleSearch}
          />
          <select onChange={handleCategoryChange} value={selectedCategory}>
            <option value="">All Categories</option>
            <option value="react">React</option>
            <option value="fiction">Fiction</option>
            <option value="science">Science</option>
            <option value="programming">Programming</option>
            <option value="history">History</option>
          </select>
          <button className="btn btn-primary" onClick={handleSort}>
            Sort by Price ({sortOrder === 'asc' ? 'Low to High' : 'High to Low'})
          </button>
        </div>

        {Object.keys(categorizedBooks).map((category) => (
          <div key={category} className="category-section">
            <h2>{category.charAt(0).toUpperCase() + category.slice(1)} Books</h2>
            <div className="grid">
              {categorizedBooks[category].map((book) => (
                <div key={book.id} className="book-card">
                  <img src={book.thumbnail} alt={book.title} />
                  <h3>{book.title}</h3>
                  <p>{book.author}</p>
                  <p>Rs. {book.price}</p>
                  <Link to={`/books/${encodeURIComponent(book.id)}`} className="details-link">
                    View Description
                  </Link>
                  <button className="btn btn-primary add-to-cart-btn" onClick={() => addToCart(book)}>
                    <FaShoppingCart /> Add to Cart
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <SiteFooter />
    </div>
  );
};

export default BookList;
