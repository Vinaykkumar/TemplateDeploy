// DatabaseSelector.js
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import './css/DatabaseSelector.css';

const DatabaseSelector = () => {
  const [selectedDatabase, setSelectedDatabase] = useState(null);
  const history = useHistory();

  const databases = [
    { id: 1, name: 'RDS - MySQL' },
    { id: 2, name: 'RDS - PostgreSQL' },
    { id: 3, name: 'RDS - SQL Server' },
    { id: 4, name: 'Amazon Aurora' },
    { id: 5, name: 'Oracle Database' },
    { id: 6, name: 'Amazon DynamoDB - NoSQL' },
    { id: 7, name: 'MongoDB' },
  ];

  const handleDatabaseChange = (e) => {
    setSelectedDatabase(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedDatabase) {
      // You can add logic here to save the selected database if needed
      history.push('/deployment');
    }
  };

  return (
    <div className="database-selector-container">
      <h1>Choose a Database</h1>
      <form onSubmit={handleSubmit}>
        <select value={selectedDatabase} onChange={handleDatabaseChange}>
          <option value="">Select a database</option>
          {databases.map((database) => (
            <option key={database.id} value={database.id}>{database.name}</option>
          ))}
        </select>
        <button type="submit">Next</button>
      </form>
    </div>
  );
};

export default DatabaseSelector;