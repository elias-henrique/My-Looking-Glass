from netmiko import ConnectHandler
import re


def get_bgp_neighbors(parametro):
    """Connects to a device and retrieves BGP table information."""
    net_connect = ConnectHandler(
        **{
            "device_type": "juniper_junos",
            "host": "12.0.1.28",
            "username": "rviews",
            "password": "rviews"
        }
    )
    output = net_connect.send_command(
        f"show route {parametro} protocol bgp table inet.0")
    net_connect.disconnect()

    return parse_bgp_output(output)


def parse_bgp_output(output):
    """Parses the BGP output and converts it to a JSON format."""
    bgp_data = {}

    prefix_match = re.search(
        r"\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\/\d{1,2}", output)
    if prefix_match:
        bgp_data['prefix'] = prefix_match.group(0)

    hours_match = re.findall(r"\[BGP\/170\] (.+?), localpref", output)
    as_path_match = re.findall(r"AS path: (.+?) I", output)
    from_match = re.findall(r"from (.+?)\n", output)

    x = [{"index": idx + 1, "hours": h, "as_path": p, "to": f}
         for idx, (h, p, f) in enumerate(zip(hours_match, as_path_match, from_match))]
    bgp_data['routes'] = x
    return bgp_data

# result = get_bgp_neighbors('45.190.200.51')
# # print(result)

# parsed_result = parse_bgp_output(result)
# print(parsed_result)
