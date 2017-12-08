let doExportCanvas = function(title) {
  var canvas = document.querySelector('#canvas');
  domtoimage.toJpeg(canvas, { quality: 1 })
      .then(function (dataUrl) {
          var link = document.createElement('a');
          link.download = title + ".jpeg";
          link.href = dataUrl;
          link.click();
      })
      .catch(function (error) {
          console.error('oops, something went wrong!', error);
      });
}

var toolbar = {
  init : function() {
    document.querySelector('#toolbar').addEventListener('click', function(e) {
      switch (e.target.id) {
        case 'export': {
          let title = document.querySelector('.title-input').value || e.target.dataset.name;
          doExportCanvas(title);
          break;
        }
      }
    });
  }
}
