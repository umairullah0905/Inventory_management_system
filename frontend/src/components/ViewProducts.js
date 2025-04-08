import React, { useEffect, useState } from 'react';
import Layout from './Layout';

const ViewProducts = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');

    fetch('http://localhost:8080/api/products', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          console.error('Unexpected response:', data);
        }
      })
      .catch((err) => console.error('Failed to fetch products:', err));
  }, []);

  return (
    <Layout>
      <h2>All Products</h2>
      <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>SKU</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan="5">No products found.</td>
            </tr>
          ) : (
            products.map((product) => (
              <tr key={product._id}>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>{product.quantity}</td>
                <td>₹{product.price}</td>
                <td>{product.sku}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </Layout>
  );
};

export default ViewProducts;
