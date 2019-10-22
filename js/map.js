'use strict';

(function () {
  var ENTER = 'Enter';
  var PUNCTUATION_COMMA = ',';

  var LimitY = {
    MIN: 130,
    MAX: 630
  };

  var СuspSize = {
    WIDTH: 65,
    HEIGHT: 87
  };

  var StructureLocation = {
    X: 'x',
    Y: 'y'
  };

  var onMouseDown = function (evt) {
    pinLocation = {
      x: mapPinMain.offsetLeft,
      y: mapPinMain.offsetTop
    };

    fillAddress(evt);

    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      pinLocation = {
        x: mapPinMain.offsetLeft - shift.x,
        y: mapPinMain.offsetTop - shift.y
      };

      checkOverLimit(pinLocation, StructureLocation.X, LimitX.max - middlePin.width);
      checkUnderLimit(pinLocation, StructureLocation.X, LimitX.min - middlePin.width);
      checkOverLimit(pinLocation, StructureLocation.Y, LimitY.MAX - СuspSize.HEIGHT);
      checkUnderLimit(pinLocation, StructureLocation.Y, LimitY.MIN - СuspSize.HEIGHT);

      mapPinMain.style.left = pinLocation.x + MEASURE_PX;
      mapPinMain.style.top = pinLocation.y + MEASURE_PX;
      inputAddress.value = (pinLocation.x + middlePin.width) + PUNCTUATION_COMMA + ' ' +
        (pinLocation.y + СuspSize.HEIGHT);
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  var fillAddress = function (evt) {
    if (evt.type === 'mousedown') {
      if (defaultPinLocation.x === pinLocation.x && defaultPinLocation.y === pinLocation.y) {
        inputAddress.value = (defaultPinLocation.x + middlePin.width) + PUNCTUATION_COMMA + ' ' +
          (defaultPinLocation.y + СuspSize.HEIGHT);
      }
    }
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

  var onMapPinClick = function () {
    onMapPinMainClick();
    mapPinMain.removeEventListener('mousedown', onMapPinClick);
    mapPinMain.removeEventListener('keydown', onMapPinMainEnterKeydown);
  };

  var onMapPinMainEnterKeydown = function (evt) {
    if (evt.key === ENTER) {
      onMapPinMainClick();
      mapPinMain.removeEventListener('mousedown', onMapPinClick);
      mapPinMain.removeEventListener('keydown', onMapPinMainEnterKeydown);
    }
  };

  var map = window.setup.map;
  var mapPinMain = window.form.mapPinMain;
  var onMapPinMainClick = window.form.onMapPinMainClick;
  var inputAddress = window.form.inputAddress;
  var MEASURE_PX = window.setup.MEASURE_PX;

  mapPinMain.addEventListener('mousedown', onMapPinClick);
  mapPinMain.addEventListener('mousedown', onMouseDown);
  mapPinMain.addEventListener('keydown', onMapPinMainEnterKeydown);

  var mapOverlay = map.querySelector('.map__overlay');
  var LimitX = {
    min: 0,
    max: mapOverlay.offsetWidth
  };

  var defaultPinLocation = {
    x: parseInt(mapPinMain.style.left.substring(0, mapPinMain.style.left.length - 2), 10),
    y: parseInt(mapPinMain.style.top.substring(0, mapPinMain.style.left.length - 2), 10)
  };

  var middlePin = {
    width: Math.floor(mapPinMain.offsetWidth / 2),
    height: Math.floor(mapPinMain.offsetHeight / 2)
  };

  inputAddress.value = (defaultPinLocation.x + middlePin.width) + PUNCTUATION_COMMA + ' ' +
    (defaultPinLocation.y + middlePin.height);

  var pinLocation;
})();
