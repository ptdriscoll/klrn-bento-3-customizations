/*
Event tracking module using Google Analytics 4 and Tag Manager dataLayer variables.
GA4 custom events = sponsor_click, sponsor_impression, internal_click.
GA4 customer parameters = event_category, event_label.
GA4 enhanced parameter = link_url.
GTM custom events and triggers = sponsor_click, sponsor_impression, internal_click.
GTM variables = eventCategory, eventAction, eventLabel, linkUrl.
*/

(function (exports) {
  /* 
  Pushes tracking variables to GTM dataLayer.

  @info: dictionary of event tracking data:
    {event, eventCategory, eventLabel, linkUrl, target}

  -event is required, and target is required for click events
  -any others not set are handled as undefined
  -target is a dom element, the rest are strings
  */
  exports.ga4trackEvent = function (info) {
    //for testing, toggle whether clicks should go through or not
    const test = false;
    const logs = false;

    const outboundLink = exports.checkOutboundLink(info.linkUrl);
    const options = {
      event: info.event,
      eventCategory: 'eventCategory' in info ? info.eventCategory : undefined,
      eventLabel: 'eventLabel' in info ? info.eventLabel : undefined,
      linkUrl: 'linkUrl' in info ? info.linkUrl : undefined,
    };

    //if this is not a click event, push to dataLayer and return
    if (!info.event.includes('_click')) {
      if (test) {
        if (logs) console.log('\nSETTING IMPRESSION EVENT');
        if (logs) console.log(options);
      }
      return dataLayer.push(options);
    }

    //if this is a click event, and it goes to a new page, set click handler
    if (
      info.event.includes('_click') &&
      info.target &&
      !info.target.href.includes(location.hostname + '/#')
    ) {
      info.target.addEventListener('click', (event) => {
        if (test) {
          event.preventDefault();
          if (logs) console.log('\nSETTING CLICK EVENT');
          if (logs) console.log(options);
        }

        if (outboundLink) {
          event.preventDefault(); //prevent navigation, so GTM can record event
          if (!test) {
            //when done, redirect
            options['eventCallback'] = () => {
              window.open(outboundLink);
            };
            options['eventTimeout'] = 100;
          }
          dataLayer.push(options);
          //if GTM fails, redirect anyway
          if (!test) {
            setTimeout(() => {
              window.open(outboundLink);
            }, 150);
          }
        } else dataLayer.push(options); //just push if this is an internal link
      });
    }
  };

  /*
  For group of ad tiles not displayed on load when trackSchedulePageSponsors runs.
  Adds event listeners to check when they're in view, tracks relevant views, and
  removes an event listener after its ad is viewed.

  @info: array of dictionary items, each item gets passed to exports.ga4trackEvent(info)
    dict item: {event, eventCategory, eventLabel, linkUrl, target}
  @func: string used as dictionary key to get callback function for event listeners
    options: 'singleTile', 'schedulePage'
  */
  exports.ga4trackWhenInView = function (info, func) {
    let callbacks = {};
    let ticking = false;
    let scrollHandler, resizeHandler, orientationchangeHandler; //for specific callbacks

    callbacks.singleTile = function () {
      if (exports.inView(info.target.firstElementChild, 0.5)) {
        //track impression
        exports.ga4trackEvent(info);

        //remove event listeners so impression will only be tracked once
        window.removeEventListener('scroll', scrollHandler);
        window.removeEventListener('resize', resizeHandler);
        window.removeEventListener(
          'orientationchange',
          orientationchangeHandler
        );
      }
    };

    //handles how to track last two ads, or their duplicates, on schedule page
    callbacks.schedulePage = function () {
      //if ad 0 or its duplicate ad 2 is in view,
      //then ad 1 or, respectively, its duplicate ad 3 will also be in view
      //so just check if ad 0 or ad 2 is in view
      const AdInView = exports.inView(info[0].target.firstElementChild, 0.5);
      const AdDupInView = exports.inView(info[2].target.firstElementChild, 0.5);
      
      //if a target ad or its duplicate is in view, track both ad 0 and ad 1
      //but do not replicate tracking their duplicates, ad 2 and ad 3
      if (AdInView || AdDupInView) {
        //track views
        exports.ga4trackEvent(info[0]);
        exports.ga4trackEvent(info[1]);

        //remove event listeners so views will only be tracked once
        window.removeEventListener('scroll', scrollHandler);
        window.removeEventListener('resize', resizeHandler);
        window.removeEventListener(
          'orientationchange',
          orientationchangeHandler
        );
      }
    };

    //add event listeners for various browser actions
    window.addEventListener(
      'scroll',
      (scrollHandler = function () {
        exports.throttleAnimation(ticking, callbacks[func]);
      })
    );
    window.addEventListener(
      'resize',
      (resizeHandler = function () {
        exports.throttleAnimation(ticking, callbacks[func]);
      })
    );
    window.addEventListener(
      'orientationchange',
      (orientationchangeHandler = function () {
        exports.throttleAnimation(ticking, callbacks[func]);
      })
    );
  };

  //helper function to check outbound links - returns string link or bool false
  exports.checkOutboundLink = function (href) {
    if (
      !href.includes('klrn.bento-live.pbs.org') &&
      !href.includes('klrn.org')
    ) {
      return href;
    }
    return false;
  };
})(klrn); //end namespace to add modules to klrn object
