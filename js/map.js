'use strict';

(function () {
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

  var map = window.setup.map;
  var middlePin = window.setup.middlePin;
  var MEASURE_PX = window.setup.MEASURE_PX;
  var PUNCTUATION_COMMA = window.setup.PUNCTUATION_COMMA;

  var mapPinMain = window.form.mapPinMain;
  var onMapPinMainClick = window.form.onMapPinMainClick;
  var inputAddress = window.form.inputAddress;
  var onMapPinMainEnterKeydown = window.form.onMapPinMainEnterKeydown;
  var defaultPinLocation = window.form.defaultPinLocation;

  var pinLocation;

  mapPinMain.addEventListener('mousedown', onMapPinMainClick);
  mapPinMain.addEventListener('mousedown', onMouseDown);
  mapPinMain.addEventListener('keydown', onMapPinMainEnterKeydown);

  var mapOverlay = map.querySelector('.map__overlay');
  var LimitX = {
    min: 0,
    max: mapOverlay.offsetWidth
  };

  inputAddress.value = (defaultPinLocation.x + middlePin.width) + PUNCTUATION_COMMA + ' ' +
    (defaultPinLocation.y + middlePin.height);

})();
