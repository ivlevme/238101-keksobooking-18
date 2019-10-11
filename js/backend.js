'use strict';

(function () {
  var TIME_UNIT = 'мс';

  var url = {
    load: 'https://js.dump.academy/keksobooking/data'
  };
  var hxrParams = {
    timeout: 3000,
    status200: 200
  };
  var errorMessage = {
    connect: 'Произошла ошибка соединения',
    timeout: 'Запрос не успел выполниться за ',
    response: 'Статус ответа: '
  };

  var load = function (onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === hxrParams.status200) {
        onLoad(xhr.response);
      } else {
        onError(errorMessage.response + xhr.status + ' ' + xhr.statusText);
      }
    });
    xhr.addEventListener('error', function () {
      onError(errorMessage.connect);
    });
    xhr.addEventListener('timeout', function () {
      onError(errorMessage.timeout + xhr.timeout + TIME_UNIT);
    });

    xhr.timeout = hxrParams.timeout;

    xhr.open('GET', url.load);
    xhr.send();
  };

  window.backend = {
    load: load
  };
})();
