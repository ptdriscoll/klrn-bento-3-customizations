(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
//recreates Bootstrap's tab toggability, for one or more ul.nav-tags on page
//html differences: data-toggle is replaced with data-klrn-toggle=id, and href is empty
//example component that it works with: youtube-playlists-tabs.htm  
(function() {
  
  //get all nav-tabs on page
  var navTabs = document.querySelectorAll('ul.nav-tabs'); 
  if (!navTabs) return;
  
  var i, links, j, id, tabPane, activeLink, activePane;
  
  //loop through each navTabs	  
  for (i=0; i<navTabs.length; i++) { 
	links = navTabs[i].querySelectorAll('li a');
	if (!links) break; 
	
	//loop through each link in each navTab		
	for (j=0; j<links.length; j++) {
	  id = links[j].dataset.klrnToggle; 
	  if (!id) break;       
	  
	  tabPane = document.querySelector('[data-klrn-playlist-id="' + id + '"]'); 
	  if (!tabPane) break;
	  
	  links[j].addEventListener('click', (function(navTab, link, pane) {	
		return function(e) {			  
		  e.preventDefault();
		  e.stopPropagation();	  
		  pane.parentNode.style.opacity = '0';		

		  //remove active classes from active tab and pane			  
		  activeLink = navTab.querySelector('li.active a');
		  if (activeLink) {
			activeLink.parentNode.classList.remove('active');
			activePaneID = activeLink.dataset.klrnToggle;
			if (activePaneID) {
			  activePane = document.querySelector('[data-klrn-playlist-id="' + activePaneID + '"]');
			}
			if (activePane) activePane.classList.remove('active');
		  }
	  
		  link.parentNode.classList.add('active'); //add .active class to this tab			  
		  pane.classList.add('active'); //add .active class to this tabPane
		  klrn.fadeIn(pane.parentNode, 0.75);               		  
		}  
	  }(navTabs[i], links[j], tabPane)));
	}
  } 
}());
},{}],2:[function(require,module,exports){
//event tracking module for specific pages, using gtm-event-tracking module and Google Tag Manager 
//GTM variables = eventCategory, eventAction, eventLabel, eventValue, eventNonInteraction

(function (exports) {
    
    exports.trackSchedulePageSponsors = function() {      
        //return if not TV schedule page
        if (location.pathname.indexOf('/schedule') === -1) return;
        
        var query = '#layout-4936e49d-c107-4949-bca0-f3d50f08c84f a, #layout-13f8bdb5-76bd-431a-b240-627aaa2439ed a';
        var sponsors = document.querySelectorAll(query);        
        if (!sponsors) return;
        
        var i, img, isOutboundLink, eventInfo, isDisplayed, viewsNotTracked = [];
        
        for (i=0; i<sponsors.length; i++) {
            img = sponsors[i].querySelector('img')
            if (!img) break;            
            isOutboundLink = exports.checkOutboundLink(sponsors[i].href); 
            
            eventInfo = {
                'eventCategory': isOutboundLink ? 'Outbound Links' : 'Internal Links',
                'eventAction': 'Views',
                'eventLabel': img.alt,
                'target': sponsors[i],
                'outboundLink': isOutboundLink,
                'eventNonInteraction': true //a view is not a page interaction            
            }
            
            //track views if ad is displayed at top, else when it enters into view   
            isDisplayed = getComputedStyle(sponsors[i].parentNode.parentNode.parentNode).display !== 'none';            
            if (i < 4 && isDisplayed) exports.trackEvent(eventInfo);
            else viewsNotTracked.push(Object.assign({}, eventInfo));
            
            //now set up as click tracking event
            eventInfo['eventAction'] = 'Clicks'; 
            eventInfo['eventNonInteraction'] = false; //make sure click is a page interaction
            exports.trackEvent(eventInfo); //track clicks of sponsor ad
        }

        //if page opened in mobile, then two ads or their duplicates have not been in view yet
        if (viewsNotTracked.length === 4) exports.trackWhenInView(viewsNotTracked, 'schedulePage');        
    }   
    
    exports.trackSidebar = function() {
        //return if home page
        if (location.pathname === '/') return; 
        
        //return if there is no sidebar on page
        var sidebar = document.querySelector('.rail-wrapper'); 
        if (!sidebar) return;        
        
        var sponsor_selectors = '#component-487eb930-f29a-11e8-ac11-cf036755f6fe a,'
                              + '#component-19fb5ee0-f369-11e8-90bb-7b9969ce1070 a';
                              
        var sponsors = sidebar.querySelectorAll(sponsor_selectors);
        var buttons = sidebar.querySelectorAll('#component-18114b10-e795-11e8-bc4d-edfdc25f8ca9 a');

        
        var eventInfo = {
            'eventCategory': 'Sidebar',
            'eventAction': 'Clicks',
            'eventLabel': undefined,
            'target': undefined,
            'outboundLink': undefined, 
            'eventNonInteraction': false
        }  
        
        var i, imgAlt, isOutboundLink;        
        
        //Sidebar Buttons        
        eventInfo['eventAction'] = 'Clicks - Sidebar Buttons';

        for (i=0; i<buttons.length; i++) { 
            eventInfo['eventLabel'] = buttons[i].textContent.trim();
            eventInfo['target'] = buttons[i];
            eventInfo['outboundLink'] = exports.checkOutboundLink(buttons[i].href);
            exports.trackEvent(eventInfo);            
        }        
        
        //Sidebar Sponsors       
        for (i=0; i<sponsors.length; i++) {    
            //don't track ad if display = none        
            if (window.getComputedStyle(sponsors[i].parentNode.parentNode).display === 'none') continue;
            
            if (sponsors[i].querySelector('img')) imgAlt = sponsors[i].querySelector('img').alt.trim();        
            eventInfo['eventLabel'] = imgAlt ? imgAlt : 'image alt tag not set';          
            eventInfo['target'] = sponsors[i];            
            isOutboundLink = exports.checkOutboundLink(sponsors[i].href);
            eventInfo['outboundLink'] = isOutboundLink;            
            
            //track views as a sponsor ad
            eventInfo['eventCategory'] = isOutboundLink ? 'Outbound Links' : 'Internal Links';
            eventInfo['eventAction'] = 'Views';
            eventInfo['eventNonInteraction'] = true; //make sure view is not a page interaction            
            if (klrn.inView(eventInfo.target.firstElementChild, 0.5)) exports.trackEvent(eventInfo); 
            else exports.trackWhenInView(Object.assign({}, eventInfo), 'singleAd');         
            
            //track clicks as a sponsor ad            
            eventInfo['eventAction'] = 'Clicks';
            eventInfo['eventNonInteraction'] = false; //make sure click is a page interaction
            exports.trackEvent(eventInfo);
            
            //now track clicks as a Sidebar Sponsor - don't need views
            eventInfo['eventCategory'] = 'Sidebar';
            eventInfo['eventAction'] = 'Clicks - Sidebar Sponsors';
            exports.trackEvent(eventInfo);            
        }             
    }    

    exports.trackHomePageSlider = function() {
        //return if not home page
        if (location.pathname !== '/') return;              
        
        var slides = document.querySelectorAll('#component-1a1b52f0-d9f6-11e7-a670-7f78010a7152 a');
        if (!slides) return;
        
        var i, len=slides.length, eventInfo, eventLabel;   
        
        for (i=0; i<len; i+=1) {
            if (i%3 === 0) eventLabel = slides[i].textContent;			
			eventInfo = {
				'eventCategory': 'Home Page Slider',
				'eventAction': 'Clicks',
				'eventLabel': eventLabel,
				'target': slides[i],
				'eventNonInteraction': false
			}                
			exports.trackEvent(eventInfo);          
        }      
    }

    exports.trackHomePagePromos = function() {    
        //return if not home page
        if (location.pathname !== '/') return;        
           
        var topPromos = document.querySelectorAll('#column-224b9950-b60d-11e8-8b93-9145e1056ee0 .promo');
        var whatsOnNow = document.querySelectorAll('#column-0fa9631a-e8ba-4117-adae-751046aae720 a');
        var sponsorTiles = document.querySelectorAll('#column-cef6f81b-94e3-4973-8b54-64598726ce08 a');    
        var showTiles = document.querySelectorAll('#layout-d44bc274-ff76-4587-a53a-844ddf1c15db a');
        var bottomPromos = document.querySelectorAll('#layout-733a72c0-588a-4c4c-8056-3368cc38f06e .promo');
        
        var eventInfo = {
            'eventCategory': 'Home Page Promos',
            'eventAction': 'Clicks',
            'eventLabel': undefined,
            'target': undefined,
            'outboundLink': undefined, 
            'eventNonInteraction': false
        }        
        
        var i, j, links, eventLabel, imgAlt, isOutboundLink, readMoreLink;
        
        //Top Promos        
        eventInfo['eventAction'] = 'Clicks - Home Page Top Promos';

        for (i=0; i<topPromos.length; i++) {              
            links = topPromos[i].querySelectorAll('a');             
            if (!links) break;            

            if (topPromos[i].querySelector('img')) eventLabel = topPromos[i].querySelector('img').alt.trim();
            if (!eventLabel) {
                eventLabel = topPromos[i].querySelector('.read-more__link');
                eventLabel = eventLabel ? eventLabel.textContent.trim() : 'image or link text not set';
            }        

            eventInfo['eventLabel'] = eventLabel;   
            eventInfo['outboundLink'] = exports.checkOutboundLink(links[0].href);         

            //set click tracking for each link in promo 
            for (j=0; j<links.length; j++) {                
                eventInfo['target'] = links[j];
                exports.trackEvent(eventInfo);                
            }            
        }
        
        //What's On Now
        eventInfo['eventAction'] = "Clicks - Home Page What's On Now";
        eventInfo['outboundLink'] = undefined;
        
        for (i=0; i<whatsOnNow.length; i++) {              
            eventInfo['eventLabel'] = i===0 ? 'On Primetime | On Now' : whatsOnNow[i].textContent;            
            eventInfo['target'] = whatsOnNow[i];
            exports.trackEvent(eventInfo);      
        } 
        
        //Sponsor Tiles
        eventInfo['eventAction'] = 'Clicks - Home Page Sponsors';
        
        for (i=0; i<sponsorTiles.length; i++) {  
            if (sponsorTiles[i].querySelector('img')) imgAlt = sponsorTiles[i].querySelector('img').alt.trim();        
            eventInfo['eventLabel'] = imgAlt ? imgAlt : 'image alt tag not set';          
            eventInfo['target'] = sponsorTiles[i];            
            isOutboundLink = exports.checkOutboundLink(sponsorTiles[i].href);
            eventInfo['outboundLink'] = isOutboundLink;
            
            //track views as a sponsor ad
            eventInfo['eventCategory'] = isOutboundLink ? 'Outbound Links' : 'Internal Links';
            eventInfo['eventAction'] = 'Views';
            eventInfo['eventNonInteraction'] = true; //make sure view is not a page interaction            
            if (klrn.inView(eventInfo.target.firstElementChild, 0.5)) exports.trackEvent(eventInfo); 
            else exports.trackWhenInView(Object.assign({}, eventInfo), 'singleAd');           
            
            //track clicks as a sponsor ad            
            eventInfo['eventAction'] = 'Clicks';
            eventInfo['eventNonInteraction'] = false; //make sure click is a page interaction
            exports.trackEvent(eventInfo);
            
            //now track clicks as a Home Page Sponsor Tile - don't need views
            eventInfo['eventCategory'] = 'Home Page Promos';
            eventInfo['eventAction'] = 'Clicks - Home Page Sponsors';
            exports.trackEvent(eventInfo);            
        }        
        
        //Show Tiles
        eventInfo['eventAction'] = 'Clicks - Home Page Show Tiles';
        
        for (i=0; i<showTiles.length; i++) {      
            if (showTiles[i].querySelector('img')) imgAlt = showTiles[i].querySelector('img').alt.trim();        
            eventInfo['eventLabel'] = imgAlt ? imgAlt : 'image alt tag not set';          
            eventInfo['target'] = showTiles[i];
            eventInfo['outboundLink'] = exports.checkOutboundLink(showTiles[i].href);
            exports.trackEvent(eventInfo);      
        }

        //Bottom Promos
        eventInfo['eventAction'] = 'Clicks - Home Page Bottom Promos';
        
        for (i=0; i<bottomPromos.length; i++) { 
            links = bottomPromos[i].querySelectorAll('a'); 
            if (!links) break;
            
            if (bottomPromos[i].querySelector('h3')) eventLabel = bottomPromos[i].querySelector('h3').textContent.trim();
            if (!eventLabel) {
                eventLabel = bottomPromos[i].querySelector('img');
                eventLabel = eventLabel ? eventLabel.alt.trim() : 'headline or image text not set';
            }

            eventInfo['eventLabel'] = eventLabel;                         
            eventInfo['outboundLink'] = exports.checkOutboundLink(links[0].href);                    
            
            //set click tracking for each link in promo 
            for (j=0; j<links.length; j++) {
                eventInfo['target'] = links[j];
                exports.trackEvent(eventInfo);
            } 
        }            
    }//end trackHomePagePromos    
    
    //run tracking modules  
    exports.trackSchedulePageSponsors();
    exports.trackSidebar(); 
    exports.trackHomePagePromos();
    exports.trackHomePageSlider();            
       
}(klrn)); //end namespace to add modules to klrn object
},{}],3:[function(require,module,exports){
//event tracking module, using Google Tag Manager dataLayer variables and a generic trigger and tag
//GTM variables = eventCategory, eventAction, eventLabel, eventValue, eventNonInteraction
//GTM custom event trigger = gaEvent, and GTM tag's track type = event 

(function(exports) {      
    
    //accepts dictionary of event tracking info, handling these fields as strings:
    //eventCategory, eventAction, eventLabel, eventValue, eventNonInteraction and outboundLink
    //an additional field, called target, is a dom element
    //any fields not set are handled as undefined - target is required for click events    
    exports.trackEvent = function(info) {	
        //for testing, toggle whether clicks should go through or not
        var test = false; 
        var logs = false;
        
        var outboundLink = 'outboundLink' in info ? info.outboundLink : undefined;
        var options = {
            'event': 'gaEvent',
            'eventCategory': 'eventCategory' in info ? info.eventCategory : undefined,
            'eventAction': 'eventAction' in info ? info.eventAction : undefined,
            'eventLabel': 'eventLabel' in info ? info.eventLabel : undefined,
            'eventValue': 'eventValue' in info ? info.eventValue : undefined,
            'eventNonInteraction': 'eventNonInteraction' in info ? info.eventNonInteraction : undefined
        }
        
        //if this is a view event, push to dataLayer and return 
        if (info.eventAction === 'Views') {
            if (test) {
                if (logs) console.log('\nSETTING VIEW EVENT');
                if (logs) console.log(options);  
            }                
            return dataLayer.push(options);
        }
        
        //if this is a click event, and it goes to a new page, set click handler        
        if (info.eventAction.indexOf('Clicks') !== -1 && info.target 
            && info.target.href.indexOf(location.hostname + '/#') === -1) {  
            
            info.target.addEventListener('click', function(event) { 
                if (test) {            
                    event.preventDefault();            
                    if (logs) console.log('\nSETTING CLICK EVENT');
                    if (logs) console.log(options);   
                }                    
                
                if (outboundLink) {
                    event.preventDefault(); //prevent navigation to outboundLink, so GTM can record event 
                    if (!test) options['eventCallback'] = function() {window.open(outboundLink);}; //when done, redirect
                    if (!test) options['eventTimeout'] = 100;
                    dataLayer.push(options);
                    if (!test) setTimeout(function () {window.open(outboundLink);}, 150); //if GTM fails, redirect anyway
                }
                else dataLayer.push(options); //just push to dataLayer if this is an internal link               
            });         
        }
    }

    //for group of ad tiles not displayed on load when trackSchedulePageSponsors runs
    //adds event listeners to check when they're in view, tracks relevant views, and removes event listeners
    exports.trackWhenInView = function(info, func) {  
        var callbacks = {}    
        var ticking = false;   
        var scrollHandler, resizeHandler, orientationchangeHandler;        

        callbacks.singleAd = function() {            
            if (klrn.inView(info.target.firstElementChild, 0.5)) {  
            
                //track view  
                exports.trackEvent(info); 

                //remove event listeners so view will only be tracked once                
                window.removeEventListener('scroll', scrollHandler);
                window.removeEventListener('resize', resizeHandler);
                window.removeEventListener('orientationchange', orientationchangeHandler);                
            }        
        }
        
        //handles pair of ads on schedule page, and their duplicates  
        callbacks.schedulePage = function() {        
        
            //if ad 0 or its duplicate ad 2 is in view, 
            //then respectively ad 1 or its duplicate ad 3 will also be in view
            //so just check if ad 0 or ad 2 is in view
            var AdInView = klrn.inView(info[0].target.firstElementChild, 0.5);
            var AdDupInView = klrn.inView(info[2].target.firstElementChild, 0.5);
            
            //if a target ad is in view, track both ad 0 and ad 1, but not their duplicates ad 2 and ad 3
            if (AdInView || AdDupInView) {
                
                //track views 
                exports.trackEvent(info[0]); 
                exports.trackEvent(info[1]);

                //remove event listeners so views will only be tracked once                
                window.removeEventListener('scroll', scrollHandler);
                window.removeEventListener('resize', resizeHandler);
                window.removeEventListener('orientationchange', orientationchangeHandler);
            }
        }          
        
        window.addEventListener('scroll', scrollHandler = function() {          
            klrn.throttleAnimation(ticking, callbacks[func]);            
        });
        window.addEventListener('resize', resizeHandler = function() {          
            klrn.throttleAnimation(ticking, callbacks[func]);
        });          
        window.addEventListener('orientationchange', orientationchangeHandler = function() {          
            klrn.throttleAnimation(ticking, callbacks[func]);
        });
        
    }

    //helper function to check outbound links - returns string link or bool false
    exports.checkOutboundLink = function(href) {
        if (href.indexOf('klrn.bento-live.pbs.org') === -1 
            && href.indexOf('klrn.org') === -1) {
            return href;
        }
        return false;
    }
    
}(klrn)); //end namespace to add modules to klrn object
},{}],4:[function(require,module,exports){
//klrn modules
(function(exports) { 

  //checks when an element is within the viewport
  //percentRequired checks vertical percentage in view - defaults to 0, the elem leading edge
  //reference: https://vanillajstoolkit.com/helpers/isinviewport/
  exports.inView = function(elem, percentRequired) {    
    var viewTop = 70; //nav bar is 70 in all viewports
    var viewBottom = (window.innerHeight || document.documentElement.clientHeight);
    var bounding = elem.getBoundingClientRect(); 
    var percent = percentRequired || 0; 
    var checkTop, checkBottom; 
    if (bounding.height === 0) return false;    
    checkTop = bounding.bottom >= viewTop + (bounding.height * percent);
    checkBottom = bounding.top <= viewBottom - (bounding.height * percent);
    return checkTop && checkBottom;
  }
  
  //use requestAnimationFrame to throttle events to browser repaints
  exports.throttleAnimation = function(ticking, func) {
    if (!ticking) {  
      requestAnimationFrame(function() { 
        func();
        ticking = false;
      });        
    }
    ticking = true;
  }    
  
  //debounce from david walsh and underscore 
  //reference: http://davidwalsh.name/javascript-debounce-function
  //wait sets fire rate, immediate triggers func call on leading edge rather than trailing
  exports.debounce = function(func, wait, immediate) {
    var timeout;
    return function() {
      var context = this, args = arguments;
      var later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  }
  
  //fade in element, i.e. on click event
  exports.fadeIn = function(elem, seconds) {
    var opacity = 0, timer;
    var millisPerStep = seconds*10;
    //console.log(millisPerStep);    
    var fade = function() {          
      opacity += 1;                   
      elem.style.filter = "alpha(opacity=" + parseInt(opacity).toString() + ")";
      elem.style.opacity = opacity/100;
      if (opacity == 100) clearInterval(timer);
    }
    timer = setInterval(fade, millisPerStep);        
  }  
  
  //adapted from Mootools Element.Measure
  //https://stackoverflow.com/questions/2921428/dom-element-width-before-appended-to-dom
  //creates and adds element to dom, measures something, and then removes element from dom
  //i.e. measure(h3Tag, function(el){return el.clientWidth})
  exports.measure = function(elem, func) {
      var prevVis = elem.style.visibility, 
          prevPos = elem.style.position,
          result;
          
      elem.style.visibility = 'hidden';
      elem.style.position = 'absolute';
      
      document.body.appendChild(elem);
      result = func(elem);
      elem.parentNode.removeChild(elem);
      
      elem.style.visibility = prevVis;
      elem.style.position = prevPos;
      return result;
  } 
  
	// ajax get request
	// enter string for file, set success callback and optionally set boolean for asynch  
	//====================================================================================	
	exports.ajaxLoad = function(file, callback, asynch) {
		var data;
		var xmlhttp;
		asynch = asynch || true;

		//for IE7+, Firefox, Chrome, Opera, Safari
		if (window.XMLHttpRequest) xmlhttp = new XMLHttpRequest();

		//for IE6, IE5
		else xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");

		xmlhttp.onreadystatechange = function () {
			if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
				callback(xmlhttp.responseText);
			}
		}
		xmlhttp.open("GET", file, asynch);
		xmlhttp.send();
	}  
  
  // basic csv parser
	// handles multi-comma fields, removes quotes around those fields, strips leading and trailing spaces 
	// optionally set json to true to return json, else false or empty to return object
	//====================================================================================
	exports.parseCSV = function(csv, json) {
		var lines = csv.split(('\r\n' || '\r' || '\n'));
		var result = [];
		var headers = lines[0].split(',');
		var obj = {};
		var currentline;
		var quotes;
		var badBreaks = [];
		var fromToLength;
		var buildString = '';

		var leadingSpace = /^\s+/;
		var trailingSpace = /\s+$/;
		var doubleSmartQuote = /[\u201C\u201D]/g;
		var singleSmartQuote = /[\u2018\u2019]/g;
		var emDash = /[\u2013\u2014]/g;
		var ellipsesRegEx = /[\u2026]/g;

		for (var i = 1; i < lines.length - 1; i++) {
			obj = {};
			currentline = lines[i].split(',');

			for (var j = currentline.length - 1; j > -1; j--) {

				//find all unescaped quotes on each line
				quotes = currentline[j].match(/"/g);

				//if there are an odd number of quotes, push line index into badBreaks
				if ((quotes ? quotes.length : 0) % 2 == 1) badBreaks.push(j);

				//trim escaping quotes for quotes, added around quotes as well as line
				if (currentline[j].slice(0,1) === '"' && currentline[j].slice(-1) === '"'
						&& (currentline[j].slice(0,2) !== '""' || currentline[j].slice(-2) !== '""')) {
					currentline[j] = currentline[j].slice(1,-1);
				}
				if (currentline[j].match(/""/)) {
					currentline[j] = currentline[j].replace(/""/g, '"');
				}
			}

			//starting at bottom, merge currentline back, skipping over every other badBreaks index
			for (var j = 0, length = badBreaks.length; j < length; j = j + 2) {

				//get index pairs with starting and end quotes, and everything inbetween, and merge all into string
				fromToLength = (badBreaks[j] - badBreaks[j + 1]);
				for (var k = fromToLength; k > -1; k--) {
					buildString += currentline[badBreaks[j] - k] + ',';
				}

				//now splice each set of merged indexes, each as one index, back into whole array  
				currentline.splice(badBreaks[j] - fromToLength, fromToLength + 1, buildString.slice(1, -2));
				buildString = '';
			}
			badBreaks = [];

			//line up headers with each data row
			//and trim leading and trailing white spaces, and replace smart quotes, emdashes and ellipses 
			for (var j = 0; j < headers.length; j++) {
				obj[headers[j].replace(leadingSpace, '').replace(trailingSpace, '')] =
				currentline[j].replace(leadingSpace, '').replace(trailingSpace, '')
								.replace(doubleSmartQuote, '"').replace(singleSmartQuote, "'")
								.replace(emDash, '-').replace(ellipsesRegEx, '...');
			}
			result.push(obj);
		}

		//return result
		return json ? JSON.stringify(result) : result;
	}  
}(klrn)); //end klrn modules
},{}],5:[function(require,module,exports){
//requestAnimationFrame fallback
//reference: http://www.javascriptkit.com/javatutors/requestanimationframe.shtml

window.requestAnimationFrame = window.requestAnimationFrame
    || window.mozRequestAnimationFrame
    || window.webkitRequestAnimationFrame
    || window.msRequestAnimationFrame
    || function(f){return setTimeout(f, 1000/60)} // simulate calling code 60 
 
window.cancelAnimationFrame = window.cancelAnimationFrame
    || window.mozCancelAnimationFrame
    || function(requestID){clearTimeout(requestID)} //fall back
    
//The Object.assign() method is used to copy the values of all enumerable own properties
//from one or more source objects to a target object. It will return the target object.
//reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign  
  
if (typeof Object.assign !== 'function') {
  // Must be writable: true, enumerable: false, configurable: true
  Object.defineProperty(Object, "assign", {
    value: function assign(target, varArgs) { // .length of function is 2
      'use strict';
      if (target === null || target === undefined) {
        throw new TypeError('Cannot convert undefined or null to object');
      }

      var to = Object(target);

      for (var index = 1; index < arguments.length; index++) {
        var nextSource = arguments[index];

        if (nextSource !== null && nextSource !== undefined) { 
          for (var nextKey in nextSource) {
            // Avoid bugs when hasOwnProperty is shadowed
            if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
              to[nextKey] = nextSource[nextKey];
            }
          }
        }
      }
      return to;
    },
    writable: true,
    configurable: true
  });
}    
},{}],6:[function(require,module,exports){
//copy last two sponsor ad tiles to mobile display area, below schedule on schedule page
(function() {
  //return if not schedule page     
  if (document.body.className.indexOf('schedule') === -1) return;
  
  var sponsor3 = document.querySelector('#\\33 abebf30-de1c-11e8-90fd-af9807ce4fb6 a');
  var sponsor4 = document.querySelector('#c07c2760-de1d-11e8-90fd-af9807ce4fb6 a');
  var container1 = document.querySelector('#component-48ee4230-fb6a-11e9-9559-992548e36765 div');
  var container2 = document.querySelector('#component-915a7340-fb6a-11e9-9559-992548e36765 div');
  
  if (!sponsor3 || !sponsor4 || !container1 || !container2) return;
  
  var clone3 = sponsor3.cloneNode(true);
  var clone4 = sponsor4.cloneNode(true);
  
  container1.replaceChild(clone3, container1.childNodes[0]);
  container2.replaceChild(clone4, container2.childNodes[0]);     
}());

//temporarily hide footer ...
//and mobile display area for sponsor tiles while schedule loads on schedule page
//while schedule loads on events page
//while blog posts load on main blog feed pages 
(function() {  
  //return if not schedule page and not a main blog page 
  var schedulePage = document.body.className.indexOf('schedule') > -1 
                     || document.body.className.indexOf('events') > -1;
  var blogPage = document.body.className.indexOf('blogs') > -1;  
  if (!schedulePage && !blogPage) return; 
  
  //get any dom elements that are hidden
  var schedule = document.querySelector('.jaws-tv-schedules') || 
                 document.querySelector('.jaws-whats-on');        
  var mobileSponsorArea = document.querySelector('#layout-13f8bdb5-76bd-431a-b240-627aaa2439ed'); 
  var buttonLinks = document.querySelector('#layout-f9b491d0-69fc-4adb-b239-b69a18855db5');
  var footer = document.querySelector('body > footer');
  
  //skip waiting if on a schedule page but there is no schedule, 
  //or if on a blog post page (.blog-entry will already be there), instead of a main blog feed page 
  if ((schedulePage && !schedule) || (blogPage && document.querySelector('.blog-entry'))) {
    if (mobileSponsorArea) mobileSponsorArea.style.visibility = 'visible';
    if (buttonLinks) buttonLinks.style.visibility = 'visible'; 
    if (footer) footer.style.visibility = 'visible';
    return;
  }
  
  //wait for schedule or blog posts to load
  var attempts = 60;
  var showFooter = function() {  
    attempts -= 1;   
    //console.log(attempts);
    if ((schedulePage && schedule.offsetHeight > 400) 
        || (blogPage && document.querySelector('.blog-entry')) 
        || attempts < 0) {
      if (mobileSponsorArea) mobileSponsorArea.style.visibility = 'visible';
      if (buttonLinks) buttonLinks.style.visibility = 'visible';
      if (footer) footer.style.visibility = 'visible';
      clearInterval(timer);
    }
  }
  
  timer = setInterval(showFooter, 50);       
}());  

//show message on events page if there are no events showing
(function() {
  //return if not events page     
  if (document.body.className.indexOf('events') === -1) return;   
  
  var contentWrapper = document.querySelector('.content-wrapper'), events;
  var message = document.querySelector('#community_events_message');
  if (contentWrapper) events = contentWrapper.querySelector('.promo');  
  if (!events && message) message.style.display = 'block';
  else if (message) {
    message.parentNode.parentNode.parentNode.parentNode.style.display = 'none';
  }
}());

//check url search parameters, and check relevant email lists on newsletter signup page
(function() {
  //return if not signup page     
  if (document.body.className.indexOf('signup') === -1) return;   
  
  var params = location.search, box;
  
  //if education is a parameter, check KLRN Learn With Media box
  if (params.indexOf('newsletter=education') !== -1) {
    box = document.getElementsByName('list_0')[0];
    if (box) box.checked = true;
  }
}());

//for Dinosaur George page  
(function() {   
  //true = toggle off, false = toggle on
  if (true) return;

  // return if not Dinosaur George page
  if (location.pathname.indexOf('/dinosaur-george') === -1) return;

  var targetElem = document.getElementById('dinosaur-george');
  if (!targetElem) return false;

  var settings = {
    version: '0', //set to override cache after data has been updated 
    getFile: 'https://pbs.klrn.org/bento/data/get-data.php?file=dinosaur-george&type=csv'
  };
  
  var callback = function(data) {      
    data = klrn.parseCSV(data);
    if (data.length < 1) return;
    //console.log(data);
          
    var i, length = data.length,
        name, file, next,
        html = '<p>';
        path = 'https://pbs.klrn.org/bento/downloads/dinosaur-george/';
      
    for (i=0;i<length;i++) {
      name = data[i].NAME.length > 0; //this is a file name
      file = data[i].FILE.length > 0; //this file has a link
      next = data[i+1] ? data[i+1].NAME.length > 0 : false; //name follows at i+1
      nextTwo = data[i+2] ? data[i+2].NAME.length > 0 : false; //name follows at i+2
      prevTwo = data[i-2] ? data[i-2].NAME.length > 0 : false; //name preceded at i-2 
        
      //parse heads and subheads  
      if (name && !file) {
        if (!next) html += '<h2>' + data[i].NAME + '</h2><p>';        
        else html += '<b>' + data[i].NAME + '</b><br>'; 
      }
          
      //parase links and blank lines    
      if (name && file) html += '<a href="' + path + data[i].FILE + '.pdf" target="_blank">'
                                + data[i].NAME + '</a><br>';   
      if ((!name && !file) && !(!nextTwo || !prevTwo)) html += '<br>';
    } 
    targetElem.innerHTML = html;  
    targetElem.style.display = 'block';    
  }
  
  // load CSV file  
  klrn.ajaxLoad(settings.getFile + '&update=' + settings.version, callback);  
  //console.log('CHECK URL STRING: settings.getFile + '?update=' + settings.version);      
}());  

//for support/klrn-endowment page 
(function() {      
  // return if not klrn-endowment page
  if (location.pathname.indexOf('/support/klrn-endowment') === -1) return;

  // see if #klrn_memorials div exists, and if not then exit
  var memorialsElem = document.querySelector('#rich-text-e68b6b10-a982-11e9-b5e3-a77ff72a2441');

  if (!memorialsElem) return;  

  //add all created elements to this, and then make only one dom insertion
  var divElem = document.createElement('div');  

  //set variables for CSV file URL parameters        
  var settings = {
    // only reset this to override browser caches if reloading CSV data in same week
    version: '2019-10-03-0',
    getFile: 'https://pbs.klrn.org/bento/data/get-data.php?file=memorials&type=csv',
    date: this.date || new Date(),
    // this gets tuesday of current week, so it can be added to CSV link to override browser caches 
    update: function() {
      var tuesday, curr = this.date;
      tuesday = new Date(curr.setDate(curr.getDate() - curr.getDay() + 2));
      tuesday = tuesday.toDateString().split(' ');
      return tuesday[1] + '_' + tuesday[2] + '_' + tuesday[3];
    }
  };

  // helper function
  var filterName = function(str) {  
        if (str.indexOf(' Jr') !== -1) {
            return str.replace(/\s+Jr/, '&nbsp;Jr');
        }
        if (str.indexOf(' (') !== -1) {
            return str.replace(/\s+\(/, '&nbsp;(');
          }
          else return str; 
  };
  
  // another helper function  
  var filterFrom = function(str) {
      return str.replace('KLRN Staff', 'KLRN&nbsp;Staff');
  };   

  // parse memorials data to set page content   
  var setMemorials = function(data) { 
    var memorialsText = '',
      honorsText = '',
      currentDate = Date.parse(settings.date),
      expiresArray = [],
      expiredDate = '',
      memorialsArray = [],
      honorsArray = [];                   

    data = klrn.parseCSV(data); 
    //console.log(data);    
            
    if (data.length < 1) return;
    divElem.innerHTML = '';
    
    for (var i = 0, length = data.length; i < length; i++) {
      expiresArray = data[i].EXPIRES.split('-');
      expiredDate = Date.parse(expiresArray[1] + ' ' + expiresArray[0] + ', ' + expiresArray[2]);
      if (currentDate > expiredDate) continue;
      if (data[i].TYPE.match(/memorial/i)) {
        memorialsArray.push(data[i]);
      }
      if (data[i].TYPE.match(/honor/i)) {
        honorsArray.push(data[i]);
      }
    }	
    if (memorialsArray.length > 0) {            
      memorialsText = '<h2 class="subhead">In Memory Of</h2>';
      for (var i = 0, length = memorialsArray.length; i < length; i++) {
        memorialsText += '<p><strong>'
                + filterName(memorialsArray[i].NAME)
                + '</strong><br>'
                + filterFrom(memorialsArray[i].FROM)	
                          + '</p>';
      }
      divElem.innerHTML += memorialsText;
    }			
        
    if (honorsArray.length > 0) {
      honorsText = '<h2 class="subhead">In Honor Of</h2>';
      for (var i = 0, length = honorsArray.length; i < length; i++) {
        honorsText += '<p><strong>'
                 + filterName(honorsArray[i].NAME)
               + '</strong><br>'
                         + filterFrom(honorsArray[i].FROM)
                         + '</p>';
      }
      divElem.innerHTML += honorsText;      
    }
    
    divElem.innerHTML += '<hr style="margin: 12px 0 16px;">';
    
    if (memorialsArray.length > 0 || honorsArray.length > 0) {     
      if (memorialsElem.firstElementChild && memorialsElem.firstElementChild.nextElementSibling)
        memorialsElem.insertBefore(divElem, memorialsElem.firstElementChild.nextElementSibling); 
    }     
  }

  // load CSV file 
  var file = settings.getFile + '&update=' + settings.update() + '&version=' + settings.version;
  klrn.ajaxLoad(file, setMemorials);    
}());

//clean up blog posts
(function() {
  //return if not a blog post page
  var checkPage = location.pathname.indexOf('/blogs/') > -1 && document.querySelector('.blog-entry-content');
  if (!checkPage) return;
  
  //move social icons so they are first element in .blog-entry 
  var socialIcons = document.querySelector('.blog-entry-social');
  if (socialIcons) {
    socialIcons.parentNode.insertBefore(socialIcons, socialIcons.parentNode.firstElementChild);
    socialIcons.classList.add('klrn_blog_post_social_icons');
  }
  
  //remove empty or bad paragraphs
  var paragraphs = document.querySelectorAll('.blog-entry-content p'), i, p, badImg, badTxt;
  if (!paragraphs) return;
  imageChecks = ['https://www.klrn.org/s/cms/images/plugins/link.png', 
                 'https://www.klrn.org/s/images/snippet.png'];
  textChecks = ['', 'watch:', 'watch now:']; //checks only lower case 

  for (i=0; i<paragraphs.length; i++) {
    p = paragraphs[i]; 
    badImg = (p.firstChild && p.firstChild.nodeName.toLowerCase() === 'img' 
              && imageChecks.indexOf(p.firstChild.src) > -1); 
    badTxt = (textChecks.indexOf(p.innerHTML.trim().toLowerCase()) > -1);
    if (badImg || badTxt) p.parentNode.removeChild(p);    
  }  
}());
},{}],7:[function(require,module,exports){
(function () {
  // return if not sponsor page
  if (location.pathname.indexOf('/support/sponsor') === -1) return;

  const csv =
    'https://pbs.klrn.org/bento/data/get-data.php?file=sponsors&type=csv';
  const images = 'https://pbs.klrn.org/bento/images/sponsors/';
  const target = document.querySelector('#klrn_sponsors');
  let level = 0;
  if (!target) return;

  //add everything to this, then make 1 insertion
  const fragment = document.createDocumentFragment();

  //subheads and html wrappers
  const subheads = [
    '',
    'American Master',
    'SuperNOVA',
    'Great Performer',
    'Media Allies',
  ];

  const createSubhead = (level) => {
    const subhead = document.createElement('h2');
    subhead.style.cssText = 'text-align:center;margin-top:16px;';
    subhead.innerHTML = subheads[level];
    return subhead;
  };

  const createLogoContainer = () => {
    const ul = document.createElement('ul');
    ul.className = 'logos';
    return ul;
  };

  const createLogoWrapper = (logoContainer) => {
    const div = document.createElement('div');
    const article = document.createElement('article');
    div.className = 'sponsor-logos-component bento-component center';
    article.appendChild(logoContainer);
    div.appendChild(article);
    return div;
  };

  const createTextSponsorContainer = () => {
    const div = document.createElement('div');
    div.className = 'text-container text-background-color text-padding';
    div.style.cssText = 'text-align:center;padding:0 16px;';
    return div;
  };

  const createTextSponsorRow = () => {
    const div = document.createElement('div');
    div.style.cssText = 'max-width:100%;clear:left;';
    return div;
  };

  const createLogo = (row) => {
    const li = document.createElement('li');
    li.className = 'logo-container';

    const img = document.createElement('img');
    img.className = 'logo-img';
    img.setAttribute('loading', 'lazy');
    img.setAttribute('role', 'img');
    img.src = images + row.LOGO;
    img.alt = row.SPONSOR;
    img.style.cssText = 'max-width:170px;';
    img.setAttribute(
      'sizes',
      `(min-width: 1200px) 1440px,
        ((min-width: 992px) and (max-width: 1199px)) 899px,
        ((min-width: 768px) and (max-width: 991px)) 743px,
        ((min-width: 576px) and (max-width: 767px)) 767px,
        (max-width: 575px) 575px`
    );

    if (row.LINK) {
      const aTag = document.createElement('a');
      aTag.className = 'logo-link';
      aTag.href = row.LINK;
      aTag.setAttribute('target', '_blank');
      aTag.appendChild(img);
      li.appendChild(aTag);
    } else li.appendChild(img);

    return li;
  };

  const createTextSponsor = (row) => {
    const pTag = document.createElement('p');
    pTag.className = 'span4 column-4';
    pTag.style.cssText = 'margin-bottom:16px;';
    if (row.LINK) {
      const aTag = document.createElement('a');
      aTag.href = row.LINK;
      aTag.setAttribute('target', '_blank');
      aTag.innerHTML = row.SPONSOR;
      pTag.appendChild(aTag);
    } else pTag.innerHTML = row.SPONSOR;
    return pTag;
  };

  //callback for fetch
  const parse = (text) => {
    if (!text) return; //if there's no content, forget about it
    let data = klrn.parseCSV(text);

    //sort data by category levels
    data.sort((a, b) => a.CATEGORY - b.CATEGORY);

    //testing
    //data = data.filter(row => row.CATEGORY !== '3');
    //data = data.filter(row => row.SPONSOR !== 'Big Bend Conservancy');
    //data = data.filter(row =>  row.SPONSOR !== 'Our Kids Magazine' &&
    //                           row.SPONSOR !== 'San Antonio Magazine');
    //console.log(data);

    //driver loop to put elements together
    let container = null;
    let textRow = null;
    let count = 0;
    data.forEach((row) => {
      //skip row if any required data is missing
      if (
        row.SPONSOR === '' ||
        row.CATEGORY === '' ||
        row.CATEGORY === '0' ||
        (row.CATEGORY <= 2 && row.LOGO === '')
      ) {
        return;
      }

      //handle first occurance of each category to set level,
      //then add existing category container, add next subhead, and create next container
      const category = parseInt(row.CATEGORY);
      if (category !== level) {
        //handle previous container
        if (container) {
          if (level <= 2) fragment.appendChild(createLogoWrapper(container));
          else {
            if (textRow && textRow.children.length > 0) {
              container.appendChild(textRow);
            }
            fragment.appendChild(container);
            textRow = null;
            count = 0;
          }
          container = null;
        }

        //create next subhead and container
        level = category;

        fragment.appendChild(createSubhead(level)); //next subhead
        if (level <= 2) container = createLogoContainer(); //next logo container
        else container = createTextSponsorContainer(); //next text sponsor container
      }

      //add sponsors to current container
      if (category <= 2) container.appendChild(createLogo(row));
      else {
        //add textRow wrap for every 3 text sponsors
        if (count % 3 === 0) {
          if (textRow) {
            container.appendChild(textRow);
            textRow = null;
          }
          textRow = createTextSponsorRow();
        }
        textRow.appendChild(createTextSponsor(row));
        count++;
      }
    });

    //append last container
    if (container) {
      if (data[data.length - 1].CATEGORY <= 2) {
        fragment.appendChild(createLogoWrapper(container));
      } else {
        if (textRow && textRow.children.length > 0) {
          container.appendChild(textRow);
        }
        fragment.appendChild(container);
      }
    }

    //add everything to dom target
    target.appendChild(fragment);
  };

  //klrn.ajaxLoad(csv, parse)

  fetch(csv)
    .then((resp) => resp.text())
    .then((text) => parse(text));
})();

},{}],8:[function(require,module,exports){
//load data for what's on now module 
//for required html, see bento/src/html/whats-on.htm
//for required css, see bento/src/css/modules/whats-on.css 
(function() { 
  //return if not home or test page  
  if (location.pathname !== '/' && 
      location.pathname !== '/test/test/') {
    return;
  }
  
  //return if module's html not on page
  const schedules = document.querySelectorAll('.schedule'); 
  const scheduleTable = document.querySelector('.table.schedule__table'); 
  if (!schedules || !scheduleTable) { console.log('No schedule HTML'); return; }
  
  //helper to show element (like TV schedules or TV channels), and optionally hide another
  function showElem(showEl, hideEl = null) {
    if (hideEl) hideEl.style.display = 'none'; 
    showEl.style.display = 'block';
    klrn.fadeIn(showEl, 1);  	  
  }  

  //check whether default, TV channels, should display instead of TV schedules
  const schedule = schedules[0], scheduleBackup = schedules[1];
  if (schedule.dataset.klrnShowSchedule === 'false') {
    showElem(scheduleBackup);
    return;
  }  
  
  //urls for api calls
  const timeAPI = 'https://pbs.klrn.org/api/get-time.php';
  const scheduleAPI = 'https://pbs.klrn.org/api/get-data.php?file=tv-schedule&type=json';
  
  //other variables    
  const primetimeLink = document.querySelector('.schedule_primetime a');      
  let time, day, timeMilliseconds, showPrimetime = false;
  
  //callback to handle data from timeAPI, and fetch scheduleAPI 
  function getTimeAndDay(data) {   
    data = JSON.parse(data); 
    if (!data) { 
      showElem(scheduleBackup);
      console.log('No getTimeAndDay data'); 		
      return; 
    }
    
    //console.log(data);  
   
    if (showPrimetime) time = 1900;
    else time = parseInt(data.time);
    day = data.day;
    timeMilliseconds = new Date().getTime().toString(); //parameter to break cache 
    fetchWithTimeout(scheduleAPI + '?v=' + timeMilliseconds, parseSchedules);        
  }  

  function parseTime(time) {
    let partOfDay = ' AM', timeString;
    if (time >= 1200) partOfDay = ' PM';
    if (time >= 1300) time -= 1200;
    if (time < 100) time += 1200;
    timeString = time.toString();
    timeString = timeString.slice(0,-2) + ':' + timeString.slice(-2);          
    return timeString + partOfDay; 
  }  
  
  //callback to reload data after clicking primetimeLink
  function reloadData() {   
    schedule.style.opacity = '0';
    showPrimetime = !showPrimetime;          
    scheduleTable.style.minHeight = scheduleTable.offsetHeight.toString() + 'px'; //temp to stop flicker      
    scheduleTable.innerHTML = '<tbody></tbody>';          
    fetchWithTimeout(timeAPI, getTimeAndDay);      
    if (showPrimetime) {
      schedule.className = schedule.className.replace('show_current', 'show_primetime');
    }
    else {
      schedule.className = schedule.className.replace('show_primetime', 'show_current');  
    } 
  }

  //callback to handle data from scheduleAPI  
  function parseSchedules(data) {
    data = JSON.parse(data);   
    if (!data) { console.log('No parseSchedules data'); }
    if (data.date !== day) { console.log('parseSchedules date does not match day'); }
    if (!data || data.date !== day) {
      showElem(scheduleBackup, hideEl = schedule);	
      return;
    }		

    //console.log(data);
    
    const len = data.schedToday.feeds.length;
    let feed = null, i;
    for (i=0;i<len;i++) {
      if (data.schedToday.feeds[i].short_name === 'KLRN') feed = i;
    }
    if (feed === null) { 
      showElem(scheduleBackup);
      console.log('feed data does not include KLRN channel'); 
      return; 
	}    
    
    const indexLastShowToday = data.schedToday.feeds[feed].listings.length-1;
    const listings = data.schedToday.feeds[feed].listings.concat(data.schedTomorrow.feeds[feed].listings);
    let startTime, title, episodeTitle;
    let count = 0, row, firstCell; 
   
    //console.log(listings);
    //console.log(listings[indexLastShowToday]);
    //time =  2300;
    
    //console.log(time); 
    //console.log(day);        
    //console.log('');
    
    for (i=0;i<listings.length;i++) {        
      //skip any shows before the one currently airing
      if (count === 0 && i < indexLastShowToday) { 
        if (parseInt(listings[i+1].start_time) < time+1) continue;
      }   
      
      //include currently airing show and next 3           
      count += 1;
      if (count > 4) break;           
      
      startTime = parseTime(parseInt(listings[i].start_time));          
      if (listings[i].episode_title) episodeTitle = ': ' + listings[i].episode_title;
      else episodeTitle = '';
      title = listings[i].title + episodeTitle;
                
      //console.log(startTime);
      //console.log(title);     
      //console.log('');
      
      row = scheduleTable.insertRow(); 
      firstCell = row.insertCell()
      firstCell.className = 'schedule__time home-schedule__table-cell-time schedule__time--formatted';
      firstCell.textContent = startTime;         
      row.insertCell().textContent = title;                    
    }
    scheduleTable.style.minHeight = '';
    primetimeLink.addEventListener('click', reloadData, {once: true});
    showElem(schedule);   
  }
  
  function fetchWithTimeout(url, callback, timeout = 1500) {    
    const controller = new AbortController();
    const signal = controller.signal;
    setTimeout(() => controller.abort(), timeout);
    
    fetch(url, {signal})
      .then(response => response.text())
      .then(text => callback(text))
      .catch(e => {
        if (e.name === 'AbortError') console.log('Fetch to URL aborted:', url);
        else console.log('There was a fetch error:', e);
        showElem(scheduleBackup, hideEl = schedule);
    });	  
  }  
  
  fetchWithTimeout(timeAPI, getTimeAndDay);
  primetimeLink.addEventListener('click', (e) => e.preventDefault()); //stop empty href from reloading page  
}());
},{}],9:[function(require,module,exports){
(function(exports) {

  //applies filters to YouTube videos being loaded, based on playlist ID
  exports.youtubePlaylistFilters = function(textString, playlistId) {    
    var newString;
    
    //Ready Set Grow testimonials
    if (playlistId === 'PLO5rIpyd-O4G4C6Qw66Ft1YfK7MQZBYuP') {
      newString = textString.replace('Ready Set Grow Testimonial | ', '');
      return newString;
    }     
    
    //Play & Learn testimonials
    if (playlistId === 'PLO5rIpyd-O4HxXSkCYvw-lN8Yo314u5Pu') {
      newString = textString.replace('Play & Learn Testimonial | ', '');
      return newString;
    }     
    
    //On the Record
    if (playlistId === 'PLO5rIpyd-O4ERCTOKJmeKBRz-gYTYJYpH') {
      newString = textString.replace(/On [tT]he Record\s+\|\s+The Conversation Continues\s+\|\s+/, '');
      return newString;
    }      
    
    //News Updates
    if (playlistId === 'PLO5rIpyd-O4EA5mYUxl1WbOaOl1kU08RB') {
      newString = textString.replace(/,\s20[12][0-9]/, '');
      return newString;
    }   

    //TAMIU Student Reporting Lab
    if (playlistId === 'PLO5rIpyd-O4HysEnkRay0jUiQcL5eqvR3') {
      newString = textString.replace(/TAMIU Student Reporting Lab\s+\|\s+/, '');
      return newString;
    }     
    
    //Healthy Kids English
    if (playlistId === 'PLO5rIpyd-O4FdYCi4DtZmkeIbp5Yn7Jp_') {
      newString = textString.replace('Healthy Kids Project | ', '');
      return newString;
    }
    
    //Healthy Kids Espanol
    if (playlistId === 'PLO5rIpyd-O4GCnwfyIkdoLGs86KDqTcT_') {
      newString = textString.replace('El Proyecto Niños Sanos | ', '');
      return newString;
    }   

    return textString;    
  }
}(klrn));
},{}],10:[function(require,module,exports){
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

(function(exports) {
  
  //Helper function that accepts string, or regex as a string (using double escapes \\) 
  //returns string or regex object to enter into string.replace() method
  exports.getFilter = function(string) {
    if (string[0] !== '/') return string;
    var arr = string.split('/');
    return new RegExp(arr[1], arr[2]);
  }   

  //gets youtube playlists on page, creates attributes array for each, and adds arrays to an array
  //[[playlistID, showVideos, numberCols, textToUse, showLines, loadMore], textFilter, [...]]
  exports.getYoutubePlaylists = function() {
    var elems = document.querySelectorAll('.klrn_youtube_playlist');
    if (!elems.length) return false;
    
    var playlists = [], i, playlist, playlistID, numVideos, numCols, textToUse, showLines;
    
    for (i=0; i<elems.length; i++) {
      playlistID = elems[i].getAttribute('data-klrn-playlist-id') || '';
      showVideos = elems[i].getAttribute('data-klrn-show-videos') || '';
      numberCols = elems[i].getAttribute('data-klrn-number-cols') || '';
      textToUse = elems[i].getAttribute('data-klrn-text-to-use') || '';
      showLines = elems[i].getAttribute('data-klrn-show-lines') || '';
      loadMore = elems[i].getAttribute('data-klrn-load-more') || '';
      textFilter = elems[i].getAttribute('data-klrn-text-filter') || '';      
      playlist = [playlistID.trim(), showVideos.trim(), numberCols.trim(), textToUse.trim(), showLines.trim(), loadMore.trim(), textFilter]; //no trim on textFilter 
      playlists.push(playlist);
      elems[i].id = playlistID;
    }          
    return playlists;
  }
  
  //accepts src and an optional callback, makes ajax get request, and invokes callback
  exports.getFile = function(src, callback) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        if (callback) callback(JSON.parse(this.responseText));
      } 
    };      
    xhttp.open('GET', src, true);
    xhttp.send();
  } 
  
  //accepts [playlistID, numVideos, numCols, textToUse] item or or array of such items
  //and adds script links and callbacks to grab playlists from YouTube
  //also loads youtube api
  exports.loadYoutubePlaylists = function(lists) {  
    var elem, body = document.querySelector('body');
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
    
    for (i=0; i<lists.length; i++) {
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
      src = 'https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&'
        + 'maxResults=' + showVideos
        + '&playlistId=' + playlistID    
        + '&key=AIzaSyDraaM_dJplqR3JbRtmx-HSIMfIZHTqXV4';      
      
      //create callback on window for each playlist
      callbackFunc = 'klrn_youtube_playlist_module_' + i.toString(); 
      window[callbackFunc] = new Function('data', 'return klrn.parseYoutubePlaylist(data, "' 
        + domSelector + '", "' + numColumns + '", "' + textToUse + '", "' 
        + showLines + '", "' + loadMore + '", "' + textFilter + '", "' + src + '")');
        
      //make ajax call to YouTube for each playlist  
      exports.getFile(src, window[callbackFunc]);
    }
  }  

  exports.parseYoutubePlaylist = function(data, domSel, numCols, textToUse, 
                                          showLines, loadMore, textFilter, src) { 
    
    //console.log(data);
    
    //prep variables for parsing and dom insertion
    var target = document.querySelector(domSel);
    var imgUrl, videoDesc, videoDescClass, cols, colSpan, i, elems = -1;
    var div0, div1, div2, div2, div3, div4, div5, div6, div7, h3Tag, buttonTag;
    var playListId = domSel.slice(1), tokenParam, fadeIn = false;
    var linkDiv, linkDivId, linkTag, callbackFunc, loadedMore; 
    
    //add all created elements to this, and then make only one dom insertion
    var fragment = document.createDocumentFragment();
    
    //YouTube style play button
    var playButton = '<svg height="100%" version="1.1" viewBox="0 0 68 48" width="100%"><path class="ytp-large-play-button-bg" d="M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.64-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z" fill="#212121" fill-opacity="0.8"></path><path d="M 45,24 27,14 27,34" fill="#fff"></path></svg>'
    
    //create only one text filter, if there is one, since it may be a regex
    if (textFilter) textFilter = exports.getFilter(textFilter);    
    
    cols = parseInt(numCols);
    colSpan = 12 / cols;   
    
    //set dom elements for each video 
    for (i=0; i<data.items.length; i++) {
      if (!data.items[i].snippet.thumbnails.high) continue;
	  elems += 1;	
      imgUrl = data.items[i].snippet.thumbnails.high.url;
      videoID = data.items[i].snippet.resourceId.videoId;
      textToUse = textToUse.toLowerCase();

      if (textToUse === 'descriptions' | textToUse === 'description') {
        videoDesc = data.items[i].snippet.description;
        videoDescClass = ' klrn_show_lines_3';
      }
      else {
        videoDesc = data.items[i].snippet.title;
        videoDescClass = ' klrn_show_lines_2';
      }
      
      //apply filters to titles, if there are any filters
      if (textFilter) videoDesc = videoDesc.replace(textFilter, '');      
      else if (typeof exports.youtubePlaylistFilters === 'function') {
        videoDesc = exports.youtubePlaylistFilters(videoDesc, playListId)
      }
      
      if (showLines) videoDescClass = ' klrn_show_lines_' + showLines;
      
      //add div for grouping videos into rows
      if (elems % cols === 0) {
        div0 = document.createElement('div');
        div0.className = 'row-fluid';
        if (target.style.display !== 'none') { // if initial playlist already loaded 
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
      div5.addEventListener('click', exports.loadVideo(videoID))        

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
      if (src.indexOf(tokenParam) === -1) src += tokenParam + data.nextPageToken;
      else src = src.slice(0, src.indexOf(tokenParam)) + tokenParam + data.nextPageToken;

      //set up next callback for youtube api call      
      callbackFunc = 'klrn_youtube_playlist_module_' + playListId + '_' + data.nextPageToken;
      window[callbackFunc] = new Function('data', 'return klrn.parseYoutubePlaylist(data, "' 
        + domSel + '", "' + numCols + '", "' + textToUse + '", "' 
        + showLines + '", "' + loadMore + '", "' + textFilter + '", "' + src + '")');
      
      //create elements
      linkDiv = document.createElement('div');
      linkDiv.id = 'load_more_' + playListId; 
      linkDiv.className = 'load_more_videos_div';           
      linkTag = document.createElement('a');
      linkTag.className = 'klrn_button read-more__link';
      linkTag.innerHTML = 'Load More Videos';
      linkTag.addEventListener('click', function() {
        exports.getFile(src, window[callbackFunc])
      });      
      if (target.style.display !== 'none') { // if initial playlist already loaded 
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
      for (i=0; i<loadedMore.length; i++) { 
        klrn.fadeIn(loadedMore[i], 1);
        loadedMore[i].classList.remove('fade-in');                
      }
    }
    
  }

}(klrn));
},{}],11:[function(require,module,exports){
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
          if (exports.youtubeVideos.getObjects[i].id === e.target.id) continue;      
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
},{}],12:[function(require,module,exports){
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
},{}],13:[function(require,module,exports){
//remove Google Analytics cross-domain tracking in url, if it exists
(function() {
  href = location.href.split('&_ga=')[0];
  history.replaceState({}, location.href, href);  
}());

//add page path as classes to body element
(function() {
  var path = document.location.pathname, classes = '';  
  if (location.host === 'www.klrn.org' || location.host === 'klrn.bento-live.pbs.org') {
    if (path === '/') classes += 'home'; 
    else if (path.length > 0) classes += path.split('/').join(' ').trim();    
  }  
  else if (location.host === 'bento.pbs.org') classes += klrn.pages[path];  
  if (classes.length > 0) document.body.className += ' ' + classes; 
}());

//manage link button styles    
(function() { 
    var links = document.links;
    var i, len = links.length;
    if (len === 0) return;  
    
    //add String endsWith method if not available
    //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/endsWith
    if (!String.prototype.endsWith) {
      String.prototype.endsWith = function(search, this_len) {
        if (this_len === undefined || this_len > this.length) {
          this_len = this.length;
        }
        return this.substring(this_len - search.length, this_len) === search;
      };
    }

    for (i=0; i<len; i++) {      
        //add button styles if url has klrn_style parameter added, or text ends with > character
        if (links[i].href.indexOf('klrn_style=link') > -1
            || links[i].innerHTML.trim().endsWith('&gt;')) {
            links[i].className += ' klrn_button read-more__link';
            if (links[i].innerHTML.trim().endsWith('&gt;&gt;')) {
              links[i].className += ' klrn_button_display_block';
              links[i].innerHTML = links[i].innerHTML.replace('&gt;&gt;', '').trim();
            }            
            else if (links[i].innerHTML.trim().endsWith('&gt;')) {
              links[i].innerHTML = links[i].innerHTML.replace('&gt;', '').trim();
            }
        }
    }    
}());

//remove margins on empty p tags in text-containers
(function() {
  var pTags = document.querySelectorAll('.text-container p'), i;
  if (!pTags) return;
  for (i=0;i<pTags.length;i++) {
    if (pTags[i].innerHTML.trim() === '&nbsp;') pTags[i].style.marginBottom = '0';
  }    
}());

//remove top margins on text components if an <hr> is first element
(function() {
  var hrTags = document.querySelectorAll('.text-container hr:first-child'), i;
  if (!hrTags) return;
  for (i=0;i<hrTags.length;i++) {
    if (hrTags[i].parentNode && hrTags[i].parentNode.parentNode 
        && hrTags[i].parentNode.parentNode.parentNode 
        && hrTags[i].parentNode.parentNode.parentNode.classList.contains('component')) {
          hrTags[i].parentNode.parentNode.parentNode.style.marginTop = '16px';
        }      
  }    
}());

//remove image floats up to certain widths when text too narrow, add back when text wider
(function(exports) {    
  var selectors = '.text-container .image-style-align-left > img';
  selectors += ', .text-container .image-style-align-right > img';  
  var textImages = document.querySelectorAll(selectors);
  var i, maxWidth = 191, containerWidth, imageWidth;

  if (!textImages) return;  
  
  exports.manageFloatedImages = function() {  
    for (i=0; i<textImages.length; i++) {  
      containerWidth = textImages[i].parentNode.parentNode.offsetWidth;
      imageWidth = parseInt(textImages[i].naturalWidth);
      if (containerWidth - imageWidth < maxWidth) {
        textImages[i].parentNode.classList.add('klrn_text_container_mobile_image_block');
      } 
      else {
        textImages[i].parentNode.classList.remove('klrn_text_container_mobile_image_block');
      }            
    }
  }  
}(klrn));  

//remove pbs favicons. and add klrn favicon
(function(exports) {
  //remove pbs favicon links
  var favLinks = document.querySelectorAll('head link[href*="favicon"]'); 
  if (favLinks) favLinks.forEach(function(link){link.remove()});

  //create klrn favicon  
  var favIcon = document.createElement('link'); 
  favIcon.href = 'https://d1qbemlbhjecig.cloudfront.net/prod/filer_public/klrn-bento-live-pbs/global/65c49cf27f_klrn_favicon.png'; 
  favIcon.type = 'image/png'; 
  favIcon.rel = 'icon';

  //insert klrn favicon into head tag
  document.querySelector('head').appendChild(favIcon);
}(klrn));

///////////////////////////////////////////////////////////////////////////////////////////
//ready, load and resize     
(function ($, undefined) {    
  $(document).ready(function() {  
    
    klrn.manageFloatedImages();
    window.dataLayer = window.dataLayer || []; //for Google Tag Manager variables 
    klrn.loadYoutubeVideos();
    var playlists = klrn.getYoutubePlaylists();
    if (playlists) klrn.loadYoutubePlaylists(playlists, 'klrn');

    //resize and orientationchange events
    var resizeTicking = false;    
    klrn.throttleAnimation(false, klrn.manageFloatedImages);
    $(window).on('resize orientationchange', function() {
      
      //use requestAnimationFrame to throttle events to browser repaints
      if (!resizeTicking) {        
        requestAnimationFrame(function() { 
          klrn.manageFloatedImages();
          resizeTicking = false;
        });        
      }
      resizeTicking = true;
    }); 
    
  });
}(jQuery)); 

///////////////////////////////////////////////////////////////////////////////////////////
//fade in body so loading doesn't look so jerky 
$('body').fadeTo(500, 1, function(){
    document.getElementsByTagName('html')[0].style.backgroundColor = 'transparent';
});
///////////////////////////////////////////////////////////////////////////////////////////

//optional fade-in for Bootstrap tabs
//<ul class="nav nav-tabs"> needs class klrn-tab-fade-in added
(function(exports) {  
  var tabs = document.querySelectorAll('.klrn-tab-fade-in');
  if (!tabs) return;
  
  var links, i, id, tabBox, j;
  
  for (i=0; i<tabs.length; i++) {
    links = tabs[i].querySelectorAll('li a');
    if (!links) break;
    
    id = links[0].href.split('#');
    if (!id) break;
    
    tabBox = document.querySelector('#' + id[1]);
    if (!tabBox) break;
    
    for (j=0; j<links.length; j++) {
      links[j].addEventListener('click', function(e) {
        tabBox.parentNode.style.opacity = '0';
        exports.fadeIn(tabBox.parentNode, 0.75); 
      });

    }
  } 
}(klrn));

//set campaign cookie to manage campaign tracking through funnel
(function() {  
  //only track campaigns using Google Analytics tags
  var search = location.search;
  if (search.indexOf('utm_campaign=') === -1) return;
  
  var search = search.slice(1).split('&');
  var params = {}, i, len = search.length, keyValue;
  var cookieValue = '', source, medium, campaign, content;
  
  for (i=0; i<len; i++) {
    keyValue = search[i].split('=');
    params[keyValue[0]] = keyValue[1]; 
  }
  
  cookieValue += params.hasOwnProperty('utm_source') ? params['utm_source'] : '';
  cookieValue += params.hasOwnProperty('utm_medium') ? ',' + params['utm_medium'] : ',';
  cookieValue += params.hasOwnProperty('utm_campaign') ? ',' + params['utm_campaign'] : '';
  cookieValue += params.hasOwnProperty('content') ? ',' + params['content'] : '';  

  //set cookie
  if (params.hasOwnProperty('utm_campaign')) {
    var date = new Date();
    date.setTime(date.getTime() + 183 * 24 * 60 * 60 * 1000).toString();
    var expires = 'expires=' + date;
    document.cookie = 'klrnCampaign=' + cookieValue + '; ' + expires + '; path=/; domain=klrn.org';
  }  
}());
},{}],14:[function(require,module,exports){
window.klrn = window.klrn || {};
require('./modules/polyfills');
require('./modules/klrn-helpers');
require('./modules/whats-on');
require('./modules/youtube-video');
require('./modules/youtube-playlist-filters');
require('./modules/youtube-playlist');
require('./modules/youtube-video-loader');
require('./modules/bootstrap-tab-replacement');
require('./ready');
require('./modules/specific-pages');
require('./modules/sponsors-parse');
require('./modules/gtm-event-tracking');
require('./modules/gtm-event-tracking-pages');
},{"./modules/bootstrap-tab-replacement":1,"./modules/gtm-event-tracking":3,"./modules/gtm-event-tracking-pages":2,"./modules/klrn-helpers":4,"./modules/polyfills":5,"./modules/specific-pages":6,"./modules/sponsors-parse":7,"./modules/whats-on":8,"./modules/youtube-playlist":10,"./modules/youtube-playlist-filters":9,"./modules/youtube-video":12,"./modules/youtube-video-loader":11,"./ready":13}]},{},[14]);
