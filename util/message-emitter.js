export const emitter = (predicate) => {
  const self = function LoadEmitter(){}

  self.start = function startEmitting () {
    function emit (fn, timeout) {
      timeout = timeout || 200
      // eslint-disable-next-line vars-on-top
      var timerId = window.setTimeout(() => {
        fn()
        // console.log({ timerId, timeout })
        window.clearInterval(timerId)

        if (self.__stop) return
        emit(fn, timeout)
      }, timeout)
    }

    emit(function Fn () {
      predicate()
    })
  }

  self.stop = function stopEmitting () {
    self.__stop = true
  }

  return self
}
