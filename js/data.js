'use strict';

(function () {
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

  var avatar = {
    src: 'img/avatars/user',
    firstNumber: 0,
    expansion: '.png'
  };
  var offer = {
    title: 'Заголовок предложение - ',
    description: 'Описание - '
  };
  var limitY = {
    min: 130,
    max: 630
  };
  var pinSize = {
    width: 75,
    height: 87
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

  var mapOverlay = document.querySelector('.map__overlay');
  var mapSizes = {
    width: mapOverlay.clientWidth,
    height: mapOverlay.clientHeight
  };
  var pinsMocks = getPinsMocks(8);

  window.data = {
    pinsMocks: pinsMocks,
    pinSize: pinSize
  };
})();
