export const emitter = predicate => {
  const self = function LoadEmitter() {};

  self.start = function startEmitting() {
    if (self.__stop === true) self.__stop = false;

    function emit(fn, timeout) {
      // eslint-disable-next-line no-param-reassign
      timeout = timeout || 200;
      // eslint-disable-next-line vars-on-top, no-var
      window.setTimeout(() => {
        fn();

        if (self.__stop) return;
        emit(fn, timeout);
      }, timeout);
    }

    // eslint-disable-next-line prefer-arrow-callback
    emit(function Fn() {
      predicate();
    });

    return 'started';
  };

  self.stop = function stopEmitting() {
    self.__stop = true;

    return 'stopped';
  };

  return self;
};
