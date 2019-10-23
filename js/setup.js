'use strict';

(function () {
  var MEASURE_PX = 'px';
  var PUNCTUATION_COMMA = ',';

  var KeyboardKey = {
    ESC: 'Escape',
    ENTER: 'Enter'
  };

  var ClassListMethod = {
    ADD: 'add',
    REMOVE: 'remove'
  };

  var map = document.querySelector('.map');
  var main = document.querySelector('main');

  var mapPinMain = map.querySelector('.map__pin--main');

  var middlePin = {
    width: Math.floor(mapPinMain.offsetWidth / 2),
    height: Math.floor(mapPinMain.offsetHeight / 2)
  };

  window.setup = {
    map: map,
    main: main,
    mapPinMain: mapPinMain,
    middlePin: middlePin,
    MEASURE_PX: MEASURE_PX,
    PUNCTUATION_COMMA: PUNCTUATION_COMMA,
    KeyboardKey: KeyboardKey,
    ClassListMethod: ClassListMethod
  };
})();
