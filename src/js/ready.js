//remove Google Analytics cross-domain tracking in url, if it exists
(function () {
  const splitter = /\?_gl=|&_gl=|\?_ga=|&_ga=/;
  const href = location.href.split(splitter)[0];
  if (location.href !== href) history.replaceState({}, location.href, href);
})();

//add page path as classes to body element
(function () {
  var path = document.location.pathname,
    classes = '';
  if (
    location.host === 'www.klrn.org' ||
    location.host === 'klrn.bento-live.pbs.org'
  ) {
    if (path === '/') classes += 'home';
    else if (path.length > 0) classes += path.split('/').join(' ').trim();
  } else if (location.host === 'bento.pbs.org') classes += klrn.pages[path];
  if (classes.length > 0) document.body.className += ' ' + classes;
})();

//manage link button styles
(function () {
  var links = document.links;
  var i,
    len = links.length;
  if (len === 0) return;

  //add String endsWith method if not available
  //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/endsWith
  if (!String.prototype.endsWith) {
    String.prototype.endsWith = function (search, this_len) {
      if (this_len === undefined || this_len > this.length) {
        this_len = this.length;
      }
      return this.substring(this_len - search.length, this_len) === search;
    };
  }

  for (i = 0; i < len; i++) {
    //add button styles if url has klrn_style parameter added, or text ends with > character
    if (
      links[i].href.indexOf('klrn_style=link') > -1 ||
      links[i].innerHTML.trim().endsWith('&gt;')
    ) {
      links[i].className += ' klrn_button read-more__link';
      if (links[i].innerHTML.trim().endsWith('&gt;&gt;')) {
        links[i].className += ' klrn_button_display_block';
        links[i].innerHTML = links[i].innerHTML.replace('&gt;&gt;', '').trim();
      } else if (links[i].innerHTML.trim().endsWith('&gt;')) {
        links[i].innerHTML = links[i].innerHTML.replace('&gt;', '').trim();
      }
    }
  }
})();

//remove margins on empty p tags in text-containers
(function () {
  var pTags = document.querySelectorAll('.text-container p'),
    i;
  if (!pTags) return;
  for (i = 0; i < pTags.length; i++) {
    if (pTags[i].innerHTML.trim() === '&nbsp;')
      pTags[i].style.marginBottom = '0';
  }
})();

//remove top margins on text components if an <hr> is first element
(function () {
  var hrTags = document.querySelectorAll('.text-container hr:first-child'),
    i;
  if (!hrTags) return;
  for (i = 0; i < hrTags.length; i++) {
    if (
      hrTags[i].parentNode &&
      hrTags[i].parentNode.parentNode &&
      hrTags[i].parentNode.parentNode.parentNode &&
      hrTags[i].parentNode.parentNode.parentNode.classList.contains('component')
    ) {
      hrTags[i].parentNode.parentNode.parentNode.style.marginTop = '16px';
    }
  }
})();

//remove image floats up to certain widths when text too narrow, add back when text wider
(function (exports) {
  var selectors = '.text-container .image-style-align-left > img';
  selectors += ', .text-container .image-style-align-right > img';
  var textImages = document.querySelectorAll(selectors);
  var i,
    maxWidth = 191,
    containerWidth,
    imageWidth;

  if (!textImages) return;

  exports.manageFloatedImages = function () {
    for (i = 0; i < textImages.length; i++) {
      containerWidth = textImages[i].parentNode.parentNode.offsetWidth;
      imageWidth = parseInt(textImages[i].naturalWidth);
      if (containerWidth - imageWidth < maxWidth) {
        textImages[i].parentNode.classList.add(
          'klrn_text_container_mobile_image_block'
        );
      } else {
        textImages[i].parentNode.classList.remove(
          'klrn_text_container_mobile_image_block'
        );
      }
    }
  };
})(klrn);

//remove pbs favicons. and add klrn favicon
(function (exports) {
  //remove pbs favicon links
  var favLinks = document.querySelectorAll('head link[href*="favicon"]');
  if (favLinks)
    favLinks.forEach(function (link) {
      link.remove();
    });

  //create klrn favicon
  var favIcon = document.createElement('link');
  favIcon.href =
    'https://d1qbemlbhjecig.cloudfront.net/prod/filer_public/klrn-bento-live-pbs/global/65c49cf27f_klrn_favicon.png';
  favIcon.type = 'image/png';
  favIcon.rel = 'icon';

  //insert klrn favicon into head tag
  document.querySelector('head').appendChild(favIcon);
})(klrn);

///////////////////////////////////////////////////////////////////////////////////////////
//ready, load and resize
(function ($, undefined) {
  $(document).ready(function () {
    klrn.manageFloatedImages();
    window.dataLayer = window.dataLayer || []; //for Google Tag Manager variables
    klrn.loadYoutubeVideos();
    var playlists = klrn.getYoutubePlaylists();
    if (playlists) klrn.loadYoutubePlaylists(playlists, 'klrn');

    //resize and orientationchange events
    var resizeTicking = false;
    klrn.throttleAnimation(false, klrn.manageFloatedImages);
    $(window).on('resize orientationchange', function () {
      //use requestAnimationFrame to throttle events to browser repaints
      if (!resizeTicking) {
        requestAnimationFrame(function () {
          klrn.manageFloatedImages();
          resizeTicking = false;
        });
      }
      resizeTicking = true;
    });
  });
})(jQuery);

///////////////////////////////////////////////////////////////////////////////////////////
//fade in body so loading doesn't look so jerky
$('body').fadeTo(500, 1, function () {
  document.getElementsByTagName('html')[0].style.backgroundColor =
    'transparent';
});
///////////////////////////////////////////////////////////////////////////////////////////

//optional fade-in for Bootstrap tabs
//<ul class="nav nav-tabs"> needs class klrn-tab-fade-in added
(function (exports) {
  var tabs = document.querySelectorAll('.klrn-tab-fade-in');
  if (!tabs) return;

  var links, i, id, tabBox, j;

  for (i = 0; i < tabs.length; i++) {
    links = tabs[i].querySelectorAll('li a');
    if (!links) break;

    id = links[0].href.split('#');
    if (!id) break;

    tabBox = document.querySelector('#' + id[1]);
    if (!tabBox) break;

    for (j = 0; j < links.length; j++) {
      links[j].addEventListener('click', function (e) {
        tabBox.parentNode.style.opacity = '0';
        exports.fadeIn(tabBox.parentNode, 0.75);
      });
    }
  }
})(klrn);

//set campaign cookie to manage campaign tracking through funnel
(function () {
  //only track campaigns using Google Analytics tags
  var search = location.search;
  if (search.indexOf('utm_campaign=') === -1) return;

  var search = search.slice(1).split('&');
  var params = {},
    i,
    len = search.length,
    keyValue;
  var cookieValue = '',
    source,
    medium,
    campaign,
    content;

  for (i = 0; i < len; i++) {
    keyValue = search[i].split('=');
    params[keyValue[0]] = keyValue[1];
  }

  cookieValue += params.hasOwnProperty('utm_source')
    ? params['utm_source']
    : '';
  cookieValue += params.hasOwnProperty('utm_medium')
    ? ',' + params['utm_medium']
    : ',';
  cookieValue += params.hasOwnProperty('utm_campaign')
    ? ',' + params['utm_campaign']
    : '';
  cookieValue += params.hasOwnProperty('content')
    ? ',' + params['content']
    : '';

  //set cookie
  if (params.hasOwnProperty('utm_campaign')) {
    var date = new Date();
    date.setTime(date.getTime() + 183 * 24 * 60 * 60 * 1000).toString();
    var expires = 'expires=' + date;
    document.cookie =
      'klrnCampaign=' +
      cookieValue +
      '; ' +
      expires +
      '; path=/; domain=klrn.org';
  }
})();
