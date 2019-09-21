'use strict';

var TYPE_HOME = ['palace', 'flat', 'house', 'bungalo'];
var TIMES = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var PIN_SIZES = {
  width: 75,
  height: 87
};

var generateData = function (count) {
  var datas = [];
  for (var i = 0; i < count; i++) {
    var element = {
      author: {
        avatar: 'img/avatars/user' + '0' + (i + 1) + '.png',
      },

      offer: {
        title: 'Заголовок предложение - ' + (i + 1),
        address: generateRandomNumber(100, 600).toString() + ', ' +
          generateRandomNumber(100, 600).toString(),
        price: (i + 1) + '000',
        type: TYPE_HOME[generateRandomNumber(0, TYPE_HOME.length - 1)],
        rooms: generateRandomNumber(1, 4),
        guests: generateRandomNumber(1, 10),
        checkin: TIMES[generateRandomNumber(0, TIMES.length - 1)],
        checkout: TIMES[generateRandomNumber(0, TIMES.length - 1)],
        features: generateLine(FEATURES, generateRandomNumber(1, FEATURES.length)),
        description: 'Описание - ' + (i + 1),
        photos: generateLine(PHOTOS, generateRandomNumber(1, PHOTOS.length))
      },

      location: {
        x: generateRandomNumber(0, mapSizes.width - PIN_SIZES.width),
        y: generateRandomNumber(130, 630)
      }
    };
    datas.push(element);
  }
  return datas;
};

var generateRandomNumber = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

var generateLine = function (elements, count) {
  var dataLine = [];
  var featuresElement = elements.slice();
  for (var i = 0; i < count; i++) {
    var indexCurrentElement = generateRandomNumber(0, featuresElement.length - 1);
    dataLine[i] = featuresElement[indexCurrentElement];
    featuresElement.splice(indexCurrentElement, 1);
  }
  return dataLine;
};

var generatePins = function (data) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < Object.keys(data).length; i++) {
    var pin = pinTemplate.cloneNode(true);
    pin.style.left = data[i].location.x.toString() + 'px';
    pin.style.top = data[i].location.y.toString() + 'px';
    var imgPin = pin.querySelector('img');
    imgPin.src = data[i].author.avatar.toString();
    imgPin.alt = data[i].offer.title.toString();
    fragment.appendChild(pin);
  }
  return fragment;
};

var insertPins = function (fragment, location) {
  location.appendChild(fragment);
};

var mapOverlay = document.querySelector('.map__overlay');
var mapSizes = {
  width: mapOverlay.clientWidth,
  height: mapOverlay.clientHeight
};

var fakeDatas = generateData(8);

var map = document.querySelector('.map');
map.classList.remove('map--faded');

var pinTemplate = document.querySelector('#pin')
    .content
    .querySelector('.map__pin');
var pinsFragment = generatePins(fakeDatas);
var mapPins = document.querySelector('.map__pins');
insertPins(pinsFragment, mapPins);
