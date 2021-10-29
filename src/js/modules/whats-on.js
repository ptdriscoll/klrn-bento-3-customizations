//load what's on now module 
//for required html, see bento/src/html/whats-on.htm
//for required css, see bento/src/css/modules/whats-on.css 
(function() { 
  //return if not home page     
  if (document.location.pathname !== '/') return;
  
  //urls for api calls
  var getTime = 'https://pbs.klrn.org/api/get-time.php';
  var getSchedule = 'https://pbs.klrn.org/api/get-data.php?file=tv-schedule&type=json';
  
  //return if module's html not on page
  var schedules = document.querySelectorAll('.schedule'); 
  if (!schedules) { console.log('No schedule HTML'); return; }      
  var scheduleTable = document.querySelector('.table.schedule__table');           
  if (!scheduleTable) { console.log('No scheduleTable HTML'); return; }
  
  //other variables
  var schedule = schedules[0], scheduleBackup = schedules[1];
  var primetimeLink = document.querySelector('.schedule_primetime a');      
  var time, day, timeMilliseconds, showPrimetime = false, tBody;
  
  //callback for getTime data, and to make getSchedule ajax call 
  var getTimeAndDay = function(data) {
    var data = JSON.parse(data); 
    if (!data) { 
        console.log('No getTimeAndDay data'); 
        return; 
    }
    
    //console.log(data);  
   
    if (showPrimetime) time = 1900;
    else time = parseInt(data.time);
    day = data.day;
    timeMilliseconds = new Date().getTime().toString(); //parameter to break cache 
    ajaxCall(getSchedule + '?v=' + timeMilliseconds, parseSchedules);        
  }  

  var parseTime = function(time) {
    var partOfDay = ' AM', timeString;
    if (time >= 1200) partOfDay = ' PM';
    if (time >= 1300) time -= 1200;
    if (time < 100) time += 1200;
    timeString = time.toString();
    timeString = timeString.slice(0,-2) + ':' + timeString.slice(-2);          
    return timeString + partOfDay; 
  }     

  //callback for getSchedule data  
  var parseSchedules = function(data) {
    var data = JSON.parse(data);   
    if (!data) { console.log('No parseSchedules data'); }
    if (data.date !== day) { console.log('parseSchedules date does not match day'); }
    if (!data || data.date !== day) return; 

    //console.log(data);
    
    var feed = null, i, len = data.schedToday.feeds.length;
    for (i=0;i<len;i++) {
      if (data.schedToday.feeds[i].short_name === 'KLRN') feed = i;
    }
    if (feed === null) { console.log('feed data does not include KLRN channel'); return; }    
    
    var indexLastShowToday = data.schedToday.feeds[feed].listings.length-1;
    var listings = data.schedToday.feeds[feed].listings.concat(data.schedTomorrow.feeds[feed].listings);
    var startTime, title, episodeTitle;
    var count = 0, i, row, firstCell; 
   
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
    scheduleBackup.style.display = 'none';
    schedule.style.display = 'block';
    scheduleTable.style.minHeight = '';
    klrn.fadeIn(schedule, 1);     
  }
  
  var ajaxCall = function(url, callback) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        callback(this.responseText);          
      }
    }      
    xhttp.open('GET', url, true);
    xhttp.send();
  }
  
  ajaxCall(getTime, getTimeAndDay);
  
  if (schedule && primetimeLink) {
    primetimeLink.addEventListener('click', function(e) {
      e.preventDefault();
      schedule.style.opacity = '0';
      showPrimetime = !showPrimetime;          
      scheduleTable.style.minHeight = scheduleTable.offsetHeight.toString() + 'px'; //temp to stop flicker      
      scheduleTable.innerHTML = '<tbody></tbody>';          
      ajaxCall(getTime, getTimeAndDay);
      if (showPrimetime) {
        schedule.className = schedule.className.replace('show_current', 'show_primetime');
      }
      else {
        schedule.className = schedule.className.replace('show_primetime', 'show_current');  
      }      
    });
  }
  
}());