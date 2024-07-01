import React, { useState, useEffect } from 'react';
import MapComponent from './MapComponent';

interface AppProps {}

const App: React.FC<AppProps> = () => {
  const [message, setMessage] = useState<string>('');
  const [dbVersion, setDbVersion] = useState<string>('');

  useEffect(() => {
    fetch('/')
      .then(response => response.json())
      .then(data => setMessage(data.message))
      .catch(error => console.error('Error fetching message:', error));

    fetch('/db')
      .then(response => response.json())
      .then(data => setDbVersion(data.db_version))
      .catch(error => console.error('Error fetching database version:', error));
  }, []);

  return (
    <div>
      <h1>{message}</h1>
      <p>Database version: {dbVersion}</p>
      <MapComponent />
    </div>
  );
};

export default App;
