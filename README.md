# KLRN Bento 3 Customizations 

This is a development environment to customize and add components to San Antonio's KLRN.org website, which is built with PBS' Bento 3 platform. Bento 3 uses a PBS version of Bootstrap 2 and other front-end styles and scripts.

![KLRN.org home page](images/KLRN-home-page.jpg)

### Code embedded in header

Custom CSS and JavaScript is loaded using JavaScript placed into a Bento HTML Embed Code in the global HEADER. This HTML component is archived at **/src/html/global-embed-CSS.htm**.

A JavaScript variable near the top can be set to enable either development or production code:   

- `klrn.env.in = 'dev'`: Imports CSS and JavaScript from **/src**   
- `klrn.env.in = 'prod'`: Loads bundled (but not minified) CSS and JavaScript from **/dist** 
- `klrn.env.in = 'live'`: Loads bundled and minified CSS and JavaScript that has been manually added to Bento Files under **/global/css and /global/js**  

Another JavaScript variable that follows sets conditions for the development environment. For example:

- `klrn.env.inDev = path.indexOf('/') > -1`: Limits development code to only home page, while other pages use live code
- `klrn.env.inDev = path.indexOf('/videoapp/') > -1 || path.indexOf('/') > -1`: Limits development code to two specific pages

Two more JavaScript variables point to live CSS and JavaScript files, and these variables have to be updated each time a new file replaces an old file in Bento Files at either **/global/css** or **/global/js**:

- `klrn.env.liveCSS = '/dcad12d4b2_styles.css'`
- `klrn.env.liveJS = '/1eb74bd985_scripts.js'`

Temporary CSS fixes can be added to a `<style>` block at the bottom.

### Code embedded in footer

Custom JavaScript finishes loading here using a script placed into a Bento HTML Embed Code in the global FOOTER. This HTML component is archived at **/src/html/global-embed-JS.htm**.

A variable to set whether to load development or production code is in the global HEADER (see "Code embedded in header"). For development code, a "require" function is included here to load individual scripts. Temporary JavaScript fixes can be added at the bottom. 

### Other code modules

Other modules placed inside Bento HTML Embed Code blocks are archived at **/scr/html**. CSS modules that are bundled into main styles - some paired with HTML modules - are at **/src/css/modules**. JavaScript modules bundled in the main script - some paired with HTML, and others standalone - are at **/src/js/modules**.

Modules range from YouTube loaders and players, to simpler iframe embeds, and even a Python script to generate HTML. The more involved modules are self-documenting - here are some of those:

- **What’s on Now** - calls cached results from a PBS TV schedule API and displays results 
    - whats-on.htm
    - whats-on.css
    - whats-on.js
- **YouTube playlist** - loads YouTube playlists
    - youtube-playlist.htm 
    - youtube-videos.css
    - youtube-playlist.js
    - youtube-playlist-filters.js
    - youtube-video-loader.js
- **YouTube Video** - extends parts of YouTube playlist to load standalone videos
    - youtube-video.htm 
    - youtube-video.js
- **Event tracking** - uses Google Tag Manager to track clicks and views on sponsor modules and other page sections 
    - gtm-event-tracking.js
    - gtm-event-tracking-pages.js

### NPM scripts

`npm run build` bundles and minifies CSS and JavaScript in **/src/css** and **/src/js** and places them in **/dist/css** and **/dist/js**. The resulting **styles.css** and **scripts.js** are manually uploaded to Bento Files under **/global/css** and **/global/js**. After uploading, two variables in the global HEADER need to be re-pointed to the new files (see "Code embedded in header"), since Bento prepends file names to make them unique.  

### Folders and files 

*Production code:*

- **/dist**
    - **/css**
	    - **bundle.css:** All CSS code bundled into one file
		- **styles.css:** All CSS code bundled and minified, for loading into website
    - **/js**
	    - **bundle.js:** All JavaScript code bundled into one file
		- **styles.js:** All JavaScript code bundled and minified, for loading into website		
		
*Development code:*

- **/src** 
    - **/css** 
        - **custom.css:** Main custom CSS
        - **styles.css:** Imports all CSS files into one file for loading into website during development   
        - **/modules:** Contains additional custom CSS files 
    - **/html:** Contains HTML components, including Python scripts to generate them, that are manually added as Bento Embed Code components  
    - **/js**
        - **ready.js:** Main custom JavaScript
        - **scripts.js:** Uses "require" function (see "Code embedded in footer" above) to load all JavaScript files into website during development
		- **/modules:** Contains additional custom JavaScript files
		
*Other folders and files:*

- **/data:** Not included here, and used in production to store data files loaded into website 
- **/downloads:** Not included here, and used in production to store PDF files loaded into website
- **package.json:** NPM scripts to load devDependencies, and create production-ready CSS and JavaScript 
- **package-lock.json:** An auto-generated file that locks dependencies 
- **.gitignore:** Specified folders and files that Git should ignore

### References

- https://www.klrn.org/home/
- https://docs.pbs.org/display/B3
<!--
- https://markdownlivepreview.com/
- https://dillinger.io/ 
-->