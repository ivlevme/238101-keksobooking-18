'use strict';

(function () {
  var KeyboardKey = {
    ESC: 'Escape',
    ENTER: 'Enter'
  };

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

  var OfferPinStructure = {
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

  var CapacityText = {
    FOR: 'для',
    GUESTS: 'гостей',
    ROOMS: 'комнаты'
  };

  var TimeText = {
    CHECKIN: 'Заезд после',
    CHECKOUT: ''
  };

  var ClassListMethod = {
    ADD: 'add',
    REMOVE: 'remove'
  };

  var NameClass = {
    ACTIVE: 'map__pin--active',
    HIDDEN: 'hidden'
  };

  var generateCard = function (element, pin) {
    var card = cardTemplate.cloneNode(true);

    var popupClose = card.querySelector('.popup__close');

    var currentOnPopupCloseClick = onPopupCloseClick.bind(card, card);
    document.removeEventListener('keydown', currentOnPopupEscKeydown);

    currentOnPopupEscKeydown = onPopupEscKeydown.bind(card, card);
    popupClose.addEventListener('click', currentOnPopupCloseClick);
    document.addEventListener('keydown', currentOnPopupEscKeydown);
    var onCurrentPinClick = onPinClick.bind(card, card, pin);
    pin.addEventListener('click', onCurrentPinClick);

    var popupTitle = card.querySelector('.popup__title');
    var popupAddress = card.querySelector('.popup__text--address');
    var popupPrice = card.querySelector('.popup__text--price');
    var popupType = card.querySelector('.popup__type');
    var popupCapacity = card.querySelector('.popup__text--capacity');
    popupCapacity.textContent = '';
    var popupTime = card.querySelector('.popup__text--time');
    popupTime.textContent = '';
    var popupDescription = card.querySelector('.popup__description');

    fillField(popupTitle, OfferPinStructure.TITLE, element.offer);

    fillField(popupAddress, OfferPinStructure.ADDRESS, element.offer);

    if (checkAvailableField(OfferPinStructure.PRICE, element.offer)) {
      var priceText = popupPrice.textContent.slice(Digit.ZERO, Digit.FOUR);
      var newPriceText = element.offer[OfferPinStructure.PRICE];
      popupPrice.innerHTML = popupPrice.innerHTML.replace(priceText, newPriceText);
    } else {
      hideField(popupPrice);
    }

    fillField(popupType, OfferPinStructure.TYPE, element.offer);

    if (checkAvailableField(OfferPinStructure.ROOMS, element.offer)) {
      popupCapacity.textContent = element.offer.rooms + ' ' + CapacityText.ROOMS + ' ';
    }

    if (checkAvailableField(OfferPinStructure.GUESTS, element.offer)) {
      var newCapacityText = CapacityText.FOR + ' ' + element.offer.guests + ' ' +
        CapacityText.GUESTS;
      connectStrings(popupCapacity, newCapacityText);
    }

    hideElement(element, popupCapacity, OfferPinStructure.ROOMS, OfferPinStructure.GUESTS);

    if (checkAvailableField(OfferPinStructure.CHECKIN, element.offer)) {
      popupTime.textContent = TimeText.CHECKIN + ' ' + element.offer.checkin;
    }

    if (checkAvailableField(OfferPinStructure.CHECKOUT, element.offer)) {
      var newTimeText = ' ' + TimeText.CHECKOUT + ' ' + element.offer.checkout;
      connectStrings(popupTime, newTimeText);
    }

    hideElement(element, popupTime, OfferPinStructure.CHECKIN, OfferPinStructure.CHECKOUT);

    var popupFeatures = card.querySelector('.popup__features');
    var wifiFeature = popupFeatures.querySelector('.popup__feature--wifi');
    var dishwasherFeature = popupFeatures.querySelector('.popup__feature--dishwasher');
    var parkingFeature = popupFeatures.querySelector('.popup__feature--parking');
    var washerFeature = popupFeatures.querySelector('.popup__feature--washer');
    var elevatorFeature = popupFeatures.querySelector('.popup__feature--elevator');
    var conditionerFeature = popupFeatures.querySelector('.popup__feature--conditioner');
    var allFeatures = {
      wifi: wifiFeature,
      dishwasher: dishwasherFeature,
      parking: parkingFeature,
      washer: washerFeature,
      elevator: elevatorFeature,
      conditioner: conditionerFeature,
    };

    for (var prop in allFeatures) {
      if (!element.offer.features.includes(prop)) {
        popupFeatures.removeChild(allFeatures[prop]);
      }
    }

    if (popupFeatures.querySelector(Tag.LI) === null) {
      hideField(popupFeatures);
    }


    fillField(popupDescription, OfferPinStructure.DESCRIPTION, element.offer);

    var popupPhotos = card.querySelector('.popup__photos');
    var photo = popupPhotos.querySelector(Tag.IMG);

    photo.remove();

    if (element.offer.photos.length) {
      hideField(popupPhotos);
    } else {
      var fragmentPhotos = document.createDocumentFragment();
      element.offer.photos.forEach(function (item) {
        var photoItem = photo.cloneNode(false);
        photoItem.src = item;
        fragmentPhotos.appendChild(photoItem);
      });
      popupPhotos.appendChild(fragmentPhotos);
    }

    var popupAvatar = card.querySelector('.popup__avatar');
    popupAvatar.src = element.author.avatar;

    hideActiveElement(Tag.ARTICLE, ClassListMethod.ADD, NameClass.HIDDEN);
    hideActiveElement(Tag.BUTTON, ClassListMethod.REMOVE, NameClass.ACTIVE);
    pin.classList.add(NameClass.ACTIVE);

    mapFilterContainer.before(card);
  };

  var onPopupCloseClick = function (card) {
    closeCard(card);
  };

  var onPopupEscKeydown = function (card, evt) {
    if (evt.key === KeyboardKey.ESC) {
      closeCard(card);
    }
  };

  var onPinClick = function (card, pin) {
    document.removeEventListener('keydown', currentOnPopupEscKeydown);

    currentOnPopupEscKeydown = onPopupEscKeydown.bind(card, card);
    document.addEventListener('keydown', currentOnPopupEscKeydown);

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

  var fillField = function (field, structure, element) {
    if (checkAvailableField(structure, element)) {
      field.textContent = element[structure];
      return true;
    }
    hideField(field);
    return false;
  };

  var checkAvailableField = function (field, pinElement) {
    if (field in pinElement) {
      return true;
    }
    return false;
  };

  var hideField = function (field) {
    field.textContent = '';
    field.classList.add(NameClass.HIDDEN);
  };

  var connectStrings = function (element, newString) {
    var currentSting = element.textContent;
    element.textContent = currentSting + newString;
  };

  var hideElement = function (element, container, firstProperty, secondProperty) {
    if (!checkAvailableField(firstProperty, element.offer) &&
        !checkAvailableField(secondProperty, element.offer)) {
      hideField(container);
    }
  };

  var closeCard = function (card) {
    document.removeEventListener('keydown', currentOnPopupEscKeydown);
    card.classList.add(NameClass.HIDDEN);
    hideActiveElement('button', 'remove', NameClass.ACTIVE);
  };

  var map = window.setup.map;

  var currentOnPopupEscKeydown;

  var mapFilterContainer = map.querySelector('.map__filters-container');
  var cardTemplate = document.querySelector('#card')
    .content
    .querySelector('.map__card');

  window.card = {
    generateCard: generateCard
  };
})();
