from googleapiclient.discovery import build
from youtube_transcript_api import YouTubeTranscriptApi, TranscriptsDisabled, NoTranscriptAvailable
import os
from dotenv import load_dotenv
from transformers import pipeline
import re

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
    'DIS': 'Disney'
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
            'transcript': get_video_transcript(item['id']['videoId'], summarize)
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
    summarizer = pipeline("summarization", model="facebook/bart-large-cnn")
    
    # Split the text into chunks of 1024 tokens (BART's max input length)
    max_chunk_length = 1024
    chunks = [text[i:i + max_chunk_length] for i in range(0, len(text), max_chunk_length)]
    
    summaries = []
    for chunk in chunks:
        summary = summarizer(chunk, max_length=150, min_length=30, do_sample=False)
        summaries.append(summary[0]['summary_text'])
    
    # Combine the summaries
    final_summary = " ".join(summaries)
    
    return final_summary

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