'use strict';

(function () {
  var Time = {
    TIMEOUT: 3000,
    UNIT: 'мс'
  };
  var Url = {
    SAVE: '',
    LOAD: 'https://js.dump.academy/keksobooking/data'
  };

  var HttpCode = {
    OK: 200,
    NOT_FOUND: 404
  };

  var ErrorMessage = {
    CONNECT: 'Произошла ошибка соединения',
    TIMEOUT: 'Запрос не успел выполниться за ',
    RESPONSE: 'Статус ответа: '
  };

  var setupXHR = function (onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === HttpCode.OK) {
        onLoad(xhr.response);
      } else {
        onError(ErrorMessage.RESPONSE + xhr.status + ' ' + xhr.statusText);
      }
    });
    xhr.addEventListener('error', function () {
      onError(ErrorMessage.CONNECT);
    });

    xhr.addEventListener('timeout', function () {
      onError(ErrorMessage.TIMEOUT + xhr.timeout + Time.UNIT);
    });

    xhr.timeout = Time.TIMEOUT;

    return xhr;
  };

  var save = function (onLoad, onError, data) {
    var xhr = setupXHR(onLoad, onError);
    xhr.open('POST', Url.SAVE);
    xhr.send(data);
  };

  var load = function (onLoad, onError) {
    var xhr = setupXHR(onLoad, onError);
    xhr.open('GET', Url.LOAD);
    xhr.send();
  };

  window.backend = {
    load: load,
    save: save
  };
})();
