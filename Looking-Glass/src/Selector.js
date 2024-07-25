import React, { useState } from 'react';
import './App.css';  // Use a separate CSS file for styling

function ASInfo({ asInfo }) {
    return (
        <div className="as-info-card">
            <h2 className="as-info-title">{asInfo.name}</h2>
            <div className="as-info-content">
                <p><strong>ASN:</strong> {asInfo.asn}</p>
                <p><strong>Descrição:</strong> {asInfo.description_short}</p>
                <p><strong>País:</strong> {asInfo.country_code}</p>
                <p><strong>Website:</strong> <a href={asInfo.website}>{asInfo.website}</a></p>
                <p><strong>Looking Glass:</strong> <a href={asInfo.looking_glass}>{asInfo.looking_glass}</a></p>
                <p><strong>Estimativa de Tráfego:</strong> {asInfo.traffic_estimation}</p>
                <p><strong>Relação de Tráfego:</strong> {asInfo.traffic_ratio}</p>
            </div>
        </div>
    );
}

function WhoisData({ whoisData, irrData }) {
    return (
        <div className="as-info-card">
            <h2 className="as-info-title">{whoisData.owner}</h2>
            <div className="as-info-section">
                <div className="as-info-content">
                    <p><strong>Net Range:</strong> {whoisData.NetRange}</p>
                    <p><strong>CIDR:</strong> {whoisData.inetnum}</p>
                    <p><strong>ASN:</strong> {whoisData['aut-num']}</p>
                    <p><strong>Address:</strong> {whoisData.Address}</p>
                    <p><strong>City:</strong> {whoisData.City} - <strong>{whoisData.Country}</strong></p>
                    <p><strong>CNPJ:</strong> {whoisData.ownerid}</p>
                    <p><strong>Responsible:</strong> {whoisData.person}</p>
                </div>
            </div>
            <div className="as-info-section">
                <div className="as-info-content">
                    {irrData.map((data, index) => (
                        <div key={index} className="irr-info-item">
                            <p><strong>Source:</strong> {data.source}</p>
                            <p><strong>Route:</strong> {data.route}</p>
                            <p><strong>Description:</strong> {data.descr}</p>
                            <p><strong>Origin:</strong> {data.origin}</p>
                            <p><strong>Member Of:</strong> {data['member-of']}</p>
                            <p><strong>Notify:</strong> {data.notify}</p>
                            <p><strong>Maintained By:</strong> {data['mnt-by']}</p>
                            <p><strong>Changed:</strong> {data.changed}</p>
                            <p><strong>Last Modified:</strong> {data['last-modified']}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function Selector() {
    const [selectedOption, setSelectedOption] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [result, setResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleChangeSelect = (event) => {
        setSelectedOption(event.target.value);
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
            {isLoading && <div className="loading">Carregando...</div>}
            {result && (
                <div className="card">
                    {selectedOption === 'as' && result && <ASInfo asInfo={result} />}
                    {selectedOption === 'whois' && result && <WhoisData whoisData={result.whois_data} irrData={result.irr_data} />}
                    {/* {result.error && <div className="error">{result.error}</div>} */}
                </div>
            )}
        </div>
    );
}

export default Selector;
