///////////////////////////////////////////////////////////////////////////////////////////
//  YOUTUBE PLAYLIST PLUGIN:
//    -getYoutubePlaylists() - gathers any youtube playlists listed in html data attributes
//    -loadYoutubePlaylists() - adds script links and callbacks to grab playlists from YouTube
//    -parseYoutubePlaylist() - parses a playlist to page
//
//  REQUIRES: to play videos, requires youtube-video-loader:
//    -youtubeVideos() - manages api for playing, pausing and analytics tracking
//    -loadVideo() - loads iframe when play button pressed
//
//  OPTIONAL: to apply regex or other filters to video titles, based on playlist id:
//    -youtubePlaylistFilters()
//
//  HTML EXAMPLE:
//    -See bento/src/html/youtube-playlist.htm
//
//  CSS:
//    -See bento/src/css/modules/youtube-videos.css
//
//  RUNNING JAVASCRIPT:
//    var playlists = klrn.getYoutubePlaylists();
//    if (playlists) klrn.loadYoutubePlaylists(playlists);
//
///////////////////////////////////////////////////////////////////////////////////////////

(function (exports) {
  //Helper function that accepts string, or regex as a string (using double escapes \\)
  //returns string or regex object to enter into string.replace() method
  exports.getFilter = function (string) {
    if (string[0] !== '/') return string;
    var arr = string.split('/');
    return new RegExp(arr[1], arr[2]);
  };

  //gets youtube playlists on page, creates attributes array for each, and adds arrays to an array
  //[[playlistID, showVideos, numberCols, textToUse, showLines, loadMore], textFilter, [...]]
  exports.getYoutubePlaylists = function () {
    var elems = document.querySelectorAll('.klrn_youtube_playlist');
    if (!elems.length) return false;

    var playlists = [],
      i,
      playlist,
      playlistID,
      numVideos,
      numCols,
      textToUse,
      showLines;

    for (i = 0; i < elems.length; i++) {
      playlistID = elems[i].getAttribute('data-klrn-playlist-id') || '';
      showVideos = elems[i].getAttribute('data-klrn-show-videos') || '';
      numberCols = elems[i].getAttribute('data-klrn-number-cols') || '';
      textToUse = elems[i].getAttribute('data-klrn-text-to-use') || '';
      showLines = elems[i].getAttribute('data-klrn-show-lines') || '';
      loadMore = elems[i].getAttribute('data-klrn-load-more') || '';
      textFilter = elems[i].getAttribute('data-klrn-text-filter') || '';
      playlist = [
        playlistID.trim(),
        showVideos.trim(),
        numberCols.trim(),
        textToUse.trim(),
        showLines.trim(),
        loadMore.trim(),
        textFilter,
      ]; //no trim on textFilter
      playlists.push(playlist);
      elems[i].id = playlistID;
    }
    return playlists;
  };

  //accepts src and an optional callback, makes ajax get request, and invokes callback
  exports.getFile = function (src, callback) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        if (callback) callback(JSON.parse(this.responseText));
      }
    };
    xhttp.open('GET', src, true);
    xhttp.send();
  };

  //accepts [playlistID, numVideos, numCols, textToUse] item or or array of such items
  //and adds script links and callbacks to grab playlists from YouTube
  //also loads youtube api
  exports.loadYoutubePlaylists = function (lists) {
    var elem,
      body = document.querySelector('body');
    var i, playlistID, domSelector, showVideos, numColumns;
    var textToUse, showLines, loadMore, textFilter;
    var callbackFunc, src;
    if (typeof lists === 'undefined') return;

    //if only one item, not nested in outer array, add it to an array to loop through once
    if (lists[0].constructor !== Array) lists = [lists];

    //load youtube player api if not loaded already
    if (!document.getElementById('klrn_youtube_player_api')) {
      elem = document.createElement('script');
      elem.setAttribute('type', 'text/javascript');
      elem.src = 'https://www.youtube.com/player_api';
      elem.id = 'klrn_youtube_player_api';
      body.appendChild(elem);
    }

    for (i = 0; i < lists.length; i++) {
      //create callback functions on window for each playlist
      playlistID = lists[i][0];
      domSelector = '#' + playlistID;
      showVideos = lists[i][1];
      numColumns = lists[i][2];
      textToUse = lists[i][3];
      showLines = lists[i][4];
      loadMore = lists[i][5];
      textFilter = lists[i][6];

      //build url with parameters for call to YouTube
      src =
        'https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&' +
        'maxResults=' +
        showVideos +
        '&playlistId=' +
        playlistID +
        '&key=AIzaSyDraaM_dJplqR3JbRtmx-HSIMfIZHTqXV4';

      //create callback on window for each playlist
      callbackFunc = 'klrn_youtube_playlist_module_' + i.toString();
      window[callbackFunc] = new Function(
        'data',
        `return klrn.parseYoutubePlaylist(data, ` +
          `"${domSelector}", ` +
          `"${numColumns}", ` +
          `"${textToUse}", ` +
          `"${showLines}", ` +
          `"${loadMore}", ` +
          `"${textFilter}", ` +
          `"${src}")`
      );

      //make ajax call to YouTube for each playlist
      exports.getFile(src, window[callbackFunc]);
    }
  };

  exports.parseYoutubePlaylist = function (
    data,
    domSel,
    numCols,
    textToUse,
    showLines,
    loadMore,
    textFilter,
    src
  ) {
    //console.log(data);

    //prep variables for parsing and dom insertion
    var target = document.querySelector(domSel);
    var imgUrl,
      videoDesc,
      videoDescClass,
      cols,
      colSpan,
      i,
      elems = -1;
    var div0, div1, div2, div2, div3, div4, div5, div6, div7, h3Tag, buttonTag;
    var playListId = domSel.slice(1),
      tokenParam,
      fadeIn = false;
    var linkDiv, linkDivId, linkTag, callbackFunc, loadedMore;

    //add all created elements to this, and then make only one dom insertion
    var fragment = document.createDocumentFragment();

    //YouTube style play button
    var playButton =
      '<svg height="100%" version="1.1" viewBox="0 0 68 48" width="100%"><path class="ytp-large-play-button-bg" d="M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.64-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z" fill="#212121" fill-opacity="0.8"></path><path d="M 45,24 27,14 27,34" fill="#fff"></path></svg>';

    //create only one text filter, if there is one, since it may be a regex
    if (textFilter) textFilter = exports.getFilter(textFilter);

    cols = parseInt(numCols);
    colSpan = 12 / cols;

    //set dom elements for each video
    for (i = 0; i < data.items.length; i++) {
      if (!data.items[i].snippet.thumbnails.high) continue;
      elems += 1;
      imgUrl = data.items[i].snippet.thumbnails.high.url;
      videoID = data.items[i].snippet.resourceId.videoId;
      textToUse = textToUse.toLowerCase();

      if ((textToUse === 'descriptions') | (textToUse === 'description')) {
        videoDesc = data.items[i].snippet.description;
        videoDescClass = ' klrn_show_lines_3';
      } else {
        videoDesc = data.items[i].snippet.title;
        videoDescClass = ' klrn_show_lines_2';
      }

      //apply filters to titles, if there are any filters
      if (textFilter) videoDesc = videoDesc.replace(textFilter, '');
      else if (typeof exports.youtubePlaylistFilters === 'function') {
        videoDesc = exports.youtubePlaylistFilters(videoDesc, playListId);
      }

      if (showLines) videoDescClass = ' klrn_show_lines_' + showLines;

      //add div for grouping videos into rows
      if (elems % cols === 0) {
        div0 = document.createElement('div');
        div0.className = 'row-fluid';
        if (target.style.display !== 'none') {
          // if initial playlist already loaded
          div0.style.opacity = 0;
          div0.classList.add('fade-in');
          fadeIn = true;
        }
      }

      div1 = document.createElement('div');
      div1.className = 'span' + colSpan + ' column-' + colSpan;

      div2 = document.createElement('div');
      div2.className = 'component';

      div3 = document.createElement('div');
      div3.className = 'video-component column-' + colSpan;

      div4 = document.createElement('div');
      div4.className = 'video-container__wrapper';

      //video wrapper
      div5 = document.createElement('div');
      div5.className = 'youtube-wrapper video-container';
      div5.className += ' embed_wrapper ratio_16-9 youtube-player';
      div5.style.backgroundImage = 'url(' + imgUrl + ')';
      div5.addEventListener('click', exports.loadVideo(videoID));

      div6 = document.createElement('div');
      div6.className = 'video-info';

      div7 = document.createElement('div');
      div7.className = 'ellipsis' + videoDescClass;

      //title
      h3Tag = document.createElement('h3');
      h3Tag.appendChild(document.createTextNode(videoDesc));
      h3Tag.className = 'title';

      //YouTube play button
      buttonTag = document.createElement('button');
      buttonTag.className = 'ytp-large-play-button ytp-button temp';
      buttonTag.setAttribute('aria-label', 'Play');
      buttonTag.innerHTML = playButton;

      //put it all together
      div7.appendChild(h3Tag);
      div6.appendChild(div7);
      div5.appendChild(buttonTag);
      div4.appendChild(div5);
      div4.appendChild(div6);
      div3.appendChild(div4);
      div2.appendChild(div3);
      div1.appendChild(div2);
      div0.appendChild(div1);
      fragment.appendChild(div0);
    }

    // if there are more videos to load, add load more button
    if (loadMore.toLowerCase() === 'yes' && 'nextPageToken' in data) {
      //set up url for next call to youtube api
      tokenParam = '&pageToken=';
      if (src.indexOf(tokenParam) === -1)
        src += tokenParam + data.nextPageToken;
      else
        src =
          src.slice(0, src.indexOf(tokenParam)) +
          tokenParam +
          data.nextPageToken;

      //set up next callback for youtube api call
      callbackFunc =
        'klrn_youtube_playlist_module_' + playListId + '_' + data.nextPageToken;
      window[callbackFunc] = new Function(
        'data',
        'return klrn.parseYoutubePlaylist(data, "' +
          domSel +
          '", "' +
          numCols +
          '", "' +
          textToUse +
          '", "' +
          showLines +
          '", "' +
          loadMore +
          '", "' +
          textFilter +
          '", "' +
          src +
          '")'
      );

      //create elements
      linkDiv = document.createElement('div');
      linkDiv.id = 'load_more_' + playListId;
      linkDiv.className = 'load_more_videos_div';
      linkTag = document.createElement('a');
      linkTag.className = 'klrn_button read-more__link';
      linkTag.innerHTML = 'Load More Videos';
      linkTag.addEventListener('click', function () {
        exports.getFile(src, window[callbackFunc]);
      });
      if (target.style.display !== 'none') {
        // if initial playlist already loaded
        linkDiv.style.opacity = 0;
        linkDiv.classList.add('fade-in');
      }

      //put elements together
      linkDiv.appendChild(linkTag);
      fragment.appendChild(linkDiv);
    }

    //get rid of previous load more button if there is one
    linkDivId = document.getElementById('load_more_' + playListId);
    if (linkDivId) linkDivId.parentNode.removeChild(linkDivId);

    // add to page
    target.appendChild(fragment);
    if (target.style.display === 'none') {
      target.parentElement.style.marginTop = '0';
      target.style.display = '';
    }

    // if added from load more button, fade in new elements
    if (fadeIn) {
      loadedMore = target.querySelectorAll('.fade-in');
      console.log(loadedMore);
      for (i = 0; i < loadedMore.length; i++) {
        klrn.fadeIn(loadedMore[i], 1);
        loadedMore[i].classList.remove('fade-in');
      }
    }
  };
})(klrn);
