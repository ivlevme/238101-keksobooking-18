'use strict';

var TYPES_HOME = [
  'palace',
  'flat',
  'house',
  'bungalo'
];
var TIMES_CHECK = [
  '12:00',
  '13:00',
  '14:00'
];
var FEATURES = [
  'wifi',
  'dishwasher',
  'parking',
  'washer',
  'elevator',
  'conditioner'
];
var PHOTOS = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
];
var ENTER = 'Enter';
var DISABLED = true;
var TAG_FIELDSET = 'fieldset';
var TAG_SELECT = 'select';

var avatar = {
  src: 'img/avatars/user',
  fitstNumber: '0',
  expansion: '.png'
};
var offer = {
  title: 'Заголовок предложение - ',
  description: 'Описание - '
};
var pinSize = {
  width: 75,
  height: 87
};
var limitY = {
  min: 130,
  max: 630
};
var roomsErrorText = {
  one: '1 комната — «для 1 гостя»',
  two: '2 комнаты — «для 2 гостей» или «для 1 гостя»',
  three: '3 комнаты — «для 3 гостей», «для 2 гостей» или «для 1 гостя»',
  hundred: '100 комнат — «не для гостей»'
};

var getPinsMocks = function (count) {
  var pins = [];
  for (var i = 0; i < count; i++) {
    var coordinate = {
      x: generateRandomNumber(0, mapSizes.width - pinSize.width),
      y: generateRandomNumber(limitY.min, limitY.max)
    };
    var element = {
      author: {
        avatar: avatar.src + avatar.fitstNumber + (i + 1) + avatar.expansion,
      },

      offer: {
        title: offer.title + (i + 1),
        address: coordinate.x + ', ' + coordinate.y,
        price: generateRandomNumber(1000, 10000),
        type: TYPES_HOME[generateRandomNumber(0, TYPES_HOME.length - 1)],
        rooms: generateRandomNumber(1, 4),
        guests: generateRandomNumber(1, 10),
        checkin: TIMES_CHECK[generateRandomNumber(0, TIMES_CHECK.length - 1)],
        checkout: TIMES_CHECK[generateRandomNumber(0, TIMES_CHECK.length - 1)],
        features: generateOptions(FEATURES, generateRandomNumber(1, FEATURES.length)),
        description: offer.description + (i + 1),
        photos: generateOptions(PHOTOS, generateRandomNumber(1, PHOTOS.length))
      },

      location: {
        x: coordinate.x,
        y: coordinate.y
      }
    };
    pins.push(element);
  }
  return pins;
};

var generateRandomNumber = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

var generateOptions = function (elements, count) {
  var options = [];
  var featuresElement = elements.slice();
  for (var i = 0; i < count; i++) {
    var indexCurrentElement = generateRandomNumber(0, featuresElement.length - 1);
    options[i] = featuresElement[indexCurrentElement];
    featuresElement.splice(indexCurrentElement, 1);
  }
  return options;
};

var generatePins = function (pins) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < Object.keys(pins).length; i++) {
    var pin = pinTemplate.cloneNode(true);
    pin.style.left = pins[i].location.x.toString() + 'px';
    pin.style.top = pins[i].location.y.toString() + 'px';


    var imgPin = pin.querySelector('img');
    imgPin.src = pins[i].author.avatar;
    imgPin.alt = pins[i].offer.title;
    fragment.appendChild(pin);
  }
  return fragment;
};

var activatePage = function () {
  mapContainer.classList.remove('map--faded');
  adForm.classList.remove('ad-form--disabled');

  changeFormElements(adForm, TAG_FIELDSET, !DISABLED);
  changeFormElements(mapFilters, TAG_SELECT, !DISABLED);
  changeFormElements(mapFilters, TAG_FIELDSET, !DISABLED);

  var PinLocation = {
    x: defaultPinLocation.x + pinSize.width,
    y: defaultPinLocation.y + pinSize.height
  };
  inputAddress.value = PinLocation.x + ', ' + PinLocation.y;
  mapOverlayContainer.appendChild(pinsFragment);
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

  var validRatioRoomsGuests = [
    [roomOne, capacityOneGuests],
    [roomsTwo, capacityTwoGuests],
    [roomsTwo, capacityOneGuests],
    [roomsThree, capacityThreeGuests],
    [roomsThree, capacityTwoGuests],
    [roomsThree, capacityOneGuests],
    [roomsHundred, capacityNoGuests]
  ];

  var currentRatio = [inputRoomsSelected, inputCapacitySelected];
  var errorStatus = true;

  for (var i = 0; i < validRatioRoomsGuests.length; i++) {
    var oneLine = validRatioRoomsGuests[i];
    var j = 0;
    if (currentRatio[j] === oneLine[j] && currentRatio[j + 1] === oneLine[j + 1]) {
      errorStatus = false;
      inputRooms.setCustomValidity('');
      break;
    }
  }

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

var mapOverlay = document.querySelector('.map__overlay');
var mapSizes = {
  width: mapOverlay.clientWidth,
  height: mapOverlay.clientHeight
};

var mapContainer = document.querySelector('.map');

var pinsMocks = getPinsMocks(8);
var pinTemplate = document.querySelector('#pin')
    .content
    .querySelector('.map__pin');
var pinsFragment = generatePins(pinsMocks);
var mapOverlayContainer = mapContainer.querySelector('.map__pins');

var mapPinMain = mapContainer.querySelector('.map__pin--main');
var defaultPinLocation = {
  x: parseInt(mapPinMain.style.left.substring(0, mapPinMain.style.left.length - 2), 10),
  y: parseInt(mapPinMain.style.top.substring(0, mapPinMain.style.left.length - 2), 10)
};

var notice = document.querySelector('.notice');
var adForm = notice.querySelector('.ad-form');
changeFormElements(adForm, TAG_FIELDSET, DISABLED);

var mapFilters = mapContainer.querySelector('.map__filters');
changeFormElements(mapFilters, TAG_SELECT, DISABLED);
changeFormElements(mapFilters, TAG_FIELDSET, DISABLED);

var inputAddress = adForm.querySelector('input[name="address"]');
var inputAddressValue = defaultPinLocation.x + ', ' + defaultPinLocation.y;
changeInputValue(inputAddress, inputAddressValue);

mapPinMain.addEventListener('mousedown', activatePage);

mapPinMain.addEventListener('keydown', function (evt) {
  if (evt.key === ENTER) {
    activatePage();
  }
});

var adFormSubmit = adForm.querySelector('.ad-form__submit');
adFormSubmit.addEventListener('click', onCustomValidate);
