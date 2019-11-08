'use strict';

(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

  var adForm = window.setup.adForm;

  var avatarChooser = adForm.querySelector('#avatar');
  var photoRoomChooser = adForm.querySelector('#images');
  var avatarPreviewContainer = adForm.querySelector('.ad-form-header__preview');
  var photoPreviewContainer = adForm.querySelector('.ad-form__photo');
  var avatarPreviewImage = avatarPreviewContainer.querySelector('img');
  var photoPreviewImage = avatarPreviewImage.cloneNode(true);

  var changeImage = function (fileChooser, preview) {
    fileChooser.addEventListener('change', function () {
      var file = fileChooser.files[0];

      if (file) {
        var fileName = file.name.toLowerCase();

        var matches = FILE_TYPES.some(function (it) {
          return fileName.endsWith(it);
        });

        if (matches) {
          var reader = new FileReader();

          reader.addEventListener('load', function () {
            preview.src = reader.result;
          });

          reader.readAsDataURL(file);
        }
      }
    });
  };

  changeImage(avatarChooser, avatarPreviewImage);
  changeImage(photoRoomChooser, photoPreviewImage);
  photoPreviewContainer.appendChild(photoPreviewImage);

  window.avatar = {
    photoPreviewImage: photoPreviewImage,
    avatarPreviewImage: avatarPreviewImage
  };
})();
