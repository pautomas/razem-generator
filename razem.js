let handlePaste = function(e) {
  e.preventDefault();
  e.stopPropagation();
  var text = e.clipboardData.getData("text/plain");
  document.execCommand("insertHTML", false, text);
}

let handleFontSizeChange = function(e) {
  let textareas = document.querySelectorAll('.textarea');
  for (var i = 0; i < textareas.length; i++) {
    textareas[i]
    .style = [ 'font-size : ' + e.target.value + 'px' ]
      .join(',');
  }
}

let razem = {
  init : function() {
    let root = document.querySelector('#canvas')
    root.addEventListener('paste', handlePaste, false);

    let fontSize = document.querySelector('#font-size input');
    fontSize.addEventListener('change', handleFontSizeChange);
  }
}
