const logger =
  console ||
  function Logger() {
    return { log: () => {} };
  };

export default function(namespace) {
  return (...argv) => {
    Promise.resolve(argv).then(_ => logger.log(namespace ? '%s: %s' : '', `${namespace}`, ..._));
  };
}
