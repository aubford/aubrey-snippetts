/*
  
  assetProfile,summaryProfile,summaryDetail,esgScores,price,defaultKeyStatistics,financialData,calendarEvents,secFilings,recommendationTrend,upgradeDowngradeHistory,institutionOwnership,fundOwnership,majorDirectHolders,majorHoldersBreakdown,insiderTransactions,insiderHolders,netSharePurchaseActivity,earnings,earningsTrend,industryTrend,indexTrend,sectorTrend,cashflowStatementHistoryQuarterly,incomeStatementHistoryQuarterly,balanceSheetHistoryQuarterly
  
*/

import stockData from "./citiData"
buildCompanyData(stockData)

function selectValueTypes(multiValues, type) {
  return Object.keys(multiValues).reduce(
    (acc, key) => ({
      ...acc,
      [key]: multiValues[key] ? multiValues[key][type] : null
    }),
    {}
  )
}

function getNonIndexOwners(ownershipList) {
  const indexFundTags = ["Index", "500"]

  return ownershipList
    .filter(owner =>
      indexFundTags.every(name => !owner.organization.includes(name))
    )
    .map(({ organization, pctHeld }) => `${organization}: ${pctHeld.fmt}`)
    .join(" <|> ")
}

function buildCompanyData(yahooData) {
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
    recommendationTrend: { trend: recommendationTrend },
    defaultKeyStatistics: {
      beta, // "Beta (5Y Monthly)"
      bookValue, // "Book Value Per Share (mrq)"
      dateShortInterest,
      earningsQuarterlyGrowth, // "Quarterly Earnings Growth (yoy)"
      enterpriseToRevenue,
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
      sharesShortPreviousMonthDate,
      sharesShortPriorMonth,
      shortPercentOfFloat,
      shortRatio,
      trailingEps // current EPS
    },
    fundOwnership: { ownershipList },
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
    majorHoldersBreakdown: { institutionsCount },
    calendarEvents: {
      earnings: { earningsAverage, earningsLow, earningsHigh, earningsDate } // upcoming quarter-end projections
    },
    earnings: {
      earningsChart: {
        quarterly: quarterlyEPSActualEstimateChart,
        currentQuarterEstimate
      }
    },
    earningsTrend: {
      trend: {
        0: {
          // Estimates for this Quarter-end earnings
          epsTrend: {
            current: currentEpsEstimate,
            "7daysAgo": weekEpsEstimate,
            "30daysAgo": monthEpsEstimate,
            "60daysAgo": monthsEpsEstimate,
            "90daysAgo": quarterEpsEstimate
          },
          revenueEstimate: {
            avg: revenueEstimateAvg,
            low: revenueEstimateLow,
            high: revenueEstimateHigh,
            growth: revenueEstimateGrowth
          },
          growth: earningsEstimateGrowth
        },
        1: {
          // Estimates for +1 Quarter earnings
          epsTrend: {
            current: currentEpsEstimateFollowingQuarter,
            "7daysAgo": weekEpsEstimateFollowingQuarter,
            "30daysAgo": monthEpsEstimateFollowingQuarter,
            "60daysAgo": monthsEpsEstimateFollowingQuarter,
            "90daysAgo": quarterEpsEstimateFollowingQuarter
          },
          revenueEstimate: {
            avg: revenueEstimateFollowingQuarterAvg,
            low: revenueEstimateFollowingQuarterLow,
            high: revenueEstimateFollowingQuarterHigh,
            growth: revenueEstimateFollowingQuarterGrowth
          },
          growth: earningsEstimateFollowingQuarterGrowth
        },
        3: {
          // Estimates for year-end earnings
          epsTrend: {
            current: currentEpsEstimateNextYear,
            "7daysAgo": weekEpsEstimateNextYear,
            "30daysAgo": monthEpsEstimateNextYear,
            "60daysAgo": monthsEpsEstimateNextYear,
            "90daysAgo": quarterEpsEstimateNextYear
          },
          revenueEstimate: {
            avg: revenueEstimateNextYearAvg,
            low: revenueEstimateNextYearLow,
            high: revenueEstimateNextYearHigh,
            growth: revenueEstimateNextYearGrowth
          },
          growth: earningsEstimateNextYearGrowth
        }
      }
    },
    financialData: {
      currentPrice,
      targetHighPrice,
      targetLowPrice,
      targetMeanPrice,
      recommendationKey,
      numberOfAnalystOpinions,
      totalCash,
      totalCashPerShare,
      totalDebt,
      revenuePerShare,
      returnOnAssets,
      returnOnEquity,
      grossProfits,
      operatingCashflow,
      earningsGrowth,
      revenueGrowth, // Quarterly Revenue Growth (yoy)
      operatingMargins
    },
    upgradeDowngradeHistory: { history: upgradeDowngradeHistory },
    price: { regularMarketPrice },
    cashflowStatementHistoryQuarterly: {
      cashflowStatements: {
        0: {
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
        }
      }
    },
    incomeStatementHistoryQuarterly: {
      incomeStatementHistory: {
        0: {
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
          netIncomeApplicableToCommonShares
        }
      }
    },
    balanceSheetHistoryQuarterly: {
      balanceSheetStatements: {
        0: {
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
          netTangibleAssets
        }
      }
    }
  } = yahooData.quoteSummary.result[0]

  // ------------------------------- //

  const { strongSell, sell, hold, buy, strongBuy } = recommendationTrend.find(
    t => t.period === "0m"
  )

  const {
    operatingCashflow: operatingCashflowRaw,
    capitalExpenditures: capitalExpendituresRaw,
    sharesOutstanding: sharesOutstandingRaw,
    shortLongTermDebt: shortLongTermDebtRaw,
    totalStockholderEquity: totalStockholderEquityRaw,
    revenuePerShare: revenuePerShareRaw,
    priceToSalesTrailing12Months: priceToSalesTrailing12MonthsRaw,
    regularMarketPrice: regularMarketPriceRaw
  } = selectValueTypes(
    {
      operatingCashflow,
      capitalExpenditures,
      sharesOutstanding,
      shortLongTermDebt,
      totalStockholderEquity,
      revenuePerShare,
      priceToSalesTrailing12Months,
      regularMarketPrice
    },
    "raw"
  )

  const freeCashFlow = (operatingCashflowRaw - capitalExpendituresRaw) * 4 // ANNUALIZED!!!
  const freeCashFlowPerShare = freeCashFlow / sharesOutstandingRaw
  

  return {
    ...selectValueTypes(
      // RAW //
      {
        // PRICE //

        regularMarketPrice,

        // FINANCIAL DATA

        currentPrice,
        grossProfits,
        operatingCashflow,
        revenuePerShare,
        totalCash,
        totalDebt,
        totalCashPerShare,

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
        enterpriseToRevenue,

        // FUNDAMENTALS //

        profitMargins, // probably TTM
        operatingMargins, // TTM
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
    shareHolderRightsRisk,
    freeCashFlow,
    freeCashFlowPerShare,
    operatingCashFlowPerShare: operatingCashflowRaw / sharesOutstandingRaw,
    debtToCapital:
      shortLongTermDebtRaw /
      (shortLongTermDebtRaw + totalStockholderEquityRaw),
    priceToSalesTTMCurr: `${priceToSalesTrailing12MonthsRaw.toFixed(2)} <> ${(
      regularMarketPriceRaw / revenuePerShareRaw
    ).toFixed(2)}`,
    upgradeDowngradeHistory: upgradeDowngradeHistory.reduce(
      (acc, { firm, toGrade, fromGrade }) => {
        return acc + ` ${firm}: ${fromGrade} => ${toGrade}`
      },
      ""
    ),
    anaylstRecommendations: [strongSell, sell, hold, buy, strongBuy],
    institutionsCount: institutionsCount ? institutionsCount.longFmt : null,
    nonIndexOwners: getNonIndexOwners(ownershipList),
    quarterlyEPSActualEstimateChart: quarterlyEPSActualEstimateChart
      .reduce(
        (acc, { actual, estimate }) => [...acc, estimate.raw, actual.raw, 0],
        []
      )
      .concat([currentQuarterEstimate]),
    shortVMonthAgoRatio: sharesShort / sharesShortPriorMonth
  }
}
