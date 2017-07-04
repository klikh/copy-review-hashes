// ==UserScript==
// @name         copy-review-hashes
// @namespace    http://tampermonkey.net/
// @version      0.1
// @author       You
// @include      https://upsource.jetbrains.com/IDEA/review/*
// @grant        none
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// ==/UserScript==


(function() {
    'use strict';
    
    waitForKeyElements (".ring-button.ring-button_default.review-revisions__add", function() {
        var revisionsPane = document.getElementsByClassName("revision-item_revision")[0];

        var zNode       = document.createElement ('div');
        zNode.innerHTML = '<button id="copy-revisions-button" type="button" class="ring-button ring-button_default">Copy Revisions</button>';
        revisionsPane.insertBefore(zNode, revisionsPane.firstChild);

        document.getElementById ("copy-revisions-button").addEventListener (
            "click", ButtonClickAction, false
        );
    });

})();


function ButtonClickAction (zEvent) {
    var hashInfo = $(".revision-item__revision__id");
    var hashes = hashInfo.map(function() {
        var hash = $(this).attr("data-title");
        var dash=hash.indexOf('-');
        if (dash < 0) dash = -1;
        return hash.substring(dash+1);
    });
    
    var joined = Array.prototype.join.call(hashes, ' ');
    
    copyTextToClipboard(joined);
}

function copyTextToClipboard(text) {
  var textArea = document.createElement("textarea");

  //
  // *** This styling is an extra step which is likely not required. ***
  //
  // Why is it here? To ensure:
  // 1. the element is able to have focus and selection.
  // 2. if element was to flash render it has minimal visual impact.
  // 3. less flakyness with selection and copying which **might** occur if
  //    the textarea element is not visible.
  //
  // The likelihood is the element won't even render, not even a flash,
  // so some of these are just precautions. However in IE the element
  // is visible whilst the popup box asking the user for permission for
  // the web page to copy to the clipboard.
  //

  // Place in top-left corner of screen regardless of scroll position.
  textArea.style.position = 'fixed';
  textArea.style.top = 0;
  textArea.style.left = 0;

  // Ensure it has a small width and height. Setting to 1px / 1em
  // doesn't work as this gives a negative w/h on some browsers.
  textArea.style.width = '2em';
  textArea.style.height = '2em';

  // We don't need padding, reducing the size if it does flash render.
  textArea.style.padding = 0;

  // Clean up any borders.
  textArea.style.border = 'none';
  textArea.style.outline = 'none';
  textArea.style.boxShadow = 'none';

  // Avoid flash of white box if rendered for any reason.
  textArea.style.background = 'transparent';


  textArea.value = text;

  document.body.appendChild(textArea);

  textArea.select();

  try {
    var successful = document.execCommand('copy');
    var msg = successful ? 'successful' : 'unsuccessful';
    console.log('Copying text command was ' + msg);
  } catch (err) {
    console.log('Oops, unable to copy');
  }

  document.body.removeChild(textArea);
}