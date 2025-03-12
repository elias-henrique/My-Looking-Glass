import React, { useState } from 'react';
import './App.css';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import logo from './logo.png';

function App() {
    const [showOption, setShowOption] = useState(false);
    const [selectedOption, setSelectedOption] = useState('ping');
    const [inputValue, setInputValue] = useState('');
    const [apiResult, setApiResult] = useState(null); // Estado para armazenar o resultado da API

    const toggleSelector = () => {
        setShowOption(!showOption);
    };

    const handleKeyPress = async (event) => {
        if (event.key === 'Enter') {
            const parameter = inputValue;
            const url = /api/asn / ${ parameter };

            try {
                const response = await fetch(url);
                const result = await response.json();
                setApiResult(result.data); // Atualiza o estado com o resultado da API
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
    };

    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} alt="Logo" className='logo' />
                <div className="button-container">
                    <Button className='button' onClick={toggleSelector} aria-label="Toggle São Paulo Selector">
                        São Paulo, IX
                        <span className='circle'>
                            BR
                        </span>
                    </Button>
                    <Button className='button' onClick={toggleSelector} aria-label="Toggle New York Selector">
                        New York, AT&T
                        <span className='circle'>
                            US
                        </span>
                    </Button>
                </div>

                {showOption && (
                    <>
                        <div className="container">
                            <div className="row">
                                <div className="description">
                                    <span className='text'>Tipo de Consulta</span>
                                    <select className='option' aria-label="Tipo de Consulta" value={selectedOption} onChange={(e) => setSelectedOption(e.target.value)}>
                                        <option value="ping">Ping</option>
                                        <option value="bgp">BGP</option>
                                        <option value="whois">Whois</option>
                                    </select>
                                </div>
                                <div className="description">
                                    <span className='text'>Dados da Consulta</span>
                                    <input
                                        type="text"
                                        className="input"
                                        placeholder="IP Address, AS, Prefix or Hostname"
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                    />
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {apiResult && selectedOption === "bgp" && (
                    <Card style={{ width: '18rem' }}>
                        <Card.Body>
                            <Card.Title>{apiResult.name} - {apiResult.asn}</Card.Title>
                            <Card.Subtitle className="mb-2 text-muted">{apiResult.country_code}</Card.Subtitle>
                            <Card.Text>
                                {apiResult.description_short}
                            </Card.Text>
                        </Card.Body>
                        <ListGroup variant="flush">
                            <ListGroup.Item>Website: <a href={apiResult.website} target="_blank" rel="noopener noreferrer">{apiResult.website}</a></ListGroup.Item>
                            <ListGroup.Item>Email Contacts: {apiResult.email_contacts.join(", ")}</ListGroup.Item>
                            <ListGroup.Item>Abuse Contacts: {apiResult.abuse_contacts.join(", ")}</ListGroup.Item>
                            <ListGroup.Item>Traffic Ratio: {apiResult.traffic_ratio}</ListGroup.Item>
                            <ListGroup.Item>Owner Address: {apiResult.owner_address.join(", ")}</ListGroup.Item>
                        </ListGroup>
                        <Card.Body>
                            <Card.Link href={apiResult.looking_glass} target="_blank">Looking Glass</Card.Link>
                        </Card.Body>
                        <Card.Footer>
                            <small className="text-muted">Last updated {apiResult.date_updated}</small>
                        </Card.Footer>
                    </Card>
                )}
            </header>
        </div>
    );
}

export default App;