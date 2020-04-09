'use strict';

(function () {
  var PIN_OFFER = 'offer';
  var MEASURE_PX = window.setup.MEASURE_PX;

  var debounce = window.debounce;

  var pinsContainer = window.setup.pinsContainer;
  var mapFilterContainer = window.setup.mapFilterContainer;
  var delElements = window.setup.delElements; // Remove
  var generateCard = window.card.generateCard;

  var filter = window.filter;

  var pinTemplate = document.querySelector('#pin')
    .content
    .querySelector('.map__pin');

  var uploadedPins;

  var generatePins = function (pins) {
    var fragment = document.createDocumentFragment();
    pins.forEach(function (item) {
      var pin = pinTemplate.cloneNode(true);
      if (!(PIN_OFFER in item)) {
        return;
      }
      pin.style.left = item.location.x.toString() + MEASURE_PX;
      pin.style.top = item.location.y.toString() + MEASURE_PX;

      var imgPin = pin.querySelector('img');
      imgPin.src = item.author.avatar;
      imgPin.alt = item.offer.title;

      fragment.appendChild(pin);

      pin.addEventListener('click', onPinClick(item, pin));
    });
    return fragment;
  };

  var updatePins = function (pins) {
    uploadedPins = pins;
    delElements('.popup');
    delElements('button:not(.map__pin--main)');
    var filteredData = filter(uploadedPins);
    pinsContainer.appendChild(generatePins(filteredData));
  };

  var onPinClick = function (item, pin) {
    return function () {
      generateCard(item, pin);
    };
  };

  mapFilterContainer.addEventListener('change', function () {
    debounce(function () {
      updatePins(uploadedPins);
    });
  });

  window.pin = {
    updatePins: updatePins
  };
})();
