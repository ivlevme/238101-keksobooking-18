'use strict';

(function () {
  var DISABLED = true;
  var tags = {
    fieldset: 'fieldset',
    select: 'select'
  };

  var roomsErrorText = {
    one: '1 комната — «для 1 гостя»',
    two: '2 комнаты — «для 2 гостей» или «для 1 гостя»',
    three: '3 комнаты — «для 3 гостей», «для 2 гостей» или «для 1 гостя»',
    hundred: '100 комнат — «не для гостей»'
  };

  var activatePage = function () {
    mapContainer.classList.remove('map--faded');
    adForm.classList.remove('ad-form--disabled');

    changeFormElements(adForm, tags.fieldset, !DISABLED);
    changeFormElements(mapFilters, tags.select, !DISABLED);
    changeFormElements(mapFilters, tags.fieldset, !DISABLED);

    var PinLocation = {
      x: defaultPinLocation.x + pinSize.width,
      y: defaultPinLocation.y + pinSize.height
    };
    inputAddress.value = PinLocation.x + ', ' + PinLocation.y;
    mapOverlayContainer.appendChild(window.pinsFragment);
  };

  var changeFormElements = function (form, tagElement, status) {
    var elements = form.querySelectorAll(tagElement);
    elements = Array.from(elements);
    elements.forEach(function (item) {
      item.disabled = status;
    });
  };

  var changeInputValue = function (element, information) {
    element.value = information;
  };

  var onCustomValidate = function () {
    var inputRooms = adForm.querySelector('select[name="rooms"]');
    var inputCapacity = adForm.querySelector('select[name="capacity"]');

    var inputRoomsSelected = parseInt(inputRooms.value, 10);
    var inputCapacitySelected = parseInt(inputCapacity.value, 10);

    var capacityThreeGuests = parseInt(inputCapacity.options[0].value, 10);
    var capacityTwoGuests = parseInt(inputCapacity.options[1].value, 10);
    var capacityOneGuests = parseInt(inputCapacity.options[2].value, 10);
    var capacityNoGuests = parseInt(inputCapacity.options[3].value, 10);

    var roomOne = parseInt(inputRooms.options[0].value, 10);
    var roomsTwo = parseInt(inputRooms.options[1].value, 10);
    var roomsThree = parseInt(inputRooms.options[2].value, 10);
    var roomsHundred = parseInt(inputRooms.options[3].value, 10);

    var validRatiosRoomsGuests = [
      [roomOne, capacityOneGuests],
      [roomsTwo, capacityTwoGuests],
      [roomsTwo, capacityOneGuests],
      [roomsThree, capacityThreeGuests],
      [roomsThree, capacityTwoGuests],
      [roomsThree, capacityOneGuests],
      [roomsHundred, capacityNoGuests]
    ];

    var currentRatioRoomsGuests = [inputRoomsSelected, inputCapacitySelected];
    var errorStatus = defineError(currentRatioRoomsGuests, validRatiosRoomsGuests,
        inputRooms);
    if (errorStatus) {
      switch (inputRoomsSelected) {
        case roomOne:
          inputRooms.setCustomValidity(roomsErrorText.one);
          break;
        case roomsTwo:
          inputRooms.setCustomValidity(roomsErrorText.two);
          break;
        case roomsThree:
          inputRooms.setCustomValidity(roomsErrorText.three);
          break;
        case roomsHundred:
          inputRooms.setCustomValidity(roomsErrorText.hundred);
          break;
        default:
          break;
      }
    }
  };

  var defineError = function (currentRatio, validRatios, inputError) {
    var errorFlag = true;
    for (var i = 0; i < validRatios.length; i++) {
      var firstLine = validRatios[i];
      var j = 0;
      if (currentRatio[j] === firstLine[j] && currentRatio[j + 1] === firstLine[j + 1]) {
        errorFlag = false;
        inputError.setCustomValidity('');
        break;
      }
    }
    return errorFlag;
  };

  var mapContainer = document.querySelector('.map');
  var mapPinMain = mapContainer.querySelector('.map__pin--main');
  var pinSize = window.data.pinSize;

  var defaultPinLocation = {
    x: parseInt(mapPinMain.style.left.substring(0, mapPinMain.style.left.length - 2), 10),
    y: parseInt(mapPinMain.style.top.substring(0, mapPinMain.style.left.length - 2), 10)
  };

  var notice = document.querySelector('.notice');
  var adForm = notice.querySelector('.ad-form');
  var mapFilters = mapContainer.querySelector('.map__filters');
  var mapOverlayContainer = mapContainer.querySelector('.map__pins');

  changeFormElements(adForm, tags.fieldset, DISABLED);
  changeFormElements(mapFilters, tags.select, DISABLED);
  changeFormElements(mapFilters, tags.fieldset, DISABLED);

  var inputAddress = adForm.querySelector('input[name="address"]');
  var inputAddressValue = defaultPinLocation.x + ', ' + defaultPinLocation.y;
  changeInputValue(inputAddress, inputAddressValue);

  var adFormSubmit = adForm.querySelector('.ad-form__submit');
  adFormSubmit.addEventListener('click', onCustomValidate);

  window.form = {
    mapContainer: mapContainer,
    mapPinMain: mapPinMain,
    activatePage: activatePage
  };
})();
