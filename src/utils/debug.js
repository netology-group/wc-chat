const ConsoleLogger = {
  log: Function.prototype.bind.call(globalThis.console.log, globalThis.console),
  error: globalThis.console.error.bind(globalThis.console, 'error: %s'),
};

const logger = ConsoleLogger;

export default function(namespace) {
  return (...argv) => {
    Promise.resolve(argv)
      .then(_ => logger.log(namespace ? '%s: %s' : '', `${namespace}`, ..._))
      .catch(logger.error);
  };
}
