import React from 'react';
//import PropTypes from 'prop-types';
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