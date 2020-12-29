import data from "./data/nvsData.json"
buildCompanyData(data)

//noinspection JSUnusedLocalSymbols
const million = 1000000

function selectValueTypes(multiValues, type) {
  return Object.keys(multiValues).reduce(
    (acc, key) => ({
      ...acc,
      [key]: multiValues[key] ? multiValues[key][type] : 0
    }),
    {}
  )
}

function annu(val) {
  return val * 4
}

function getNonIndexOwners(ownershipList) {
  if (!ownershipList) {
    return ""
  }
  const indexFundTags = ["Index", "500"]

  return ownershipList
    .filter(owner => indexFundTags.every(name => !owner.organization.includes(name)))
    .map(({ organization, pctHeld }) => `${organization}: ${pctHeld.fmt}`)
    .join("\n")
}

function getAnalystRecommendations(recommendationTrend) {
  if (!recommendationTrend) {
    return []
  }
  const { strongSell, sell, hold, buy, strongBuy } = recommendationTrend.find(
    t => t.period === "0m"
  )
  return [strongSell, sell, hold, buy, strongBuy]
}

function addDays(incomingDate, daysToAdd) {
  const newDate = new Date(incomingDate)
  const gotDate = newDate.getDate()
  return new Date(newDate.setDate(gotDate + daysToAdd))
}

function cleanEarningsTrend(trend) {
  if (!trend) {
    return {}
  }

  if (new Date(trend[0].endDate) < addDays(new Date(), -5)) {
    return {}
  }

  const {
    0: {
      // Estimates for this Quarter-end earnings
      epsTrend: {
        current: currentEpsEstimate,
        "7daysAgo": weekEpsEstimate,
        "30daysAgo": monthEpsEstimate,
        "60daysAgo": monthsEpsEstimate,
        "90daysAgo": quarterEpsEstimate
      } = {},
      revenueEstimate: {
        avg: revenueEstimateAvg,
        low: revenueEstimateLow,
        high: revenueEstimateHigh,
        growth: revenueEstimateGrowth
      } = {},
      growth: earningsEstimateGrowth
    } = {},
    1: {
      // Estimates for +1 Quarter earnings
      epsTrend: {
        current: currentEpsEstimateFollowingQuarter,
        "7daysAgo": weekEpsEstimateFollowingQuarter,
        "30daysAgo": monthEpsEstimateFollowingQuarter,
        "60daysAgo": monthsEpsEstimateFollowingQuarter,
        "90daysAgo": quarterEpsEstimateFollowingQuarter
      } = {},
      revenueEstimate: {
        avg: revenueEstimateFollowingQuarterAvg,
        low: revenueEstimateFollowingQuarterLow,
        high: revenueEstimateFollowingQuarterHigh,
        growth: revenueEstimateFollowingQuarterGrowth
      } = {},
      growth: earningsEstimateFollowingQuarterGrowth
    } = {},
    3: {
      // Estimates for year-end earnings
      epsTrend: {
        current: currentEpsEstimateNextYear,
        "7daysAgo": weekEpsEstimateNextYear,
        "30daysAgo": monthEpsEstimateNextYear,
        "60daysAgo": monthsEpsEstimateNextYear,
        "90daysAgo": quarterEpsEstimateNextYear
      } = {},
      revenueEstimate: {
        avg: revenueEstimateNextYearAvg,
        low: revenueEstimateNextYearLow,
        high: revenueEstimateNextYearHigh,
        growth: revenueEstimateNextYearGrowth
      } = {},
      growth: earningsEstimateNextYearGrowth
    } = {}
  } = trend

  return {
    currentEpsEstimate,
    weekEpsEstimate,
    monthEpsEstimate,
    monthsEpsEstimate,
    quarterEpsEstimate,
    revenueEstimateAvg,
    revenueEstimateLow,
    revenueEstimateHigh,
    revenueEstimateGrowth,
    earningsEstimateGrowth,
    currentEpsEstimateFollowingQuarter,
    weekEpsEstimateFollowingQuarter,
    monthEpsEstimateFollowingQuarter,
    monthsEpsEstimateFollowingQuarter,
    quarterEpsEstimateFollowingQuarter,
    revenueEstimateFollowingQuarterAvg,
    revenueEstimateFollowingQuarterLow,
    revenueEstimateFollowingQuarterHigh,
    revenueEstimateFollowingQuarterGrowth,
    earningsEstimateFollowingQuarterGrowth,
    currentEpsEstimateNextYear,
    weekEpsEstimateNextYear,
    monthEpsEstimateNextYear,
    monthsEpsEstimateNextYear,
    quarterEpsEstimateNextYear,
    revenueEstimateNextYearAvg,
    revenueEstimateNextYearLow,
    revenueEstimateNextYearHigh,
    revenueEstimateNextYearGrowth,
    earningsEstimateNextYearGrowth
  }
}

function dateStrIsBeforeNow(dateStr, daysToAdd) {
  return Boolean(new Date(dateStr) < addDays(new Date(), daysToAdd))
}

function quarterStrIsTooOld(qtrString) {
  return Boolean(qtrString.slice(2) < new Date().getFullYear() - 1)
}

function cleanEarningsChart(earningsChart) {
  if (!earningsChart) {
    return {}
  }

  const { quarterly, currentQuarterEstimate, earningsDate } = earningsChart
  const quarterlyOk = quarterly.every(({ date }) => !quarterStrIsTooOld(date))

  return {
    quarterlyEPSActualEstimateChart: quarterlyOk && quarterly,
    currentQuarterEstimateRaw:
      Boolean(earningsDate[0]) &&
      !dateStrIsBeforeNow(earningsDate[0].fmt, -4) &&
      currentQuarterEstimate.raw
  }
}

function cleanFinancialsChart(financialsChart) {
  if (!financialsChart) {
    return []
  }

  const { quarterly } = financialsChart
  const quarterlyOk = quarterly.every(({ date }) => !quarterStrIsTooOld(date))

  return quarterlyOk && quarterly
}

function cleanStatements(bs, income, cash) {
  const numDaysToBeforeLastQtr = -120
  return {
    ...(dateStrIsBeforeNow(bs.endDate, numDaysToBeforeLastQtr) ? {} : bs[0]),
    ...(dateStrIsBeforeNow(income.endDate, numDaysToBeforeLastQtr) ? {} : income[0]),
    ...(dateStrIsBeforeNow(cash.endDate, numDaysToBeforeLastQtr) ? {} : cash[0])
  }
}

function buildCompanyData({ quoteSummary }) {
  //noinspection JSUnusedLocalSymbols
  const {
    assetProfile: {
      longBusinessSummary,
      auditRisk,
      boardRisk,
      compensationRisk,
      shareHolderRightsRisk,
      overallRisk,
      sector,
      industry,
      country
    },
    recommendationTrend: { trend: recommendationTrend } = {},
    defaultKeyStatistics: {
      beta, // "Beta (5Y Monthly)"
      bookValue, // "Book Value Per Share (mrq)"
      earningsQuarterlyGrowth, // "Quarterly Earnings Growth (yoy)"
      enterpriseToRevenue,
      enterpriseToEbitda,
      enterpriseValue,
      floatShares,
      forwardEps,
      forwardPE,
      heldPercentInsiders,
      heldPercentInstitutions,
      lastDividendDate,
      lastDividendValue,
      lastFiscalYearEnd,
      mostRecentQuarter,
      netIncomeToCommon,
      pegRatio,
      priceToBook,
      profitMargins,
      sharesOutstanding,
      sharesPercentSharesOut, // "Short % of Shares Outstanding"
      sharesShort,
      dateShortInterest,
      sharesShortPreviousMonthDate,
      sharesShortPriorMonth,
      shortPercentOfFloat,
      shortRatio,
      trailingEps // current EPS
    },
    fundOwnership: { ownershipList } = {},
    summaryDetail: {
      dividendRate, // "Forward Dividend
      dividendYield, // & Yield"
      exDividendDate,
      fiftyDayAverage,
      fiveYearAvgDividendYield,
      trailingAnnualDividendRate,
      trailingAnnualDividendYield,
      trailingPE, // "PE Ratio (TTM)"
      payoutRatio,
      priceToSalesTrailing12Months,
      regularMarketVolume,
      twoHundredDayAverage
    },
    majorHoldersBreakdown: { institutionsCount } = {},
    calendarEvents: {
      earnings: { earningsAverage, earningsLow, earningsHigh, earningsDate } = {} // upcoming quarter-end projections
    } = {},
    earnings: { earningsChart, financialsChart } = {},
    earningsTrend: { trend } = {},
    financialData: {
      currentPrice,
      targetHighPrice,
      targetLowPrice,
      targetMeanPrice,
      recommendationKey,
      numberOfAnalystOpinions,
      totalCash,
      totalCashPerShare,
      totalDebt, //  Total Debt MRQ from "statistics" page
      revenuePerShare,
      returnOnAssets,
      returnOnEquity,
      grossProfits,
      operatingCashflow: operatingCashflowTTM, // verified this is TTM from Schwab cash flow statement
      earningsGrowth,
      revenueGrowth, // Quarterly Revenue Growth (yoy)
      operatingMargins
    } = {},
    upgradeDowngradeHistory: { history: upgradeDowngradeHistory } = {},
    price: { regularMarketPrice },
    cashflowStatementHistoryQuarterly: { cashflowStatements },
    incomeStatementHistoryQuarterly: { incomeStatementHistory },
    balanceSheetHistoryQuarterly: { balanceSheetStatements }
  } = quoteSummary.result[0]

  // ------------------------------- //

  const {
    // balance sheet
    cash,
    inventory,
    totalCurrentAssets,
    longTermInvestments,
    propertyPlantEquipment,
    goodWill,
    intangibleAssets,
    totalAssets,
    accountsPayable,
    shortLongTermDebt,
    longTermDebt,
    minorityInterest,
    totalCurrentLiabilities,
    totalLiab,
    commonStock,
    retainedEarnings,
    capitalSurplus,
    totalStockholderEquity, // common stock
    netTangibleAssets,
    // income statement
    totalRevenue,
    costOfRevenue,
    grossProfit,
    researchDevelopment,
    sellingGeneralAdministrative,
    nonRecurring,
    totalOperatingExpenses,
    operatingIncome,
    ebit,
    interestExpense,
    incomeBeforeTax,
    netIncomeFromContinuingOps,
    discontinuedOperations,
    netIncome,
    netIncomeApplicableToCommonShares,
    // cashflow statement
    depreciation,
    changeToNetincome,
    changeToOperatingActivities,
    totalCashFromOperatingActivities,
    capitalExpenditures,
    investments,
    totalCashflowsFromInvestingActivities,
    dividendsPaid,
    netBorrowings,
    totalCashFromFinancingActivities,
    effectOfExchangeRate,
    changeInCash,
    repurchaseOfStock
  } = cleanStatements(balanceSheetStatements, incomeStatementHistory, cashflowStatements)

  const {
    currentEpsEstimate,
    weekEpsEstimate,
    monthEpsEstimate,
    monthsEpsEstimate,
    quarterEpsEstimate,
    revenueEstimateAvg,
    revenueEstimateLow,
    revenueEstimateHigh,
    revenueEstimateGrowth,
    earningsEstimateGrowth,
    currentEpsEstimateFollowingQuarter,
    weekEpsEstimateFollowingQuarter,
    monthEpsEstimateFollowingQuarter,
    monthsEpsEstimateFollowingQuarter,
    quarterEpsEstimateFollowingQuarter,
    revenueEstimateFollowingQuarterAvg,
    revenueEstimateFollowingQuarterLow,
    revenueEstimateFollowingQuarterHigh,
    revenueEstimateFollowingQuarterGrowth,
    earningsEstimateFollowingQuarterGrowth,
    currentEpsEstimateNextYear,
    weekEpsEstimateNextYear,
    monthEpsEstimateNextYear,
    monthsEpsEstimateNextYear,
    quarterEpsEstimateNextYear,
    revenueEstimateNextYearAvg,
    revenueEstimateNextYearLow,
    revenueEstimateNextYearHigh,
    revenueEstimateNextYearGrowth,
    earningsEstimateNextYearGrowth
  } = cleanEarningsTrend(trend)

  const {
    capitalExpenditures: capitalExpendituresRaw,
    cash: cashRaw,
    ebit: ebitRaw,
    longTermDebt: longTermDebtRaw,
    operatingCashflowTTM: operatingCashflowTTMRaw,
    operatingMargins: operatingMarginsRaw,
    regularMarketPrice: regularMarketPriceRaw,
    sharesOutstanding: sharesOutstandingRaw,
    shortLongTermDebt: shortLongTermDebtRaw,
    totalCashFromOperatingActivities: totalCashFromOperatingActivitiesRaw,
    totalCurrentLiabilities: totalCurrentLiabilitiesRaw,
    totalDebt: totalDebtRaw,
    totalRevenue: totalRevenueRaw,
    totalStockholderEquity: totalStockholderEquityRaw,
    enterpriseValue: enterpriseValueRaw,
    revenueEstimateAvg: revenueEstimateAvgRaw
  } = selectValueTypes(
    {
      capitalExpenditures, // STATEMENT
      cash,
      ebit, // STATEMENT
      longTermDebt, // STATEMENT
      shortLongTermDebt, // STATEMENT
      totalCashFromOperatingActivities, // STATEMENT
      totalCurrentLiabilities, // STATEMENT
      totalRevenue, // STATEMENT
      totalStockholderEquity, // STATEMENT
      operatingCashflowTTM, // financialData
      operatingMargins, // financialData
      regularMarketPrice, // price
      revenuePerShare, // financialData
      sharesOutstanding, // defaultKeyStats
      totalDebt, // financialData
      enterpriseValue, // defaultKeyStats
      revenueEstimateAvg // earnings trend
    },
    "raw"
  )

  const { quarterlyEPSActualEstimateChart, currentQuarterEstimateRaw } = cleanEarningsChart(
    earningsChart
  )

  const slicePerShareAnnlz = val => annu(val) / sharesOutstandingRaw
  const slicePerShare = val => val / sharesOutstandingRaw

  const mTotalDebt = totalDebtRaw
    ? totalDebtRaw
    : totalCurrentLiabilitiesRaw + longTermDebtRaw + shortLongTermDebtRaw

  const mOperatingCashflowAnnlz =
    operatingCashflowTTMRaw || annu(totalCashFromOperatingActivitiesRaw)
  const mFreeCashFlowAnnlz = mOperatingCashflowAnnlz - annu(capitalExpendituresRaw)
  const totalRevenueAnnlz = annu(totalRevenueRaw)

  return {
    totalDebt: mTotalDebt,
    debtToCapital: mTotalDebt / (mTotalDebt + totalStockholderEquityRaw),
    operatingMargins: operatingMarginsRaw || ebitRaw / totalRevenueRaw, // TTM
    priceToSalesMRQ:
      regularMarketPriceRaw && totalRevenueRaw
        ? (regularMarketPriceRaw / slicePerShareAnnlz(totalRevenueRaw)).toFixed(2)
        : "n/a",
    freeCashFlow: mFreeCashFlowAnnlz,
    freeCashFlowPerShare: slicePerShare(mFreeCashFlowAnnlz),
    totalCashPerShare: slicePerShare(cashRaw),
    operatingCashFlowPerShare: slicePerShare(mOperatingCashflowAnnlz),
    upgradeDowngradeHistory: upgradeDowngradeHistory
      ? upgradeDowngradeHistory
          .filter(({ firm, epochGradeDate }) =>
            upgradeDowngradeHistory.every(
              comparison => firm !== comparison.firm || epochGradeDate >= comparison.epochGradeDate
            )
          )
          .reduce((acc, { firm, toGrade, fromGrade }) => {
            return acc + ` ${firm}: ${fromGrade} => ${toGrade}\n`
          }, "")
      : "n/a",
    anaylstRecommendations: getAnalystRecommendations(recommendationTrend),
    institutionsCount: institutionsCount ? institutionsCount.longFmt : null,
    nonIndexOwners: getNonIndexOwners(ownershipList),
    quarterlyEPSActualEstimateChart: quarterlyEPSActualEstimateChart
      ? quarterlyEPSActualEstimateChart
          .reduce((acc, { actual, estimate }) => [...acc, estimate.raw, actual.raw, 0], [])
          .concat([currentQuarterEstimateRaw])
      : [],
    quarterlyRevenueChart: cleanFinancialsChart(financialsChart)
      ? cleanFinancialsChart(financialsChart)
          .reduce((acc, { revenue }) => [...acc, revenue.raw], [])
          .concat([0, revenueEstimateAvgRaw])
      : [],
    totalRevenueAnnlz,
    enterpriseToRevenue: enterpriseValueRaw / totalRevenueAnnlz,
    ...selectValueTypes(
      // RAW //
      {
        // PRICE //

        regularMarketPrice,

        // FINANCIAL DATA

        currentPrice,
        grossProfits,
        revenuePerShare,

        // DEFAULT KEY STATISTICS

        floatShares,
        enterpriseValue,
        forwardEps,
        heldPercentInsiders,
        netIncomeToCommon,
        sharesOutstanding,
        trailingEps,
        sharesShort,
        sharesShortPriorMonth,

        // CALENDAR EVENTS //

        earningsAverage, // upcoming quarter-end projection
        earningsHigh, // upcoming quarter-end projection
        earningsLow, // upcoming quarter-end projection

        // SUMMARY DETAIL //

        twoHundredDayAverage,
        fiftyDayAverage,

        // ANALYSTS

        numberOfAnalystOpinions,
        targetHighPrice,
        targetLowPrice,
        targetMeanPrice,

        // DIVIDEND

        trailingAnnualDividendRate,
        fiveYearAvgDividendYield,
        dividendRate,
        lastDividendValue,

        // EARNINGS TREND

        currentEpsEstimate, //  estimate for this quater results; as of now
        currentEpsEstimateFollowingQuarter, // estimate for following quater results; as of now
        currentEpsEstimateNextYear, // estimate for following year results; as of now
        weekEpsEstimate,
        weekEpsEstimateFollowingQuarter,
        weekEpsEstimateNextYear,
        monthEpsEstimate,
        monthEpsEstimateFollowingQuarter,
        monthEpsEstimateNextYear,
        monthsEpsEstimate, // estimate for this quater results; 2 months ago
        monthsEpsEstimateFollowingQuarter, // estimate for following quater results; 2 months ago
        monthsEpsEstimateNextYear, // estimate for following year results; 2 months ago
        quarterEpsEstimate,
        quarterEpsEstimateFollowingQuarter,
        quarterEpsEstimateNextYear,

        // REVENUE ESTIMATES (All "as of now")

        revenueEstimateLow, // estimate for this quarter revenue
        revenueEstimateAvg,
        revenueEstimateHigh,
        revenueEstimateFollowingQuarterLow, // estimate for following quarter revenue
        revenueEstimateFollowingQuarterAvg,
        revenueEstimateFollowingQuarterHigh,
        revenueEstimateNextYearLow, // estimate for next year revenue
        revenueEstimateNextYearAvg,
        revenueEstimateNextYearHigh,

        //  BALANCE SHEET

        cash,
        inventory,
        totalCurrentAssets,
        longTermInvestments,
        propertyPlantEquipment,
        goodWill,
        intangibleAssets,
        totalAssets,
        accountsPayable,
        shortLongTermDebt,
        longTermDebt,
        minorityInterest,
        totalCurrentLiabilities,
        totalLiab,
        commonStock,
        retainedEarnings,
        capitalSurplus,
        totalStockholderEquity,
        netTangibleAssets,

        // INCOME STATEMENT

        totalRevenue,
        costOfRevenue,
        grossProfit,
        researchDevelopment,
        sellingGeneralAdministrative,
        nonRecurring,
        totalOperatingExpenses,
        operatingIncome,
        ebit,
        interestExpense,
        incomeBeforeTax,
        netIncomeFromContinuingOps,
        discontinuedOperations,
        netIncome,
        netIncomeApplicableToCommonShares,

        // CASH FLOW STATEMENT

        depreciation,
        changeToNetincome,
        changeToOperatingActivities,
        totalCashFromOperatingActivities,
        capitalExpenditures,
        investments,
        totalCashflowsFromInvestingActivities,
        dividendsPaid,
        netBorrowings,
        totalCashFromFinancingActivities,
        effectOfExchangeRate,
        changeInCash,
        repurchaseOfStock
      },
      "raw"
    ),
    ...selectValueTypes(
      // FORMATTED //
      {
        // INFO //

        lastFiscalYearEnd,
        mostRecentQuarter,
        regularMarketVolume,

        // DIVIDEND //

        dividendYield,
        exDividendDate,
        trailingAnnualDividendYield,
        lastDividendDate,
        payoutRatio,

        // VALUATION //

        priceToBook,
        priceToSalesTrailing12Months,
        forwardPE,
        trailingPE,
        pegRatio,
        enterpriseToEbitda,

        // FUNDAMENTALS //

        profitMargins, // probably TTM
        returnOnAssets,
        returnOnEquity,
        beta,
        earningsGrowth,
        revenueGrowth, // Quarterly Revenue Growth (yoy)
        bookValue,

        // MARKET SENTIMENT //

        heldPercentInstitutions,
        sharesPercentSharesOut,
        sharesShortPreviousMonthDate,
        shortPercentOfFloat,
        shortRatio,
        dateShortInterest,

        // EARNINGS/REVENUE //

        earningsDate,
        earningsQuarterlyGrowth,
        revenueEstimateGrowth, // estimated revenue growth (YoY) for this quarter
        revenueEstimateFollowingQuarterGrowth,
        revenueEstimateNextYearGrowth, // estimated revenue growth (YoY) for next year
        earningsEstimateGrowth, // estimated earnings growth (YoY) for this quarter
        earningsEstimateFollowingQuarterGrowth,
        earningsEstimateNextYearGrowth // estimated earnings growth (YoY) for next year
      },
      "fmt"
    ),
    auditRisk,
    boardRisk,
    compensationRisk,
    country,
    industry,
    longBusinessSummary,
    overallRisk,
    recommendationKey,
    sector,
    shareHolderRightsRisk
  }
}
