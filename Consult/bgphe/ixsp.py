import telnetlib
import time
from pprint import pprint
import re


def convert_to_bytes(command):
    """Converts a string command to bytes for Telnet."""
    return f"{command}\n".encode("utf-8")


def parse_bgp_output(output):
    """Parses the BGP output and returns a dictionary with essential information."""
    result = {}
    lines = output.splitlines()

    # Extract the prefix
    prefix_match = re.search(r"BGP routing table entry for (\S+)", lines[0])
    if prefix_match:
        result['prefix'] = prefix_match.group(1)

    # Extract the paths
    paths = []
    current_path = None
    for line in lines:
        line = line.strip()

        if line.startswith("Paths:"):
            current_path = None
        elif re.match(r"^\d+ +\d+.*", line):  # AS path
            if current_path:
                paths.append(current_path)
            as_path = re.findall(r"\d+", line)
            current_path = {
                'as_path': as_path,
                'next_hop': None,
                'origin': None,
                'communities': [],
                'last_update': None
            }
        elif "from" in line and current_path:
            next_hop_match = re.search(r"from (\S+)", line)
            if next_hop_match:
                current_path['next_hop'] = next_hop_match.group(1)
        elif "Origin" in line and current_path:
            origin_match = re.search(r"Origin (\S+)", line)
            if origin_match:
                current_path['origin'] = origin_match.group(1)
        elif "Community:" in line and current_path:
            communities = re.findall(r"(\d+:\d+)", line)
            current_path['communities'].extend(communities)
        elif "Last update:" in line and current_path:
            update_match = re.search(r"Last update: (.+)", line)
            if update_match:
                current_path['last_update'] = update_match.group(1)

    if current_path:
        paths.append(current_path)

    result['paths'] = paths
    return result


def ixsp_send_command(address):
    """Establishes a Telnet connection to the IXSP router, sends a command, and returns the output."""
    with telnetlib.Telnet("lg.sp.ptt.br") as telnet:
        telnet.read_until(b"lgpub-sp>", timeout=5)
        time.sleep(3)
        telnet.write(convert_to_bytes('show bgp ipv4 unicast ' + address))
        result = ""

        while True:
            index, match, output = telnet.expect(
                [b"--More--", b"lgpub-sp>"], timeout=5)
            output = output.decode("utf-8")
            output = re.sub(" +--More--| +\x08+ +\x08+", "\n", output)
            result += output
            if index in (1, -1):
                break
            telnet.write(b" ")
            time.sleep(1)
            result = result.replace("\r\n", "\n")

        parsed_result = parse_bgp_output(result)
        return parsed_result


# if __name__ == "__main__":
#     bgp_result = ixsp_send_command("45.190.200.51")
#     pprint(bgp_result, width=120)
