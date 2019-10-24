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
    mapPinMain.removeEventListener('mousedown', onMapPinMainClick);
    mapPinMain.removeEventListener('keydown', onMapPinMainEnterKeydown);

    load(onLoadSuccess, onErrorHappen);

    checkHousePrice();

    manageForm(!DISABLED);
    changeStatusPage(ClassListMethod.REMOVE);
  };

  var onMapPinMainEnterKeydown = function (evt) {
    if (evt.key === KeyboardKey.ENTER) {
      onMapPinMainClick();
    }
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

  var defineError = function (roomSelected, guestSelected, validRatios, inputError) {
    var errorFlag = true;
    if (validRatios[roomSelected].includes(guestSelected)) {
      errorFlag = false;
      inputError.setCustomValidity('');
    }
    return errorFlag;
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

  var onLoadSuccess = function (data) {
    updatePins(data);
  };

  var onSaveSuccess = function () {
    var successTemplate = document.querySelector('#success')
      .content
      .querySelector('.success');
    var success = successTemplate.cloneNode(true);
    main.appendChild(success);

    manageForm(DISABLED);
    adForm.reset();
    mapFilters.reset();
    inputAddress.value = (defaultPinLocation.x + middlePin.width) + PUNCTUATION_COMMA + ' ' +
    (defaultPinLocation.y + middlePin.height);

    changeStatusPage(ClassListMethod.ADD);

    mapPinMain.addEventListener('mousedown', onMapPinMainClick);
    document.addEventListener('click', onModalPopupClick);
    document.addEventListener('keydown', onModalPopupEscKeydown);

    delPinButtons();

    var allPopups = map.querySelectorAll('.map__card');
    allPopups.forEach(function (item) {
      item.remove();
    });

    mapPinMain.style.left = defaultPinLocation.x + MEASURE_PX;
    mapPinMain.style.top = defaultPinLocation.y + MEASURE_PX;
  };

  var manageForm = function (action) {
    changeFormElements(adForm, Tags.FIELDSET, action);
    changeFormElements(mapFilters, Tags.SELECT, action);
    changeFormElements(mapFilters, Tags.FIELDSET, action);
  };

  var changeStatusPage = function (actClass) {
    map.classList[actClass]('map--faded');
    adForm.classList[actClass]('ad-form--disabled');
  };


  var MEASURE_PX = window.setup.MEASURE_PX;
  var PUNCTUATION_COMMA = window.setup.PUNCTUATION_COMMA;
  var middlePin = window.setup.middlePin;
  var map = window.setup.map;
  var mapPinMain = window.setup.mapPinMain;
  var main = window.setup.main;
  var KeyboardKey = window.setup.KeyboardKey;
  var ClassListMethod = window.setup.ClassListMethod;
  var delPinButtons = window.setup.delPinButtons;

  var updatePins = window.pin.updatePins;

  var load = window.backend.load;
  var save = window.backend.save;

  var onErrorHappen = window.error.onErrorHappen;
  var onModalPopupClick = window.error.onModalPopupClick;
  var onModalPopupEscKeydown = window.error.onModalPopupEscKeydown;


  var notice = document.querySelector('.notice');
  var adForm = notice.querySelector('.ad-form');
  var mapFilters = map.querySelector('.map__filters');

  manageForm(DISABLED);

  var inputAddress = adForm.querySelector('input[name="address"]');
  inputAddress.readOnly = true;

  var adFormSubmit = adForm.querySelector('.ad-form__submit');
  adFormSubmit.addEventListener('click', onAdFormSubmit);
  adForm.addEventListener('submit', function (evt) {
    evt.preventDefault();
    var formData = new FormData(adForm);

    save(onSaveSuccess, onErrorHappen, formData);
  });

  var typeHouse = adForm.querySelector('#type');
  typeHouse.addEventListener('click', checkHousePrice);
  var housePrice = adForm.querySelector('#price');

  var timeIn = adForm.querySelector('#timein');
  var timeOut = adForm.querySelector('#timeout');
  timeIn.addEventListener('click', checkTime);
  timeOut.addEventListener('click', checkTime);

  var defaultPinLocation = {
    x: parseInt(mapPinMain.style.left.substring(0, mapPinMain.style.left.length - 2), 10),
    y: parseInt(mapPinMain.style.top.substring(0, mapPinMain.style.left.length - 2), 10)
  };

  window.form = {
    mapPinMain: mapPinMain,
    onMapPinMainClick: onMapPinMainClick,
    onMapPinMainEnterKeydown: onMapPinMainEnterKeydown,
    inputAddress: inputAddress,
    defaultPinLocation: defaultPinLocation
  };
})();
