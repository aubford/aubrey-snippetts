import data from "./data/citiData.json"
import _ from "lodash"
//noinspection JSUnusedLocalSymbols
const million = 1000000
buildCompanyData(data) /* ?+*/

///////////////////////////////////////////////////////////////////////

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

function dateStrIsBefore(dateStr, daysToAdd) {
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
  const quarterlyOk = quarterly.some(({ date }) => !quarterStrIsTooOld(date))

  return {
    quarterlyEPSActualEstimateChart: quarterlyOk && quarterly,
    currentQuarterEstimateRaw:
      Boolean(earningsDate[0]) &&
      !dateStrIsBefore(earningsDate[0].fmt, -4) &&
      currentQuarterEstimate.raw
  }
}

function cleanFinancialsChart(financialsChart) {
  if (!financialsChart) {
    return []
  }

  const { quarterly } = financialsChart
  const quarterlyOk = quarterly.some(({ date }) => !quarterStrIsTooOld(date))

  return quarterlyOk ? quarterly.map(({ revenue }) => revenue.raw) : []
}

function getRecentStatement(statements) {
  const numDaysToLastQuarter = -100
  return statements.find(({ endDate }) => !dateStrIsBefore(endDate, numDaysToLastQuarter))
}
function cleanStatement(statementList) {
  const recentStatement = getRecentStatement(statementList)
  return _.mapValues(recentStatement, "raw")
}

function cleanShortInterest(
  dateShortInterest,
  sharesShortPreviousMonthDate,
  sharesShortPriorMonth,
  shortPercentOfFloat,
  sharesShort
) {
  const twoMonthsAgo = -60
  const threeMonthsAgo = -90
  if (
    dateStrIsBefore(dateShortInterest.fmt, twoMonthsAgo) ||
    dateStrIsBefore(sharesShortPreviousMonthDate.fmt, threeMonthsAgo)
  ) {
    return {}
  }

  return {
    sharesShortPriorMonth: sharesShortPriorMonth.raw,
    sharesShort: sharesShort.raw,
    shortPercentOfFloat: shortPercentOfFloat.raw
  }
}

function buildCompanyData({ quoteSummary }) {
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
      netIncomeToCommon, // TTM
      pegRatio,
      priceToBook,
      profitMargins, // probably TMM
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
      totalRevenue,
      revenuePerShare,
      returnOnAssets,
      returnOnEquity,
      grossProfits,
      ebitda,
      grossMargins,
      ebitdaMargins,
      quickRatio,
      currentRatio,
      freeCashflow: leveredFreeCashFlow,
      currentPrice,
      targetHighPrice,
      targetLowPrice,
      targetMeanPrice,
      recommendationKey,
      numberOfAnalystOpinions,
      totalCash,
      totalCashPerShare,
      totalDebt, //  Total Debt MRQ from "statistics" page
      operatingCashflow: operatingCashflowTTM, // verified this is TTM from Schwab cash flow statement
      earningsGrowth,
      revenueGrowth, // Quarterly Revenue Growth (yoy)
      operatingMargins // TTM
    } = {},
    upgradeDowngradeHistory: { history: upgradeDowngradeHistory } = {},
    price: { regularMarketPrice },
    cashflowStatementHistoryQuarterly: { cashflowStatements },
    incomeStatementHistoryQuarterly: { incomeStatementHistory },
    balanceSheetHistoryQuarterly: { balanceSheetStatements }
  } = quoteSummary.result[0]

  // ------------------------------- //

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

  const { quarterlyEPSActualEstimateChart, currentQuarterEstimateRaw } = cleanEarningsChart(
    earningsChart
  )

  const balanceSheet = cleanStatement(balanceSheetStatements)
  const incomeStatement = cleanStatement(incomeStatementHistory)
  const cashFlows = cleanStatement(cashflowStatements)

  const slicePerShareAnnlz = val => annu(val) / sharesOutstanding.raw
  const slicePerShare = val => val / sharesOutstanding.raw

  const mTotalDebt =
    totalDebt && totalDebt.raw
      ? totalDebt.raw
      : balanceSheet.totalCurrentLiabilities +
        balanceSheet.longTermDebt +
        (balanceSheet.shortLongTermDebt || 0)

  const operatingCashFlowMRQ = annu(cashFlows.totalCashFromOperatingActivities)

  const freeCashFlowMRQ = annu(
    cashFlows.totalCashFromOperatingActivities + cashFlows.capitalExpenditures
  )

  const freeCashFlowTTM =
    cashflowStatements.length === 4
      ? cashflowStatements.reduce(
          (acc, curr) =>
            acc +
            (curr.totalCashFromOperatingActivities
              ? curr.totalCashFromOperatingActivities.raw
              : 0) +
            (curr.capitalExpenditures ? curr.capitalExpenditures.raw : 0),
          0
        )
      : 0

  const statementTotalRevenueSum =
    incomeStatementHistory.length === 4
      ? incomeStatementHistory.reduce(
          (acc, curr) => acc + (curr.totalRevenue ? curr.totalRevenue.raw : 0),
          0
        )
      : 0
  const totalRevenueTTM =
    totalRevenue && totalRevenue.raw ? totalRevenue.raw : statementTotalRevenueSum

  return {
    ...balanceSheet,
    ...incomeStatement,
    ...cashFlows,
    ...selectValueTypes(
      // RAW //
      {
        // PRICE //

        regularMarketPrice,

        // FINANCIAL DATA

        currentPrice,
        grossProfits,
        revenuePerShare,
        totalCash,
        ebitda,

        // DEFAULT KEY STATISTICS

        floatShares,
        enterpriseValue,
        forwardEps,
        heldPercentInsiders,
        netIncomeToCommon,
        sharesOutstanding,
        trailingEps,

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
        revenueEstimateNextYearHigh
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
        quickRatio,
        currentRatio,
        grossMargins,
        ebitdaMargins,

        // MARKET SENTIMENT //

        heldPercentInstitutions,
        sharesPercentSharesOut,
        shortPercentOfFloat,
        shortRatio,

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
    ...cleanShortInterest(
      dateShortInterest,
      sharesShortPreviousMonthDate,
      sharesShortPriorMonth,
      shortPercentOfFloat,
      sharesShort
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
    shareHolderRightsRisk,
    totalRevenueTTM,
    operatingCashflowTTM,
    totalDebt: mTotalDebt,
    buybackRatio:
      cashFlows.netIncome > 0
        ? -((cashFlows.issuanceOfStock || 0) + (cashFlows.repurchaseOfStock || 0)) /
          cashFlows.netIncome
        : "n/a", // validated this data w/ other brokerages
    debtToCapital: mTotalDebt / (mTotalDebt + balanceSheet.totalStockholderEquity),
    operatingMargins:
      operatingMargins && operatingMargins.raw
        ? operatingMargins.raw
        : incomeStatement.ebit / incomeStatement.totalRevenue,
    priceToSalesMRQ:
      regularMarketPrice && regularMarketPrice.raw && incomeStatement.totalRevenue
        ? (regularMarketPrice.raw / slicePerShareAnnlz(incomeStatement.totalRevenue)).toFixed(2)
        : "n/a",
    leveredFreeCashFlowPerShare: leveredFreeCashFlow ? slicePerShare(leveredFreeCashFlow.raw) : 0,
    freeCashFlowPerShareTTM: slicePerShare(freeCashFlowTTM),
    freeCashFlowPerShareMRQ: slicePerShare(freeCashFlowMRQ),
    totalCashPerShare: totalCashPerShare ? totalCashPerShare.raw : slicePerShare(balanceSheet.cash),
    operatingCashFlowPerShareMRQ: slicePerShare(operatingCashFlowMRQ),
    enterpriseToRevenue: enterpriseToRevenue
      ? enterpriseToRevenue.raw
      : enterpriseValue.raw / totalRevenueTTM,
    
    // non-numbers:
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
    quarterlyRevenueChart: cleanFinancialsChart(financialsChart).concat(
      revenueEstimateAvg ? [0, revenueEstimateAvg.raw] : []
    )
  }
}
