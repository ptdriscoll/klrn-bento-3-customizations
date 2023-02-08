//event tracking module, using Google Tag Manager dataLayer variables and a generic trigger and tag
//GTM variables = eventCategory, eventAction, eventLabel, eventValue, eventNonInteraction
//GTM custom event trigger = gaEvent, and GTM tag's track type = event

(function (exports) {
  //accepts dictionary of event tracking info, handling these fields as strings:
  //eventCategory, eventAction, eventLabel, eventValue, eventNonInteraction and outboundLink
  //an additional field, called target, is a dom element
  //any fields not set are handled as undefined - target is required for click events
  exports.trackEvent = function (info) {
    //for testing, toggle whether clicks should go through or not
    var test = false;
    var logs = false;

    var outboundLink = 'outboundLink' in info ? info.outboundLink : undefined;
    var options = {
      event: 'gaEvent',
      eventCategory: 'eventCategory' in info ? info.eventCategory : undefined,
      eventAction: 'eventAction' in info ? info.eventAction : undefined,
      eventLabel: 'eventLabel' in info ? info.eventLabel : undefined,
      eventValue: 'eventValue' in info ? info.eventValue : undefined,
      eventNonInteraction:
        'eventNonInteraction' in info ? info.eventNonInteraction : undefined,
    };

    //if this is a view event, push to dataLayer and return
    if (info.eventAction === 'Views') {
      if (test) {
        if (logs) console.log('\nSETTING VIEW EVENT');
        if (logs) console.log(options);
      }
      return dataLayer.push(options);
    }

    //if this is a click event, and it goes to a new page, set click handler
    if (
      info.eventAction.indexOf('Clicks') !== -1 &&
      info.target &&
      info.target.href.indexOf(location.hostname + '/#') === -1
    ) {
      info.target.addEventListener('click', function (event) {
        if (test) {
          event.preventDefault();
          if (logs) console.log('\nSETTING CLICK EVENT');
          if (logs) console.log(options);
        }

        if (outboundLink) {
          event.preventDefault(); //prevent navigation to outboundLink, so GTM can record event
          if (!test)
            options['eventCallback'] = function () {
              window.open(outboundLink);
            }; //when done, redirect
          if (!test) options['eventTimeout'] = 100;
          dataLayer.push(options);
          if (!test)
            setTimeout(function () {
              window.open(outboundLink);
            }, 150); //if GTM fails, redirect anyway
        } else dataLayer.push(options); //just push to dataLayer if this is an internal link
      });
    }
  };

  //for group of ad tiles not displayed on load when trackSchedulePageSponsors runs
  //adds event listeners to check when they're in view, tracks relevant views, and removes event listeners
  exports.trackWhenInView = function (info, func) {
    var callbacks = {};
    var ticking = false;
    var scrollHandler, resizeHandler, orientationchangeHandler;

    callbacks.singleAd = function () {
      if (klrn.inView(info.target.firstElementChild, 0.5)) {
        //track view
        exports.trackEvent(info);

        //remove event listeners so view will only be tracked once
        window.removeEventListener('scroll', scrollHandler);
        window.removeEventListener('resize', resizeHandler);
        window.removeEventListener(
          'orientationchange',
          orientationchangeHandler
        );
      }
    };

    //handles pair of ads on schedule page, and their duplicates
    callbacks.schedulePage = function () {
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
        window.removeEventListener(
          'orientationchange',
          orientationchangeHandler
        );
      }
    };

    window.addEventListener(
      'scroll',
      (scrollHandler = function () {
        klrn.throttleAnimation(ticking, callbacks[func]);
      })
    );
    window.addEventListener(
      'resize',
      (resizeHandler = function () {
        klrn.throttleAnimation(ticking, callbacks[func]);
      })
    );
    window.addEventListener(
      'orientationchange',
      (orientationchangeHandler = function () {
        klrn.throttleAnimation(ticking, callbacks[func]);
      })
    );
  };

  //helper function to check outbound links - returns string link or bool false
  //added to ga4-event-tracking module instead
  /*
  exports.checkOutboundLink = function (href) {
    if (
      href.indexOf('klrn.bento-live.pbs.org') === -1 &&
      href.indexOf('klrn.org') === -1
    ) {
      return href;
    }
    return false;
  };
  */
})(klrn); //end namespace to add modules to klrn object
