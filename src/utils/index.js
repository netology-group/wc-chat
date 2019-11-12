import Debug from './debug.js';

export const debug = namespace => {
  const shouldLog =
    typeof window.localStorage !== 'undefined' &&
    localStorage.length &&
    localStorage.getItem('debug') &&
    new RegExp(localStorage.getItem('debug')).test(namespace);

  return (...argv) => (shouldLog ? Debug(namespace)(...argv) : undefined);
};

const deb = debug('@netology-group/wc-chat/utils');

export const stampToDate = stamp => new Date(stamp * 1e3);

export const formatDate = (date, pattern = /\d{2}:\d{2}/) => date.toTimeString().match(pattern);

export const isAggregatedBy = (field, index, list) =>
  !index || !field ? false : list[index][field] === list[index - 1][field];

export const isLastseen = ({ index, lastseen, list }) => {
  const idx = index - 1;

  const result =
    lastseen !== undefined && list[idx] && typeof list[idx].id !== 'undefined'
      ? list[idx].id === lastseen
      : undefined;

  return Boolean(result);
};

export const requestAnimation = fn => {
  const { requestAnimationFrame } = globalThis;

  if (!requestAnimationFrame) deb('requestAnimationFrame is absent');
  // eslint-disable-next-line no-unused-expressions
  requestAnimationFrame ? requestAnimationFrame(() => fn()) : fn();
};

// TODO: get rid of `toJSON` method
export const mapToJSON = map => {
  const list = [];
  [...map.keys()].forEach(key => {
    list.push([key, map.get(key)]);
  });

  return list;
};
