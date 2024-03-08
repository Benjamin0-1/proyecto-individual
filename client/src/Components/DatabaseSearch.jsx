
import React from 'react';

const DatabaseSearchBar = ({ onDatabaseSearch, searchTerm, setSearchTerm }) => {
  const handleSearch = () => {
    onDatabaseSearch();
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Drives creados desde Form"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
    </div>
  );
};

export default DatabaseSearchBar;
