// frontend/assets/js/editor.js

tinymce.init({
  selector: '#mytextarea',
  plugins: 'link image media file',
  toolbar: 'undo redo | bold italic | link image media file',
  file_picker_callback: function (callback, value, meta) {
      const input = document.createElement('input');
      input.setAttribute('type', 'file');

      if (meta.filetype === 'image') {
          input.setAttribute('accept', 'image/*');
      } else if (meta.filetype === 'media') {
          input.setAttribute('accept', 'video/*, audio/*');
      } else {
          input.setAttribute('accept', '.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt');
      }

      input.onchange = function () {
          const file = this.files[0];
          const formData = new FormData();
          formData.append('file', file);

          fetch('http://localhost:3700/api/upload', {
              method: 'POST',
              body: formData
          })
          .then(response => response.json())
          .then(data => {
              if (data.location) {
                  callback(data.location, { text: file.name, title: file.name });
              } else {
                  console.error('Ошибка загрузки файла:', data);
              }
          })
          .catch(error => {
              console.error('Ошибка при загрузке файла:', error);
          });
      };

      input.click();
  }
});


  