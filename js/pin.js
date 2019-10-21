'use strict';

(function () {
  var generatePins = function (pins) {
    var fragment = document.createDocumentFragment();
    pins.forEach(function (item, index) {
      var pin = pinTemplate.cloneNode(true);
      if (!('offer' in item)) {
        return;
      }
      pin.style.left = item.location.x.toString() + 'px';
      pin.style.top = item.location.y.toString() + 'px';

      var imgPin = pin.querySelector('img');
      imgPin.src = item.author.avatar;
      imgPin.alt = item.offer.title;

      fragment.appendChild(pin);

      pinHandlerFunction[index] = onPinClick.bind(item, item, pin, index);
      pin.addEventListener('click', pinHandlerFunction[index]);
    });
    return fragment;
  };

  var onPinClick = function (item, pin, index) {
    generateCard(item, pin);
    pin.removeEventListener('click', pinHandlerFunction[index]);
  };

  var generateCard = window.card.generateCard;

  var pinTemplate = document.querySelector('#pin')
  .content
  .querySelector('.map__pin');

  var pinHandlerFunction = {};

  window.pin = {
    generatePins: generatePins
  };
})();
