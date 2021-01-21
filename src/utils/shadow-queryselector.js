export const querySelector = ctx => {
  const query = (a, b, c = []) => {
    const getRoot = (d, e) => d.querySelector(e).shadowRoot;

    if (!c.length) return getRoot(a, b);

    const nextSelector = c.unshift();
    const nextCtx = getRoot(a, nextSelector);

    if (!nextCtx) return null;

    return query(nextCtx, b, c);
  };

  return (selector, path = []) => query(ctx, selector, path);
};
