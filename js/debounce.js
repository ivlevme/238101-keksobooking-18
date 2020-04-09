'use strict';

(function () {
  var DEBOUNCE_INTERVAL = 1000;

  var lastTimeout = null;

  window.debounce = function (cb) {
    return function () {
      if (lastTimeout) {
        window.clearTimeout(lastTimeout);
      }
      lastTimeout = window.setTimeout(cb, DEBOUNCE_INTERVAL);
    }();
  };
})();
