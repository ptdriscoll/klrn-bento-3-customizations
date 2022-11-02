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