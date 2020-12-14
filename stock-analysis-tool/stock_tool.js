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
    .join(",")
}

function buildCompanyData(yahooData, atData) {
  try {
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
        pegRatio: yahPegRatio,
        priceToBook,
        profitMargins,
        sharesOutstanding: yahSharesOutstanding,
        sharesPercentSharesOut, // "Short % of Shares Outstanding"
        sharesShort,
        sharesShortPreviousMonthDate,
        sharesShortPriorMonth,
        shortPercentOfFloat,
        shortRatio,
        trailingEps // essentiall current EPS
      },
      fundOwnership: { ownershipList },
      summaryDetail: {
        dividendRate, // "Forward Dividend
        dividendYield: yahDivYield, // & Yield"
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
      calendarEvents: {
        earnings: { earningsAverage, earningsLow, earningsHigh, earningsDate } // upcoming quarter-end projections
      },
      earnings: {
        earningsChart: { quarterly: quarterlyEPSActualEstimateChart }
      },
      majorHoldersBreakdown: { institutionsCount },
      earningsTrend: {
        trend: {
          0: {
            epsTrend: {
              current: currentEpsEstimate,
              "7daysAgo": weekEpsEstimate,
              "30daysAgo": monthEpsEstimate,
              "60daysAgo": monthsEpsEstimate,
              "90daysAgo": quarterEpsEstimate
            }
          },
          1: {
            epsTrend: {
              current: currentEpsEstimateNextQuarter,
              "7daysAgo": weekEpsEstimateNextQuarter,
              "30daysAgo": monthEpsEstimateNextQuarter,
              "60daysAgo": monthsEpsEstimateNextQuarter,
              "90daysAgo": quarterEpsEstimateNextQuarter
            },
            revenueEstimate: {
              avg: revenueEstimateAvg,
              low: revenueEstimateLow,
              high: revenueEstimateHigh
            }
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
        returnOnAssets: yahReturnOnAssets,
        returnOnEquity: yahReturnOnEquity,
        grossProfits,
        operatingCashflow,
        earningsGrowth,
        revenueGrowth,
        operatingMargins
      },
      upgradeDowngradeHistory: { history: upgradeDowngradeHistory },
      price: { regularMarketPrice }
    } = yahooData.quoteSummary.result[0]
    
    const {
      dividendAmount,
      dividendYield,
      dividendDate,
      peRatio,
      pegRatio,
      pbRatio,
      prRatio,
      pcfRatio,
      grossMarginTTM,
      grossMarginMRQ,
      netProfitMarginTTM,
      netProfitMarginMRQ,
      operatingMarginTTM,
      operatingMarginMRQ,
      returnOnEquity,
      returnOnAssets,
      returnOnInvestment,
      quickRatio,
      currentRatio,
      interestCoverage,
      totalDebtToCapital,
      ltDebtToEquity,
      totalDebtToEquity,
      epsTTM,
      epsChangePercentTTM,
      epsChangeYear,
      epsChange,
      revChangeYear,
      revChangeTTM,
      revChangeIn,
      sharesOutstanding,
      bookValuePerShare,
      shortIntToFloat,
      shortIntDayToCover,
      divGrowthRate3Year,
      dividendPayAmount,
      dividendPayDate,
    } = atData

    // ------------------------------- //
    
    const { strongSell, sell, hold, buy, strongBuy } = recommendationTrend.find(
      t => t.period === "0m"
    )
    return {
      // TO DO //
      
      //netIncome,
      //revenue,
      //costOfRevenue,
      //grossProfit,
      //researchDevelopment,
      //sellingGeneralAdministrative,
      //totalOperatingExpenses,
      //operatingIncome,
      //totalOtherIncomeExpenseNet,
      //interestExpense,
      //incomeBeforeTax,
      //netIncomeApplicableToCommonShares,
      //netTangibleAssets,
      //totalStockholderEquity,
      //retainedEarnings,
      //totalCurrentAssets,
      //propertyPlantEquipment,
      //totalAssets,
      //totalLiab,
      //totalCurrentLiabilities,
      //longTermDebt,
      //shortLongTermDebt,
      //depreciation,
      //investments,
      //issuanceOfStock,
      //changeInCash,
      //repurchaseOfStock,
      //projRevenueGrowth: revenueEstimateAvg.raw / totalRevenue.raw - 1,
      //capexRaD: capitalExpenditures + radExpenditures,
      
      // TD Ameritrade //
      
      bookValuePerShare,
      currentRatio,
      divGrowthRate3Year,
      dividendAmount,
      dividendDate,
      dividendPayAmount,
      dividendPayDate,
      dividendYield,
      epsChange,
      epsChangePercentTTM,
      epsChangeYear,
      epsTTM,
      grossMarginMRQ,
      grossMarginTTM,
      interestCoverage,
      ltDebtToEquity,
      netProfitMarginMRQ,
      netProfitMarginTTM,
      operatingMarginMRQ,
      operatingMarginTTM,
      pbRatio,
      pcfRatio,
      pegRatio,
      peRatio,
      prRatio,
      quickRatio,
      returnOnAssets,
      returnOnEquity,
      returnOnInvestment,
      revChangeIn,
      revChangeTTM,
      revChangeYear,
      sharesOutstanding,
      shortIntDayToCover,
      shortIntToFloat,
      totalDebtToCapital,
      totalDebtToEquity,
      
      // yahoo //
      
      ...selectValueTypes(
        {
          regularMarketPrice,
          revenueEstimateAvg,
          revenueEstimateLow,
          revenueEstimateHigh,
          dividendRate,
          earningsAverage,
          earningsHigh,
          earningsLow,
          enterpriseValue,
          fiftyDayAverage,
          fiveYearAvgDividendYield,
          floatShares,
          heldPercentInsiders,
          netIncomeToCommon,
          trailingAnnualDividendRate,
          twoHundredDayAverage,
          currentEpsEstimate,
          currentEpsEstimateNextQuarter,
          weekEpsEstimate,
          weekEpsEstimateNextQuarter,
          monthEpsEstimate,
          monthEpsEstimateNextQuarter,
          monthsEpsEstimate,
          monthsEpsEstimateNextQuarter,
          quarterEpsEstimate,
          quarterEpsEstimateNextQuarter,
          currentPrice,
          targetHighPrice,
          targetLowPrice,
          targetMeanPrice,
          numberOfAnalystOpinions,
          totalCash,
          totalCashPerShare,
          totalDebt,
          revenuePerShare,
          grossProfits,
          operatingCashflow,
          lastDividendValue
        },
        "raw"
      ),
      ...selectValueTypes(
        {
          yahReturnOnAssets,
          yahReturnOnEquity,
          beta,
          earningsGrowth,
          revenueGrowth,
          operatingMargins,
          bookValue,
          dateShortInterest,
          earningsDate,
          earningsQuarterlyGrowth,
          enterpriseToRevenue,
          exDividendDate,
          forwardPE,
          heldPercentInstitutions,
          lastDividendDate,
          lastFiscalYearEnd,
          mostRecentQuarter,
          payoutRatio,
          priceToBook,
          priceToSalesTrailing12Months,
          profitMargins,
          regularMarketVolume,
          sharesPercentSharesOut,
          sharesShortPreviousMonthDate,
          shortPercentOfFloat,
          shortRatio,
          trailingAnnualDividendYield,
          trailingPE
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
      priceToSalesTTMCurr: `${priceToSalesTrailing12Months.raw.toFixed(
        2
      )} <> ${(regularMarketPrice.raw / revenuePerShare.raw).toFixed(2)}`,
      upgradeDowngradeHistory: upgradeDowngradeHistory.reduce(
        (acc, { firm, toGrade, fromGrade }) => {
          return acc + ` ${firm}: ${fromGrade} => ${toGrade}`
        },
        ""
      ),
      anaylstRecommendations: [strongSell, sell, hold, buy, strongBuy],
      institutionsCount: institutionsCount.longFmt,
      nonIndexOwners: getNonIndexOwners(ownershipList),
      projEPSGrowth: forwardEps.raw / trailingEps.raw - 1,
      quarterlyEPSActualEstimateChart: quarterlyEPSActualEstimateChart.map(
        ({ actual, estimate }) => ({
          actual: actual.raw,
          estimate: estimate.raw
        })
      ),
      shortVMonthAgoRatio: sharesShort.raw / sharesShortPriorMonth.raw
    }
  } catch (error) {
    return { error }
  }
}
