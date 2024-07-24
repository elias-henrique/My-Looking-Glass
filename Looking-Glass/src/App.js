import React, { useState } from 'react';
import './App.css';
import Button from 'react-bootstrap/Button';
import logo from './logo.png';
import Selector from './Selector';

function App() {
  const [showSelector, setShowSelector] = useState(false);

  const toggleSelector = () => setShowSelector(!showSelector);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} alt="Logo" className="logo" />
        <div className="button-container">
          <Button className="button" onClick={toggleSelector}>São Paulo, IX <span className="circle">BR</span></Button>
          <Button className="button" onClick={toggleSelector}>New York, AT&T <span className="circle">US</span></Button>
        </div>
        {showSelector && <Selector />}
      </header>
    </div>
  );
}

export default App;
