import telnetlib
import time
import re
import json


def convert_to_bytes(command: str) -> bytes:
    """Converts a string command to bytes for Telnet."""
    return f"{command}\n".encode("utf-8")


def ixsp_send_command(address: str) -> dict:
    """Sends a 'show ip bgp' command to the IXSP router and returns the output as JSON."""
    return _ixsp_send_generic_command(f"show ip bgp {address} json")


def ixsp_send_community_command(community: str) -> dict:
    """Sends a 'show bgp community' command to the IXSP router and returns the output as JSON."""
    return _ixsp_send_generic_command(f"show bgp community {community} json")


def _ixsp_send_generic_command(command: str) -> dict:
    """Helper function to send a generic command to the IXSP router and parse the JSON response."""
    with telnetlib.Telnet("lg.sp.ptt.br") as telnet:
        telnet.read_until(b"lgpub-sp>", timeout=5)
        time.sleep(3)
        telnet.write(convert_to_bytes(command))
        result = telnet.read_until(b"lgpub-sp>", timeout=5).decode("utf-8")

        # Extract JSON part from the response
        json_match = re.search(r"{.*}", result, re.DOTALL)
        if json_match:
            json_data = json_match.group(0)
            try:
                return json.loads(json_data)
            except json.JSONDecodeError:
                raise ValueError("Failed to parse JSON from the response.")
        else:
            raise ValueError("No JSON data found in the response.")
