import React, { useState, useEffect } from 'react';
import Layout from './Layout';

const AddSupplier = () => {
  const [supplier, setSupplier] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [suppliers, setSuppliers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token');

  const handleChange = (e) => {
    setSupplier((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editingId
      ? `http://localhost:8080/api/suppliers/${editingId}`
      : 'http://localhost:8080/api/suppliers';

    const method = editingId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(supplier)
      });

      const data = await res.json();
      if (res.ok) {
        setMessage(editingId ? 'Supplier updated!' : 'Supplier added!');
        setSupplier({ name: '', email: '', phone: '', address: '' });
        setEditingId(null);
        fetchSuppliers();
      } else {
        setMessage(data.message || 'Failed to save supplier');
      }
    } catch (err) {
      console.error(err);
      setMessage('Server error');
    }
  };

  const fetchSuppliers = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/suppliers', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (Array.isArray(data)) setSuppliers(data);
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  const handleEdit = (supplier) => {
    setSupplier({
      name: supplier.name,
      email: supplier.email,
      phone: supplier.phone,
      address: supplier.address
    });
    setEditingId(supplier._id);
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:8080/api/suppliers/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();
      if (res.ok) {
        setMessage('Supplier deleted');
        fetchSuppliers();
      } else {
        setMessage(data.message || 'Failed to delete supplier');
      }
    } catch (err) {
      console.error('Delete error:', err);
      setMessage('Server error');
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  return (
    <Layout>
      <h2>{editingId ? 'Edit Supplier' : 'Add New Supplier'}</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" value={supplier.name} onChange={handleChange} required /><br /><br />
        <input name="email" placeholder="Email" value={supplier.email} onChange={handleChange} /><br /><br />
        <input name="phone" placeholder="Phone" value={supplier.phone} onChange={handleChange} /><br /><br />
        <input name="address" placeholder="Address" value={supplier.address} onChange={handleChange} /><br /><br />
        <button type="submit">{editingId ? 'Update Supplier' : 'Add Supplier'}</button>
        {editingId && (
          <button type="button" onClick={() => {
            setEditingId(null);
            setSupplier({ name: '', email: '', phone: '', address: '' });
          }} style={{ marginLeft: '1rem' }}>
            Cancel
          </button>
        )}
      </form>

      <hr />
      <h3>All Suppliers</h3>
      <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th>Name</th><th>Email</th><th>Phone</th><th>Address</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {suppliers.length === 0 ? (
            <tr><td colSpan="5">No suppliers found.</td></tr>
          ) : (
            suppliers.map((sup) => (
              <tr key={sup._id}>
                <td>{sup.name}</td>
                <td>{sup.email}</td>
                <td>{sup.phone}</td>
                <td>{sup.address}</td>
                <td>
                  <button onClick={() => handleEdit(sup)}>Edit</button>
                  <button onClick={() => handleDelete(sup._id)} style={{ marginLeft: '1rem', color: 'red' }}>Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </Layout>
  );
};

export default AddSupplier;
