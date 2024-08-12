from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, HTTPException
from typing import Dict, Any
import subprocess
import requests

from bgphe import (
    extract_info,
    extract_whois_data,
    ixsp_send_command
)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_URL = 'https://bgp.he.net/'


def fetch_data_he(address: str = '') -> str:
    """Faz a requisição HTTP e retorna o texto HTML."""
    if address:
        if '/' in address:
            url = f'{BASE_URL}net/{address}'
        else:
            url = f'{BASE_URL}ip/{address}'
    else:
        url = BASE_URL

    try:
        response = requests.get(url)
        response.raise_for_status()
    except requests.RequestException as e:
        raise HTTPException(
            status_code=400, detail=f"Error fetching data from {url}: {e}")

    return response.text


@app.get('/whois')
def whois(address: str = None) -> Dict[str, Any]:
    try:
        whois = subprocess.getoutput(f'whois {address}')
        return extract_whois_data(whois)
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Internal server error: {e}")


@app.get('/')
def meu_ip() -> Dict[str, Any]:
    try:
        html_content = fetch_data_he()
        info = extract_info(html_content)

        return {'info': info}
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Internal server error: {e}")


@app.get('/ping')
def ping(data: str) -> Dict[str, Any]:
    try:
        types,  address = data.split()
        result = subprocess.getoutput(f'ping -c 5 -{types} {address}')

        ping_result = result.split('\n')
        return {'result': ping_result}
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Internal server error: {e}")


@app.get('/bgp')
def quagga(parametro: str) -> Dict[str, Any]:
    try:
        pass
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Internal server error: {e}")


@app.get('/ixsp')
def ixsp(parametro: str) -> Dict[str, Any]:
    try:
        ix = ixsp_send_command(parametro)
        return {'ix': ix}
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Internal server error: {e}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
