'use strict';

(function () {
  var ENTER = 'Enter';

  var mapPinMain = window.form.mapPinMain;
  var activatePage = window.form.activatePage;

  mapPinMain.addEventListener('mousedown', activatePage);
  mapPinMain.addEventListener('keydown', function (evt) {
    if (evt.key === ENTER) {
      activatePage();
    }
  });
})();
