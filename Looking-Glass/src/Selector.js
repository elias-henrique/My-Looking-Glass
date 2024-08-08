import React, { useState } from 'react';
import './App.css';

function ASInfo({ asInfo }) {
    return (
        <div className="as-info-card">
            <h2 className="as-info-title">{asInfo.Owner || "Not available"} - {asInfo.Country && asInfo.Country}</h2>
            <div className="as-info-content">
                {asInfo.Responsible && <p><strong>Responsible:</strong> {asInfo.Responsible}</p>}
                {asInfo.CIDR_v4 && <p><strong>Net Range (v4):</strong> {asInfo.CIDR_v4}</p>}
                {asInfo.CIDR_v6 && <p><strong>Net Range (v6):</strong> {asInfo.CIDR_v6}</p>}
                {asInfo.Ownerid && <p><strong>CNPJ:</strong> {asInfo.Ownerid}</p>}
                {asInfo['e-mail'] && <p><strong>Notify:</strong> {asInfo['e-mail']}</p>}
                {asInfo.OriginAS && <p><strong>OriginAS:</strong> {asInfo.OriginAS}</p>}
                {asInfo.changed && <p><strong>Changed:</strong> {asInfo.changed}</p>}
                {asInfo.created && <p><strong>Created:</strong> {asInfo.created}</p>}
            </div>
        </div>
    );
}


function PingData({ pingData }) {
    return (
        <div className="as-info-card">
            <div className="as-info-content">
                <h2 className="as-info-title">Ping</h2>
                {pingData.map((line, index) => (
                    <div key={index} className="ping-info-item">
                        <p>{line}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

function Selector() {
    const [selectedOption, setSelectedOption] = useState('ping', 'as', 'whois');
    const [inputValue, setInputValue] = useState('');
    const [result, setResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleChangeSelect = (event) => {
        setSelectedOption(event.target.value);
        setResult(null);
    };

    const handleChangeInput = (event) => {
        setInputValue(event.target.value);
    };

    const fetchData = async (url) => {
        setIsLoading(true);
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
            setResult(data);
        } catch (error) {
            console.error('Failed to fetch data:', error);
            setResult({ error: 'Failed to fetch data' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setResult(null);
        console.log(selectedOption);
        if (selectedOption === 'whois') {
            await fetchData(`http://0.0.0.0:8000/whois?address=${inputValue}`);
        } else if (selectedOption === 'ping') {
            await fetchData(`http://0.0.0.0:8000/ping?data=${inputValue}`);
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
            {isLoading && <div className="loading">Carregando...</div>}
            {result && (
                <div className="card">
                    {selectedOption === 'whois' && result && <ASInfo asInfo={result} />}
                    {selectedOption === 'ping' && result && <PingData pingData={result.result} />}
                </div>
            )}
        </div>
    );
}

export default Selector;
