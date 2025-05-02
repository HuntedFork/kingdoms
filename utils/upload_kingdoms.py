import requests
import json

# Example array of dictionaries
kingdoms = [
{"name":"test2","description":"","supply":["Adventurer"],"landscapes":[],"shelters":False,"prosperity":False}
]

url = "https://dominionkingdoms.net/api/kingdoms/"
headers = {
    "Authorization": "TOKEN 15e4daf1bf7465f2c04bbc7b4cae7256fae09e35",
    "Content-Type": "application/json",
    "Origin": "https://dominionkingdoms.net",
    "Referer": "https://dominionkingdoms.net/create"
}

cookies = {
    "csrftoken": "nxrMIwj8QEClFXhhWaWpGe5k3uWV9mLI",
    "GAESA": "CooBMDBmZDdkNzMzN2FlYjUzMjQ5NWY2ZDU2MDE1YTg5OGFiNjU2MzE2Mzg3ZmQwMzFhNjBmOGJiNDJkMjJkYzE0ZDAxNmMxODIxYmUwNzVjODIzMDgxOWUxOWE2OTBmMmNjOWQ5Yjk1ZmU4Nzg4ZjkzZTQ5ZDkzY2UzOTNhOWMxN2RiNzczOGQ4ZDdhEOfur7DWMg",
    "messages": ".eJxtzDEKwzAMheGrCM0mhEL3Qm_QjiEYYytGrSVB5Ay5fQ0dunR7_Dy-ZcEYX24ahdxTJQxzuMwB76Yb75I6mwJJ4gZO2qEb7JRNhLRQuRUT1nF5s9axfVLqEwbENfyVrwGfR86jbEdrJzhXpQKskBweP_hrrB-MkjdW:1tpnCg:932HHWHm-aaTfO8ykikAfd_4DFvKyN98Nghu-0vrU8w",
    "sessionid": "kufshydcawgbfkfybofh06ni3ci8sxfr"
}

for kingdom in kingdoms:
    kingdoms = []
    with open('kingdoms.json') as file:
        kingdom_array = json.load(file)
    for x in kingdom_array:
        kingdom = {
            'name': x['title'],
            'description': x['description'],
            'supply': x['supply'],
            'landscapes': x['landscapes'],
            'prosperity': x['colonies'],
            'shelters': x['shelters']
        }
        response = requests.post(url, headers=headers, cookies=cookies, json=kingdom)
        if response.ok:
            print(f"Successfully posted kingdom: {kingdom['name']}")
        else:
            print(f"Error posting kingdom: {kingdom['name']} - {response.status_code}: {response.text}")
