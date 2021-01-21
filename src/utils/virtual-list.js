import { debug as Debug } from './index.js';

const debug = Debug('@ulms/util/VirtualList');

export class VirtualList {
  constructor({ size = 24, accessEl }) {
    this.__data = [];
    this.__list = [];
    this.__activeIds = [];
    this.__size = size;
    this.__disabled = false;
    this.__accessElFn =
      accessEl ||
      function acEl(a) {
        return a.label;
      };
    this.__updateFn = undefined;

    /* computed */
    this.__onEdge = true;
    this.__isLatestReached = true;
    this.__latestReachedElId = undefined;
  }

  set disabled(a) {
    this.__disabled = a;
  }

  set list(a) {
    const latestNextId = a.length && this.__accessElFn(a[a.length - 1]);
    const latestActiveId = this.__activeIds && this.__activeIds.slice(-1)[0];

    this.__data = a;

    // Turn `latestReached` flag off
    if (latestActiveId && latestActiveId !== latestNextId) {
      this.__isLatestReached = false;
      this.__latestReachedElId = undefined;
    }
  }

  get list() {
    const [firstVisibleId] = this.__activeIds;
    // const numberRemainsToStart = this.__data.findIndex(a => this.matchItem(a, firstVisibleId));

    if (!firstVisibleId) {
      const prevList = this.__list;

      this.__list = this.__data.slice(-1 * this.__size);
      this.__updateFn && this.__updateFn(this.__list, prevList);

      return this.__list;
    }

    // const numberAhead = numberRemainsToStart - this.__size;
    const prevList = this.__list;

    // const sliceFrom = numberAhead < 0 ? 0 : numberAhead;

    if (this.__latestReachedElId) {
      const latestReachedElIndex = this.__data.findIndex(a =>
        this.matchItem(a, this.__latestReachedElId),
      );

      debug('Latest reached', latestReachedElIndex);

      if (this.__disabled) {
        // const from = this.__data.length - this.__size;

        this.__list = this.__data; // .slice(from < 0 ? 0 : from, this.__data.length);
      } else {
        this.__list = this.__data; // .slice(sliceFrom, latestReachedElIndex + 1);
      }
    } else {
      this.__list = this.__data; // .slice(sliceFrom);
    }

    debug('Update list', this.__list);

    this.__updateFn && this.__updateFn(this.__list, prevList);

    return this.__list;
  }

  get forward() {
    return this.__onEdge;
  }

  set size(a) {
    if (!isNaN(a)) {
      this.__size = a;
    } else {
      debug('Can not change size');
    }
  }

  adjust(ids = [], auto = false) {
    const oldIds = this.__activeIds;

    // Toggle `latestReached` flag on if latest id matches the last item
    const latestVisibleId = ids[ids.length - 1];
    const latestExistedEl = this.__data[this.__data.length - 1];

    if (latestVisibleId && latestExistedEl && this.matchItem(latestExistedEl, latestVisibleId)) {
      this.__isLatestReached = true;
      this.__latestReachedElId = latestVisibleId;
    } else {
      this.__isLatestReached = false;
    }

    const currentList = this.list;

    const lastVisibleId = oldIds[oldIds.length - 1];
    const prevVisibleId = oldIds[oldIds.length - 2];

    const lastExistedEl = currentList[currentList.length - 1];
    const prevExistedEl = currentList[currentList.length - 2];
    // access last and prevous elements at the list as adjust meant to be called multiple times on update when the list is actual

    if (!lastExistedEl || !lastVisibleId || auto) {
      this.__onEdge = true;
    } else if (
      this.matchItem(lastExistedEl, lastVisibleId) ||
      this.matchItem(prevExistedEl, lastVisibleId) ||
      this.matchItem(lastExistedEl, prevVisibleId) // is needed on element delete from list
    ) {
      this.__onEdge = true;
    } else {
      this.__onEdge = false;
    }

    const cleanupIds = a => {
      const end = a[a.length - 1];

      if (end === 'undefined') {
        a.splice(-1);
      }

      return a;
    };

    this.__activeIds = cleanupIds(ids);
  }

  destroy() {
    this.__data = [];
    this.__updateFn = undefined;
  }

  filterVisible() {
    return this.list;
  }

  onUpdate(listener) {
    this.__updateFn = listener;
  }

  matchItem(el, id) {
    return this.__accessElFn(el) === id;
  }
}
