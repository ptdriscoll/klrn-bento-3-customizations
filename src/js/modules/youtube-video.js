///////////////////////////////////////////////////////////////////////////////////////////
//  YOUTUBE VIDEO PLUGIN:
//    -loadYoutubeVideos() - gathers any youtube videos listed in html data attributes, 
//                           and calls parseYoutubeVideo() for each  
//    -parseYoutubeVideo() - parses a video to page 
//
//  REQUIRES: to play videos, requires youtube-video-loader:
//    -youtubeVideos() - manages api for playing, pausing and analytics tracking
//    -loadVideo() - loads iframe when play button pressed
//
//  HTML EXAMPLE:
//    -See bento/src/html/youtube-video.htm
//
//  CSS:
//    -See bento/src/css/modules/youtube-videos.css
//
//  RUNNING JAVASCRIPT: 
//    var videos = klrn.loadYoutubeVideos();
//
///////////////////////////////////////////////////////////////////////////////////////////

(function(exports) {

  //gets youtube videos on page and calls parseYoutubeVideo() for each
  exports.loadYoutubeVideos = function() {
    var elems = document.querySelectorAll('.klrn_youtube_video');
    if (!elems.length) return false;
    
    var body = document.querySelector('body');
    var i, video, videoID, textToUse, showLines;
    
    //load youtube player api if not loaded already 
    if (!document.getElementById('klrn_youtube_player_api')) {
      elem = document.createElement('script');
      elem.setAttribute('type', 'text/javascript');
      elem.src = 'https://www.youtube.com/player_api';
      elem.id = 'klrn_youtube_player_api';
      body.appendChild(elem);  
    }
    
    for (i=0;i<elems.length;i++) {
      videoID = elems[i].getAttribute('data-klrn-video-id') || '';
      textToUse = elems[i].getAttribute('data-klrn-text-to-use') || '';
      showLines = elems[i].getAttribute('data-klrn-show-lines') || '';
      
      videoID = videoID.trim()
      textToUse = textToUse.trim()
      showLines = showLines.trim()
      
      elems[i].id = 'klrn_video_' + videoID;      
      exports.parseYoutubeVideo(videoID, textToUse, showLines)
    }    
  }

  //parses a video to page
  exports.parseYoutubeVideo = function(videoID, textToUse, showLines) { 
   
    //prep variables for parsing and dom insertion
    var target = document.querySelector('#klrn_video_' + videoID);
    var imgUrl, videoDesc, videoDescClass, colSpan, i;
    var div0, div1, div2, div2, div3, div4, div5, div6, div7, h3Tag, buttonTag;
    var tokenParam, linkDiv, linkDivId, linkTag, callbackFunc; 
    
    //add all created elements to this, and then make only one dom insertion
    var fragment = document.createDocumentFragment();
    
    //YouTube style play button
    var playButton = '<svg height="100%" version="1.1" viewBox="0 0 68 48" width="100%"><path class="ytp-large-play-button-bg" d="M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.64-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z" fill="#212121" fill-opacity="0.8"></path><path d="M 45,24 27,14 27,34" fill="#fff"></path></svg>'
    
    colSpan = 12;   
    
    //set dom elements for video 
    imgUrl = 'https://i.ytimg.com/vi/' + videoID + '/maxresdefault.jpg';
    textToUse = textToUse.toLowerCase();
    
    if (textToUse) videoDescClass = ' klrn_show_lines_' + showLines;
    
    //add div for grouping videos into rows
    div0 = document.createElement('div');
    div0.className = 'row-fluid';
    
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
    div5.addEventListener('click', exports.loadVideo(videoID)) 

    if (textToUse) {
      div6 = document.createElement('div');
      div6.className = 'video-info';  

      div7 = document.createElement('div');
      div7.className = 'ellipsis' + videoDescClass;         
     
      //title
      h3Tag = document.createElement('h3');
      h3Tag.appendChild(document.createTextNode(textToUse)); 
      h3Tag.className = 'title';       
    }
    
    //YouTube play button
    buttonTag = document.createElement('button');
    buttonTag.className = 'ytp-large-play-button ytp-button temp';
    buttonTag.setAttribute('aria-label', 'Play');
    buttonTag.innerHTML = playButton; 

    //put it all together
    if (textToUse) {
      div7.appendChild(h3Tag);
      div6.appendChild(div7);
    }    
    div5.appendChild(buttonTag);
    div4.appendChild(div5);
    if (textToUse) {    
      div4.appendChild(div6);
    }
    div3.appendChild(div4);        
    div2.appendChild(div3);
    div1.appendChild(div2);
    div0.appendChild(div1);
    fragment.appendChild(div0);

    target.appendChild(fragment);
    if (target.style.display === 'none') {
      target.parentElement.style.marginTop = '0'; 
      target.style.display = '';
    }
  }

}(klrn));