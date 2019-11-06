'use strict';

(function () {
  var Tag = {
    ARTICLE: 'article',
    BUTTON: 'button',
    LI: 'li',
    IMG: 'img'
  };

  var Digit = {
    ZERO: 0,
    FOUR: 4
  };

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

  var NameClass = {
    ACTIVE: 'map__pin--active',
    HIDDEN: 'hidden'
  };

  var generateCard = function (element, pin) {
    card = cardTemplate.cloneNode(true);

    var popupClose = card.querySelector('.popup__close');

    var onPopupCloseClick = closePopup.bind(card, card);
    document.removeEventListener('keydown', onPopupCloseEscPress);

    onPopupCloseEscPress = onPopupEscKeydown.bind(card, card);
    popupClose.addEventListener('click', onPopupCloseClick);
    document.addEventListener('keydown', onPopupCloseEscPress);

    var onCurrentPinClick = onPinClick.bind(card, card, pin);
    pin.addEventListener('click', onCurrentPinClick);

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

    hideActiveElement(Tag.ARTICLE, ClassListMethod.ADD, NameClass.HIDDEN);
    hideActiveElement(Tag.BUTTON, ClassListMethod.REMOVE, NameClass.ACTIVE);
    pin.classList.add(NameClass.ACTIVE);

    mapFilterContainer.before(card);
  };

  var closeCard = function (card) {
    document.removeEventListener('keydown', onPopupCloseEscPress);
    card.classList.add(NameClass.HIDDEN);
    hideActiveElement(Tag.BUTTON, ClassListMethod.REMOVE, NameClass.ACTIVE);
  };

  var closePopup = function (card) {
    closeCard(card);
  };

  var onPopupEscKeydown = function (card, evt) {
    if (evt.key === KeyboardKey.ESC) {
      closeCard(card);
    }
  };

  var onPinClick = function (card, pin) {
    document.removeEventListener('keydown', onPopupCloseEscPress);

    onPopupCloseEscPress = onPopupEscKeydown.bind(card, card);
    document.addEventListener('keydown', onPopupCloseEscPress);

    hideActiveElement(Tag.ARTICLE, ClassListMethod.ADD, NameClass.HIDDEN);
    hideActiveElement(Tag.BUTTON, ClassListMethod.REMOVE, NameClass.ACTIVE);
    card.classList.remove(NameClass.HIDDEN);
    pin.classList.add(NameClass.ACTIVE);
  };

  var hideActiveElement = function (tag, property, classTag) {
    var elements = map.querySelectorAll(tag);
    elements = Array.from(elements);
    elements.forEach(function (element) {
      element.classList[property](classTag);
    });
  };

  var fillElement = function (schema, data) {
    var prototype = Object.keys(schema);
    var structurePin = Object.keys(data);

    prototype.forEach(function (item) {
      item = item.toLowerCase();

      if (structurePin.includes(item)) {
        return fillBox(item, data);
      }

      return popupSchema[item].classList.add(NameClass.HIDDEN);
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
        var priceText = popupPrice.textContent.slice(Digit.ZERO, Digit.FOUR);
        var newPriceText = data.price;
        popupPrice.innerHTML = popupPrice.innerHTML.replace(priceText, newPriceText);
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
        Object.keys(allFeatures).forEach(function (feature) {
          if (!data.features.includes(feature)) {
            popupFeatures.removeChild(allFeatures[feature]);
          }
        });

        if (popupFeatures.querySelector(Tag.LI) === null) {
          popupSchema[OfferPinSchema.FEATURES].classList.add(NameClass.HIDDEN);
        }
        break;

      case OfferPinSchema.DESCRIPTION:
        popupDescription.textContent = data.description;
        break;

      case OfferPinSchema.PHOTOS:
        var photoPlug = popupPhotos.querySelector(Tag.IMG);

        photoPlug.remove();

        if (!data.photos.length) {
          popupSchema[OfferPinSchema.PHOTOS].classList.add(NameClass.HIDDEN);
          break;
        }

        if (data.photos.length) {
          var fragmentPhotos = document.createDocumentFragment();
          data.photos.forEach(function (photo) {
            var photoItem = photoPlug.cloneNode(false);
            photoItem.src = photo;
            fragmentPhotos.appendChild(photoItem);
          });
          popupPhotos.appendChild(fragmentPhotos);
        }
        break;
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
    return popupSchema[OfferPinSchema.TYPE].classList.add(NameClass.HIDDEN);
  };

  var map = window.setup.map;
  var KeyboardKey = window.setup.KeyboardKey;
  var ClassListMethod = window.setup.ClassListMethod;
  var mapFilterContainer = window.setup.mapFilterContainer;
  var TypeAccommodation = window.setup.TypeAccommodation;
  var PUNCTUATION_COMMA = window.setup.PUNCTUATION_COMMA;


  var popupSchema = {};

  var cardTemplate = document.querySelector('#card')
  .content
  .querySelector('.map__card');

  var onPopupCloseEscPress;
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

  window.card = {
    generateCard: generateCard,
    OfferPinSchema: OfferPinSchema,
  };
})();
