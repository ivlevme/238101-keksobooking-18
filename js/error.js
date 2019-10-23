'use strict';

(function () {
  var onErrorHappen = function (message) {
    var errorTemplate = document.querySelector('#error')
      .content
      .querySelector('.error');
    var error = errorTemplate.cloneNode(true);

    var errorMessageText = error.querySelector('.error__message');
    errorMessageText.textContent = message;
    main.appendChild(error);

    document.addEventListener('click', onModalPopupClick);
    document.addEventListener('keydown', onModalPopupEscKeydown);
  };

  var onModalPopupClick = function () {
    main.lastChild.remove();
    document.removeEventListener('click', onModalPopupClick);
    document.removeEventListener('keydown', onModalPopupEscKeydown);
  };

  var onModalPopupEscKeydown = function (evt) {
    if (evt.key === KeyboardKey.ESC) {
      main.lastChild.remove();
      document.removeEventListener('click', onModalPopupClick);
      document.removeEventListener('keydown', onModalPopupEscKeydown);
    }
  };

  var main = window.setup.main;
  var KeyboardKey = window.setup.KeyboardKey;

  window.error = {
    onErrorHappen: onErrorHappen,
    onModalPopupClick: onModalPopupClick,
    onModalPopupEscKeydown: onModalPopupEscKeydown
  };
})();
