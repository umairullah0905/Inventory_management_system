import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from './Layout';

const Dashboard = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    fetch('http://localhost:8080/api/dashboard', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setDashboardData(data))
      .catch((err) => {
        console.error('Dashboard fetch error:', err);
        navigate('/login');
      });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  if (!dashboardData) return <p>Loading dashboard...</p>;

  return (
    <Layout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Dashboard</h2>
        <button onClick={handleLogout}>Logout</button>
      </div>

      <div style={{ marginTop: '20px' }}>
        <p><strong>Total Products:</strong> {dashboardData.totalProducts}</p>
        <p><strong>Total Suppliers:</strong> {dashboardData.totalSuppliers}</p>
        <p><strong>Total Purchases:</strong> {dashboardData.totalPurchases}</p>
      </div>

      <div style={{ marginTop: '30px' }}>
        <h4>Low Stock Alerts</h4>
        {dashboardData.lowStock.length === 0 ? (
          <p>No low stock items.</p>
        ) : (
          <ul>
            {dashboardData.lowStock.map((product) => (
              <li key={product._id}>
                {product.name} — {product.quantity} in stock (SKU: {product.sku})
              </li>
            ))}
          </ul>
        )}
      </div>

      <div style={{ marginTop: '30px' }}>
        <h4>Recent Inventory Activity</h4>
        {dashboardData.recentInventory.length === 0 ? (
          <p>No recent inventory activity.</p>
        ) : (
          <ul>
            {dashboardData.recentInventory.map((entry) => (
              <li key={entry._id}>
                <strong>{entry.productId?.name || 'Unknown'}</strong> — {entry.type} {entry.quantity}
                {entry.reason ? ` (${entry.reason})` : ''} on{' '}
                {new Date(entry.date).toLocaleString()}
              </li>
            ))}
          </ul>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
