'use strict';

(function () {
  var DISABLED = true;
  var ATTRIBUTE_MIN = 'min';

  var Tags = {
    FIELDSET: 'fieldset',
    SELECT: 'select'
  };

  var RoomsErrorText = {
    ONE: '1 комната — «для 1 гостя»',
    TWO: '2 комнаты — «для 2 гостей» или «для 1 гостя»',
    THREE: '3 комнаты — «для 3 гостей», «для 2 гостей» или «для 1 гостя»',
    HUNDRED: '100 комнат — «не для гостей»'
  };

  var TypeAccommodation = {
    BUNGALO: 'bungalo',
    FLAT: 'flat',
    HOUSE: 'house',
    PALACE: 'palace'
  };

  var PriceAccommodation = {
    BUNGALO: 0,
    FLAT: 1000,
    HOUSE: 5000,
    PALACE: 10000
  };

  var Time = {
    IN: 'timein',
    OUT: 'timeout'
  };


  var onMapPinMainClick = function () {
    load(onLoadSuccess, onLoadError);
    checkHousePrice();

    map.classList.remove('map--faded');
    adForm.classList.remove('ad-form--disabled');

    changeFormElements(adForm, Tags.FIELDSET, !DISABLED);
    changeFormElements(mapFilters, Tags.SELECT, !DISABLED);
    changeFormElements(mapFilters, Tags.FIELDSET, !DISABLED);
  };

  var changeFormElements = function (form, tagElement, status) {
    var elements = form.querySelectorAll(tagElement);
    elements = Array.from(elements);
    elements.forEach(function (item) {
      item.disabled = status;
    });
  };

  var onAdFormSubmit = function () {
    checkHousePrice();
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

    var validRatiosRoomsGuests = {};
    validRatiosRoomsGuests[roomOne] = [capacityOneGuests];
    validRatiosRoomsGuests[roomsTwo] = [capacityTwoGuests, capacityOneGuests];
    validRatiosRoomsGuests[roomsThree] = [capacityThreeGuests, capacityTwoGuests, capacityOneGuests];
    validRatiosRoomsGuests[roomsHundred] = [capacityNoGuests];

    var errorStatus = defineError(inputRoomsSelected, inputCapacitySelected, validRatiosRoomsGuests,
        inputRooms);
    if (errorStatus) {
      switch (inputRoomsSelected) {
        case roomOne:
          inputRooms.setCustomValidity(RoomsErrorText.ONE);
          break;
        case roomsTwo:
          inputRooms.setCustomValidity(RoomsErrorText.TWO);
          break;
        case roomsThree:
          inputRooms.setCustomValidity(RoomsErrorText.THREE);
          break;
        case roomsHundred:
          inputRooms.setCustomValidity(RoomsErrorText.HUNDRED);
          break;
        default:
          break;
      }
    }
  };

  var checkHousePrice = function () {
    var typeHouseSelected = typeHouse.value;

    switch (typeHouseSelected) {
      case TypeAccommodation.BUNGALO:
        changePrice(TypeAccommodation.BUNGALO);
        break;

      case TypeAccommodation.FLAT:
        changePrice(TypeAccommodation.FLAT);
        break;

      case TypeAccommodation.HOUSE:
        changePrice(TypeAccommodation.HOUSE);
        break;

      case TypeAccommodation.PALACE:
        changePrice(TypeAccommodation.PALACE);
        break;
    }
  };

  var changePrice = function (type) {
    type = type.toUpperCase();
    housePrice.setAttribute(ATTRIBUTE_MIN, PriceAccommodation[type]);
    housePrice.placeholder = PriceAccommodation[type];
  };

  var checkTime = function (evt) {
    switch (evt.currentTarget.id) {
      case Time.IN:
        timeOut.value = timeIn.value;
        break;
      case Time.OUT:
        timeIn.value = timeOut.value;
        break;
    }
  };

  var defineError = function (roomSelected, guestSelected, validRatios, inputError) {
    var errorFlag = true;
    if (validRatios[roomSelected].includes(guestSelected)) {
      errorFlag = false;
      inputError.setCustomValidity('');
    }
    return errorFlag;
  };

  var onLoadError = function (message) {
    var errorTemplate = document.querySelector('#error')
      .content
      .querySelector('.error');
    var error = errorTemplate.cloneNode(true);
    var errorMessageText = error.querySelector('.error__message');
    errorMessageText.textContent = message;
    main.appendChild(error);
  };

  var onLoadSuccess = function (data) {
    pinsFragment = generatePins(data);
    mapOverlayContainer.appendChild(pinsFragment);
  };

  var map = window.setup.map;
  var generatePins = window.pin.generatePins;
  var load = window.backend.load;

  var pinsFragment;
  var mapPinMain = map.querySelector('.map__pin--main');
  var main = document.querySelector('main');

  var notice = document.querySelector('.notice');
  var adForm = notice.querySelector('.ad-form');
  var mapFilters = map.querySelector('.map__filters');
  var mapOverlayContainer = map.querySelector('.map__pins');

  changeFormElements(adForm, Tags.FIELDSET, DISABLED);
  changeFormElements(mapFilters, Tags.SELECT, DISABLED);
  changeFormElements(mapFilters, Tags.FIELDSET, DISABLED);

  var inputAddress = adForm.querySelector('input[name="address"]');
  inputAddress.readOnly = true;

  var adFormSubmit = adForm.querySelector('.ad-form__submit');
  adFormSubmit.addEventListener('click', onAdFormSubmit);

  var typeHouse = adForm.querySelector('#type');
  typeHouse.addEventListener('click', checkHousePrice);
  var housePrice = adForm.querySelector('#price');

  var timeIn = adForm.querySelector('#timein');
  var timeOut = adForm.querySelector('#timeout');
  timeIn.addEventListener('click', checkTime);
  timeOut.addEventListener('click', checkTime);

  window.form = {
    mapPinMain: mapPinMain,
    onMapPinMainClick: onMapPinMainClick,
    inputAddress: inputAddress,
  };
})();
