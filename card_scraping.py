import requests
from bs4 import BeautifulSoup
import json
import re
import os
import sys

card_list_path = "./cards.json"
card_image_directory = "./website/public/cards/"

def simplify_name(name):
    return re.sub(r'[^a-z0-9]', '', name.lower()) + ".jpg"

def scrape_dominion_cards():
    url = "https://wiki.dominionstrategy.com/index.php/List_of_cards"
    headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}
    
    response = requests.get(url, headers=headers)
    if response.status_code != 200:
        print(f"Failed to retrieve page: {response.status_code}")
        return []
    
    soup = BeautifulSoup(response.text, "html.parser")
    
    # Finding the main content area where the cards are listed
    card_tables = soup.find_all("table", class_="wikitable")
    
    landscape_types = {"Event", "Landmark", "Project", "Way", "Trait", "Prophecy"}
    non_supply_types = {"State", "Hex", "Boon", "Artifact", "Shelter", "Ruins", "Heirloom", "Prize", "Zombie", "Spirit", "Castle", "Knight"}
    
    cards = []
    
    for table in card_tables:
        rows = table.find_all("tr")[1:]  # Skip header row
        for row in rows:
            cols = row.find_all("td")
            if cols:
                card_name = cols[0].get_text(strip=True)
                card_set = cols[1].get_text(strip=True) if len(cols) > 1 else "Unknown"
                
                # Extract card image URL
                card_image = None
                img_tag = cols[0].find("img")
                if img_tag and "src" in img_tag.attrs:
                    card_image = "https://wiki.dominionstrategy.com" + img_tag["src"]
                
                # Extract coin, debt, and potion costs from the 4th column
                cost = None
                debt_cost = 0.0
                potion_cost = 0.0
                if len(cols) > 3:
                    img_elements = cols[3].find_all("img")
                    for img in img_elements:
                        if "alt" in img.attrs:
                            alt_text = img["alt"].strip()
                            if "$" in alt_text:
                                try:
                                    cost = float(alt_text.replace("$", "").strip()) if cost is None else cost + float(alt_text.replace("$", "").strip())
                                except ValueError:
                                    pass
                            elif "D" in alt_text:
                                try:
                                    debt_cost += float(alt_text.replace("D", "").strip())
                                except ValueError:
                                    pass
                            elif "P" in alt_text:
                                potion_cost = 0.5  # Assign 0.5 if a potion icon is found
                
                total_cost = (cost if cost is not None else 0.0) + debt_cost + potion_cost
                total_cost = None if total_cost == 0.0 else total_cost
                
                card_type = cols[2].get_text(strip=True) if len(cols) > 2 else "Unknown"
                is_landscape = any(t in card_type for t in landscape_types)
                is_supply = not any(t in card_type for t in non_supply_types)
                types = card_type.split(", ") if card_type != "Unknown" else []
                
                card_data = {
                    "name": card_name,
                    "set": card_set,
                    "cost": total_cost,
                    "supply": is_supply,
                    "landscape": is_landscape,
                    "types": types,
                    "image_name": simplify_name(card_name),
                    "image_url": card_image
                }
                
                cards.append(card_data)
    
    return cards

def download_images(card_list):
    if not os.path.exists(card_image_directory):
        os.makedirs(card_image_directory)
    
    for card in card_list:
        if card["image_url"]:
            image_path = os.path.join(card_image_directory, card["image_name"])
            if not os.path.exists(image_path):
                if not card["landscape"]:
                    image_url = card["image_url"].replace("200px", "400px")
                    response = requests.get(image_url, stream=True)
                    if response.status_code != 200:
                        image_url = card["image_url"].replace("200px", "300px")
                        response = requests.get(image_url, stream=True)
                        if response.status_code != 200:
                            image_url = card["image_url"]
                            response = requests.get(image_url, stream=True)
                else:
                    image_url = card["image_url"]
                    response = requests.get(image_url, stream=True)
                
                if response.status_code == 200:
                    with open(image_path, "wb") as img_file:
                        for chunk in response.iter_content(1024):
                            img_file.write(chunk)
                    sys.stdout.write('.')
                    sys.stdout.flush()
                else:
                    print(f"Failed to download {card['name']} image.")
    print()

def save_card_list(card_list):
    # Remove image_url from the card list before saving
    for card in card_list:
        del card["image_url"]
    with open(card_list_path, "w", encoding="utf-8") as f:
        json.dump(card_list, f, indent=4)
    print(f"Card list saved to {card_list_path}")

def get_oddball_cards(card_list):
    result = [card for card in card_list if card["name"].lower() != "haremfarm"]
    knights = {
        "name": "Knights", 
        "set": "Dark Ages",
        "cost": 5.0,
        "supply": True,
        "landscape": False,
        "types": [
            "Action", "Attack", "Knight"
        ],
        "image_name": "knights.jpg",
        "image_url": "https://wiki.dominionstrategy.com/index.php/Knights#/media/File:Knights.jpg"
    }
    castles = {
        "name": "Castles", 
        "set": "Empires",
        "cost": 3.0,
        "supply": True,
        "landscape": False,
        "types": [
            "Castle", "Victory"
        ],
        "image_name": "castles.jpg",
        "image_url": "https://wiki.dominionstrategy.com/images/thumb/d/df/Castles.jpg/200px-Castles.jpg"
    }
    harem = {
        "name": "Harem", 
        "set": "Intrigue,1E",
        "cost": 6.0,
        "supply": True,
        "landscape": False,
        "types": [
            "Treasure", "Victory"
        ],
        "image_name": "harem.jpg",
        "image_url": "https://wiki.dominionstrategy.com/images/thumb/9/90/HaremOld.jpg/400px-HaremOld.jpg"
    }
    farm = {
        "name": "Farm", 
        "set": "Intrigue,2E",
        "cost": 6.0,
        "supply": True,
        "landscape": False,
        "types": [
            "Treasure", "Victory"
        ],
        "image_name": "farm.jpg",
        "image_url": "https://wiki.dominionstrategy.com/images/thumb/4/4c/FarmDigital.jpg/300px-FarmDigital.jpg"
    }
    result.extend([knights, castles, harem, farm])
    return result

if __name__ == "__main__":
    card_list = scrape_dominion_cards()
    card_list = get_oddball_cards(card_list)
    download_images(card_list)
    save_card_list(card_list)
