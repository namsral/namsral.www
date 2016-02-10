(function(){
  var MAIN_CONTENT_SELECTOR = '#pjax-container';

  var find = function(selector, context) {
    return (context || document).querySelector(selector);
  };

  var updateMainContent = function(url) {
    var xhr = new XMLHttpRequest();

    xhr.open('GET', url.href);
    xhr.responseType = 'document';
    xhr.setRequestHeader('Content-Type', 'text/html');

    xhr.onload = function() {
      if (this.status != 200 || this.response == null || this.response.contentType != 'text/html') {
        location = url;
        return;
      }

      var newContainer = find(MAIN_CONTENT_SELECTOR, this.response);
      var newTitle = newContainer.getAttribute('data-title');
      var currentContainer = find(MAIN_CONTENT_SELECTOR);

      find('title').textContent = newTitle;
      currentContainer.parentNode.replaceChild(newContainer, currentContainer);

      // if (url.hash) {
      //   location.hash = "#" + url.hash;
      // } else {
      //   scroll(0,0);
      // }
    };

    xhr.onerror = function() {
        location = url;
    }

    xhr.send();
  };

  if (history && history.pushState) {
    find(MAIN_CONTENT_SELECTOR).addEventListener('click', function(a) {
      var b = a.target;
      if (b.nodeName.match(/a/i) && b.origin === location.origin && b.pathname !== location.pathname) {
        a.preventDefault(), updateMainContent(b), history.pushState(null, null, b.href);
        console.log(history.state);
      }
    }), setTimeout(function() {
      window.addEventListener("popstate", function(a) {
        updateMainContent(location);
      });
    }, 1e3);
  }
}())