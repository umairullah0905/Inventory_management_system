import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';

const AddProduct = () => {
  const [product, setProduct] = useState({
    name: '',
    category: '',
    price: '',
    sku: ''
  });

  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setProduct(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const res = await fetch('http://localhost:8080/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(product)
      });

      const data = await res.json();
      if (res.ok) {
        setMessage('Product added successfully!');
        setProduct({ name: '', category: '', price: '', sku: '' });
        setTimeout(() => navigate('/dashboard'), 1500);
      } else {
        setMessage(data.message || 'Failed to add product.');
      }
    } catch (err) {
      console.error(err);
      setMessage('Server error');
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ marginLeft: '220px', padding: '2rem', width: '100%' }}>
        <h2>Add New Product</h2>
        {message && <p>{message}</p>}
        <form onSubmit={handleSubmit}>
          <input name="name" placeholder="Product Name" value={product.name} onChange={handleChange} required /><br /><br />
          <input name="category" placeholder="Category" value={product.category} onChange={handleChange} required /><br /><br />
          <input name="price" type="number" placeholder="Price" value={product.price} onChange={handleChange} required /><br /><br />
          <input name="sku" placeholder="SKU" value={product.sku} onChange={handleChange} required /><br /><br />
          <button type="submit">Add Product</button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
