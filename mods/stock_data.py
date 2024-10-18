import yfinance as yf

def get_stock_data(symbol: str):
    stock = yf.Ticker(symbol)
    info = stock.info
    financials = stock.financials
    balance_sheet = stock.balance_sheet
    cash_flow = stock.cash_flow

    return {
        "symbol": symbol,
        "name": info.get("longName"),
        "sector": info.get("sector"),
        "industry": info.get("industry"),
        
        # Profitability
        "return_on_equity": info.get("returnOnEquity"),
        "profit_margins": info.get("profitMargins"),
        "operating_margins": info.get("operatingMargins"),
        
        # Financial Health
        "current_ratio": balance_sheet.loc["Total Current Assets"].iloc[0] / balance_sheet.loc["Total Current Liabilities"].iloc[0] if "Total Current Assets" in balance_sheet.index and "Total Current Liabilities" in balance_sheet.index else None,
        "debt_to_equity": info.get("debtToEquity"),
        "free_cash_flow": cash_flow.loc["Free Cash Flow"].iloc[0] if "Free Cash Flow" in cash_flow.index else None,
        
        # Growth and Valuation
        "revenue_growth": info.get("revenueGrowth"),
        "earnings_growth": info.get("earningsGrowth"),
        "price_to_earnings": info.get("trailingPE"),
        "price_to_book": info.get("priceToBook"),
        
        # Dividend
        "dividend_yield": info.get("dividendYield"),
        "payout_ratio": info.get("payoutRatio"),
        
        # Management Effectiveness
        "return_on_assets": info.get("returnOnAssets"),
        "return_on_invested_capital": financials.loc["Net Income"].iloc[0] / (balance_sheet.loc["Total Stockholder Equity"].iloc[0] + balance_sheet.loc["Long Term Debt"].iloc[0]) if "Net Income" in financials.index and "Total Stockholder Equity" in balance_sheet.index and "Long Term Debt" in balance_sheet.index else None,
        
        # Competitive Advantage
        "gross_margins": info.get("grossMargins"),
    }


if __name__ == "__main__":
    print(get_stock_data("TSLA"))