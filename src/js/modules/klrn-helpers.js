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