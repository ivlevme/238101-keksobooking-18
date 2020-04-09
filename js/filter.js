'use strict';

(function () {
  var EMPTY_QUANTITY = 0;
  var ANY_QUANTITY = 'any';

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

  var mapFilterForm = mapFilterContainer.querySelector('.map__filters');
  var selectHousingType = mapFilterForm.querySelector('#housing-type');
  var selectHousingPrice = mapFilterForm.querySelector('#housing-price');
  var selectHousingRooms = mapFilterForm.querySelector('#housing-rooms');
  var selectHousingGuests = mapFilterForm.querySelector('#housing-guests');


  window.filter = function (data) {
    data = checkLimits(data);
    var finalPins = data.slice(0, 5);
    return finalPins;
  };

  var checkLimits = function (data) {
    var filteredPins = [];

    data.forEach(function (pin) {
      if (checkHouseType(pin.offer.type) && checkHousePrice(pin) &&
          checkSelect(pin.offer.rooms, selectHousingRooms) &&
          checkSelect(pin.offer.guests, selectHousingGuests, 10) &&
          checkHouseFeatures(pin)) {
        filteredPins.push(pin);
      }
    });

    return filteredPins;
  };

  var checkHouseType = function (pin) {
    if (selectHousingType.value === ANY_QUANTITY || pin === selectHousingType.value) {
      return true;
    }

    return false;
  };

  var checkSelect = function (pin, select) {
    if (select.value === ANY_QUANTITY) {
      return true;
    }

    if (pin === parseInt(select.value, 10)) {
      return true;
    }

    return false;
  };

  var checkHousePrice = function (pin) {
    switch (selectHousingPrice.value) {
      case HousingPrice.LOW:
        if (pin.offer.price < Price.LOW) {
          return true;
        }

        return false;

      case HousingPrice.MIDDLE:
        if (pin.offer.price >= Price.LOW && pin.offer.price <= Price.HIGH) {
          return true;
        }

        return false;

      case HousingPrice.HIGH:
        if (pin.offer.price > Price.HIGH) {
          return true;
        }

        return false;

      default:
        return true;
    }
  };

  var checkHouseFeatures = function (pin) {
    var currentFeatures = mapFilterContainer
      .querySelectorAll('.map__features input[type="checkbox"]:checked');

    var contain = true;
    if (currentFeatures.length !== EMPTY_QUANTITY) {
      Array.from(currentFeatures).forEach(function (feature) {
        if (!pin.offer.features.includes(feature.value)) {
          contain = false;
        }
      });
    }

    return contain;
  };
})();
