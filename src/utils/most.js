import curry from 'ramda/es/curry.js';
import { combine } from 'most/src/combinator/combine.js';
import { delay } from 'most/src/combinator/delay.js';
import { filter } from 'most/src/combinator/filter.js';
import { map } from 'most/src/combinator/transform.js';
import { observe } from 'most/src/combinator/observe.js';
import { skip } from 'most';
import { throttle, debounce } from 'most/src/combinator/limit.js';

export const combineC = curry(combine);

export const debounceC = curry(debounce);

export const delayC = curry(delay);

export const filterC = curry(filter);

export const mapC = curry(map);

export const observeC = curry(observe);

export const skipC = curry(skip);

export const throttleC = curry(throttle);
