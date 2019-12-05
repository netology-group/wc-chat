import { combine } from 'most/src/combinator/combine.js';
import { throttle, debounce } from 'most/src/combinator/limit.js';
import { delay } from 'most/src/combinator/delay.js';
import { filter } from 'most/src/combinator/filter.js';
import { map } from 'most/src/combinator/transform.js';
import { observe } from 'most/src/combinator/observe.js';
import curry from 'ramda/es/curry.js';

export const combineC = curry(combine);

export const debounceC = curry(debounce);

export const delayC = curry(delay);

export const filterC = curry(filter);

export const mapC = curry(map);

export const observeC = curry(observe);

export const throttleC = curry(throttle);
