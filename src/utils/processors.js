const inRange = (sym, range) => {
  const code = sym.charCodeAt();

  return range[0] <= code && code <= range[1];
};

export class SymbolRangeProcessor {
  constructor() {
    this._ranges = [];
    this._subst = () => '';
  }

  process(input, ranges) {
    const { _ranges } = this;
    const allRanges = ranges || _ranges;

    let output = input;

    if (!output || !ranges.length) return [output, false];

    const matchRange = (sym, list) => list.some(range => inRange(sym, range));

    output = output
      .split('')
      .reduce(
        (acc, i) => (matchRange(i, allRanges) ? `${acc}${this._subst(i)}` : `${acc}${i}`),
        '',
      );

    return [output, output !== input];
  }
}

export const ranges = new Map([['latin_extended_additional', [7680, 7935]]]);
