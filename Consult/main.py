from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, HTTPException, Request
from typing import Dict, Any
import subprocess
import requests

from bgphe import (
    extract_info,
    extract_whois_data,
    ixsp_send_command,
    get_bgp_neighbors
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


@app.get('/')
def meu_ip() -> Dict[str, Any]:
    try:
        try:
            ipv4 = requests.get('https://ipv4.json.myip.wtf/').json()
        except:
            ipv4 = {}

        try:
            ipv6 = requests.get('https://ipv6.json.myip.wtf/').json()
        except:
            ipv6 = {}

        return {'info': {'ipv4': ipv4, 'ipv6': ipv6}}
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Internal server error: {e}")


@app.get('/whois')
def whois(address: str = None) -> Dict[str, Any]:
    try:
        whois = subprocess.getoutput(
            f'whois {address}').replace('\n\n', '\n\\space\n')
        raw = [i.replace('\\space', ' ')
               for i in whois.split('\n') if not '%' in i]

        if raw:
            del raw[0]

        return {'owner': extract_whois_data(whois), 'raw': raw}
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Internal server error: {e}")


@app.get('/ping')
def ping(data: str) -> Dict[str, Any]:
    try:
        types,  address = data.split()
        result = subprocess.getoutput(
            f'ping -c 5 -{types} {address}').replace('\n\n', '\n\\space\n')

        raw = [i.replace('\\space', ' ') for i in result.split('\n')]

        return {'result': raw}
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


@app.get('/atet')
def atet(parametro: str) -> Dict[str, Any]:
    try:
        parsed_result = get_bgp_neighbors(parametro)
        return {'atet': parsed_result}
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Internal server error: {e}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
