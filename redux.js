import shallowEqual from 'react-redux/lib/utils/shallowEqual'

/**
 * apply signature string to error message
 * @param {string} message - any string
 * @param {string} signature - signature to apply if it exists
 * @returns {string} new string with signature applied
 */
const withSignature = (message: string, signature?: string) => {
  return message + (signature ? '  SIGNATURE: ' + signature : '')
}

function blackList(...blackListed) {
  return (pProps, nProps) => {
    const prev = {...pProps}
    const next = {...nProps}
    for (const p in prev) {
      if (blackListed.includes(p)) {
        prev[p] = 1
      }
    }
    for (const n in next) {
      if (blackListed.includes(n)) {
        next[n] = 1
      }
    }
    return shallowEqual(prev, next)
  }
}

export const loadDataParallelSimple = (
  dataArray: Array<{
    checkRequiredData?: () => mixed,
    action: () => Dispatch<*>,
    signature?: string // give the action an ID to trace data flow
  }>,
  setLoadingMessage?: string => void,
  loadingMessage?: string
) => {
  if (loadingMessage && setLoadingMessage) setLoadingMessage(loadingMessage)

  const promiseArray = dataArray.map(data => {
    if (!data.checkRequiredData) return data.action()

    if (!data.checkRequiredData()) {
      const prom = data.action()

      // Check that the action is a promise
      try {
        prom.then
      } catch (e) {
        const err = new Error(
          withSignature(
            'IN loadDataParallelSimple, MISSING thenable action',
            data.signature
          )
        )
        return Promise.reject(err)
      }

      return prom.then(res => {
        // flow-ignore
        if ((res && res.error) || !data.checkRequiredData()) {
          return Promise.reject({ ...res, signature: data.signature })
        } else {
          return Promise.resolve(res)
        }
      })
    } else {
      return Promise.resolve(data)
    }
  })

  return Promise.all(promiseArray)
    .then(values => {
      return Promise.resolve(values)
    })
    .catch(err => {
      if (err && err.payload && err.payload.statusCode === 503) {
        if (setLoadingMessage)
          setLoadingMessage('Service unavailable, please refresh to try again')
        return Promise.reject(err)
      } else {
        if (setLoadingMessage) setLoadingMessage('Error loading data')
        return Promise.reject(err)
      }
    })
}
