'use strict';

(function () {
  var PIN_OFFER = 'offer';
  var HousingType = {
    PALACE: 'palace',
    FLAT: 'flat',
    HOUSE: 'house',
    BUNGALO: 'bungalo'
  };
  var HousingRooms = {
    ONE: 1,
    TWO: 2,
    THREE: 3
  };
  var HousingGuests = {
    NOTGUESTS: 0,
    ONE: 1,
    TWO: 2
  };
  var HousingPrice = {
    MIDDLE: 'middle',
    LOW: 'low',
    HIGH: 'high'
  };
  var Price = {
    LOW: 10000,
    HIGH: 50000
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
    delPopupCard();
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
    data = checkHousingType(selectHousingType.value, data);
    data = checkHousingPrice(selectHousingPrice.value, data);
    data = checkHousingRooms(selectHousingRooms.value, data);
    data = checkHousingGuests(selectHousingGuests.value, data);
    data = checkHousingFeatures(data);
    return data;
  };

  var checkHousingType = function (selectedType, data) {
    switch (selectedType) {
      case HousingType.PALACE:
        data = filterCompare(data, HousingType.PALACE, OfferPinSchema.TYPE);
        break;

      case HousingType.FLAT:
        data = filterCompare(data, HousingType.FLAT, OfferPinSchema.TYPE);
        break;

      case HousingType.HOUSE:
        data = filterCompare(data, HousingType.HOUSE, OfferPinSchema.TYPE);
        break;

      case HousingType.BUNGALO:
        data = filterCompare(data, HousingType.BUNGALO, OfferPinSchema.TYPE);
        break;
    }
    return data;
  };

  var checkHousingPrice = function (selectedPrice, data) {
    switch (selectedPrice) {
      case HousingPrice.LOW:
        data = data.filter(function (item) {
          return item.offer.price < Price.LOW;
        });
        break;

      case HousingPrice.MIDDLE:
        data = data.filter(function (item) {
          return item.offer.price >= Price.LOW && item.offer.price <= Price.HIGH;
        });
        break;

      case HousingPrice.HIGH:
        data = data.filter(function (item) {
          return item.offer.price > Price.HIGH;
        });
        break;
    }
    return data;
  };

  var checkHousingRooms = function (selectedRooms, data) {
    selectedRooms = parseInt(selectedRooms, 10);

    switch (selectedRooms) {
      case HousingRooms.ONE:
        data = filterCompare(data, HousingRooms.ONE, OfferPinSchema.ROOMS);
        break;

      case HousingRooms.TWO:
        data = filterCompare(data, HousingRooms.TWO, OfferPinSchema.ROOMS);
        break;

      case HousingRooms.THREE:
        data = filterCompare(data, HousingRooms.THREE, OfferPinSchema.ROOMS);
        break;
    }

    return data;
  };

  var checkHousingGuests = function (selectedGuests, data) {
    selectedGuests = parseInt(selectedGuests, 10);

    switch (selectedGuests) {
      case HousingGuests.ONE:
        data = filterCompare(data, HousingGuests.ONE, OfferPinSchema.GUESTS);
        break;

      case HousingGuests.TWO:
        data = filterCompare(data, HousingGuests.TWO, OfferPinSchema.GUESTS);
        break;

      case HousingGuests.NOTGUESTS:
        data = filterCompare(data, HousingGuests.NOTGUESTS, OfferPinSchema.GUESTS);
        break;
    }

    return data;
  };

  var checkHousingFeatures = function (data) {

    var featuresContainer = mapFilterContainer.querySelector('.map__features');
    var inputFeatures = featuresContainer.querySelectorAll('input[type="checkbox"]');
    var selectedFeatures = [];
    inputFeatures.forEach(function (item) {
      if (item.checked) {
        selectedFeatures.push(item.value);
      }
    });

    selectedFeatures.forEach(function (feature) {
      data = data.filter(function (item) {
        return item.offer.features.indexOf(feature) >= 0;
      });
    });

    return data;
  };

  var filterCompare = function (data, element, kind) {
    data = data.filter(function (item) {
      return item.offer[kind] === element;
    });
    return data;
  };

  var setListener = function (element) {
    element.addEventListener('change', function () {
      debounce(function () {
        updatePins(uploadedPins);
      });
    });
  };

  var debounce = window.debounce;

  var MEASURE_PX = window.setup.MEASURE_PX;
  var mapFilterContainer = window.setup.mapFilterContainer;
  var pinsContainer = window.setup.pinsContainer;
  var delPinButtons = window.setup.delPinButtons;
  var delPopupCard = window.setup.delPopupCard;

  var generateCard = window.card.generateCard;
  var OfferPinSchema = window.card.OfferPinSchema;

  var pinTemplate = document.querySelector('#pin')
  .content
  .querySelector('.map__pin');

  var pinHandlerFunction = {};
  var uploadedPins;


  var selectHousingType = mapFilterContainer.querySelector('#housing-type');
  var selectHousingPrice = mapFilterContainer.querySelector('#housing-price');
  var selectHousingRooms = mapFilterContainer.querySelector('#housing-rooms');
  var selectHousingGuests = mapFilterContainer.querySelector('#housing-guests');
  var selectHousingFeatures = mapFilterContainer.querySelector('#housing-features');

  setListener(selectHousingType);
  setListener(selectHousingPrice);
  setListener(selectHousingRooms);
  setListener(selectHousingGuests);
  setListener(selectHousingFeatures);

  window.pin = {
    updatePins: updatePins
  };
})();
