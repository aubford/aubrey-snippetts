// 🍤  GET COMPANY DATA 🍤
function getCompanyData(firstRowRange, dataPoint) {
  const displaySheetTickers = firstRowRange[0]
  const dataSheetName = displaySheetTickers.shift()
  const dataSheet = getSheet(dataSheetName)
    .getDataRange()
    .getValues()

  const dataSheetTickers = dataSheet[0].slice(1)

  const dataPointData = dataSheet
    .find(datum => datum[0] === dataPoint)
    .slice(1)
    .map(datum => {
      try {
        return JSON.parse(datum)
      } catch (err) {
        return datum
      }
    })

  return [
    dataPointData.map((val, idx, arr) => {
      const ticker = displaySheetTickers[idx]
      const dataSheetIdx = dataSheetTickers.indexOf(ticker)
      return arr[dataSheetIdx]
    })
  ]
}

function getCompanyDatum(ticker, dataSheetName, dataPoint) {
  const dataSheet = getSheet(dataSheetName)
    .getDataRange()
    .getValues()

  const tickerIndex = dataSheet[0].indexOf(ticker)
  const datum = dataSheet.find(row => row[0] === dataPoint)[tickerIndex]
  try {
    return JSON.parse(datum)
  } catch (e) {
    return datum
  }
}

///////////////////////////////  TEST /////////////////////////////////////

const testDataPoint = "anaylstRecommendations"
const displaySheetFirstRowTestData = [
  ["2/2/2021, 6:07:51 PM", "Stock3", "Stock1", "Stock2", "Stock4"]
]
const dataSheetTestData = [
  ["2/2/2021, 11:11:35 PM", "Stock1", "Stock2", "Stock3", "Stock4"],
  ["anaylstRecommendations", "[1,1,1,1,1]", "[2,2,2,2,2]", "[3,3,3,3,3]", "[4,4,4,4,4]"],
  ["auditRisk", 1, 2, 3, 4],
  ["beta", "one", "two", "three", "four"]
]

function getSheet() {
  return {
    getDataRange: () => ({
      getValues: () => dataSheetTestData
    })
  }
}

//getCompanyData(displaySheetFirstRowTestData, testDataPoint)
getCompanyDatum("Stock1", "2/2/2021, 11:11:35 PM", testDataPoint) /* ?*/
