import React, { useEffect, useState } from 'react';
import Layout from './Layout';

const PurchaseOrder = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [orderItems, setOrderItems] = useState([]);
  const [message, setMessage] = useState('');

  const token = localStorage.getItem('token');

  const fetchSuppliersAndProducts = async () => {
    try {
      const supplierRes = await fetch('http://localhost:8080/api/suppliers', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const productRes = await fetch('http://localhost:8080/api/products', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const supplierData = await supplierRes.json();
      const productData = await productRes.json();

      setSuppliers(supplierData);
      setProducts(productData);
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  const handleAddItem = () => {
    setOrderItems([...orderItems, { productId: '', quantity: '' }]);
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...orderItems];
    updatedItems[index][field] = value;
    setOrderItems(updatedItems);
  };

  const handleRemoveItem = (index) => {
    const updatedItems = orderItems.filter((_, i) => i !== index);
    setOrderItems(updatedItems);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSupplier || orderItems.length === 0) {
      setMessage('Please select supplier and add at least one item.');
      return;
    }

    try {
      const res = await fetch('http://localhost:8080/api/purchases', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          supplierId: selectedSupplier,
          items: orderItems.map(item => ({
            productId: item.productId,
            quantity: Number(item.quantity)
          })),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage('Purchase order created successfully!');
        setSelectedSupplier('');
        setOrderItems([]);
      } else {
        setMessage(data.message || 'Failed to create purchase order.');
      }
    } catch (err) {
      console.error('Submit error:', err);
      setMessage('Server error.');
    }
  };

  useEffect(() => {
    fetchSuppliersAndProducts();
  }, []);

  return (
    <Layout>
      <h2>Create Purchase Order</h2>
      {message && <p>{message}</p>}

      <form onSubmit={handleSubmit}>
        <label>Select Supplier:</label><br />
        <select value={selectedSupplier} onChange={(e) => setSelectedSupplier(e.target.value)} required>
          <option value="">-- Choose Supplier --</option>
          {suppliers.map((s) => (
            <option key={s._id} value={s._id}>{s.name}</option>
          ))}
        </select>

        <br /><br />
        <h4>Order Items</h4>
        {orderItems.map((item, index) => (
          <div key={index} style={{ marginBottom: '1rem' }}>
            <select
              value={item.productId}
              onChange={(e) => handleItemChange(index, 'productId', e.target.value)}
              required
            >
              <option value="">-- Choose Product --</option>
              {products.map((p) => (
                <option key={p._id} value={p._id}>{p.name}</option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Quantity"
              value={item.quantity}
              onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
              required
              style={{ marginLeft: '1rem', width: '100px' }}
            />

            <button type="button" onClick={() => handleRemoveItem(index)} style={{ marginLeft: '1rem' }}>
              Remove
            </button>
          </div>
        ))}

        <button type="button" onClick={handleAddItem}>Add Item</button><br /><br />
        <button type="submit">Create Purchase Order</button>
      </form>
    </Layout>
  );
};

export default PurchaseOrder;
