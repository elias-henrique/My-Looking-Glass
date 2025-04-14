from fastapi import APIRouter, HTTPException
from typing import Dict, Any
import requests

ip_router = APIRouter()

@ip_router.get("/")
def meu_ip() -> Dict[str, Any]:
    """Fetch the public IPv4 and IPv6 addresses."""
    try:
        ipv4 = requests.get('https://ipv4.json.myip.wtf/').json()
    except:
        ipv4 = {}

    try:
        ipv6 = requests.get('https://ipv6.json.myip.wtf/').json()
    except:
        ipv6 = {}

    return {"info": {"ipv4": ipv4, "ipv6": ipv6}}
