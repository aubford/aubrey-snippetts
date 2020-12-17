/*
  
  assetProfile,summaryProfile,summaryDetail,esgScores,price,defaultKeyStatistics,financialData,calendarEvents,secFilings,recommendationTrend,upgradeDowngradeHistory,institutionOwnership,fundOwnership,majorDirectHolders,majorHoldersBreakdown,insiderTransactions,insiderHolders,netSharePurchaseActivity,earnings,earningsTrend,industryTrend,indexTrend,sectorTrend,cashflowStatementHistoryQuarterly,incomeStatementHistoryQuarterly,balanceSheetHistoryQuarterly
  
*/


import stockData from "./attData"
import { isNumber } from "underscore"

const billion = 1000000000
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

const {
  balanceSheetHistoryQuarterly: { balanceSheetStatements },
  financialData: { totalDebt }
} = stockData.quoteSummary.result[0]
const balanceSheet = selectValueTypes(balanceSheetStatements[0], "raw") /* ?+*/
const bsValues = Object.values(balanceSheet)
const {
  maxAge,
  endDate,
  shortTermInvestments,
  netReceivables,
  inventory,
  otherCurrentAssets,
  totalCurrentAssets,
  propertyPlantEquipment,
  goodWill,
  intangibleAssets,
  otherAssets,
  totalAssets,
  commonStock,
  retainedEarnings,
  treasuryStock,
  capitalSurplus,
  otherStockholderEquity,
  totalStockholderEquity,
  netTangibleAssets,

  cash,
  // liabilities //
  longTermInvestments,
  deferredLongTermAssetCharges,

  accountsPayable,
  otherCurrentLiab,
  totalCurrentLiabilities,

  deferredLongTermLiab,
  shortLongTermDebt,
  longTermDebt,

  minorityInterest,
  otherLiab,
  totalLiab
} = balanceSheet


const currentDebt = totalCurrentLiabilities - accountsPayable - otherCurrentLiab


totalDebt.raw; /* ? $/billion */
totalDebt.raw - cash/* ? $/billion*/
longTermDebt + shortLongTermDebt + currentDebt; /* ? $/billion */
currentDebt; /* ? $/billion */

cash /* ? $/billion*/
deferredLongTermAssetCharges /* ? $/billion*/
longTermInvestments /* ? $/billion*/

accountsPayable /* ? $/billion*/
otherCurrentLiab /* ? $/billion*/
totalCurrentLiabilities /* ? $/billion*/

shortLongTermDebt /* ? $/billion*/
deferredLongTermLiab /* ? $/billion*/
longTermDebt /* ? $/billion*/

minorityInterest /* ? $/billion*/
otherLiab /* ? $/billion*/
totalLiab /* ? $/billion*/



const targetValue = 310.693 * billion
const range = 0.1 * billion

const testTarget = (num, history) => {
  const diff = num - targetValue
  if (Math.abs(diff) < range) {
    console.log("*******************HIT*********************", history)
    return true
  }
  return false
}

const findCombination = (num, history) => {
  if (!isNumber(num) || testTarget(num, history) || history.length > 2) {
    return
  }
  bsValues.forEach(val => {
    findCombination(num + val, history.concat(val))
    findCombination(num - val, history.concat(val))
  })
}

bsValues.forEach(val => findCombination(val, [val]))

otherCurrentLiab + netReceivables + retainedEarnings /* ? $/billion*/
