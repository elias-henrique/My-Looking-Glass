from fastapi import APIRouter, HTTPException
from typing import Dict, Any
import subprocess
from bgphe import extract_whois_data

whois_router = APIRouter()

@whois_router.get("/")
def whois(address: str) -> Dict[str, Any]:
    """Fetch WHOIS information for a given address."""
    try:
        whois_output = subprocess.getoutput(f"whois {address}").replace("\n\n", "\n\\space\n")
        raw = [line.replace("\\space", " ") for line in whois_output.split("\n") if "%" not in line]

        if raw:
            del raw[0]

        return {"owner": extract_whois_data(whois_output), "raw": raw}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {e}")
