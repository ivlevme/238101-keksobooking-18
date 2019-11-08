'use strict';

(function () {
  var MEASURE_PX = 'px';
  var PUNCTUATION_COMMA = ',';

  var TypeAccommodation = {
    BUNGALO: 'bungalo',
    FLAT: 'flat',
    HOUSE: 'house',
    PALACE: 'palace'
  };

  var KeyboardKey = {
    ESC: 'Escape',
    ENTER: 'Enter'
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

  var delElements = function (classElem) {
    var allElements = map.querySelectorAll(classElem);
    allElements.forEach(function (item) {
      item.remove();
    });
  };

  window.setup = {
    PUNCTUATION_COMMA: PUNCTUATION_COMMA,
    MEASURE_PX: MEASURE_PX,
    map: map,
    main: main,
    adForm: adForm,
    notice: notice,
    mapFilterContainer: mapFilterContainer,
    pinsContainer: pinsContainer,
    mapPinMain: mapPinMain,
    middlePin: middlePin,
    TypeAccommodation: TypeAccommodation,
    KeyboardKey: KeyboardKey,
    delElements: delElements
  };
})();
