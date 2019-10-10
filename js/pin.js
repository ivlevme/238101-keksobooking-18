'use strict';

(function () {
  window.generatePins = function (pins) {
    var fragment = document.createDocumentFragment();
    pins.forEach(function (item) {
      var pin = pinTemplate.cloneNode(true);
      pin.style.left = item.location.x.toString() + 'px';
      pin.style.top = item.location.y.toString() + 'px';
      var imgPin = pin.querySelector('img');
      imgPin.src = item.author.avatar;
      imgPin.alt = item.offer.title;
      fragment.appendChild(pin);
    });
    return fragment;
  };

  var pinTemplate = document.querySelector('#pin')
  .content
  .querySelector('.map__pin');
})();
