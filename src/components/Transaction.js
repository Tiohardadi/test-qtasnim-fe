import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const Transaction = () => {
  const [transactions, setTransactions] = useState([]);
  const [date, setDate] = useState('');
  const [quantity, setQuantity] = useState('');
  const [productId, setProductId] = useState('');
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchTransactions();
    fetchProducts(); // Fetch products for the dropdown
  }, []);

  const fetchTransactions = () => {
    axios.get('/api/transactions')
      .then(response => setTransactions(response.data.data))
      .catch(error => toast.error(error));
  };

  const fetchProducts = () => {
    axios.get('/api/products') // Adjust the endpoint based on your API
      .then(response => setProducts(response.data.data))
      .catch(error => toast.error(error));
  };

  const handleDelete = (transactionId) => {
    axios.delete(`/api/transactions/${transactionId}`)
      .then(() => {
        toast.success('Berhasil Menghapus Transaksi');
        fetchTransactions();
      })
      .catch(error => toast.error(error));
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setDate(transaction.date);
    setQuantity(transaction.quantitySold);
    setProductId(transaction.productId);
  };

  const handleCancelEdit = () => {
    setEditingTransaction(null);
    setDate('');
    setQuantity('');
    setProductId('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!date || !quantity || !productId) {
      toast.error('Lengkapi Seluruh Data');
      return;
    }

    const transactionData = {
      transactionDate: new Date(date),
      quantitySold: quantity,
      productId,
    };

    if (editingTransaction) {
      // Update existing transaction
      axios.put(`/api/transactions/${editingTransaction.id}`, transactionData)
        .then(response => {
          toast.success('Berhasil Mengubah Transaksi');
          setEditingTransaction(null);
          fetchTransactions();
        })
        .catch(error => toast.error(error));
    } else {
      // Create new transaction
      axios.post('/api/transactions', transactionData)
        .then(response => {
          toast.success('Berhasil Menambah Transaksi');
          fetchTransactions();
        })
        .catch(error => toast.error(error));
    }

    setDate('');
    setQuantity('');
    setProductId('');
  };

  return (
    <div className="my-8">
      <h2 className="text-2xl font-bold mb-4">Data Transaksi</h2>
      <table className="min-w-full border border-gray-300 mb-4">
        <thead>
          <tr>
            <th className="border p-2">No</th>
            <th className="border p-2">Nama Barang</th>
            <th className="border p-2">Stok</th>
            <th className="border p-2">Jumlah Terjual</th>
            <th className="border p-2">Tanggal Transaksi</th>
            <th className="border p-2">Jenis Barang</th>
            <th className="border p-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction,index) => (
            <tr key={transaction.id}>
              <td className="border p-2">{index+1}</td>
              <td className="border p-2">{transaction.Product?.name}</td>
              <td className="border p-2">{transaction.Product?.stock}</td>
              <td className="border p-2">{transaction.quantitySold}</td>
              <td className="border p-2">{transaction.transactionDate.substring(0, 10)}</td>
              <td className="border p-2">{transaction.Product?.ProductType?.type}</td>
              <td className="border p-2">
                <button
                  onClick={() => handleEdit(transaction)}
                  className="bg-blue-500 text-white p-1 px-2 rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(transaction.id)}
                  className="bg-red-500 text-white p-1 px-2 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {!transactions.length && 
            <tr>
              <td colSpan={5} className="border p-2 text-center">Data Kosong</td>
            </tr>
          }
        </tbody>
      </table>

      {/* Form for adding/editing */}
      <h2 className="text-2xl font-bold mb-4">{editingTransaction ? 'Edit' : 'Tambah'} Transaksi</h2>
      <form onSubmit={handleSubmit}>
        <label className="block mb-2">
          Nama Barang:
          <select
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            className="border p-2 w-full"
          >
            <option value="" disabled>Pilih Barang</option>
            {products.map(product => (
              <option key={product.id} value={product.id}>{product.name}</option>
            ))}
          </select>
        </label>
        <label className="block mb-2">
          Jumlah Terjual:
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="border p-2 w-full"
          />
        </label>
        <label className="block mb-2">
          Tanggal Transaksi:
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border p-2 w-full"
          />
        </label>
        <div className="flex space-x-4">
          <button
            type="submit"
            className={`${editingTransaction ? "bg-blue-500" : "bg-green-500"} text-white p-2 rounded`}
          >
            {editingTransaction ? 'Ubah' : 'Tambah'} Transaksi
          </button>
          {editingTransaction && (
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

export default Transaction;
