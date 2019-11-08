'use strict';

(function () {
  var MEASURE_PX = window.setup.MEASURE_PX;
  var PUNCTUATION_COMMA = window.setup.PUNCTUATION_COMMA;

  var LimitY = {
    MIN: 130,
    MAX: 630
  };

  var PinSize = {
    WIDTH: 65,
    HEIGHT: 87
  };

  var StructureLocation = {
    X: 'x',
    Y: 'y'
  };

  var map = window.setup.map;
  var middlePin = window.setup.middlePin;

  var mapPinMain = window.form.mapPinMain;
  var onMapPinMainClick = window.form.onMapPinMainClick;
  var inputAddress = window.form.inputAddress;
  var onMapPinMainEnterPress = window.form.onMapPinMainEnterPress;
  var defaultPinLocation = window.form.defaultPinLocation;
  var getCordsView = window.form.getCordsView;
  var Coordinate = window.form.Coordinate;

  var pinLocation;

  var mapOverlay = map.querySelector('.map__overlay');
  var LimitX = {
    min: 0,
    max: mapOverlay.offsetWidth
  };

  var onMouseDown = function (evt) {
    pinLocation = new Coordinate(mapPinMain.offsetLeft, mapPinMain.offsetTop);

    if (defaultPinLocation.x === pinLocation.x && defaultPinLocation.y === pinLocation.y) {
      inputAddress.value = getCordsView(defaultPinLocation.x + middlePin.width,
          defaultPinLocation.y + PinSize.HEIGHT);
    }

    var startCoords = new Coordinate(evt.clientX, evt.clientY);

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      var shift = new Coordinate(startCoords.x - moveEvt.clientX, startCoords.y - moveEvt.clientY);
      startCoords = new Coordinate(moveEvt.clientX, moveEvt.clientY);
      pinLocation = new Coordinate(mapPinMain.offsetLeft - shift.x, mapPinMain.offsetTop - shift.y);

      checkOverLimit(pinLocation, StructureLocation.X, LimitX.max - middlePin.width);
      checkUnderLimit(pinLocation, StructureLocation.X, LimitX.min - middlePin.width);
      checkOverLimit(pinLocation, StructureLocation.Y, LimitY.MAX - PinSize.HEIGHT);
      checkUnderLimit(pinLocation, StructureLocation.Y, LimitY.MIN - PinSize.HEIGHT);

      mapPinMain.style.left = pinLocation.x + MEASURE_PX;
      mapPinMain.style.top = pinLocation.y + MEASURE_PX;
      inputAddress.value = (pinLocation.x + middlePin.width) + PUNCTUATION_COMMA + ' ' +
        (pinLocation.y + PinSize.HEIGHT);
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  var checkOverLimit = function (position, key, limit) {
    if (position[key] >= limit) {
      position[key] = limit;
    }
  };

  var checkUnderLimit = function (position, key, limit) {
    if (position[key] <= limit) {
      position[key] = limit;
    }
  };

  mapPinMain.addEventListener('mousedown', onMapPinMainClick);
  mapPinMain.addEventListener('mousedown', onMouseDown);
  mapPinMain.addEventListener('keydown', onMapPinMainEnterPress);


  inputAddress.value = getCordsView(defaultPinLocation.x + middlePin.width,
      defaultPinLocation.y + middlePin.height);
})();
