import requests
import os
from dotenv import load_dotenv
from datetime import datetime, timedelta

load_dotenv()

SERPER_API_KEY = os.getenv('SERPER_API_KEY')

def get_search_trends(days=1):
    end_date = datetime.now()
    start_date = end_date - timedelta(days=days)
    
    url = "https://google.serper.dev/search"
    
    payload = {
        "q": f"trending searches from:{start_date.strftime('%Y-%m-%d')} to:{end_date.strftime('%Y-%m-%d')}",
        "gl": "us",
        "hl": "en",
        "autocorrect": True
    }
    headers = {
        "X-API-KEY": SERPER_API_KEY,
        "Content-Type": "application/json"
    }
    
    response = requests.post(url, json=payload, headers=headers)
    
    if response.status_code == 200:
        data = response.json()
        # Extract relevant information from the response
        trends = []
        for item in data.get('organic', []):
            trends.append({
                'title': item.get('title'),
                'snippet': item.get('snippet'),
                'link': item.get('link')
            })
        return trends
    else:
        print(f"Error: {response.status_code}")
        return None

if __name__ == "__main__":
    trends = get_search_trends()
    if trends:
        for trend in trends:
            print(f"Title: {trend['title']}")
            print(f"Snippet: {trend['snippet']}")
            print(f"Link: {trend['link']}")
            print("---")
