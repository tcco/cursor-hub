from googleapiclient.discovery import build
from youtube_transcript_api import YouTubeTranscriptApi, TranscriptsDisabled, NoTranscriptAvailable
import os
from dotenv import load_dotenv
import re
import requests
from dotenv import load_dotenv

load_dotenv()

GROQ_API_KEY = os.getenv('GROQ_API_KEY')
GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"

load_dotenv()

# Get your API key from https://console.developers.google.com
API_KEY = os.getenv('YOUTUBE_API_KEY')

youtube = build('youtube', 'v3', developerKey=API_KEY)

# Dictionary of stock symbols and their corresponding company names
STOCKS = {
    'AAPL': 'Apple',
    'GOOGL': 'Google',
    'MSFT': 'Microsoft',
    'AMZN': 'Amazon',
    'META': 'Meta',
    'TSLA': 'Tesla',
    'NVDA': 'NVIDIA',
    'JPM': 'JPMorgan Chase',
    'NFLX': 'Netflix',
    'DIS': 'Disney',
    "SOFI": "SoFi",
    "ZM": "Zoom",
    "EL": "Este Lauder",
    "NKE": "Nike",
    "ELF": "e.l.f. Beauty",
    "PYPL": "PayPal",
    "CAKE": "Cheesecake Factory",
    "PLTR": "Palantir",
    "MCD": "McDonald's",
    "V": "Visa",
    "MA": "Mastercard",
    "NTDOY": "Nintendo",
    "WMT": "Walmart",
    "HD": "Home Depot",
    "TGT": "Target",
    "LOW": "Lowe's",
    "FUBO": "Fubo",
    "FDX": "Fedex",
    "UPS": "UPS",
    
}

def get_channel_videos(channel_id, max_results=10, summarize=False):
    request = youtube.search().list(
        part="id,snippet",
        channelId=channel_id,
        type="video",
        order="date",
        maxResults=max_results
    )
    response = request.execute()

    videos = []
    for item in response['items']:
        video = {
            'id': item['id']['videoId'],
            'title': item['snippet']['title'],
            'description': item['snippet']['description'],
            'published_at': item['snippet']['publishedAt'],
            **get_video_transcript(item['id']['videoId'], summarize)
        }
        videos.append(video)

    return videos

def get_video_transcript(video_id, summarize=False):
    try:
        transcript = YouTubeTranscriptApi.get_transcript(video_id, languages=['en'])
        full_transcript = ' '.join([entry['text'] for entry in transcript])
        stock_mentions = identify_stocks(full_transcript)
        if summarize:
            summary = summarize_text(full_transcript)
        else:
            summary = None
        return {
            'transcript': full_transcript,
            'stock_mentions': stock_mentions,
            'summary': summary
        }
    except (TranscriptsDisabled, NoTranscriptAvailable):
        return {
            'transcript': "English transcript not available",
            'stock_mentions': [],
            'summary': "Summary not available due to missing transcript"
        }

def identify_stocks(text):
    stock_mentions = []
    for symbol, company in STOCKS.items():
        symbol_pattern = r'\b' + re.escape(symbol) + r'\b'
        company_pattern = r'\b' + re.escape(company) + r'\b'
        
        # Check for buy/sell mentions
        buy_pattern = r'\b(buy|buying|bought|purchase|purchasing|purchased)\b'
        sell_pattern = r'\b(sell|selling|sold|dump|dumping|dumped)\b'
        
        # Look for mentions within a 50-character window
        window = 50
        
        for match in re.finditer(symbol_pattern + '|' + company_pattern, text, re.IGNORECASE):
            start = max(0, match.start() - window)
            end = min(len(text), match.end() + window)
            context = text[start:end]
            
            if re.search(buy_pattern, context, re.IGNORECASE):
                action = 'buy'
            elif re.search(sell_pattern, context, re.IGNORECASE):
                action = 'sell'
            else:
                action = 'mention'
            
            stock_mentions.append({
                'symbol': symbol,
                'company': company,
                'action': action,
                'context': context
            })
    
    return stock_mentions


def summarize_text(text):

    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": "llama3-8b-8192",
        "messages": [
            {"role": "system", "content": "You are a helpful assistant that summarizes text."},
            {"role": "user", "content": f"Please summarize the following text:\n\n{text}"}
        ],
        "max_tokens": 500
    }

    response = requests.post(GROQ_API_URL, json=payload, headers=headers)

    if response.status_code == 200:
        summary = response.json()['choices'][0]['message']['content']
        return summary
    else:
        print(f"Error: {response.text}")
        return "Unable to generate summary due to an error."

if __name__ == "__main__":
    # Example usage
    channel_id = "UC8butISFwT-Wl7EV0hUK0BQ"  # FreeCodeCamp channel ID
    channel_id = "UCnMn36GT_H0X-w5_ckLtlgQ"  # Financial Education
    # channel_id = "UChBVf9YnourrEDTsbbwJPRA"  # Everything Money
    videos = get_channel_videos(channel_id, max_results=5)
    
    for video in videos:
        print(f"Title: {video.get('title', 'N/A')}")
        print(f"Published at: {video.get('published_at', 'N/A')}")
        print(f"Description: {video.get('description', '')[:100]}...")
        print(f"Transcript: {video.get('transcript', '')}...")
        print("Stock mentions:")
        for mention in video.get('stock_mentions', []):
            print(f"  - {mention.get('symbol', 'N/A')} ({mention.get('company', 'N/A')}): {mention.get('action', 'N/A').upper()}")
            print(f"    Context: '{mention.get('context', 'N/A')}'")
        print(f"Summary: {video.get('summary', 'N/A')}")
        print("---")