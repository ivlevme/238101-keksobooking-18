'use strict';

(function () {
  var generatePins = function (pins) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < Object.keys(pins).length; i++) {
      var pin = pinTemplate.cloneNode(true);
      pin.style.left = pins[i].location.x.toString() + 'px';
      pin.style.top = pins[i].location.y.toString() + 'px';


      var imgPin = pin.querySelector('img');
      imgPin.src = pins[i].author.avatar;
      imgPin.alt = pins[i].offer.title;
      fragment.appendChild(pin);
    }
    return fragment;
  };

  var pinTemplate = document.querySelector('#pin')
    .content
    .querySelector('.map__pin');
  var pinsFragment = generatePins(window.data.pinsMocks);

  window.pinsFragment = pinsFragment;
})();
