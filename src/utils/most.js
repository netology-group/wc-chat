import { combine } from 'most/src/combinator/combine'
import { throttle, debounce } from 'most/src/combinator/limit'
import { delay } from 'most/src/combinator/delay'
import { filter } from 'most/src/combinator/filter'
import { map } from 'most/src/combinator/transform'
import { observe } from 'most/src/combinator/observe'
import curry from 'ramda/es/curry'

import { fromEvent } from 'most'

window.fe = fromEvent

export const combineC = curry(combine)

export const debounceC = curry(debounce)

export const delayC = curry(delay)

export const filterC = curry(filter)

export const mapC = curry(map)

export const observeC = curry(observe)

export const throttleC = curry(throttle)
