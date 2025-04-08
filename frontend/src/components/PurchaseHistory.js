import React, { useEffect, useState } from 'react';
import Layout from './Layout';

const PurchaseHistory = () => {
  const [purchases, setPurchases] = useState([]);
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [purchaseRes, productRes] = await Promise.all([
          fetch('http://localhost:8080/api/purchases', {
            headers: { Authorization: 'Bearer ' + token },
          }),
          fetch('http://localhost:8080/api/products', {
            headers: { Authorization: 'Bearer ' + token },
          }),
        ]);

        const purchaseData = await purchaseRes.json();
        const productData = await productRes.json();

        if (purchaseRes.ok && productRes.ok) {
          setPurchases(purchaseData);
          setProducts(productData);
        } else {
          setMessage('Failed to fetch data.');
        }
      } catch (err) {
        console.error(err);
        setMessage('Server error.');
      }
    };

    fetchData();
  }, [token]);

  const getProductName = (id) => {
    const product = products.find(p => p._id === id);
    return product ? product.name : 'Unknown Product';
  };

  return (
    <Layout>
      <h2>Purchase History</h2>
      {message && <p>{message}</p>}
      {purchases.length === 0 ? (
        <p>No purchases found.</p>
      ) : (
        <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              <th>Supplier</th>
              <th>Items</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {purchases.map((purchase) => (
              <tr key={purchase._id}>
                <td>
                  <strong>{purchase.supplierId?.name}</strong><br />
                  {purchase.supplierId?.email}<br />
                  {purchase.supplierId?.phone}<br />
                  {purchase.supplierId?.address}
                </td>
                <td>
                  <ul>
                    {purchase.items.map((item) => (
                      <li key={item._id}>
                        {getProductName(item.productId)} - {item.quantity}
                      </li>
                    ))}
                  </ul>
                </td>
                <td>{new Date(purchase.date).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Layout>
  );
};

export default PurchaseHistory;
