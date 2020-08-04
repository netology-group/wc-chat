import Debug from './debug.js';

export const debug = namespace => {
  let shouldLog;

  try {
    shouldLog =
      typeof window.localStorage !== 'undefined' &&
      localStorage.length &&
      localStorage.getItem('debug') &&
      new RegExp(localStorage.getItem('debug')).test(namespace);
  } catch (error) {
    shouldLog = undefined;
  }

  return (...argv) => (shouldLog ? Debug(namespace)(...argv) : undefined);
};

const deb = debug('@ulms/wc-chat/utils');

export const stampToDate = stamp => new Date(stamp * 1e3);

export const formatDate = (date, pattern = /\d{2}:\d{2}/) => date.toTimeString().match(pattern);

export const readableTime = maybeDate => {
  const inputDate = new Date(maybeDate);

  if (isNaN(inputDate.getTime())) {
    deb('Ivalid date:', inputDate);

    return [];
  }

  const isToday = new Date().setHours(0, 0, 0, 0) === new Date(inputDate).setHours(0, 0, 0, 0);

  return [
    isToday ? formatDate(inputDate)[0] : inputDate.toLocaleDateString(),
    inputDate.toLocaleString(),
  ];
};

export const isAggregatedBy = (field, index, list) =>
  !index || !field ? false : list[index][field] === list[index - 1][field];

export const isAggregatedByDate = (field, index, list, interval = 86400) => {
  if (!index || !field) return false;

  const prev = list[index - 1][field];
  const next = list[index][field];

  if (!prev || !next) return false;

  const nextD = new Date(next);
  const prevD = new Date(prev);

  if (isNaN(nextD.getTime()) || isNaN(prevD.getTime())) return false;

  return (
    nextD.getTime() > prevD.getTime() && nextD.getTime() / 1e3 - prevD.getTime() / 1e3 <= interval
  );
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
