!function a(r,l,s){function c(t,e){if(!l[t]){if(!r[t]){var n="function"==typeof require&&require;if(!e&&n)return n(t,!0);if(d)return d(t,!0);var o=new Error("Cannot find module '"+t+"'");throw o.code="MODULE_NOT_FOUND",o}var i=l[t]={exports:{}};r[t][0].call(i.exports,function(e){return c(r[t][1][e]||e)},i,i.exports,a,r,l,s)}return l[t].exports}for(var d="function"==typeof require&&require,e=0;e<s.length;e++)c(s[e]);return c}({1:[function(e,t,n){var m;(m=klrn).trackSchedulePageSponsors=function(){if(-1!==location.pathname.indexOf("/schedule")){var e=document.querySelectorAll("#layout-4936e49d-c107-4949-bca0-f3d50f08c84f a, #layout-13f8bdb5-76bd-431a-b240-627aaa2439ed a");if(e){var t,n,o,i,a,r=[];for(t=0;t<e.length&&(n=e[t].querySelector("img"));t++)i={eventCategory:(o=m.checkOutboundLink(e[t].href))?"Outbound Links":"Internal Links",eventAction:"Views",eventLabel:n.alt,target:e[t],outboundLink:o,eventNonInteraction:!0},a="none"!==getComputedStyle(e[t].parentNode.parentNode.parentNode).display,t<4&&a?m.trackEvent(i):r.push(Object.assign({},i)),i.eventAction="Clicks",i.eventNonInteraction=!1,m.trackEvent(i);4===r.length&&m.trackWhenInView(r,"schedulePage")}}},m.trackSidebar=function(){if("/"!==location.pathname){var e=document.querySelector(".rail-wrapper");if(e){var t,n,o,i=e.querySelectorAll("#component-487eb930-f29a-11e8-ac11-cf036755f6fe a,#component-19fb5ee0-f369-11e8-90bb-7b9969ce1070 a"),a=e.querySelectorAll("#component-18114b10-e795-11e8-bc4d-edfdc25f8ca9 a"),r={eventCategory:"Sidebar",eventAction:"Clicks",eventLabel:void 0,target:void 0,outboundLink:void 0,eventNonInteraction:!1};for(r.eventAction="Clicks - Sidebar Buttons",t=0;t<a.length;t++)r.eventLabel=a[t].textContent.trim(),r.target=a[t],r.outboundLink=m.checkOutboundLink(a[t].href),m.trackEvent(r);for(t=0;t<i.length;t++)"none"!==window.getComputedStyle(i[t].parentNode.parentNode).display&&(i[t].querySelector("img")&&(n=i[t].querySelector("img").alt.trim()),r.eventLabel=n||"image alt tag not set",r.target=i[t],o=m.checkOutboundLink(i[t].href),r.outboundLink=o,r.eventCategory=o?"Outbound Links":"Internal Links",r.eventAction="Views",r.eventNonInteraction=!0,klrn.inView(r.target.firstElementChild,.5)?m.trackEvent(r):m.trackWhenInView(Object.assign({},r),"singleAd"),r.eventAction="Clicks",r.eventNonInteraction=!1,m.trackEvent(r),r.eventCategory="Sidebar",r.eventAction="Clicks - Sidebar Sponsors",m.trackEvent(r))}}},m.trackHomePageSlider=function(){if("/"===location.pathname){var e=document.querySelectorAll("#component-1a1b52f0-d9f6-11e7-a670-7f78010a7152 a");if(e){var t,n,o,i=e.length;for(t=0;t<i;t+=1)t%3==0&&(o=e[t].textContent),n={eventCategory:"Home Page Slider",eventAction:"Clicks",eventLabel:o,target:e[t],eventNonInteraction:!1},m.trackEvent(n)}}},m.trackHomePagePromos=function(){if("/"===location.pathname){var e,t,n,o,i,a,r=document.querySelectorAll("#column-224b9950-b60d-11e8-8b93-9145e1056ee0 .promo"),l=document.querySelectorAll("#column-0fa9631a-e8ba-4117-adae-751046aae720 a"),s=document.querySelectorAll("#column-cef6f81b-94e3-4973-8b54-64598726ce08 a"),c=document.querySelectorAll("#layout-d44bc274-ff76-4587-a53a-844ddf1c15db a"),d=document.querySelectorAll("#layout-733a72c0-588a-4c4c-8056-3368cc38f06e .promo"),u={eventCategory:"Home Page Promos",eventAction:"Clicks",eventLabel:void 0,target:void 0,outboundLink:void 0,eventNonInteraction:!1};for(u.eventAction="Clicks - Home Page Top Promos",e=0;e<r.length&&(n=r[e].querySelectorAll("a"));e++)for(r[e].querySelector("img")&&(o=r[e].querySelector("img").alt.trim()),o=o||((o=r[e].querySelector(".read-more__link"))?o.textContent.trim():"image or link text not set"),u.eventLabel=o,u.outboundLink=m.checkOutboundLink(n[0].href),t=0;t<n.length;t++)u.target=n[t],m.trackEvent(u);for(u.eventAction="Clicks - Home Page What's On Now",u.outboundLink=void 0,e=0;e<l.length;e++)u.eventLabel=0===e?"On Primetime | On Now":l[e].textContent,u.target=l[e],m.trackEvent(u);for(u.eventAction="Clicks - Home Page Sponsors",e=0;e<s.length;e++)s[e].querySelector("img")&&(i=s[e].querySelector("img").alt.trim()),u.eventLabel=i||"image alt tag not set",u.target=s[e],a=m.checkOutboundLink(s[e].href),u.outboundLink=a,u.eventCategory=a?"Outbound Links":"Internal Links",u.eventAction="Views",u.eventNonInteraction=!0,klrn.inView(u.target.firstElementChild,.5)?m.trackEvent(u):m.trackWhenInView(Object.assign({},u),"singleAd"),u.eventAction="Clicks",u.eventNonInteraction=!1,m.trackEvent(u),u.eventCategory="Home Page Promos",u.eventAction="Clicks - Home Page Sponsors",m.trackEvent(u);for(u.eventAction="Clicks - Home Page Show Tiles",e=0;e<c.length;e++)c[e].querySelector("img")&&(i=c[e].querySelector("img").alt.trim()),u.eventLabel=i||"image alt tag not set",u.target=c[e],u.outboundLink=m.checkOutboundLink(c[e].href),m.trackEvent(u);for(u.eventAction="Clicks - Home Page Bottom Promos",e=0;e<d.length&&(n=d[e].querySelectorAll("a"));e++)for(d[e].querySelector("h3")&&(o=d[e].querySelector("h3").textContent.trim()),o=o||((o=d[e].querySelector("img"))?o.alt.trim():"headline or image text not set"),u.eventLabel=o,u.outboundLink=m.checkOutboundLink(n[0].href),t=0;t<n.length;t++)u.target=n[t],m.trackEvent(u)}},m.trackSchedulePageSponsors(),m.trackSidebar(),m.trackHomePagePromos(),m.trackHomePageSlider()},{}],2:[function(e,t,n){var r;(r=klrn).trackEvent=function(e){var t="outboundLink"in e?e.outboundLink:void 0,n={event:"gaEvent",eventCategory:"eventCategory"in e?e.eventCategory:void 0,eventAction:"eventAction"in e?e.eventAction:void 0,eventLabel:"eventLabel"in e?e.eventLabel:void 0,eventValue:"eventValue"in e?e.eventValue:void 0,eventNonInteraction:"eventNonInteraction"in e?e.eventNonInteraction:void 0};if("Views"===e.eventAction)return dataLayer.push(n);-1!==e.eventAction.indexOf("Clicks")&&e.target&&-1===e.target.href.indexOf(location.hostname+"/#")&&e.target.addEventListener("click",function(e){t?(e.preventDefault(),n.eventCallback=function(){window.open(t)},n.eventTimeout=100,dataLayer.push(n),setTimeout(function(){window.open(t)},150)):dataLayer.push(n)})},r.trackWhenInView=function(n,e){var o,i,a,t={};t.singleAd=function(){klrn.inView(n.target.firstElementChild,.5)&&(r.trackEvent(n),window.removeEventListener("scroll",o),window.removeEventListener("resize",i),window.removeEventListener("orientationchange",a))},t.schedulePage=function(){var e=klrn.inView(n[0].target.firstElementChild,.5),t=klrn.inView(n[2].target.firstElementChild,.5);(e||t)&&(r.trackEvent(n[0]),r.trackEvent(n[1]),window.removeEventListener("scroll",o),window.removeEventListener("resize",i),window.removeEventListener("orientationchange",a))},window.addEventListener("scroll",o=function(){klrn.throttleAnimation(!1,t[e])}),window.addEventListener("resize",i=function(){klrn.throttleAnimation(!1,t[e])}),window.addEventListener("orientationchange",a=function(){klrn.throttleAnimation(!1,t[e])})},r.checkOutboundLink=function(e){return-1===e.indexOf("klrn.bento-live.pbs.org")&&-1===e.indexOf("klrn.org")&&e}},{}],3:[function(e,t,n){var o;(o=klrn).inView=function(e,t){var n,o,i=window.innerHeight||document.documentElement.clientHeight,a=e.getBoundingClientRect(),r=t||0;return 0!==a.height&&(n=a.bottom>=70+a.height*r,o=a.top<=i-a.height*r,n&&o)},o.throttleAnimation=function(e,t){e||requestAnimationFrame(function(){t(),e=!1}),e=!0},o.debounce=function(o,i,a){var r;return function(){var e=this,t=arguments,n=a&&!r;clearTimeout(r),r=setTimeout(function(){r=null,a||o.apply(e,t)},i),n&&o.apply(e,t)}},o.fadeIn=function(e,t){var n,o=0;n=setInterval(function(){o+=1,e.style.filter="alpha(opacity="+parseInt(o).toString()+")",e.style.opacity=o/100,100==o&&clearInterval(n)},10*t)},o.measure=function(e,t){var n,o=e.style.visibility,i=e.style.position;return e.style.visibility="hidden",e.style.position="absolute",document.body.appendChild(e),n=t(e),e.parentNode.removeChild(e),e.style.visibility=o,e.style.position=i,n},o.ajaxLoad=function(e,t,n){var o;n=n||!0,(o=window.XMLHttpRequest?new XMLHttpRequest:new ActiveXObject("Microsoft.XMLHTTP")).onreadystatechange=function(){4==o.readyState&&200==o.status&&t(o.responseText)},o.open("GET",e,n),o.send()},o.parseCSV=function(e,t){for(var n,o,i,a=e.split("\r\n"),r=[],l=a[0].split(","),s={},c=[],d="",u=/^\s+/,m=/\s+$/,p=/[\u201C\u201D]/g,g=/[\u2018\u2019]/g,f=/[\u2013\u2014]/g,h=/[\u2026]/g,y=1;y<a.length-1;y++){s={};for(var v=(n=a[y].split(",")).length-1;-1<v;v--)((o=n[v].match(/"/g))?o.length:0)%2==1&&c.push(v),'"'!==n[v].slice(0,1)||'"'!==n[v].slice(-1)||'""'===n[v].slice(0,2)&&'""'===n[v].slice(-2)||(n[v]=n[v].slice(1,-1)),n[v].match(/""/)&&(n[v]=n[v].replace(/""/g,'"'));v=0;for(var b=c.length;v<b;v+=2){for(var k=i=c[v]-c[v+1];-1<k;k--)d+=n[c[v]-k]+",";n.splice(c[v]-i,1+i,d.slice(1,-2)),d=""}c=[];for(v=0;v<l.length;v++)s[l[v].replace(u,"").replace(m,"")]=n[v].replace(u,"").replace(m,"").replace(p,'"').replace(g,"'").replace(f,"-").replace(h,"...");r.push(s)}return t?JSON.stringify(r):r}},{}],4:[function(e,t,n){window.requestAnimationFrame=window.requestAnimationFrame||window.mozRequestAnimationFrame||window.webkitRequestAnimationFrame||window.msRequestAnimationFrame||function(e){return setTimeout(e,1e3/60)},window.cancelAnimationFrame=window.cancelAnimationFrame||window.mozCancelAnimationFrame||function(e){clearTimeout(e)},"function"!=typeof Object.assign&&Object.defineProperty(Object,"assign",{value:function(e){"use strict";if(null==e)throw new TypeError("Cannot convert undefined or null to object");for(var t=Object(e),n=1;n<arguments.length;n++){var o=arguments[n];if(null!=o)for(var i in o)Object.prototype.hasOwnProperty.call(o,i)&&(t[i]=o[i])}return t},writable:!0,configurable:!0})},{}],5:[function(e,t,n){var o;!function(){if(-1!==document.body.className.indexOf("schedule")){var e=document.querySelector("#\\33 abebf30-de1c-11e8-90fd-af9807ce4fb6 a"),t=document.querySelector("#c07c2760-de1d-11e8-90fd-af9807ce4fb6 a"),n=document.querySelector("#component-48ee4230-fb6a-11e9-9559-992548e36765 div"),o=document.querySelector("#component-915a7340-fb6a-11e9-9559-992548e36765 div");if(e&&t&&n&&o){var i=e.cloneNode(!0),a=t.cloneNode(!0);n.replaceChild(i,n.childNodes[0]),o.replaceChild(a,o.childNodes[0])}}}(),function(){var e=-1<document.body.className.indexOf("schedule")||-1<document.body.className.indexOf("events"),t=-1<document.body.className.indexOf("blogs");if(e||t){var n=document.querySelector(".jaws-tv-schedules")||document.querySelector(".jaws-whats-on"),o=document.querySelector("#layout-13f8bdb5-76bd-431a-b240-627aaa2439ed"),i=document.querySelector("#layout-f9b491d0-69fc-4adb-b239-b69a18855db5"),a=document.querySelector("body > footer");if(e&&!n||t&&document.querySelector(".blog-entry"))return o&&(o.style.visibility="visible"),i&&(i.style.visibility="visible"),a&&(a.style.visibility="visible");var r=60;timer=setInterval(function(){r-=1,(e&&400<n.offsetHeight||t&&document.querySelector(".blog-entry")||r<0)&&(o&&(o.style.visibility="visible"),i&&(i.style.visibility="visible"),a&&(a.style.visibility="visible"),clearInterval(timer))},50)}}(),function(){if(-1!==document.body.className.indexOf("events")){var e,t=document.querySelector(".content-wrapper"),n=document.querySelector("#community_events_message");t&&(e=t.querySelector(".promo")),!e&&n?n.style.display="block":n.parentNode.parentNode.parentNode.parentNode.style.display="none"}}(),-1!==document.body.className.indexOf("signup")&&-1!==location.search.indexOf("newsletter=education")&&(o=document.getElementsByName("list_0")[0])&&(o.checked=!0),function(){if(-1!==location.pathname.indexOf("/support/klrn-endowment")){var c=document.querySelector("#rich-text-e68b6b10-a982-11e9-b5e3-a77ff72a2441");if(c){function d(e){return-1!==e.indexOf(" Jr")?e.replace(/\s+Jr/,"&nbsp;Jr"):-1!==e.indexOf(" (")?e.replace(/\s+\(/,"&nbsp;("):e}function u(e){return e.replace("KLRN Staff","KLRN&nbsp;Staff")}var m=document.createElement("div"),p={version:"2019-10-03-0",getFile:"https://pbs.klrn.org/bento/data/get-data.php?file=memorials&type=csv",date:this.date||new Date,update:function(){var e,t=this.date;return(e=(e=new Date(t.setDate(t.getDate()-t.getDay()+2))).toDateString().split(" "))[1]+"_"+e[2]+"_"+e[3]}},e=p.getFile+"&update="+p.update()+"&version="+p.version;klrn.ajaxLoad(e,function(e){var t="",n="",o=Date.parse(p.date),i=[],a=[],r=[];if(!((e=klrn.parseCSV(e)).length<1)){m.innerHTML="";for(var l=0,s=e.length;l<s;l++)i=e[l].EXPIRES.split("-"),Date.parse(i[1]+" "+i[0]+", "+i[2])<o||(e[l].TYPE.match(/memorial/i)&&a.push(e[l]),e[l].TYPE.match(/honor/i)&&r.push(e[l]));if(0<a.length){t='<h2 class="subhead">In Memory Of</h2>';for(l=0,s=a.length;l<s;l++)t+="<p><strong>"+d(a[l].NAME)+"</strong><br>"+u(a[l].FROM)+"</p>";m.innerHTML+=t}if(0<r.length){n='<h2 class="subhead">In Honor Of</h2>';for(l=0,s=r.length;l<s;l++)n+="<p><strong>"+d(r[l].NAME)+"</strong><br>"+u(r[l].FROM)+"</p>";m.innerHTML+=n}m.innerHTML+='<hr style="margin: 12px 0 16px;">',(0<a.length||0<r.length)&&c.firstElementChild&&c.firstElementChild.nextElementSibling&&c.insertBefore(m,c.firstElementChild.nextElementSibling)}})}}}(),function(){if(-1<location.pathname.indexOf("/blogs/")&&document.querySelector(".blog-entry-content")){var e=document.querySelector(".blog-entry-social");e&&(e.parentNode.insertBefore(e,e.parentNode.firstElementChild),e.classList.add("klrn_blog_post_social_icons"));var t,n,o,i,a=document.querySelectorAll(".blog-entry-content p");if(a)for(imageChecks=["https://www.klrn.org/s/cms/images/plugins/link.png","https://www.klrn.org/s/images/snippet.png"],textChecks=["","watch:","watch now:"],t=0;t<a.length;t++)o=(n=a[t]).firstChild&&"img"===n.firstChild.nodeName.toLowerCase()&&-1<imageChecks.indexOf(n.firstChild.src),i=-1<textChecks.indexOf(n.innerHTML.trim().toLowerCase()),(o||i)&&n.parentNode.removeChild(n)}}()},{}],6:[function(e,t,n){!function(){if("/"===document.location.pathname){var t="https://pbs.klrn.org/data/tv-schedule-get-time.php",e=document.querySelectorAll(".schedule");if(e){var f=document.querySelector(".table.schedule__table");if(f){function n(e){(e=JSON.parse(e))?(h=a?1900:parseInt(e.time),y=e.day,o=(new Date).getTime().toString(),l("https://pbs.klrn.org/data/tv-schedule-get-json.php?v="+o,r)):console.log("No getTimeAndDay data")}var h,y,o,v=e[0],b=e[1],i=document.querySelector(".schedule_primetime a"),a=!1,r=function(e){if((e=JSON.parse(e))||console.log("No parseSchedules data"),e.date!==y&&console.log("parseSchedules date does not match day"),e&&e.date===y){var t=null,n=e.schedToday.feeds.length;for(r=0;r<n;r++)"KLRN"===e.schedToday.feeds[r].short_name&&(t=r);if(null!==t){var o,i,a,r,l,s,c,d,u,m=e.schedToday.feeds[t].listings.length-1,p=e.schedToday.feeds[t].listings.concat(e.schedTomorrow.feeds[t].listings),g=0;for(r=0;r<p.length;r++)if(!(0===g&&r<m&&parseInt(p[r+1].start_time)<h+1)){if(4<(g+=1))break;c=parseInt(p[r].start_time),u=d=void 0,u=" AM",1200<=c&&(u=" PM"),1300<=c&&(c-=1200),c<100&&(c+=1200),o=(d=(d=c.toString()).slice(0,-2)+":"+d.slice(-2))+u,a=p[r].episode_title?": "+p[r].episode_title:"",i=p[r].title+a,(s=(l=f.insertRow()).insertCell()).className="schedule__time home-schedule__table-cell-time schedule__time--formatted",s.textContent=o,l.insertCell().textContent=i}b.style.display="none",v.style.display="block",f.style.minHeight="",klrn.fadeIn(v,1)}else console.log("feed data does not include KLRN channel")}},l=function(e,t){var n=new XMLHttpRequest;n.onreadystatechange=function(){4==this.readyState&&200==this.status&&t(this.responseText)},n.open("GET",e,!0),n.send()};l(t,n),v&&i&&i.addEventListener("click",function(e){e.preventDefault(),v.style.opacity="0",a=!a,f.style.minHeight=f.offsetHeight.toString()+"px",f.innerHTML="<tbody></tbody>",l(t,n),v.className=a?v.className.replace("show_current","show_primetime"):v.className.replace("show_primetime","show_current")})}else console.log("No scheduleTable HTML")}else console.log("No schedule HTML")}}()},{}],7:[function(e,t,n){klrn.youtubePlaylistFilters=function(e,t){return"PLO5rIpyd-O4G4C6Qw66Ft1YfK7MQZBYuP"===t?e.replace("Ready Set Grow Testimonial | ",""):"PLO5rIpyd-O4HxXSkCYvw-lN8Yo314u5Pu"===t?e.replace("Play & Learn Testimonial | ",""):"PLO5rIpyd-O4ERCTOKJmeKBRz-gYTYJYpH"===t?e.replace(/On [tT]he Record\s+\|\s+The Conversation Continues\s+\|\s+/,""):"PLO5rIpyd-O4EA5mYUxl1WbOaOl1kU08RB"===t?e.replace(/,\s20[12][0-9]/,""):"PLO5rIpyd-O4HysEnkRay0jUiQcL5eqvR3"===t?e.replace(/TAMIU Student Reporting Lab\s+\|\s+/,""):"PLO5rIpyd-O4FdYCi4DtZmkeIbp5Yn7Jp_"===t?e.replace("Healthy Kids Project | ",""):"PLO5rIpyd-O4GCnwfyIkdoLGs86KDqTcT_"===t?e.replace("El Proyecto Niños Sanos | ",""):e}},{}],8:[function(e,t,n){var I;(I=klrn).getFilter=function(e){if("/"!==e[0])return e;var t=e.split("/");return new RegExp(t[1],t[2])},I.getYoutubePlaylists=function(){var e=document.querySelectorAll(".klrn_youtube_playlist");if(!e.length)return!1;var t,n,o,i,a,r=[];for(t=0;t<e.length;t++)o=e[t].getAttribute("data-klrn-playlist-id")||"",showVideos=e[t].getAttribute("data-klrn-show-videos")||"",numberCols=e[t].getAttribute("data-klrn-number-cols")||"",i=e[t].getAttribute("data-klrn-text-to-use")||"",a=e[t].getAttribute("data-klrn-show-lines")||"",loadMore=e[t].getAttribute("data-klrn-load-more")||"",textFilter=e[t].getAttribute("data-klrn-text-filter")||"",n=[o.trim(),showVideos.trim(),numberCols.trim(),i.trim(),a.trim(),loadMore.trim(),textFilter],r.push(n),e[t].id=o;return r},I.getFile=function(e,t){var n=new XMLHttpRequest;n.onreadystatechange=function(){4==this.readyState&&200==this.status&&t&&t(JSON.parse(this.responseText))},n.open("GET",e,!0),n.send()},I.loadYoutubePlaylists=function(e){var t,n,o,i,a,r,l,s,c,d,u,m,p=document.querySelector("body");if(void 0!==e)for(e[0].constructor!==Array&&(e=[e]),document.getElementById("klrn_youtube_player_api")||((t=document.createElement("script")).setAttribute("type","text/javascript"),t.src="https://www.youtube.com/player_api",t.id="klrn_youtube_player_api",p.appendChild(t)),n=0;n<e.length;n++)i="#"+(o=e[n][0]),a=e[n][1],r=e[n][2],l=e[n][3],s=e[n][4],c=e[n][5],d=e[n][6],m="https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults="+a+"&playlistId="+o+"&key=AIzaSyDraaM_dJplqR3JbRtmx-HSIMfIZHTqXV4",u="klrn_youtube_playlist_module_"+n.toString(),window[u]=new Function("data",'return klrn.parseYoutubePlaylist(data, "'+i+'", "'+r+'", "'+l+'", "'+s+'", "'+c+'", "'+d+'", "'+m+'")'),I.getFile(m,window[u])},I.parseYoutubePlaylist=function(e,t,n,o,i,a,r,l){var s,c,d,u,m,p,g,f,h,y,v,b,k,w,C,L,_,N,S,E,A,O,q=document.querySelector(t),x=t.slice(1),T=!1,P=document.createDocumentFragment();for(r=r&&I.getFilter(r),m=12/(u=parseInt(n)),p=0;p<e.items.length;p++)e.items[p].snippet.thumbnails&&(s=e.items[p].snippet.thumbnails.high.url,videoID=e.items[p].snippet.resourceId.videoId,d="descriptions"===(o=o.toLowerCase())|"description"===o?(c=e.items[p].snippet.description," klrn_show_lines_3"):(c=e.items[p].snippet.title," klrn_show_lines_2"),r?c=c.replace(r,""):"function"==typeof I.youtubePlaylistFilters&&(c=I.youtubePlaylistFilters(c,x)),i&&(d=" klrn_show_lines_"+i),p%u==0&&((g=document.createElement("div")).className="row-fluid","none"!==q.style.display&&(g.style.opacity=0,g.classList.add("fade-in"),T=!0)),(f=document.createElement("div")).className="span"+m+" column-"+m,(h=document.createElement("div")).className="component",(y=document.createElement("div")).className="video-component column-"+m,(v=document.createElement("div")).className="video-container__wrapper",(b=document.createElement("div")).className="youtube-wrapper video-container",b.className+=" embed_wrapper ratio_16-9 youtube-player",b.style.backgroundImage="url("+s+")",b.addEventListener("click",I.loadVideo(videoID)),(k=document.createElement("div")).className="video-info",(w=document.createElement("div")).className="ellipsis"+d,(C=document.createElement("h3")).appendChild(document.createTextNode(c)),C.className="title",(L=document.createElement("button")).className="ytp-large-play-button ytp-button temp",L.setAttribute("aria-label","Play"),L.innerHTML='<svg height="100%" version="1.1" viewBox="0 0 68 48" width="100%"><path class="ytp-large-play-button-bg" d="M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.64-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z" fill="#212121" fill-opacity="0.8"></path><path d="M 45,24 27,14 27,34" fill="#fff"></path></svg>',w.appendChild(C),k.appendChild(w),b.appendChild(L),v.appendChild(b),v.appendChild(k),y.appendChild(v),h.appendChild(y),f.appendChild(h),g.appendChild(f),P.appendChild(g));if("yes"===a.toLowerCase()&&"nextPageToken"in e&&(_="&pageToken=",-1===l.indexOf(_)?l+=_+e.nextPageToken:l=l.slice(0,l.indexOf(_))+_+e.nextPageToken,A="klrn_youtube_playlist_module_"+x+"_"+e.nextPageToken,window[A]=new Function("data",'return klrn.parseYoutubePlaylist(data, "'+t+'", "'+n+'", "'+o+'", "'+i+'", "'+a+'", "'+r+'", "'+l+'")'),(N=document.createElement("div")).id="load_more_"+x,N.className="load_more_videos_div",(E=document.createElement("a")).className="klrn_button read-more__link",E.innerHTML="Load More Videos",E.addEventListener("click",function(){I.getFile(l,window[A])}),"none"!==q.style.display&&(N.style.opacity=0,N.classList.add("fade-in")),N.appendChild(E),P.appendChild(N)),(S=document.getElementById("load_more_"+x))&&S.parentNode.removeChild(S),q.appendChild(P),"none"===q.style.display&&(q.parentElement.style.marginTop="0",q.style.display=""),T)for(O=q.querySelectorAll(".fade-in"),console.log(O),p=0;p<O.length;p++)klrn.fadeIn(O[p],1),O[p].classList.remove("fade-in")}},{}],9:[function(e,t,n){var s;(s=klrn).youtubeVideos={getObjects:[],setObject:function(e){var t=new YT.Player(e,{events:{onReady:this.onPlayerReady,onStateChange:this.onPlayerStateChange}});return this.getObjects.push(t),t},onPlayerReady:function(e){dataLayer.push({event:"gaEvent",eventCategory:"YouTube Videos on KLRN.org",eventAction:"Plays",eventLabel:e.target.getVideoData().title,eventNonInteraction:!1})},onPlayerStateChange:function(e){if(e.data==YT.PlayerState.PLAYING)for(i=0;i<s.youtubeVideos.getObjects.length;i++)s.youtubeVideos.getObjects[i].h.id!==e.target.h.id&&s.youtubeVideos.getObjects[i].pauseVideo()},stopVideos:function(){var e;for(e=0;e<this.getObjects.length;e++)this.getObjects[e].stopVideo()},pauseVideos:function(){var e;for(e=0;e<this.getObjects.length;e++)this.getObjects[e].pauseVideo()}},s.loadVideo=function(l){return function(e){e.target.removeEventListener(e.type,arguments.callee);var t=e.target;"path"===e.target.tagName.toLowerCase()?t=e.target.parentNode.parentNode.parentNode:"svg"===e.target.tagName.toLowerCase()?t=e.target.parentNode.parentNode:"button"===e.target.tagName.toLowerCase()&&(t=e.target.parentNode);var n,o=document.createElement("iframe"),i="https://www.youtube.com/embed/"+l+"/?rel=0&enablejsapi=1&version=3&autohide=1&showinfo=0&html5=1&playsinline=1",a=0,r=function(e){60!==a&&(e&&"function"==typeof e.playVideo?e.playVideo():(a+=1,setTimeout(function(){r(e)},50)))};o.className="youtube-player",o.id=l,o.setAttribute("frameborder","0"),o.setAttribute("allowfullscreen",""),o.setAttribute("marginwidth","0"),o.setAttribute("marginheight","0"),o.setAttribute("scrolling","no"),o.setAttribute("webkit-playsinline",""),o.setAttribute("allow","autoplay"),o.src=i,t.innerHTML="",t.appendChild(o),n=s.youtubeVideos.setObject(l),r(n)}}},{}],10:[function(e,t,n){var y;(y=klrn).loadYoutubeVideos=function(){var e=document.querySelectorAll(".klrn_youtube_video");if(!e.length)return!1;var t,n,o,i,a=document.querySelector("body");for(document.getElementById("klrn_youtube_player_api")||(elem=document.createElement("script"),elem.setAttribute("type","text/javascript"),elem.src="https://www.youtube.com/player_api",elem.id="klrn_youtube_player_api",a.appendChild(elem)),t=0;t<e.length;t++)n=e[t].getAttribute("data-klrn-video-id")||"",o=e[t].getAttribute("data-klrn-text-to-use")||"",i=e[t].getAttribute("data-klrn-show-lines")||"",n=n.trim(),o=o.trim(),i=i.trim(),e[t].id="klrn_video_"+n,y.parseYoutubeVideo(n,o,i)},y.parseYoutubeVideo=function(e,t,n){var o,i,a,r,l,s,c,d,u,m,p,g,f=document.querySelector("#klrn_video_"+e),h=document.createDocumentFragment();o="https://i.ytimg.com/vi/"+e+"/maxresdefault.jpg",(t=t.toLowerCase())&&(i=" klrn_show_lines_"+n),(a=document.createElement("div")).className="row-fluid",(r=document.createElement("div")).className="span12 column-12",(l=document.createElement("div")).className="component",(s=document.createElement("div")).className="video-component column-12",(c=document.createElement("div")).className="video-container__wrapper",(d=document.createElement("div")).className="youtube-wrapper video-container",d.className+=" embed_wrapper ratio_16-9 youtube-player",d.style.backgroundImage="url("+o+")",d.addEventListener("click",y.loadVideo(e)),t&&((u=document.createElement("div")).className="video-info",(m=document.createElement("div")).className="ellipsis"+i,(p=document.createElement("h3")).appendChild(document.createTextNode(t)),p.className="title"),(g=document.createElement("button")).className="ytp-large-play-button ytp-button temp",g.setAttribute("aria-label","Play"),g.innerHTML='<svg height="100%" version="1.1" viewBox="0 0 68 48" width="100%"><path class="ytp-large-play-button-bg" d="M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.64-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z" fill="#212121" fill-opacity="0.8"></path><path d="M 45,24 27,14 27,34" fill="#fff"></path></svg>',t&&(m.appendChild(p),u.appendChild(m)),d.appendChild(g),c.appendChild(d),t&&c.appendChild(u),s.appendChild(c),l.appendChild(s),r.appendChild(l),a.appendChild(r),h.appendChild(a),f.appendChild(h),"none"===f.style.display&&(f.parentElement.style.marginTop="0",f.style.display="")}},{}],11:[function(e,t,n){var o,i,a,r,l,s,c,d;href=location.href.split("&_ga=")[0],history.replaceState({},location.href,href),o=document.location.pathname,i="","www.klrn.org"===location.host||"klrn.bento-live.pbs.org"===location.host?"/"===o?i+="home":0<o.length&&(i+=o.split("/").join(" ").trim()):"bento.pbs.org"===location.host&&(i+=klrn.pages[o]),0<i.length&&(document.body.className+=" "+i),function(){var e,t=document.links,n=t.length;if(0!==n)for(String.prototype.endsWith||(String.prototype.endsWith=function(e,t){return(void 0===t||t>this.length)&&(t=this.length),this.substring(t-e.length,t)===e}),e=0;e<n;e++)(-1<t[e].href.indexOf("klrn_style=link")||t[e].innerHTML.trim().endsWith("&gt;"))&&(t[e].className+=" klrn_button read-more__link",t[e].innerHTML.trim().endsWith("&gt;&gt;")?(t[e].className+=" klrn_button_display_block",t[e].innerHTML=t[e].innerHTML.replace("&gt;&gt;","").trim()):t[e].innerHTML.trim().endsWith("&gt;")&&(t[e].innerHTML=t[e].innerHTML.replace("&gt;","").trim()))}(),function(){var e,t=document.querySelectorAll(".text-container p");if(t)for(e=0;e<t.length;e++)"&nbsp;"===t[e].innerHTML.trim()&&(t[e].style.marginBottom="0")}(),function(){var e,t=document.querySelectorAll(".text-container hr:first-child");if(t)for(e=0;e<t.length;e++)t[e].parentNode&&t[e].parentNode.parentNode&&t[e].parentNode.parentNode.parentNode&&t[e].parentNode.parentNode.parentNode.classList.contains("component")&&(t[e].parentNode.parentNode.parentNode.style.marginTop="16px")}(),a=klrn,(c=document.querySelectorAll(".text-container .image-style-align-left > img, .text-container .image-style-align-right > img"))&&(a.manageFloatedImages=function(){for(r=0;r<c.length;r++)l=c[r].parentNode.parentNode.offsetWidth,s=parseInt(c[r].naturalWidth),l-s<191?c[r].parentNode.classList.add("klrn_text_container_mobile_image_block"):c[r].parentNode.classList.remove("klrn_text_container_mobile_image_block")}),function(){var e=document.querySelectorAll('head link[href*="favicon"]');e&&e.forEach(function(e){e.remove()});var t=document.createElement("link");t.href="https://d1qbemlbhjecig.cloudfront.net/prod/filer_public/klrn-bento-live-pbs/global/65c49cf27f_klrn_favicon.png",t.type="image/png",t.rel="icon",document.querySelector("head").appendChild(t)}(klrn),(d=jQuery)(document).ready(function(){klrn.manageFloatedImages(),window.dataLayer=window.dataLayer||[],klrn.loadYoutubeVideos();var e=klrn.getYoutubePlaylists();e&&klrn.loadYoutubePlaylists(e,"klrn");var t=!1;klrn.throttleAnimation(!1,klrn.manageFloatedImages),d(window).on("resize orientationchange",function(){t||requestAnimationFrame(function(){klrn.manageFloatedImages(),t=!1}),t=!0})}),$("body").fadeTo(500,1,function(){document.getElementsByTagName("html")[0].style.backgroundColor="transparent"}),function(t){var e,n,o,i,a,r=document.querySelectorAll(".klrn-tab-fade-in");if(r)for(n=0;n<r.length&&(e=r[n].querySelectorAll("li a"))&&(o=e[0].href.split("#"))&&(i=document.querySelector("#"+o[1]));n++)for(a=0;a<e.length;a++)e[a].addEventListener("click",function(e){i.parentNode.style.opacity="0",t.fadeIn(i.parentNode,.75)})}(klrn),function(){if(-1!==(e=location.search).indexOf("utm_campaign=")){var e,t,n,o={},i=(e=e.slice(1).split("&")).length,a="";for(t=0;t<i;t++)o[(n=e[t].split("="))[0]]=n[1];if(a+=o.hasOwnProperty("utm_source")?o.utm_source:"",a+=o.hasOwnProperty("utm_medium")?","+o.utm_medium:",",a+=o.hasOwnProperty("utm_campaign")?","+o.utm_campaign:"",a+=o.hasOwnProperty("content")?","+o.content:"",o.hasOwnProperty("utm_campaign")){var r=new Date;r.setTime(r.getTime()+158112e5).toString();var l="expires="+r;document.cookie="klrnCampaign="+a+"; "+l+"; path=/; domain=klrn.org"}}}()},{}],12:[function(e,t,n){window.klrn=window.klrn||{},e("./modules/polyfills"),e("./modules/klrn-helpers"),e("./modules/whats-on"),e("./modules/youtube-video"),e("./modules/youtube-playlist-filters"),e("./modules/youtube-playlist"),e("./modules/youtube-video-loader"),e("./ready"),e("./modules/specific-pages"),e("./modules/gtm-event-tracking"),e("./modules/gtm-event-tracking-pages")},{"./modules/gtm-event-tracking":2,"./modules/gtm-event-tracking-pages":1,"./modules/klrn-helpers":3,"./modules/polyfills":4,"./modules/specific-pages":5,"./modules/whats-on":6,"./modules/youtube-playlist":8,"./modules/youtube-playlist-filters":7,"./modules/youtube-video":10,"./modules/youtube-video-loader":9,"./ready":11}]},{},[12]);