import React from "react";

interface Projection {
  year: number;
  revenue: number;
  netIncome: number;
  eps: string;
  sharePriceLow: string;
  sharePriceHigh: string;
}

interface StockProjectionsProps {
  ticker: string;
  projections: Projection[];
  inputs: {
    revGrowth: number;
    netIncomeGrowth: number;
    netIncomeMarginGrowth: number;
    peLow: number;
    peHigh: number;
  };
  currentStockPrice: number;
  sharesOutstanding: number;
}

export function StockProjections({
  ticker,
  projections,
  inputs,
  currentStockPrice,
  sharesOutstanding,
}: StockProjectionsProps) {
  const marketCap = ((currentStockPrice * sharesOutstanding) / 1e9).toFixed(2);

  return (
    <div className="mt-8 bg-gray-900 text-white p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-gold">
        {ticker.toUpperCase()} - 5 Year Projections
      </h2>
      <div className="text-sm mb-4">
        <span className="mr-4">
          STOCK PRICE: ${currentStockPrice.toFixed(2)}
        </span>
        <span className="mr-4">MKT.CAP: ${marketCap}B</span>
        <span>SHARES OUTSTANDING: {sharesOutstanding.toLocaleString()}</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="p-2 text-left font-semibold text-gold">YEAR</th>
              <th className="p-2 text-right font-semibold text-gold">
                REVENUE
              </th>
              <th className="p-2 text-right font-semibold text-gold">
                NET INCOME
              </th>
              <th className="p-2 text-right font-semibold text-gold">EPS</th>
              <th className="p-2 text-right font-semibold text-gold">
                SHARE PRICE LOW
              </th>
              <th className="p-2 text-right font-semibold text-gold">
                SHARE PRICE HIGH
              </th>
            </tr>
          </thead>
          <tbody>
            {projections.map((projection, index) => (
              <tr key={projection.year} className="border-b border-gray-800">
                <td className="p-2 text-left">{projection.year}</td>
                <td className="p-2 text-right">
                  ${projection.revenue.toLocaleString()}
                </td>
                <td className="p-2 text-right">
                  ${projection.netIncome.toLocaleString()}
                </td>
                <td className="p-2 text-right">${projection.eps}</td>
                <td className="p-2 text-right bg-gold text-black">
                  ${projection.sharePriceLow}
                </td>
                <td className="p-2 text-right bg-gold text-black">
                  ${projection.sharePriceHigh}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 text-sm">
        <p>Projections based on:</p>
        <ul className="list-disc list-inside mt-2">
          <li>Revenue Growth: {inputs.revGrowth}%</li>
          <li>Net Income Growth: {inputs.netIncomeGrowth}%</li>
          <li>Net Income Margin Growth: {inputs.netIncomeMarginGrowth}%</li>
          <li>P/E Low: {inputs.peLow}</li>
          <li>P/E High: {inputs.peHigh}</li>
        </ul>
      </div>
    </div>
  );
}
