import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TransactionList = () => {
  const [transactions, setTransactions] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(`/api/transactions/sorted-sold${(startDate&&endDate)&&`?startDate=${startDate.substring(0, 10)}&endDate=${endDate.substring(0, 10)}`}`);
      setTransactions(response.data.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [startDate, endDate]);

  const handleResetSorting = () => {
    setStartDate('');
    setEndDate('');
  };

  return (
    <div className="my-8">
      <h2 className="text-2xl font-bold mb-4">Daftar Transaksi</h2>
      <div className="mb-4">
        <label className="block mb-2">
          Tanggal Awal:
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border p-2"
          />
        </label>
        <label className="block mb-2">
          Tanggal Akhir:
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border p-2"
          />
        </label>
        <button
          onClick={handleResetSorting}
          className="bg-gray-500 text-white p-2 rounded"
        >
          Reset Sorting
        </button>
      </div>
      <table className="min-w-full border border-gray-300 mb-4">
        {/* Table header */}
        <thead>
          <tr>
            <th className="border p-2">No</th>
            <th className="border p-2">Jenis Produk</th>
            <th className="border p-2">Total Transaksi</th>
            <th className="border p-2">Total Jumlah Terjual</th>
          </tr>
        </thead>
        {/* Table body */}
        <tbody>
          {transactions?.map((transaction, index) => (
            <tr key={transaction.id}>
              <td className="border p-2">{index + 1}</td>
              <td className="border p-2">{transaction.Product.ProductType.type}</td>
              <td className="border p-2">{transaction.totalQuantityTransaction}</td>
              <td className="border p-2">{transaction.totalQuantitySold}</td>
            </tr>
          ))}
          {!transactions?.length && 
            <tr>
              <td colSpan={5} className="border p-2 text-center">Data Kosong</td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  );
};

export default TransactionList;
