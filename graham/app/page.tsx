"use client";
import React, { useState } from "react";
import { StockForm, StockFormData } from "./components/StockForm";
import { StockProjections } from "./components/StockProjections";
import { calculateProjections } from "./utils/stockCalculations";

export default function Home() {
  const [result, setResult] = useState(null);
  const [inputs, setInputs] = useState<StockFormData | null>(null);
  const [currentStockPrice, setCurrentStockPrice] = useState(0);
  const [sharesOutstanding, setSharesOutstanding] = useState(0);

  const handleSubmit = async (formData: StockFormData) => {
    // Here you would typically fetch the current stock price and shares outstanding
    // from an API. For this example, we'll use placeholder values.
    const fetchedStockPrice = 32.39; // This should come from an API
    const fetchedSharesOutstanding = 231787480; // This should come from an API

    setCurrentStockPrice(fetchedStockPrice);
    setSharesOutstanding(fetchedSharesOutstanding);

    const projections = calculateProjections(formData);
    setResult(projections);
    setInputs(formData);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans">
      <main className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Stock Projector
        </h1>
        <StockForm onSubmit={handleSubmit} />
        {result && inputs && (
          <StockProjections
            ticker={inputs.ticker}
            projections={result}
            inputs={inputs}
            currentStockPrice={currentStockPrice}
            sharesOutstanding={sharesOutstanding}
          />
        )}
      </main>
    </div>
  );
}
