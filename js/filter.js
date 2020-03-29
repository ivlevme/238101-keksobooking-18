'use strict';

(function () {
  var EMPTY_QUANTITY = 0;
  var ANY_QUANTITY = 'any';

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

  var mapFilterContainer = window.setup.mapFilterContainer;

  var categorizedPins = {};


  var mapFilterForm = mapFilterContainer.querySelector('.map__filters');
  var selectHousingType = mapFilterForm.querySelector('#housing-type');
  var selectHousingPrice = mapFilterForm.querySelector('#housing-price');
  var selectHousingRooms = mapFilterForm.querySelector('#housing-rooms');
  var selectHousingGuests = mapFilterForm.querySelector('#housing-guests');
  var selectHousingFeatures = mapFilterForm.querySelector('#housing-features');
  var inputHousingFeatures = selectHousingFeatures.querySelectorAll('input[type="checkbox"');


  window.filter = function (data) {
    categorizePins(data);
    data = checkHousingType(selectHousingType.value, data);
    var finalPins = data.slice(0, 5);
    return finalPins;
  };

  var categorizePins = function (data) {
    Array.from(mapFilterForm.children).forEach(function (child) {
      initializeStructureCategories(child, data);
    });

    data.forEach(function (pin) {
      categorizedPins[selectHousingType.id][pin.offer.type].push(pin);

      if (pin.offer.rooms >= HousingRooms.ONE && pin.offer.rooms <= HousingRooms.THREE) {
        categorizedPins[selectHousingRooms.id][pin.offer.rooms].push(pin);
      }

      if (pin.offer.guests >= HousingGuests.NOTGUESTS && pin.offer.guests <= HousingGuests.TWO) {
        categorizedPins[selectHousingGuests.id][pin.offer.rooms].push(pin);
      }

      sortHousingPrice(pin);
      sortHousingFeatures(pin);
    });

    return categorizedPins;
  };

  var initializeStructureCategories = function (selectElement, data) {
    categorizedPins[selectElement.id] = {};

    var arraySelectElement = (selectElement === selectHousingFeatures) ? Array.from(inputHousingFeatures) : Array.from(selectElement.options);

    arraySelectElement.forEach(function (item) {
      categorizedPins[selectElement.id][item.value] = (item.value === ANY_QUANTITY) ? data : [];
    });
  };

  var sortHousingPrice = function (pin) {
    if (pin.offer.price < Price.LOW) {
      return categorizedPins[selectHousingPrice.id][HousingPrice.LOW].push(pin);
    }

    if (pin.offer.price >= Price.LOW && pin.offer.price <= Price.HIGH) {
      return categorizedPins[selectHousingPrice.id][HousingPrice.MIDDLE].push(pin);
    }

    return categorizedPins[selectHousingPrice.id][HousingPrice.HIGH].push(pin);
  };

  var sortHousingFeatures = function (pin) {
    pin.offer.features.forEach(function (feature) {
      categorizedPins[selectHousingFeatures.id][feature].push(pin);
    });
  };

  var checkHousingType = function (selectedType, data) {
    data = categorizedPins[selectHousingType.id][selectedType];
    return checkHousingPrice(selectHousingPrice.value, data);
  };

  var checkHousingPrice = function (selectedPrice, data) {
    data = data.filter(function (pin) {
      return categorizedPins[selectHousingPrice.id][selectedPrice].includes(pin);
    });

    return checkHousingRooms(selectHousingRooms.value, data);
  };

  var checkHousingRooms = function (selectedRooms, data) {
    data = data.filter(function (pin) {
      return categorizedPins[selectHousingRooms.id][selectedRooms].includes(pin);
    });

    return checkHousingGuests(selectHousingGuests.value, data);
  };

  var checkHousingGuests = function (selectedGuests, data) {
    data = data.filter(function (pin) {
      return categorizedPins[selectHousingGuests.id][selectedGuests].includes(pin);
    });

    return checkHousingFeatures(data);
  };

  var checkHousingFeatures = function (data) {
    var inputFeatures = mapFilterContainer.querySelectorAll('.map__features input[type="checkbox"]:checked');

    if (inputFeatures.length !== EMPTY_QUANTITY) {
      inputFeatures.forEach(function (feature) {
        data = data.filter(function (item) {
          return item.offer.features.indexOf(feature.value) >= 0;
        });
      });
    }

    return data;
  };
})();
