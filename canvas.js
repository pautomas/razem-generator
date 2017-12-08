let handleDragOver = function(e) {
  e.stopPropagation();
  e.preventDefault();

  if (e.target.classList.contains('square')) {
    e.target.classList.add('hover');
  }
};

let handleDragLeave = function(e) {
  if (e.target.classList.contains('square')) {
    e.target.classList.remove('hover');
  }
};

let handleDrop = function(e) {
  e.stopPropagation();
  e.preventDefault();

  e.target.classList.remove('hover');

  if (e.target.classList.contains('square')) {
    let square = e.target;
    let img = new Image();
    let file = e.dataTransfer.files[0];

    if (!file || !file.type.match('image')) {
      return;
    }

    let reader = new FileReader();
    reader.onload = function() { // file load
      img.onload = function() { // image load
        Pimio(img, { effect : "razem" });
        openEditDialog(this, square);
        this.onload = null;
      }
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  }
};

let handleMouseDown = function(e) {
  if (e.target.classList.contains('square') && e.target.dataset.imgUrl) {
    let img = new Image();
    img.onload = function() {
      console.log('ONLOAD MOUSEDOWN')
      openEditDialog(this, e.target);
      this.onload = null;
    };
    img.src = e.target.dataset.imgUrl;
  } else {

  }
}

let openEditDialog = function(img, square) {
  let modal = document.querySelector('.modal');
  let saveButton = document.querySelector('#save-edit');

  let ratio = square.offsetHeight / square.offsetWidth;
  let h = Math.min(400, square.offsetHeight);
  let w = h / ratio;

  console.log(ratio, w, h, square.offsetWidth, square.offsetHeight);

  let c = new Croppie(modal.querySelector('.croppie'), {
    viewport: {
      width: w,
      height: h
    },
    boundary: {
      width: w + 100,
      height: h + 50
    }
  });

  let handleModalKeypress = function(e) {
    if (e.keyCode == 13) {
      handleModalSaveButtonClick();
      e.preventDefault();
    } else if (e.keyCode == 27) {
      closeModal();
      e.preventDefault();
    }
  };

  let closeModal = function() {
    // Remove Event Listeners
    saveButton.removeEventListener('click', handleModalSaveButtonClick);
    window.removeEventListener('keydown', handleModalKeypress);

    modal.classList.add('hidden');
    document.querySelector('body').classList.remove('modal-open');

    c.destroy();
  }

  let handleModalSaveButtonClick = function() {
    c.result({
      type: 'base64',
      size: {
        width: square.offsetWidth,
        height:  square.offsetHeight
      }
    })
    .then(function(e) {
      // Store the old url on the node
      square.dataset.imgUrl = img.src;
      square.style = [
        'background-image : url("' + e + '")'
      ].join(';')
    })
    .catch(function(e) {
      console.log('ERROR', e);
    })

    closeModal();
  };

  c.bind({ url: img.src })
    .then(function() {
      modal.classList.remove('hidden');
      document.querySelector('body').classList.add('modal-open');

      // Add Event Listeners
      saveButton.addEventListener('click', handleModalSaveButtonClick, false);
      window.addEventListener('keydown', handleModalKeypress, false);
    });
}

let canvas = {
  init : function() {
    let root = document.querySelector('#canvas')
    root.addEventListener('dragover', handleDragOver, false);
    root.addEventListener('dragleave', handleDragLeave, false);
    root.addEventListener('drop', handleDrop, false);
    root.addEventListener('mousedown', handleMouseDown, false);
  }
}
