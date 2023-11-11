import React from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import Product from './components/Product';
import ProductType from './components/ProductType';
import Transaction from './components/Transaction';
import TransactionList from './components/TransactionList';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <Router>
      <Toaster/>
      <div className="container mx-auto my-8 px-96">
        <nav className="mb-8">
          <ul className="flex">
            <li className="mr-4">
              <Link to="/dashboard" className="text-blue-500 hover:underline">Dashboard</Link>
            </li>
            <li className="mr-4">
              <Link to="/products" className="text-blue-500 hover:underline">Barang</Link>
            </li>
            <li className="mr-4">
              <Link to="/product-types" className="text-blue-500 hover:underline">Tipe Barang</Link>
            </li>
            <li>
              <Link to="/transactions" className="text-blue-500 hover:underline">Transaksi</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/dashboard" element={<TransactionList />}/>
          <Route path="/products" element={<Product />}/>
          <Route path="/product-types" element={<ProductType />}/>
          <Route path="/transactions" element={<Transaction />}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
