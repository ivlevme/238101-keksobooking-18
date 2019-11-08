'use strict';

(function () {
  var main = window.setup.main;
  var KeyboardKey = window.setup.KeyboardKey;

  var onAppMistake = function (message) {
    var errorTemplate = document.querySelector('#error')
      .content
      .querySelector('.error');
    var error = errorTemplate.cloneNode(true);

    var errorMessageText = error.querySelector('.error__message');
    errorMessageText.textContent = message;
    main.appendChild(error);

    document.addEventListener('click', onModalPopupClick);
    document.addEventListener('keydown', onModalPopupEscPress);
  };

  var onModalPopupClick = function () {
    main.lastChild.remove();
    document.removeEventListener('click', onModalPopupClick);
    document.removeEventListener('keydown', onModalPopupEscPress);
  };

  var onModalPopupEscPress = function (evt) {
    if (evt.key === KeyboardKey.ESC) {
      main.lastChild.remove();
      document.removeEventListener('click', onModalPopupClick);
      document.removeEventListener('keydown', onModalPopupEscPress);
    }
  };

  window.error = {
    onAppMistake: onAppMistake,
    onModalPopupClick: onModalPopupClick,
    onModalPopupEscPress: onModalPopupEscPress
  };
})();
