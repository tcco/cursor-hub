from fastapi import FastAPI, Query
from stock_data import get_stock_data
from search_trends import get_search_trends
from youtube_scrapper import get_channel_videos

app = FastAPI()

@app.get("/stock/{symbol}")
async def stock_endpoint(symbol: str):
    return get_stock_data(symbol)

@app.get("/trends")
async def trends_endpoint(days: int = Query(default=1, ge=1, le=30)):
    return get_search_trends(days)

@app.get("/youtube/{channel_id}")
async def youtube_endpoint(channel_id: str, max_results: int = Query(default=5, ge=1, le=50), summarize: bool = Query(default=False)):
    return get_channel_videos(channel_id, max_results, summarize)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)