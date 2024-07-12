import React, { useState } from 'react';
import './App.css';
import Button from 'react-bootstrap/Button';
import logo from './logo.png';

function Selector() {
  return (
    <div className="container">
      <div className="row">
        <div className="description">
          <span className="text">Tipo de Consulta</span>
          <select className="option" value='' onChange=''>
            <option value="ping">Ping</option>
            <option value="as">AS</option>
            <option value="whois">Whois</option>
          </select>
        </div>
        <div className="description">
          <span className="text">Dados da Consulta</span>
          <input type="text" className="input" placeholder="IP Address, AS, Prefix" value='' onChange='' onKeyPress='' />
        </div>
      </div>
    </div>
  );
}

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
        {showSelector && <Selector />} {/* Passo 4 */}
      </header>
    </div>
  );
}

export default App;