import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function ItemDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();
    fetch('http://localhost:4001/api/items/' + id, { signal: controller.signal })
      .then(res => {
        if (res.status === 404) {
          navigate('/');
          return Promise.reject(new Error('Not found'));
        }
        if (!res.ok) return Promise.reject(new Error('Request failed'));
        return res.json();
      })
      .then(setItem)
      .catch(err => {
        if (err.name !== 'AbortError') setError('Failed to load item');
      });
    return () => controller.abort();
  }, [id, navigate]);

  if (!item && !error) return <p>Loading...</p>;
  if (error) return <p style={{ padding: 16 }}>{error}</p>;

  return (
    <div style={{padding: 16}}>
      <h2>{item.name}</h2>
      <p><strong>Category:</strong> {item.category}</p>
      <p><strong>Price:</strong> ${item.price}</p>
    </div>
  );
}

export default ItemDetail;