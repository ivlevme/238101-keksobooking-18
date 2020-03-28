'use strict';

(function () {
  var EMPTY_QUANTITY = 0;

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

  var TypeAccommodation = window.setup.TypeAccommodation;
  var mapFilterContainer = window.setup.mapFilterContainer;

  var OfferPinSchema = window.card.OfferPinSchema;

  var pointsFilter = [];

  var selectHousingType = mapFilterContainer.querySelector('#housing-type');
  var selectHousingPrice = mapFilterContainer.querySelector('#housing-price');
  var selectHousingRooms = mapFilterContainer.querySelector('#housing-rooms');
  var selectHousingGuests = mapFilterContainer.querySelector('#housing-guests');
  var selectHousingFeatures = mapFilterContainer.querySelector('#housing-features');

  pointsFilter.push(selectHousingType);
  pointsFilter.push(selectHousingPrice);
  pointsFilter.push(selectHousingRooms);
  pointsFilter.push(selectHousingGuests);
  pointsFilter.push(selectHousingFeatures);


  var verify = function (data) {
    data = checkHousingType(selectHousingType.value, data);
    var finalPins = data.slice(0, 5);
    return finalPins;
  };
  var checkHousingType = function (selectedType, data) {
    switch (selectedType) {
      case TypeAccommodation.PALACE:
        data = filterCompare(data, TypeAccommodation.PALACE, OfferPinSchema.TYPE);
        break;

      case TypeAccommodation.FLAT:
        data = filterCompare(data, TypeAccommodation.FLAT, OfferPinSchema.TYPE);
        break;

      case TypeAccommodation.HOUSE:
        data = filterCompare(data, TypeAccommodation.HOUSE, OfferPinSchema.TYPE);
        break;

      case TypeAccommodation.BUNGALO:
        data = filterCompare(data, TypeAccommodation.BUNGALO, OfferPinSchema.TYPE);
        break;
    }
    return checkHousingPrice(selectHousingPrice.value, data);
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
    return checkHousingRooms(selectHousingRooms.value, data);
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

    return checkHousingGuests(selectHousingGuests.value, data);
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

  var filterCompare = function (data, element, kind) {
    data = data.filter(function (item) {
      return item.offer[kind] === element;
    });
    return data;
  };

  window.filter = {
    verify: verify,
    pointsFilter: pointsFilter
  };
})();
