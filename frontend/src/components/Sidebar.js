import React from 'react';
import { Link, NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div style={{
      width: '200px',
      height: '100vh',
      backgroundColor: '#f0f0f0',
      padding: '1rem',
      position: 'fixed'
    }}>
      <h3>Menu</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/add-product">Add Product</Link></li>
        <li><Link to="/add-supplier">Add Supplier</Link></li>
        <li><Link to="/view-products">View Products</Link></li> {/* ✅ NEW */}
        <li><Link to="/purchase-history">Purchase History</Link></li>
        <li><Link to="/add-inventory">Add Inventory</Link></li>
        <li><Link to="/inventory-history">Inventory History</Link></li>

        <NavLink to="/purchase-order">Create Purchase Order</NavLink>
      </ul>
    </div>
  );
};

export default Sidebar;
