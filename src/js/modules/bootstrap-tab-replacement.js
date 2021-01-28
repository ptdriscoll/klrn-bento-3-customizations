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