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
        earningsChart: {
          quarterly: quarterlyEPSActualEstimateChart,
          currentQuarterEstimate
        }
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
        returnOnAssets: yahReturnOnAssets,
        returnOnEquity: yahReturnOnEquity,
        grossProfits,
        operatingCashflow,
        earningsGrowth,
        revenueGrowth, // Quarterly Revenue Growth (yoy)
        operatingMargins
      },
      upgradeDowngradeHistory: { history: upgradeDowngradeHistory },
      price: { regularMarketPrice }
    } = yahooData.quoteSummary.result[0]

    const {
      cusip,
      fundamental: {
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
        divGrowthRate3Year: divGrowthRateThreeYear,
        dividendPayAmount,
        dividendPayDate
      }
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

      cusip,
      dividendAmount,
      shortIntToFloat, // nope
      shortIntDayToCover,
      divGrowthRateThreeYear,
      currentRatio, // nope
      dividendPayAmount,
      returnOnEquity,
      dividendPayDate,
      quickRatio, // nope
      totalDebtToEquity,
      ltDebtToEquity,
      totalDebtToCapital, // nope
      dividendDate,
      peRatio,
      pbRatio,
      prRatio,
      pcfRatio,
      grossMarginTTM,
      grossMarginMRQ,
      netProfitMarginTTM,
      netProfitMarginMRQ,
      operatingMarginTTM,
      operatingMarginMRQ,
      returnOnInvestment, // nope
      interestCoverage, // nope
      epsTTM,
      epsChangePercentTTM, // nope
      epsChangeYear, // nope
      epsChange, // nope
      revChangeYear,
      revChangeTTM, // nope
      revChangeIn,
      bookValuePerShare,
      sharesOutstanding,
      dividendYield,
      pegRatio,
      returnOnAssets,

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
          currentEpsEstimate, // current estimate for this quarter
          currentEpsEstimateFollowingQuarter, //current estimate for next quarter
          currentEpsEstimateNextYear,
          weekEpsEstimate, // estimate from a week ago for this quarter
          weekEpsEstimateFollowingQuarter, // estimate from a week ago for next quarter
          weekEpsEstimateNextYear,
          monthEpsEstimate,
          monthEpsEstimateFollowingQuarter,
          monthEpsEstimateNextYear,
          monthsEpsEstimate, // estimate from 2 months ago for this quarter
          monthsEpsEstimateFollowingQuarter, // // estimate from 2 months ago for next quarter
          monthsEpsEstimateNextYear,
          quarterEpsEstimate,
          quarterEpsEstimateFollowingQuarter,
          quarterEpsEstimateNextYear,

          revenueEstimateFollowingQuarterAvg,
          revenueEstimateFollowingQuarterLow,
          revenueEstimateFollowingQuarterHigh,
          revenueEstimateNextYearAvg,
          revenueEstimateNextYearLow,
          revenueEstimateNextYearHigh,

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
          revenueGrowth, // Quarterly Revenue Growth (yoy)
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
          trailingPE,
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
      projEPSGrowth: earningsEstimateFollowingQuarterGrowth.raw,
      projSalesGrowth: revenueEstimateFollowingQuarterGrowth.raw,
      quarterlyEPSActualEstimateChart: quarterlyEPSActualEstimateChart
        .reduce(
          (acc, { actual, estimate }) => [...acc, estimate.raw, actual.raw, 0],
          []
        )
        .concat([currentQuarterEstimate.raw]),
      shortVMonthAgoRatio: sharesShort.raw / sharesShortPriorMonth.raw
    }
  } catch (error) {
    return { error }
  }
}
