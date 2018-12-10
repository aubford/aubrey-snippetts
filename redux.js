import shallowEqual from 'react-redux/lib/utils/shallowEqual'

function blackList(...blackListed) {
  return (pProps, nProps) => {
    const prev = {...pProps}
    const next = {...nProps}
    for (var p in prev) {
      if (blackListed.includes(p)) {
        prev[p] = 1
      }
    }
    for (var n in next) {
      if (blackListed.includes(n)) {
        next[n] = 1
      }
    }
    return shallowEqual(prev, next)
  }
}