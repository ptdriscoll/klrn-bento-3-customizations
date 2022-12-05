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