const logger =
  console ||
  function Logger() {
    return { log: () => {}, error: () => {} };
  };

export default function(namespace) {
  return (...argv) => {
    Promise.resolve(argv)
      .then(_ => logger.log(namespace ? '%s: %s' : '', `${namespace}`, ..._))
      .catch(logger.error);
  };
}
