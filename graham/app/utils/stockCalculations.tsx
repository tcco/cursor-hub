interface StockInputs {
  revGrowth: number;
  netIncomeGrowth: number;
  netIncomeMarginGrowth: number;
  peLow: number;
  peHigh: number;
}

export function calculateProjections(inputs: StockInputs) {
  const baseRevenue = 1661055000;
  const baseNetIncome = 249612354;
  const sharesOutstanding = 231787480;
  const projectedYears = 5;

  let projectedRevenue = baseRevenue;
  let projectedNetIncome = baseNetIncome;
  let netIncomeMargin = baseNetIncome / baseRevenue;
  const projections = [];

  for (let i = 0; i < projectedYears; i++) {
    projectedRevenue *= 1 + inputs.revGrowth / 100;
    netIncomeMargin *= 1 + inputs.netIncomeMarginGrowth / 100;
    projectedNetIncome = projectedRevenue * netIncomeMargin;

    const eps = projectedNetIncome / sharesOutstanding;
    const sharePriceLow = eps * inputs.peLow;
    const sharePriceHigh = eps * inputs.peHigh;

    projections.push({
      year: 2024 + i,
      revenue: Math.round(projectedRevenue),
      netIncome: Math.round(projectedNetIncome),
      eps: eps.toFixed(2),
      sharePriceLow: sharePriceLow.toFixed(2),
      sharePriceHigh: sharePriceHigh.toFixed(2),
    });
  }

  return projections;
}
