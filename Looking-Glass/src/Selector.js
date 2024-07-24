import React, { useState } from 'react';
import './App.css';  // Use a separate CSS file for styling

function ASInfo({ asInfo }) {
    return (
        <div className="as-info">
            <h2>{asInfo.name}</h2>
            <p><strong>ASN:</strong> {asInfo.asn}</p>
            <p><strong>Descrição:</strong> {asInfo.description_short}</p>
            <p><strong>País:</strong> {asInfo.country_code}</p>
            <p><strong>Website:</strong> <a href={asInfo.website}>{asInfo.website}</a></p>
            <p><strong>Looking Glass:</strong> <a href={asInfo.looking_glass}>{asInfo.looking_glass}</a></p>
            <p><strong>Estimativa de Tráfego:</strong> {asInfo.traffic_estimation}</p>
            <p><strong>Relação de Tráfego:</strong> {asInfo.traffic_ratio}</p>
        </div>
    );
}

function Peers({ peers }) {
    return (
        <div className="peers">
            <h3>Peers</h3>
            <div>
                <h4>IPv4 Peers</h4>
                {peers.ipv4_peers.map((peer, index) => (
                    <p key={index}>{peer.name} (ASN: {peer.asn})</p>
                ))}
            </div>
            <div>
                <h4>IPv6 Peers</h4>
                {peers.ipv6_peers.map((peer, index) => (
                    <p key={index}>{peer.name} (ASN: {peer.asn})</p>
                ))}
            </div>
        </div>
    );
}

function Selector() {
    const [selectedOption, setSelectedOption] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [result, setResult] = useState(null);  // Novo estado para armazenar o resultado

    const handleChangeSelect = (event) => {
        setSelectedOption(event.target.value);
    };

    const handleChangeInput = (event) => {
        setInputValue(event.target.value);
    };

    const fetchData = async (url) => {
        try {
            const response = await fetch(url, {
                headers: {
                    'Accept': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            const data = await response.json();
            setResult(data);  // Armazenar o resultado no estado
        } catch (error) {
            console.error('Failed to fetch data:', error);
            setResult({ error: 'Failed to fetch data' });  // Armazenar mensagem de erro no estado
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setResult(null);  // Resetar o resultado antes da nova consulta
        if (selectedOption === 'as') {
            await fetchData(`http://0.0.0.0:8000/net?asn=${inputValue}`);
        } else if (selectedOption === 'whois') {
            await fetchData(`http://0.0.0.0:8000/net?address=${inputValue}`);
        }
    };

    return (
        <div className="selector-container">
            <form onSubmit={handleSubmit}>
                <div className="container">
                    <div className="row">
                        <div className="description">
                            <span className="text">Tipo de Consulta</span>
                            <select className="option" value={selectedOption} onChange={handleChangeSelect}>
                                <option value="ping">Ping</option>
                                <option value="as">AS</option>
                                <option value="whois">Whois</option>
                            </select>
                        </div>
                        <div className="description">
                            <span className="text">Dados da Consulta</span>
                            <input
                                type="text"
                                className="input"
                                placeholder="IP Address, AS, Prefix"
                                value={inputValue}
                                onChange={handleChangeInput}
                            />
                        </div>
                    </div>
                </div>
            </form>
            {result && (
                <div className="card">
                    {result.data.as && <ASInfo asInfo={result.data.as} />}
                    {result.data.peers && <Peers peers={result.data.peers} />}
                </div>
            )}
        </div>
    );
}

// No final do arquivo Selector.js
export default Selector;
