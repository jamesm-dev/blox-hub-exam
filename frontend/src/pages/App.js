import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Items from './Items';
import ItemDetail from './ItemDetail';
import { DataProvider } from '../state/DataContext';

function App() {
  return (
    <DataProvider>
      <nav className="nav">
        <div className="container">
          <span className="title">Senior Assessment v2</span>
          <Link to="/">Items</Link>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<Items />} />
        <Route path="/items/:id" element={<ItemDetail />} />
      </Routes>
    </DataProvider>
  );
}

export default App;