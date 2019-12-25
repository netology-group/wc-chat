const tramp = (a, b, c) => () => {
  const res = a();
  if (res) return res;

  return tramp(a, b, c);
};

export const timeoutTrampoline = (fn, timeout, opts) => {
  let trampoline = tramp(fn, timeout, opts);

  const repeatTrampoline = () => {
    if (typeof trampoline === 'function') {
      trampoline = trampoline();
      setTimeout(repeatTrampoline, timeout);
    }

    // else
    return trampoline;
  };

  const repeat = () => repeatTrampoline();

  return repeat();
};
