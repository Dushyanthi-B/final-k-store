import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/BookDetails.css';

const BookDetails = () => {
  const { id: rawId } = useParams();
  const id = decodeURIComponent(rawId || "");
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        console.log('Fetching book details for ID:', id); // Log the ID
        // Try local cache first (from BookList)
        const cached = JSON.parse(localStorage.getItem('books') || '[]');
        const cachedBook = cached.find(b => b.id === id);
        if (cachedBook) {
          setBook(cachedBook);
          return;
        }

        const res = await axios.get(`https://www.googleapis.com/books/v1/volumes/${id}`);
        console.log('Book data:', res.data); // Log the fetched data
        const volumeInfo = res.data.volumeInfo;
        const bookDetails = {
          id: res.data.id,
          title: volumeInfo.title,
          author: volumeInfo.authors?.[0] || 'Unknown',
          description: volumeInfo.description || 'No description available.',
          price: Math.floor(Math.random() * 1000) + 100,
          stock: Math.floor(Math.random() * 10) + 1,
          thumbnail: volumeInfo.imageLinks?.thumbnail,
        };
        setBook(bookDetails);
      } catch (err) {
        console.error("Error fetching book details:", err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchBookDetails();
  }, [id]);
  

  if (loading) return <p>Loading...</p>;
  if (!book) return <p>Book not found.</p>;

  return (
    <div className="book-details-wrapper">
      <header className="details-header">
        <h1>📖 Book Details</h1>
        <button onClick={() => navigate('/booklist')} className="back-button">← Back</button>
      </header>

      <div className="details-card">
        <img src={book.thumbnail} alt={book.title} />
        <div className="details-info">
          <h2>{book.title}</h2>
          <p><strong>Author:</strong> {book.author}</p>
          <p><strong>Description:</strong> {book.description}</p>
          <p><strong>Price:</strong> Rs. {book.price}</p>
          <p><strong>Stock Availability:</strong> {book.stock} in stock</p>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
