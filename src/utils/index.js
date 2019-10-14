import Debug from 'debug'
import invariant from 'invariant'

// eslint-disable-next-line no-unused-vars
const _ = ns => (cond, ...argv) => invariant(cond, ...argv)

export const Invariant = (namespace) => {
  const nvrnt = _(namespace)

  return (...argv) => nvrnt(process.env.NODE_ENV === 'production', ...argv)
}

export const debug = (namespace) => {
  const deb = Debug(namespace)

  return (...argv) => process.env.NODE_ENV !== 'production' ? deb(...argv) : undefined
}

const deb = debug('@netology-group/wc-chat/utils')

export const stampToDate = stamp => new Date(stamp * 1e3)

export const formatDate = (date, pattern = /\d{2}:\d{2}/) => date.toTimeString().match(pattern)

export const isAggregatedBy = (field, index, list) => (!index || !field)
  ? false
  : list[index][field] === list[index - 1][field]

export const isLastseen = ({
  index,
  lastseen,
  list,
}) => {
  const idx = index - 1

  const result = (
    lastseen !== undefined
    && list[idx]
    && typeof list[idx].id !== 'undefined'
  )
    ? list[idx].id === lastseen
    : undefined

  return Boolean(result)
}

export const requestAnimation = (fn) => {
  const { requestAnimationFrame } = globalThis

  if (!requestAnimationFrame) deb('requestAnimationFrame is absent')
  requestAnimationFrame
    ? requestAnimationFrame(() => fn())
    : fn()
}
