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

  var delPinButtons = function () {
    var allPins = pinsContainer.querySelectorAll('.map__pin');
    allPins.forEach(function (item) {
      if (!item.classList.contains('map__pin--main')) {
        item.remove();
      }
    });
  };

  var map = document.querySelector('.map');
  var main = document.querySelector('main');
  var mapFilterContainer = map.querySelector('.map__filters-container');
  var pinsContainer = map.querySelector('.map__pins');

  var notice = document.querySelector('.notice');
  var adForm = notice.querySelector('.ad-form');


  var mapPinMain = map.querySelector('.map__pin--main');

  var middlePin = {
    width: Math.floor(mapPinMain.offsetWidth / 2),
    height: Math.floor(mapPinMain.offsetHeight / 2)
  };

  window.setup = {
    map: map,
    main: main,
    adForm: adForm,
    mapFilterContainer: mapFilterContainer,
    pinsContainer: pinsContainer,
    mapPinMain: mapPinMain,
    middlePin: middlePin,
    MEASURE_PX: MEASURE_PX,
    PUNCTUATION_COMMA: PUNCTUATION_COMMA,
    KeyboardKey: KeyboardKey,
    ClassListMethod: ClassListMethod,
    delPinButtons: delPinButtons
  };
})();
