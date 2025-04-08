import React, { useEffect, useState } from 'react';
import Layout from './Layout';

const InventoryHistory = () => {
  const [inventoryLogs, setInventoryLogs] = useState([]);
  const [summary, setSummary] = useState(null);
  const [message, setMessage] = useState('');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [removeQuantity, setRemoveQuantity] = useState('');
  const [removeReason, setRemoveReason] = useState('');
  const [uniqueProducts, setUniqueProducts] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchInventoryData();
    fetchSummary();
  }, []);

  const fetchInventoryData = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/inventory', {
        headers: { Authorization: 'Bearer ' + token }
      });
      const data = await res.json();
      if (res.ok) {
        setInventoryLogs(data);
        extractUniqueProducts(data);
      } else {
        setMessage('Failed to fetch inventory data.');
      }
    } catch (err) {
      console.error(err);
      setMessage('Server error.');
    }
  };

  const extractUniqueProducts = (logs) => {
    const uniqueMap = new Map();
    logs.forEach(log => {
      if (log.productId && !uniqueMap.has(log.productId._id)) {
        uniqueMap.set(log.productId._id, log.productId);
      }
    });
    setUniqueProducts(Array.from(uniqueMap.values()));
  };

  const fetchSummary = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/inventory/summary', {
        headers: { Authorization: 'Bearer ' + token }
      });
      const data = await res.json();
      if (res.ok) {
        setSummary(data);
      }
    } catch (err) {
      console.error('Error fetching summary:', err);
    }
  };

  const handleRemove = async () => {
    if (!selectedProductId || !removeQuantity || !removeReason) {
      alert('Please select product, enter quantity, and provide reason.');
      return;
    }

    try {
      const res = await fetch('http://localhost:8080/api/inventory/remove', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token
        },
        body: JSON.stringify({
          productId: selectedProductId,
          quantity: parseInt(removeQuantity),
          reason: removeReason
        })
      });

      const data = await res.json();
      if (res.ok) {
        alert('Item removed from inventory.');
        fetchInventoryData();
        fetchSummary();
        setSelectedProductId('');
        setRemoveQuantity('');
        setRemoveReason('');
      } else {
        alert(data.message || 'Failed to remove item.');
      }
    } catch (err) {
      console.error(err);
      alert('Server error.');
    }
  };

  return (
    <Layout>
      <h2>Inventory Operation History</h2>
      {message && <p>{message}</p>}

      {summary && (
        <div style={{ marginBottom: '20px' }}>
          <strong>Total Quantity:</strong> {summary.totalQuantity} <br />
          <strong>Total Inventory Value:</strong> ₹{summary.totalValue}
        </div>
      )}

      <div style={{ marginBottom: '20px' }}>
        <label>
          <strong>Select Product:</strong>{' '}
          <select
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
          >
            <option value="">-- Choose a product --</option>
            {uniqueProducts.map((product) => (
              <option key={product._id} value={product._id}>
                {product.name} ({product.sku})
              </option>
            ))}
          </select>
        </label>{' '}
        <label>
          <strong>Quantity:</strong>{' '}
          <input
            type="number"
            min="1"
            value={removeQuantity}
            onChange={(e) => setRemoveQuantity(e.target.value)}
            style={{ width: '80px' }}
          />
        </label>{' '}
        <label>
          <strong>Reason:</strong>{' '}
          <input
            type="text"
            value={removeReason}
            onChange={(e) => setRemoveReason(e.target.value)}
            placeholder="e.g. Damaged"
            style={{ width: '200px' }}
          />
        </label>{' '}
        <button
          onClick={handleRemove}
          disabled={!selectedProductId || !removeQuantity || !removeReason}
        >
          Remove from Inventory
        </button>
      </div>

      {inventoryLogs.length === 0 ? (
        <p>No inventory operations found.</p>
      ) : (
        <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              <th>Product</th>
              <th>SKU</th>
              <th>Category</th>
              <th>Quantity</th>
              <th>Type</th>
              <th>Reason</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {inventoryLogs.map((log) => (
              <tr key={log._id}>
                <td>{log.productId?.name || 'Unknown'}</td>
                <td>{log.productId?.sku}</td>
                <td>{log.productId?.category}</td>
                <td>{log.quantity}</td>
                <td>{log.type}</td>
                <td>{log.reason}</td>
                <td>{new Date(log.date).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Layout>
  );
};

export default InventoryHistory;
