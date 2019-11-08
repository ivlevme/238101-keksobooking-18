'use strict';

(function () {
  var DEFAULT_AVATAR_PATH = 'img/muffin-grey.svg';
  var MEASURE_PX = window.setup.MEASURE_PX;
  var PUNCTUATION_COMMA = window.setup.PUNCTUATION_COMMA;

  var RoomsErrorText = {
    ONE: '1 комната — «для 1 гостя»',
    TWO: '2 комнаты — «для 2 гостей» или «для 1 гостя»',
    THREE: '3 комнаты — «для 3 гостей», «для 2 гостей» или «для 1 гостя»',
    HUNDRED: '100 комнат — «не для гостей»'
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

  var Coordinate = function (x, y) {
    this.x = x;
    this.y = y;
  };

  var middlePin = window.setup.middlePin;
  var map = window.setup.map;
  var mapPinMain = window.setup.mapPinMain;
  var main = window.setup.main;
  var adForm = window.setup.adForm;
  var KeyboardKey = window.setup.KeyboardKey;
  var TypeAccommodation = window.setup.TypeAccommodation;
  var delElements = window.setup.delElements;

  var updatePins = window.pin.updatePins;

  var load = window.backend.load;
  var save = window.backend.save;

  var onAppMistake = window.error.onAppMistake;
  var onModalPopupClick = window.error.onModalPopupClick;
  var onModalPopupEscPress = window.error.onModalPopupEscPress;

  var photoPreviewImage = window.avatar.photoPreviewImage;
  var avatarPreviewImage = window.avatar.avatarPreviewImage;

  var mapFilters = map.querySelector('.map__filters');

  var inputAddress = adForm.querySelector('input[name="address"]');
  inputAddress.readOnly = true;

  var adFormSubmit = adForm.querySelector('.ad-form__submit');
  var adFormReset = adForm.querySelector('.ad-form__reset');

  var typeHouse = adForm.querySelector('#type');
  var housePrice = adForm.querySelector('#price');

  var timeIn = adForm.querySelector('#timein');
  var timeOut = adForm.querySelector('#timeout');

  var defaultPinLocation = new Coordinate(
      parseInt(mapPinMain.style.left.substring(0, mapPinMain.style.left.length - 2), 10),
      parseInt(mapPinMain.style.top.substring(0, mapPinMain.style.left.length - 2), 10)
  );


  var onMapPinMainClick = function () {
    mapPinMain.removeEventListener('mousedown', onMapPinMainClick);
    mapPinMain.removeEventListener('keydown', onMapPinMainEnterPress);

    load(onLoadSuccess, onAppMistake);

    checkHousePrice();
    activatePage();
  };

  var onMapPinMainEnterPress = function (evt) {
    if (evt.key === KeyboardKey.ENTER) {
      onMapPinMainClick();
    }
  };

  var changeStateElements = function (form, tagElement, status) {
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
    housePrice.min = PriceAccommodation[type];
    housePrice.placeholder = PriceAccommodation[type];
  };

  var onTimeChange = function (evt) {
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
    manageFilterForm(false);
  };

  var deactivatePage = function () {
    changeStateElements(adForm, 'fieldset', true);
    manageFilterForm(true);
    adForm.reset();
    checkHousePrice();
    mapFilters.reset();
    photoPreviewImage.src = DEFAULT_AVATAR_PATH;
    avatarPreviewImage.src = DEFAULT_AVATAR_PATH;
    inputAddress.value = getCordsView(defaultPinLocation.x + middlePin.width,
        defaultPinLocation.y + middlePin.height);

    map.classList.add('map--faded');
    adForm.classList.add('ad-form--disabled');

    delElements('button:not(.map__pin--main)');
    mapPinMain.addEventListener('mousedown', onMapPinMainClick);
    mapPinMain.addEventListener('keydown', onMapPinMainEnterPress);

    delElements('.popup');

    mapPinMain.style.left = defaultPinLocation.x + MEASURE_PX;
    mapPinMain.style.top = defaultPinLocation.y + MEASURE_PX;
  };

  var activatePage = function () {
    changeStateElements(adForm, 'fieldset', false);
    map.classList.remove('map--faded');
    adForm.classList.remove('ad-form--disabled');
  };

  var onSaveSuccess = function () {
    var successTemplate = document.querySelector('#success')
      .content
      .querySelector('.success');
    var success = successTemplate.cloneNode(true);
    main.appendChild(success);
    deactivatePage();
    document.addEventListener('click', onModalPopupClick);
    document.addEventListener('keydown', onModalPopupEscPress);
  };

  var manageFilterForm = function (action) {
    changeStateElements(mapFilters, 'select', action);
    changeStateElements(mapFilters, 'fieldset', action);
  };

  var getCordsView = function (x, y) {
    var cord = x + PUNCTUATION_COMMA + ' ' + y;
    return cord;
  };

  var onResetClick = deactivatePage;
  var onTypeHouseChange = checkHousePrice;

  adFormSubmit.addEventListener('click', onAdFormSubmit);
  adFormReset.addEventListener('click', onResetClick);
  adForm.addEventListener('submit', function (evt) {
    evt.preventDefault();
    var formData = new FormData(adForm);

    save(onSaveSuccess, onAppMistake, formData);
  });


  typeHouse.addEventListener('change', onTypeHouseChange);
  timeIn.addEventListener('change', onTimeChange);
  timeOut.addEventListener('change', onTimeChange);

  deactivatePage();

  window.form = {
    Coordinate: Coordinate,
    mapPinMain: mapPinMain,
    adForm: adForm,
    onMapPinMainClick: onMapPinMainClick,
    onMapPinMainEnterPress: onMapPinMainEnterPress,
    inputAddress: inputAddress,
    defaultPinLocation: defaultPinLocation,
    getCordsView: getCordsView
  };
})();
