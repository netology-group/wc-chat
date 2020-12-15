import EventTarget from '@ungap/event-target';

import { timeoutTrampoline as repeat } from './recursion.js';

export function Queue(options = {}) {
  let target = new EventTarget();
  let list = [];
  let updateNeeded = false;

  const opts = {
    timeout: 1e3,
    ...options,
  };

  const requestUpdate = () => {
    updateNeeded = true;
  };

  let self = {
    emitter: target,
    on(name, listener) {
      target.addEventListener(name, listener, { passive: true });

      return self;
    },
    off(name, listener) {
      target.removeEventListener(name, listener);

      return self;
    },
    push(a) {
      if (Array.isArray(a)) {
        if (list !== a) {
          list = a;
          requestUpdate();
        }

        return list;
      }
      // else
      const index = list.push(a);

      list = [...list];
      requestUpdate();

      return index;
    },
    list() {
      return list;
    },
    destroy() {
      target = undefined;
      list = undefined;
      self = undefined;
    },
  };

  repeat(() => {
    if (updateNeeded) {
      target.dispatchEvent(new CustomEvent('list', { detail: { list } }));
      updateNeeded = false;
    }
  }, opts.timeout);

  return self;
}
