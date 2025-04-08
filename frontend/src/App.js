import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import AddProduct from './components/AddProduct';
import ViewProducts from './components/ViewProducts'; // ✅
import AddSupplier from './components/AddSupplier';
import PurchaseOrder from './components/PurchaseOrder';
import PurchaseHistory from './components/PurchaseHistory';
import AddInventory from './components/AddInventory';
import InventoryHistory from './components/InventoryHistory';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add-product" element={<AddProduct />} />
        <Route path="/view-products" element={<ViewProducts />} /> {/* ✅ */}
        <Route path="/add-supplier" element={<AddSupplier />} />
        <Route path="/purchase-order" element={<PurchaseOrder />} />
        <Route path="/purchase-history" element={<PurchaseHistory />} />
        <Route path="/add-inventory" element={<AddInventory />} />
        <Route path="/inventory-history" element={<InventoryHistory />} />
      </Routes>
    </Router>
  );
}

export default App;
