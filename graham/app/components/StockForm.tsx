import React, { useState } from "react";

export interface StockFormData {
  ticker: string;
  revGrowth: number;
  netIncomeGrowth: number;
  netIncomeMarginGrowth: number;
  peLow: number;
  peHigh: number;
}

interface StockFormProps {
  onSubmit: (formData: StockFormData) => void;
}

export function StockForm({ onSubmit }: StockFormProps) {
  const [formData, setFormData] = useState<StockFormData>({
    ticker: "",
    revGrowth: 12,
    netIncomeGrowth: 12,
    netIncomeMarginGrowth: 15,
    peLow: 20,
    peHigh: 30,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "ticker" ? value : Number(value),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex space-x-4">
        <div className="flex flex-col space-y-2 flex-1">
          <label htmlFor="ticker" className="text-sm font-medium text-gray-700">
            Ticker
          </label>
          <input
            id="ticker"
            name="ticker"
            type="text"
            placeholder="e.g. AAPL"
            value={formData.ticker}
            onChange={handleChange}
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="flex flex-col space-y-2 flex-1">
          <label
            htmlFor="revGrowth"
            className="text-sm font-medium text-gray-700"
          >
            Revenue Growth (%)
          </label>
          <input
            id="revGrowth"
            name="revGrowth"
            type="number"
            placeholder="e.g. 10"
            value={formData.revGrowth}
            onChange={handleChange}
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>
      <div className="flex space-x-4">
        <div className="flex flex-col space-y-2 flex-1">
          <label
            htmlFor="netIncomeGrowth"
            className="text-sm font-medium text-gray-700"
          >
            Net Income Growth (%)
          </label>
          <input
            id="netIncomeGrowth"
            name="netIncomeGrowth"
            type="number"
            placeholder="e.g. 15"
            value={formData.netIncomeGrowth}
            onChange={handleChange}
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="flex flex-col space-y-2 flex-1">
          <label htmlFor="peLow" className="text-sm font-medium text-gray-700">
            P/E Low
          </label>
          <input
            id="peLow"
            name="peLow"
            type="number"
            placeholder="e.g. 20"
            value={formData.peLow}
            onChange={handleChange}
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>
      <div className="flex space-x-4">
        <div className="flex flex-col space-y-2 flex-1">
          <label htmlFor="peHigh" className="text-sm font-medium text-gray-700">
            P/E High
          </label>
          <input
            id="peHigh"
            name="peHigh"
            type="number"
            placeholder="e.g. 30"
            value={formData.peHigh}
            onChange={handleChange}
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="flex-1"></div>
      </div>
      <div className="flex space-x-4">
        <div className="flex flex-col space-y-2 flex-1">
          <label
            htmlFor="netIncomeMarginGrowth"
            className="text-sm font-medium text-gray-700"
          >
            Net Income Margin Growth (%)
          </label>
          <input
            id="netIncomeMarginGrowth"
            name="netIncomeMarginGrowth"
            type="number"
            placeholder="e.g. 15"
            value={formData.netIncomeMarginGrowth}
            onChange={handleChange}
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="flex-1"></div>
      </div>
      <button
        type="submit"
        className="w-full p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 ease-in-out"
      >
        Calculate Projections
      </button>
    </form>
  );
}
