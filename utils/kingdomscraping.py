import requests
from bs4 import BeautifulSoup
import json

# I did some manual editing after running this. Its not plug and play. Be careful if you overwrite kingdoms.json!

def scrape_recommended_kingdoms(url):
    response = requests.get(url)
    response.raise_for_status()  # raise an error if the request failed
    soup = BeautifulSoup(response.content, 'html.parser')
    kingdoms = []
    
    # Find all wikitable elements (but not the 1e ones)
    tables = soup.find_all(
        lambda tag: tag.name == "table" 
        and "wikitable" in tag.get("class", []) 
        and not tag.find_parent(class_="mw-collapsible")
    )
    
    for table in tables:
        # Assume the first row contains headers
        header_row = table.find("th")
        if not header_row:
            continue

        title = header_row.get_text(strip=True).lower()
        title = title.replace('[images]', '')
        
        cards = []
        # Process all table rows (skip header row)
        visible_rows = table.find_all(lambda row: row.name == "tr" and "mw-collapsible" not in row.get("class", ""))
        for row in visible_rows[1:3]:
            for cell in row.find_all("th"):
                text = cell.get_text(strip=True)
                if len(text) > 0:
                    cards.append(text)
        
        landscapes = []
        useShelters = False
        useColonies = False
        if len(visible_rows) > 3:
            row = visible_rows[4]
            for cell in row.find_all("th"):
                text = cell.get_text(strip=True)
                if len(text) > 0:
                    if text == 'Shelters':
                        useShelters = True
                    elif text == 'Platinum' or text == 'Colony':
                        useColonies = True
                    elif text == 'Potion':
                        pass
                    else:
                        landscapes.append(text)

        kingdoms.append({
            'title': title, 
            'supply': cards, 
            'landscapes': landscapes, 
            'colonies': useColonies, 
            'shelters': useShelters,
            'description': ''})
            

    return kingdoms

if __name__ == "__main__":
    url = "https://wiki.dominionstrategy.com/index.php/Recommended_Kingdoms/Dominion"
    kingdoms = scrape_recommended_kingdoms(url)
    # Output the JSON in the requested format
    print(json.dumps(kingdoms, indent=2))
