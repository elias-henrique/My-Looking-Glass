from fastapi import APIRouter, HTTPException
from typing import Dict, Any
import subprocess
from bgphe import ixsp_send_command, ixsp_send_community_command, get_bgp_neighbors

network_router = APIRouter()

@network_router.get("/ping")
def ping(data: str) -> Dict[str, Any]:
    """Ping a given IP or hostname."""
    try:
        result = subprocess.getoutput(f"ping -c 5 {data}")
        return {"result": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {e}")


@network_router.get("/traceroute")
def traceroute(data: str) -> Dict[str, Any]:
    """Perform a traceroute to a given IP or hostname."""
    try:
        result = subprocess.getoutput(f"traceroute {data}")
        return {"result": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {e}")


@network_router.get("/ixsp")
def ixsp(parameter: str) -> Dict[str, Any]:
    """Handle 'show ip bgp' command."""
    try:
        ix = ixsp_send_command(parameter)
        return {"ix": ix}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {e}")


@network_router.get("/ixsp/community")
def ixsp_community(parameter: str) -> Dict[str, Any]:
    """Handle 'show bgp community' command."""
    try:
        ix = ixsp_send_community_command(parameter)
        return {"ix": ix}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {e}")


@network_router.get("/atet")
def atet(parameter: str) -> Dict[str, Any]:
    """Fetch BGP neighbors."""
    try:
        parsed_result = get_bgp_neighbors(parameter)
        return {"atet": parsed_result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {e}")
