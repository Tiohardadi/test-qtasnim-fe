import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const Product = () => {
  const [products, setProducts] = useState([]);
  const [productName, setProductName] = useState('');
  const [stock, setStock] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [productTypes, setProductTypes] = useState([]);
  const [productTypeId, setProductTypeId] = useState('');

  useEffect(() => {
    fetchProducts();
    fetchProductTypes();
  }, []);

  const fetchProducts = () => {
    axios.get('/api/products')
      .then(response => setProducts(response.data.data))
      .catch(error => toast.error(error));
  };

  const fetchProductTypes = () => {
    axios.get('/api/product-types')
      .then(response => setProductTypes(response.data.data))
      .catch(error => toast.error(error));
  };

  const handleDelete = (productId) => {
    axios.delete(`/api/products/${productId}`)
      .then(() => {
        toast.success('Hapus Barang Berhasil');
        fetchProducts();
      })
      .catch(error => toast.error(error));
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setProductName(product.name);
    setStock(product.stock);
    setProductTypeId(product.productTypeId);
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
    setProductName('');
    setStock('');
    setProductTypeId('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!productName || !stock || !productTypeId) {
      toast.error('Lengkapi Seluruh Data');
      return;
    }

    const productData = {
      name: productName,
      stock,
      productTypeId,
    };

    if (editingProduct) {
      // Update existing product
      axios.put(`/api/products/${editingProduct.id}`, productData)
        .then(response => {
          toast.success('Ubah Barang Berhasil');
          setEditingProduct(null);
          fetchProducts();
        })
        .catch(error => toast.error(error));
    } else {
      // Create new product
      axios.post('/api/products', productData)
        .then(response => {
          toast.success('Tambah Barang Berhasil');
          fetchProducts();
        })
        .catch(error => toast.error(error));
    }
    setProductName('');
    setStock('');
    setProductTypeId('');
  };

  return (
    <div className="my-8">
      <h2 className="text-2xl font-bold mb-4">Data Barang</h2>
      <table className="min-w-full border border-gray-300 mb-4">
        <thead>
          <tr>
            <th className="border p-2">No</th>
            <th className="border p-2">Nama</th>
            <th className="border p-2">Stok</th>
            <th className="border p-2">Jenis Barang</th>
            <th className="border p-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={product.id}>
              <td className="border p-2">{index + 1}</td>
              <td className="border p-2">{product.name}</td>
              <td className="border p-2">{product.stock}</td>
              <td className="border p-2">{product.ProductType?.type}</td>
              <td className="border p-2">
                <button
                  onClick={() => handleEdit(product)}
                  className="bg-blue-500 text-white p-1 px-2 rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="bg-red-500 text-white p-1 px-2 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {!products.length && 
            <tr>
              <td colSpan={5} className="border p-2 text-center">Data Kosong</td>
            </tr>
          }
        </tbody>
      </table>

      {/* Form for adding/editing */}
      <h2 className="text-2xl font-bold mb-4">{editingProduct ? 'Edit' : 'Tambah'} Barang</h2>
      <form onSubmit={handleSubmit}>
        <label className="block mb-2">
          Nama Barang:
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            className="border p-2 w-full"
          />
        </label>
        <label className="block mb-2">
          Stok:
          <input
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className="border p-2 w-full"
          />
        </label>
        <label className="block mb-2">
          Tipe Barang:
          <select
            value={productTypeId}
            onChange={(e) => setProductTypeId(e.target.value)}
            className="border p-2 w-full"
          >
            <option value="" disabled>Pilih Tipe Barang</option>
            {productTypes.map(productType => (
              <option key={productType.id} value={productType.id}>{productType.type}</option>
            ))}
          </select>
        </label>
        <div className="flex space-x-4">
          <button
            type="submit"
            className={`${editingProduct ? "bg-blue-500" : "bg-green-500"}  text-white p-2 rounded`}
          >
            {editingProduct ? 'Ubah' : 'Tambah'} Product
          </button>
          {editingProduct && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="bg-gray-500 text-white p-2 rounded"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default Product;
