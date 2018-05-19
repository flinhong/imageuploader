// File Upload
// 
function ekUpload() {
  function Init() {

      var fileSelect = document.getElementById('file-upload'),
          fileDrag = document.getElementById('file-drag'),
          submitButton = document.getElementById('submit-button');

      fileSelect.addEventListener('change', fileSelectHandler, false);

      // Is XHR2 available?
      var xhr = new XMLHttpRequest();
      if (xhr.upload) {
          // File Drop
          fileDrag.addEventListener('dragover', fileDragHover, false);
          fileDrag.addEventListener('dragleave', fileDragHover, false);
          fileDrag.addEventListener('drop', fileSelectHandler, false);
      }
  }

  function fileDragHover(e) {
      var fileDrag = document.getElementById('file-drag');

      e.stopPropagation();
      e.preventDefault();

      fileDrag.className = (e.type === 'dragover' ? 'hover' : 'modal-body file-upload');
  }

  function fileSelectHandler(e) {
      // Fetch FileList object
      var files = e.target.files || e.dataTransfer.files;

      // Cancel event and hover styling
      fileDragHover(e);

      // Process all File objects
      for (var i = 0, f; f = files[i]; i++) {
          parseFile(f);
          // file2Base64(f);
          uploadFile(f);
      }
  }

  // Output
  function output(msg) {
      // Response
      var m = document.getElementById('messages');
      m.innerHTML = msg;
  }

  function parseFile(file) {

      // console.log(file);

      output(
          `<strong>${encodeURI(file.name)}</strong><br>
          <span>${Math.round(file.size/1000)} kb</span>`
      );

      // var fileType = file.type;
      // console.log(fileType);
      var imageName = file.name;

      var isGood = (/\.(?=gif|jpg|png|jpeg)/gi).test(imageName);
      if (isGood) {
          document.getElementById('start').classList.add("hidden");
          document.getElementById('response').classList.remove("hidden");
          document.getElementById('notimage').classList.add("hidden");
          // Thumbnail Preview
          document.getElementById('file-image').classList.remove("hidden");
          document.getElementById('file-image').src = URL.createObjectURL(file);
      } else {
          document.getElementById('file-image').classList.add("hidden");
          document.getElementById('notimage').classList.remove("hidden");
          document.getElementById('start').classList.remove("hidden");
          document.getElementById('response').classList.add("hidden");
          document.getElementById("file-upload-form").reset();
      }
  }

  function setProgressMaxValue(e) {
      var pBar = document.getElementById('file-progress');

      if (e.lengthComputable) {
          pBar.max = e.total;
      }
  }

  function updateFileProgress(e) {
      var pBar = document.getElementById('file-progress');

      if (e.lengthComputable) {
          pBar.value = e.loaded;
      }
  }

  function file2Base64(file) {
    var fileInput = document.getElementById('class-roster-file'),
        pBar = document.getElementById('file-progress'),
        fileSizeLimit = 5; // In MB

    if (file.size <= fileSizeLimit * 1024 * 1024) {
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = function(event) {
        console.log(event);
        output(`<pre>${reader.result}</pre>`);
      }
    } else {
      output('Please select a smaller file (< ' + fileSizeLimit + ' MB).');
    }


  }

  function uploadFile(file) {

      // console.log(file);
      var xhr = new XMLHttpRequest(),
          url = 'https://api.cloudinary.com/v1_1/flinhong/image/upload?api_key=144259586877723'
          fileInput = document.getElementById('class-roster-file'),
          pBar = document.getElementById('file-progress'),
          fileSizeLimit = 5; // In MB
      var fd = new FormData();
      if (xhr.upload) {
          // Check if file is less than x MB
          if (file.size <= fileSizeLimit * 1024 * 1024) {
              // Progress bar
              pBar.style.display = 'inline';
              xhr.upload.addEventListener('loadstart', setProgressMaxValue, false);
              xhr.upload.addEventListener('progress', updateFileProgress, false);

              // File received / failed
              xhr.onreadystatechange = function(e) {
                  if (xhr.readyState == 4 && xhr.status == 200) {
                      // Everything is good!

                      var progress = $('progress');
                      progress.className = (xhr.status == 200 ? "success" : "failure");
                      // document.location.reload(true);
                      var response = JSON.parse(xhr.responseText);
                      console.log(response);
                  }
              };

              // Start upload
              xhr.open('POST', url, true);
              xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
              xhr.setRequestHeader('X-File-Name', file.name);
              xhr.setRequestHeader('X-File-Size', file.size);

              fd.append('upload_preset', 'statics');
              fd.append('file', file)
              console.log(fd);
              xhr.send(fd);
          } else {
              output('Please upload a smaller file (< ' + fileSizeLimit + ' MB).');
          }
      }
  }

  // Check for the various File API support.
  if (window.File && window.FileList && window.FileReader) {
      Init();
  } else {
      document.getElementById('file-drag').style.display = 'none';
  }
}
ekUpload();