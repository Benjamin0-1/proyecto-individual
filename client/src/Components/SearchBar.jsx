
import React from 'react';
import { useState } from 'react';


function SearchBar({ onSearch, onToggleAlphabeticalOrder }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = () => {
    onSearch(searchTerm);
  };

  const handleToggleAlphabeticalOrderClick = () => {
    onToggleAlphabeticalOrder();
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search by name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
      <button onClick={handleToggleAlphabeticalOrderClick}>
        Activar orden alfabetico
      </button>
    </div>
  );
} 

export default SearchBar; 


/*
import React, { useState } from 'react';

const SearchBar = ({ onSearch, onToggleAlphabeticalOrder, onDatabaseSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = () => {
    onSearch(searchTerm);
  };

  const handleToggleOrder = () => {
    onToggleAlphabeticalOrder();
  };

  const handleDatabaseSearch = () => {
    onDatabaseSearch(searchTerm);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
      <button onClick={handleToggleOrder}>Toggle Order</button>
      <button onClick={handleDatabaseSearch}>Search Database</button>
    </div>
  );
};

export default SearchBar;

*/