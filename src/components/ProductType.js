import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const ProductType = () => {
  const [productTypes, setProductTypes] = useState([]);
  const [productType, setProductType] = useState('');
  const [editingProductType, setEditingProductType] = useState(null);

  useEffect(() => {
    fetchProductTypes();
  }, []);

  const fetchProductTypes = () => {
    axios.get('/api/product-types')
      .then(response => setProductTypes(response.data.data))
      .catch(error => toast.error(error));
  };

  const handleDelete = (productTypeId) => {
    axios.delete(`/api/product-types/${productTypeId}`)
      .then(() => {
        toast.success('Berhasil Menghapus Tipe Barang');
        fetchProductTypes();
      })
      .catch(error => toast.error(error));
  };

  const handleEdit = (productType) => {
    setEditingProductType(productType);
    setProductType(productType.type);
  };

  const handleCancelEdit = () => {
    setEditingProductType(null);
    setProductType('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!productType) {
      toast.error('Lengkapi Seluruh Data');
      return;
    }

    if (editingProductType) {
      // Update existing product type
      axios.put(`/api/product-types/${editingProductType.id}`, { type: productType })
        .then(response => {
          toast.success('Berhasil Mengubah Tipe Barang');
          setEditingProductType(null);
          fetchProductTypes();
        })
        .catch(error => toast.error(error));
    } else {
      // Create new product type
      axios.post('/api/product-types', { type: productType })
        .then(response => {
          toast.success('Berhasil Menambah Tipe Barang');
          fetchProductTypes();
        })
        .catch(error => toast.error(error));
    }

    setProductType('');
  };

  return (
    <div className="my-8">
      <h2 className="text-2xl font-bold mb-4">Data Tipe Barang</h2>
      <table className="min-w-full border border-gray-300 mb-4">
        <thead>
          <tr>
            <th className="border p-2">No</th>
            <th className="border p-2">Type</th>
            <th className="border p-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {productTypes.map((productType,index) => (
            <tr key={productType.id}>
              <td className="border p-2">{index+1}</td>
              <td className="border p-2">{productType.type}</td>
              <td className="border p-2">
                <button
                  onClick={() => handleEdit(productType)}
                  className="bg-blue-500 text-white p-1 px-2 rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(productType.id)}
                  className="bg-red-500 text-white p-1 px-2 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {!productTypes.length && 
            <tr>
              <td colSpan={5} className="border p-2 text-center">Data Kosong</td>
            </tr>
          }
        </tbody>
      </table>

      {/* Form for adding/editing */}
      <h2 className="text-2xl font-bold mb-4">{editingProductType ? 'Edit' : 'Tambah'} Tipe Barang</h2>
      <form onSubmit={handleSubmit}>
        <label className="block mb-2">
          Tipe Barang:
          <input
            type="text"
            value={productType}
            onChange={(e) => setProductType(e.target.value)}
            className="border p-2 w-full"
          />
        </label>
        <div className="flex space-x-4">
          <button
            type="submit"
            className={`${editingProductType ? "bg-blue-500" : "bg-green-500"} text-white p-2 rounded`}
          >
            {editingProductType ? 'Ubah' : 'Tambah'} Tipe Barang
          </button>
          {editingProductType && (
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

export default ProductType;
