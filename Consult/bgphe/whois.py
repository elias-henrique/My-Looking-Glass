import re


def extract_whois_data(text):
    # data = {}
    # patterns = {
    #     "CIDR_v4": r"inetnum:\s*(\d+\.\d+\.\d+\.\d+/\d+)",
    #     "CIDR_v6": r"inetnum:\s*([0-9a-fA-F:]+/\d+)",
    #     "Owner": r"owner:\s*(.+)",
    #     "Ownerid": r"ownerid:\s*(.+)",
    #     "OriginAS": r"aut-num:\s*(.+)",
    #     "Country": r"country:\s*(.+)",
    #     "Responsible": r"responsible:\s*(.+)",
    #     "inetrev:": r"inetrev:\s*(.+)",
    #     "nserver": r"nserver:\s*(.+)",
    #     "nsstat": r"nsstat:\s*(.+)",
    #     "nslastaa": r"nslastaa:\s*(.+)",
    #     "created": r"created:\s*(.+)",
    #     "changed": r"changed:\s*(.+)",
    #     "e-mail:": r"e-mail:\s*(.+)",
    # }

    # for key, pattern in patterns.items():
    #     match = re.search(pattern, text, re.MULTILINE)
    #     if match:
    #         data[key] = match.group(1).strip()

    match = re.search(r"owner:\s*(.+)", text, re.MULTILINE)
    if match:
        data = match.group(1).strip()
    else:
        data = "No data found"
        
    return data
