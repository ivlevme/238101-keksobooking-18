'use strict';

(function () {
  var ENTER = 'Enter';

  var mapPinMain = window.form.mapPinMain;
  var onMapPinMainClick = window.form.onMapPinMainClick;

  mapPinMain.addEventListener('mousedown', onMapPinMainClick);
  mapPinMain.addEventListener('keydown', function (evt) {
    if (evt.key === ENTER) {
      onMapPinMainClick();
    }
  });
})();
