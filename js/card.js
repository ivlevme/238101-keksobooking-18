'use strict';

(function () {
  var PUNCTUATION_COMMA = window.setup.PUNCTUATION_COMMA;

  var OfferPinSchema = {
    TITLE: 'title',
    ADDRESS: 'address',
    PRICE: 'price',
    TYPE: 'type',
    ROOMS: 'rooms',
    GUESTS: 'guests',
    CHECKIN: 'checkin',
    CHECKOUT: 'checkout',
    FEATURES: 'features',
    DESCRIPTION: 'description',
    PHOTOS: 'photos'
  };

  var TranslateAccommodation = {
    BUNGALO: 'Бунгало',
    FLAT: 'Квартира',
    HOUSE: 'Дом',
    PALACE: 'Дворец'
  };

  var CapacityText = {
    FOR: 'для',
    GUESTS: 'гостей',
    ROOMS: 'комнаты'
  };

  var TimeText = {
    CHECKIN: 'Заезд после',
    CHECKOUT: 'выезд до'
  };

  var map = window.setup.map;
  var KeyboardKey = window.setup.KeyboardKey;
  var mapFilterContainer = window.setup.mapFilterContainer;
  var TypeAccommodation = window.setup.TypeAccommodation;
  var pinsContainer = window.setup.pinsContainer;


  var popupSchema = {};

  var cardTemplate = document.querySelector('#card')
    .content
    .querySelector('.map__card');

  var firstCutSymbolPosition = 4;
  var lastCutSymbolPosition = 5;
  var emptyPhotosCount = 0;

  var card;
  var allFeatures;
  var popupFeatures;
  var popupTitle;
  var popupAddress;
  var popupPrice;
  var popupType;
  var popupCapacity;
  var popupTime;
  var popupDescription;
  var popupPhotos;


  var generateCard = function (element, pin) {
    card = cardTemplate.cloneNode(true);

    var popupClose = card.querySelector('.popup__close');

    popupClose.addEventListener('click', removePopup);
    document.addEventListener('keydown', onPopupEscKeydown);

    popupTitle = card.querySelector('.popup__title');
    popupAddress = card.querySelector('.popup__text--address');
    popupPrice = card.querySelector('.popup__text--price');
    popupType = card.querySelector('.popup__type');
    popupCapacity = card.querySelector('.popup__text--capacity');
    popupTime = card.querySelector('.popup__text--time');
    popupDescription = card.querySelector('.popup__description');
    popupPhotos = card.querySelector('.popup__photos');


    popupFeatures = card.querySelector('.popup__features');
    var wifiFeature = popupFeatures.querySelector('.popup__feature--wifi');
    var dishwasherFeature = popupFeatures.querySelector('.popup__feature--dishwasher');
    var parkingFeature = popupFeatures.querySelector('.popup__feature--parking');
    var washerFeature = popupFeatures.querySelector('.popup__feature--washer');
    var elevatorFeature = popupFeatures.querySelector('.popup__feature--elevator');
    var conditionerFeature = popupFeatures.querySelector('.popup__feature--conditioner');
    allFeatures = {
      wifi: wifiFeature,
      dishwasher: dishwasherFeature,
      parking: parkingFeature,
      washer: washerFeature,
      elevator: elevatorFeature,
      conditioner: conditionerFeature,
    };

    popupSchema.title = popupTitle;
    popupSchema.address = popupAddress;
    popupSchema.price = popupPrice;
    popupSchema.type = popupType;
    popupSchema.rooms = popupCapacity;
    popupSchema.guests = popupCapacity;
    popupSchema.checkin = popupTime;
    popupSchema.checkout = popupTime;
    popupSchema.features = popupFeatures;
    popupSchema.description = popupDescription;
    popupSchema.photos = popupPhotos;

    fillElement(OfferPinSchema, element.offer);

    var popupAvatar = card.querySelector('.popup__avatar');
    popupAvatar.src = element.author.avatar;

    removePopup();
    pin.classList.add('map__pin--active');

    mapFilterContainer.before(card);
  };

  var onPopupEscKeydown = function (evt) {
    if (evt.key === KeyboardKey.ESC) {
      removePopup();
      document.removeEventListener('keydown', onPopupEscKeydown);
    }
  };

  var hideActivePin = function () {
    var activePin = pinsContainer.querySelector('.map__pin--active');
    if (activePin !== null) {
      activePin.classList.remove('map__pin--active');
    }
  };

  var removePopup = function () {
    hideActivePin();
    var popup = map.querySelector('.popup');
    if (popup !== null) {
      popup.remove();
    }
  };

  var fillElement = function (schema, data) {
    var prototype = Object.values(schema);
    var structurePin = Object.keys(data);

    prototype.forEach(function (item) {
      if (structurePin.includes(item)) {
        return fillBox(item, data);
      }

      return popupSchema[item].classList.add('hidden');
    });
  };

  var fillBox = function (item, data) {
    switch (item) {
      case OfferPinSchema.TITLE:
        popupTitle.textContent = data.title;
        break;

      case OfferPinSchema.ADDRESS:
        popupAddress.textContent = data.address;
        break;

      case OfferPinSchema.PRICE:
        var currencySign = popupPrice.textContent.slice(
            firstCutSymbolPosition,
            lastCutSymbolPosition
        );
        popupPrice.removeChild(popupPrice.firstChild);
        popupPrice.prepend(data.price + currencySign);
        break;

      case OfferPinSchema.TYPE:
        popupType.textContent = defineTypeHouse(data.type);
        break;

      case OfferPinSchema.ROOMS:
        popupCapacity.textContent = data.rooms + ' ' + CapacityText.ROOMS + ' ';
        break;

      case OfferPinSchema.GUESTS:
        var newCapacityText = CapacityText.FOR + ' ' + data.guests + ' ' +
            CapacityText.GUESTS;
        popupCapacity.textContent = popupCapacity.textContent + newCapacityText;
        break;

      case OfferPinSchema.CHECKIN:
        popupTime.textContent = TimeText.CHECKIN + ' ' + data.checkin;
        break;

      case OfferPinSchema.CHECKOUT:
        var newTimeText = PUNCTUATION_COMMA + ' ' + TimeText.CHECKOUT + ' ' + data.checkout;
        popupTime.textContent = popupTime.textContent + newTimeText;
        break;

      case OfferPinSchema.FEATURES:
        fillFeatures(data.features);
        break;

      case OfferPinSchema.DESCRIPTION:
        popupDescription.textContent = data.description;
        break;

      case OfferPinSchema.PHOTOS:
        fillPhotos(data.photos);
    }
  };

  var defineTypeHouse = function (type) {
    switch (type) {
      case TypeAccommodation.BUNGALO:
        return TranslateAccommodation.BUNGALO;

      case TypeAccommodation.FLAT:
        return TranslateAccommodation.FLAT;


      case TypeAccommodation.HOUSE:
        return TranslateAccommodation.HOUSE;

      case TypeAccommodation.PALACE:
        return TranslateAccommodation.PALACE;
    }
    return popupSchema[OfferPinSchema.TYPE].classList.add('hidden');
  };

  var fillPhotos = function (photos) {
    var photoPlug = popupPhotos.querySelector('img');

    photoPlug.remove();

    if (photos.length === emptyPhotosCount) {
      popupSchema[OfferPinSchema.PHOTOS].classList.add('hidden');
      return;
    }

    if (photos.length > emptyPhotosCount) {
      var fragmentPhotos = document.createDocumentFragment();
      photos.forEach(function (photo) {
        var photoItem = photoPlug.cloneNode(false);
        photoItem.src = photo;
        fragmentPhotos.appendChild(photoItem);
      });
      popupPhotos.appendChild(fragmentPhotos);
    }
  };

  var fillFeatures = function (features) {
    Object.keys(allFeatures).forEach(function (feature) {
      if (!features.includes(feature)) {
        popupFeatures.removeChild(allFeatures[feature]);
      }
    });

    if (popupFeatures.querySelector('li') === null) {
      popupSchema[OfferPinSchema.FEATURES].classList.add('hidden');
    }
  };

  window.card = {
    generateCard: generateCard,
    OfferPinSchema: OfferPinSchema,
  };
})();
