'use strict';

(function () {
  var PIN_OFFER = 'offer';
  var HousingType = {
    palace: 'palace',
    flat: 'flat',
    house: 'house',
    bungalo: 'bungalo'
  };

  var generatePins = function (pins) {
    var fragment = document.createDocumentFragment();
    pins.forEach(function (item, index) {
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

      pinHandlerFunction[index] = onPinClick.bind(item, item, pin, index);
      pin.addEventListener('click', pinHandlerFunction[index]);
    });
    return fragment;
  };

  var updatePins = function (pins) {
    uploadedPins = pins;
    delPinButtons();
    var filteredData = checkFilter(uploadedPins);
    var finalPins = filteredData.slice(0, 5);
    pinsContainer.appendChild(generatePins(finalPins));
  };

  var onPinClick = function (item, pin, index) {
    generateCard(item, pin);
    pin.removeEventListener('click', pinHandlerFunction[index]);
  };

  var checkFilter = function (data) {
    switch (selectHousingType.value) {
      case HousingType.palace:
        data = data.filter(function (item) {
          return item.offer.type === HousingType.palace;
        });
        break;

      case HousingType.flat:
        data = data.filter(function (item) {
          return item.offer.type === HousingType.flat;
        });
        break;

      case HousingType.house:
        data = data.filter(function (item) {
          return item.offer.type === HousingType.house;
        });
        break;

      case HousingType.bungalo:
        data = data.filter(function (item) {
          return item.offer.type === HousingType.bungalo;
        });
        break;
    }
    return data;
  };

  var MEASURE_PX = window.setup.MEASURE_PX;
  var mapFilterContainer = window.setup.mapFilterContainer;
  var pinsContainer = window.setup.pinsContainer;
  var delPinButtons = window.setup.delPinButtons;

  var generateCard = window.card.generateCard;

  var pinTemplate = document.querySelector('#pin')
  .content
  .querySelector('.map__pin');

  var pinHandlerFunction = {};
  var uploadedPins;


  var selectHousingType = mapFilterContainer.querySelector('#housing-type');
  selectHousingType.addEventListener('change', function () {
    updatePins(uploadedPins);
  });

  window.pin = {
    updatePins: updatePins
  };
})();
