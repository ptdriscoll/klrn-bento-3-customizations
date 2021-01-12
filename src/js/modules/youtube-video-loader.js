///////////////////////////////////////////////////////////////////////////////////////////
//  YOUTUBE VIDEO LOADER:
//    -youtubeVideos() - manages api for playing, pausing and analytics tracking
//    -loadVideo() - event handler to load iframe, i.e. when play button clicked
//
///////////////////////////////////////////////////////////////////////////////////////////

(function(exports) { 
 
  //object for storing and managing YouTube video objects
  exports.youtubeVideos = {
    'getObjects': [],
    'setObject': function(videoID) {      
      var video = new YT.Player(videoID, {
        events: {
        'onReady': this.onPlayerReady,
        'onStateChange': this.onPlayerStateChange
        }
      });
      this.getObjects.push(video);
      return video;
    },
    'onPlayerReady': function(e) { 
      //e.target.playVideo();
      dataLayer.push({ 
          'event': 'gaEvent',
          'eventCategory': 'YouTube Videos on KLRN.org',
          'eventAction': 'Plays',
          'eventLabel': e.target.getVideoData()['title'],
          'eventNonInteraction': false
      });
    },
    'onPlayerStateChange': function(e) {
      //when a video plays, make sure any others pause
      if (e.data == YT.PlayerState.PLAYING) {
        for (i=0;i<exports.youtubeVideos.getObjects.length;i++) {         
          if (exports.youtubeVideos.getObjects[i].h.id === e.target.h.id) continue;      
          exports.youtubeVideos.getObjects[i].pauseVideo();
        }
      }  
    },  
    'stopVideos': function() {
      var i;
      for (i=0;i<this.getObjects.length;i++) {      
        this.getObjects[i].stopVideo();
      }    
    },  
    'pauseVideos': function() {
      var i;
      for (i=0;i<this.getObjects.length;i++) {      
        this.getObjects[i].pauseVideo();
      }    
    }  
  }    
  
  exports.loadVideo = function(videoID) { 
    return function(e) {
     
      //remove click event since it's only needed once
      e.target.removeEventListener(e.type, arguments.callee);

      //make sure target is set to embed_wrapper even if a nested element is clicked     
      var target = e.target;
      if (e.target.tagName.toLowerCase() === 'path') target = e.target.parentNode.parentNode.parentNode;
      else if (e.target.tagName.toLowerCase() === 'svg') target = e.target.parentNode.parentNode;
      else if (e.target.tagName.toLowerCase() === 'button') target = e.target.parentNode;

      //add iframe  
      var iframe = document.createElement('iframe');
      var videoLink = 'https://www.youtube.com/embed/' 
          + videoID 
          + '/?rel=0&enablejsapi=1&version=3&autohide=1&showinfo=0&html5=1&playsinline=1';
      
      //for playing video from within click event when video is ready 
      //to get around IOS blocking autoplay after loading video    
      var videoObject, attempts = 0;
      var playWhenReady = function(video) {
        if (attempts === 60) return;        
        if (video && typeof video.playVideo === 'function') {
          video.playVideo();
        }
        else {
          attempts += 1;
          setTimeout(function(){playWhenReady(video)}, 50);
        }      
      }    
      
      //load iframe
      iframe.className = 'youtube-player';
      iframe.id = videoID;
      iframe.setAttribute('frameborder', '0');
      iframe.setAttribute('allowfullscreen', '');
      iframe.setAttribute('marginwidth', '0');
      iframe.setAttribute('marginheight', '0');
      iframe.setAttribute('scrolling', 'no');
      iframe.setAttribute('webkit-playsinline', '');
      iframe.setAttribute('allow', 'autoplay'); //chrome requires to play on load from a click
      iframe.src = videoLink;
      
      //empty video wrapper div and add video
      target.innerHTML = '';
      target.appendChild(iframe);
      
      //create video object to manage plays, pauses and event tracking
      videoObject = exports.youtubeVideos.setObject(videoID);
      playWhenReady(videoObject);   
    }
  }  
}(klrn));