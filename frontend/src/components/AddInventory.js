import React, { useEffect, useState } from 'react';
import Layout from './Layout';

const AddInventory = () => {
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [form, setForm] = useState({ quantity: '', type: 'IN', reason: '' });
  const [message, setMessage] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('http://localhost:8080/api/products', {
          headers: { Authorization: 'Bearer ' + token }
        });
        const data = await res.json();
        if (res.ok) setProducts(data);
        else setMessage('Failed to load products.');
      } catch (err) {
        console.error(err);
        setMessage('Server error.');
      }
    };
    fetchProducts();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProductId) {
      return setMessage('Please select a product.');
    }

    const inventoryData = {
      productId: selectedProductId,
      quantity: parseInt(form.quantity),
      type: form.type,
      reason: form.reason
    };

    try {
      const res = await fetch('http://localhost:8080/api/inventory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token
        },
        body: JSON.stringify(inventoryData)
      });

      const data = await res.json();
      if (res.ok) {
        setMessage('Inventory updated successfully!');
        setForm({ quantity: '', type: 'IN', reason: '' });
        setSelectedProductId('');
      } else {
        setMessage(data.message || 'Failed to update inventory.');
      }
    } catch (err) {
      console.error(err);
      setMessage('Server error.');
    }
  };

  return (
    <Layout>
      <h2>Add Inventory</h2>
      {message && <p>{message}</p>}

      <h4>Select Product:</h4>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
        {products.map(product => (
          <button
            key={product._id}
            onClick={() => setSelectedProductId(product._id)}
            style={{
              backgroundColor: selectedProductId === product._id ? '#4CAF50' : '#ddd',
              padding: '10px',
              border: '1px solid #ccc',
              cursor: 'pointer'
            }}
          >
            {product.name}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        <input
          type="number"
          name="quantity"
          placeholder="Quantity"
          value={form.quantity}
          onChange={e => setForm({ ...form, quantity: e.target.value })}
          required
        /><br /><br />
        <select
          name="type"
          value={form.type}
          onChange={e => setForm({ ...form, type: e.target.value })}
        >
          <option value="IN">IN</option>
          <option value="OUT">OUT</option>
        </select><br /><br />
        <input
          type="text"
          name="reason"
          placeholder="Reason"
          value={form.reason}
          onChange={e => setForm({ ...form, reason: e.target.value })}
          required
        /><br /><br />
        <button type="submit">Submit</button>
      </form>
    </Layout>
  );
};

export default AddInventory;
