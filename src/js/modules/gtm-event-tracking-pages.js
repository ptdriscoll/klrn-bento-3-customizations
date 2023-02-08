//event tracking module for specific pages, using gtm-event-tracking module and Google Tag Manager
//GTM variables = eventCategory, eventAction, eventLabel, eventValue, eventNonInteraction

(function (exports) {
  exports.trackSchedulePageSponsors = function () {
    //return if not TV schedule page
    if (location.pathname.indexOf('/schedule') === -1) return;

    var query =
      '#layout-4936e49d-c107-4949-bca0-f3d50f08c84f a, #layout-13f8bdb5-76bd-431a-b240-627aaa2439ed a';
    var sponsors = document.querySelectorAll(query);
    if (!sponsors) return;

    var i,
      img,
      isOutboundLink,
      eventInfo,
      isDisplayed,
      viewsNotTracked = [];

    for (i = 0; i < sponsors.length; i++) {
      img = sponsors[i].querySelector('img');
      if (!img) break;
      isOutboundLink = exports.checkOutboundLink(sponsors[i].href);

      eventInfo = {
        eventCategory: isOutboundLink ? 'Outbound Links' : 'Internal Links',
        eventAction: 'Views',
        eventLabel: img.alt,
        target: sponsors[i],
        outboundLink: isOutboundLink,
        eventNonInteraction: true, //a view is not a page interaction
      };

      //track views if ad is displayed at top, else when it enters into view
      isDisplayed =
        getComputedStyle(sponsors[i].parentNode.parentNode.parentNode.parentNode)
          .display !== 'none';
      if (i < 4 && isDisplayed) exports.trackEvent(eventInfo);
      else viewsNotTracked.push(Object.assign({}, eventInfo));

      //now set up as click tracking event
      eventInfo['eventAction'] = 'Clicks';
      eventInfo['eventNonInteraction'] = false; //make sure click is a page interaction
      exports.trackEvent(eventInfo); //track clicks of sponsor ad
    }

    //if page opened in mobile, then two ads or their duplicates have not been in view yet
    if (viewsNotTracked.length === 4)
      exports.trackWhenInView(viewsNotTracked, 'schedulePage');
  };

  exports.trackSidebar = function () {
    //return if home page
    if (location.pathname === '/') return;

    //return if there is no sidebar on page
    var sidebar = document.querySelector('.rail-wrapper');
    if (!sidebar) return;

    var sponsor_selectors =
      '#component-487eb930-f29a-11e8-ac11-cf036755f6fe a,' +
      '#component-19fb5ee0-f369-11e8-90bb-7b9969ce1070 a';

    var sponsors = sidebar.querySelectorAll(sponsor_selectors);
    var buttons = sidebar.querySelectorAll(
      '#component-18114b10-e795-11e8-bc4d-edfdc25f8ca9 a'
    );

    var eventInfo = {
      eventCategory: 'Sidebar',
      eventAction: 'Clicks',
      eventLabel: undefined,
      target: undefined,
      outboundLink: undefined,
      eventNonInteraction: false,
    };

    var i, imgAlt, isOutboundLink;

    //Sidebar Buttons
    eventInfo['eventAction'] = 'Clicks - Sidebar Buttons';

    for (i = 0; i < buttons.length; i++) {
      eventInfo['eventLabel'] = buttons[i].textContent.trim();
      eventInfo['target'] = buttons[i];
      eventInfo['outboundLink'] = exports.checkOutboundLink(buttons[i].href);
      exports.trackEvent(eventInfo);
    }

    //Sidebar Sponsors
    for (i = 0; i < sponsors.length; i++) {
      //don't track ad if display = none
      if (
        window.getComputedStyle(sponsors[i].parentNode.parentNode).display ===
        'none'
      )
        continue;

      if (sponsors[i].querySelector('img'))
        imgAlt = sponsors[i].querySelector('img').alt.trim();
      eventInfo['eventLabel'] = imgAlt ? imgAlt : 'image alt tag not set';
      eventInfo['target'] = sponsors[i];
      isOutboundLink = exports.checkOutboundLink(sponsors[i].href);
      eventInfo['outboundLink'] = isOutboundLink;

      //track views as a sponsor ad
      eventInfo['eventCategory'] = isOutboundLink
        ? 'Outbound Links'
        : 'Internal Links';
      eventInfo['eventAction'] = 'Views';
      eventInfo['eventNonInteraction'] = true; //make sure view is not a page interaction
      if (klrn.inView(eventInfo.target.firstElementChild, 0.5))
        exports.trackEvent(eventInfo);
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
  };

  exports.trackHomePageSlider = function () {
    //return if not home page
    if (location.pathname !== '/') return;

    var slides = document.querySelectorAll(
      '#component-1a1b52f0-d9f6-11e7-a670-7f78010a7152 a'
    );
    if (!slides) return;

    var i,
      len = slides.length,
      eventInfo,
      eventLabel;

    for (i = 0; i < len; i += 1) {
      if (i % 3 === 0) eventLabel = slides[i].textContent;
      eventInfo = {
        eventCategory: 'Home Page Slider',
        eventAction: 'Clicks',
        eventLabel: eventLabel,
        target: slides[i],
        eventNonInteraction: false,
      };
      exports.trackEvent(eventInfo);
    }
  };

  exports.trackHomePagePromos = function () {
    //return if not home page
    if (location.pathname !== '/') return;

    var topPromos = document.querySelectorAll(
      '#column-224b9950-b60d-11e8-8b93-9145e1056ee0 .promo'
    );
    var whatsOnNow = document.querySelectorAll(
      '#column-0fa9631a-e8ba-4117-adae-751046aae720 a'
    );
    var sponsorTiles = document.querySelectorAll(
      '#column-cef6f81b-94e3-4973-8b54-64598726ce08 a'
    );
    var showTiles = document.querySelectorAll(
      '#layout-d44bc274-ff76-4587-a53a-844ddf1c15db a'
    );
    var bottomPromos = document.querySelectorAll(
      '#layout-733a72c0-588a-4c4c-8056-3368cc38f06e .promo'
    );

    var eventInfo = {
      eventCategory: 'Home Page Promos',
      eventAction: 'Clicks',
      eventLabel: undefined,
      target: undefined,
      outboundLink: undefined,
      eventNonInteraction: false,
    };

    var i, j, links, eventLabel, imgAlt, isOutboundLink, readMoreLink;

    //Top Promos
    eventInfo['eventAction'] = 'Clicks - Home Page Top Promos';

    for (i = 0; i < topPromos.length; i++) {
      links = topPromos[i].querySelectorAll('a');
      if (!links) break;

      if (topPromos[i].querySelector('img'))
        eventLabel = topPromos[i].querySelector('img').alt.trim();
      if (!eventLabel) {
        eventLabel = topPromos[i].querySelector('.read-more__link');
        eventLabel = eventLabel
          ? eventLabel.textContent.trim()
          : 'image or link text not set';
      }

      eventInfo['eventLabel'] = eventLabel;
      eventInfo['outboundLink'] = exports.checkOutboundLink(links[0].href);

      //set click tracking for each link in promo
      for (j = 0; j < links.length; j++) {
        eventInfo['target'] = links[j];
        exports.trackEvent(eventInfo);
      }
    }

    //What's On Now
    eventInfo['eventAction'] = "Clicks - Home Page What's On Now";
    eventInfo['outboundLink'] = undefined;

    for (i = 0; i < whatsOnNow.length; i++) {
      eventInfo['eventLabel'] =
        i === 0 ? 'On Primetime | On Now' : whatsOnNow[i].textContent;
      eventInfo['target'] = whatsOnNow[i];
      exports.trackEvent(eventInfo);
    }

    //Sponsor Tiles
    eventInfo['eventAction'] = 'Clicks - Home Page Sponsors';

    for (i = 0; i < sponsorTiles.length; i++) {
      if (sponsorTiles[i].querySelector('img'))
        imgAlt = sponsorTiles[i].querySelector('img').alt.trim();
      eventInfo['eventLabel'] = imgAlt ? imgAlt : 'image alt tag not set';
      eventInfo['target'] = sponsorTiles[i];
      isOutboundLink = exports.checkOutboundLink(sponsorTiles[i].href);
      eventInfo['outboundLink'] = isOutboundLink;

      //track views as a sponsor ad
      eventInfo['eventCategory'] = isOutboundLink
        ? 'Outbound Links'
        : 'Internal Links';
      eventInfo['eventAction'] = 'Views';
      eventInfo['eventNonInteraction'] = true; //make sure view is not a page interaction
      if (klrn.inView(eventInfo.target.firstElementChild, 0.5))
        exports.trackEvent(eventInfo);
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

    for (i = 0; i < showTiles.length; i++) {
      if (showTiles[i].querySelector('img'))
        imgAlt = showTiles[i].querySelector('img').alt.trim();
      eventInfo['eventLabel'] = imgAlt ? imgAlt : 'image alt tag not set';
      eventInfo['target'] = showTiles[i];
      eventInfo['outboundLink'] = exports.checkOutboundLink(showTiles[i].href);
      exports.trackEvent(eventInfo);
    }

    //Bottom Promos
    eventInfo['eventAction'] = 'Clicks - Home Page Bottom Promos';

    for (i = 0; i < bottomPromos.length; i++) {
      links = bottomPromos[i].querySelectorAll('a');
      if (!links) break;

      if (bottomPromos[i].querySelector('h3'))
        eventLabel = bottomPromos[i].querySelector('h3').textContent.trim();
      if (!eventLabel) {
        eventLabel = bottomPromos[i].querySelector('img');
        eventLabel = eventLabel
          ? eventLabel.alt.trim()
          : 'headline or image text not set';
      }

      eventInfo['eventLabel'] = eventLabel;
      eventInfo['outboundLink'] = exports.checkOutboundLink(links[0].href);

      //set click tracking for each link in promo
      for (j = 0; j < links.length; j++) {
        eventInfo['target'] = links[j];
        exports.trackEvent(eventInfo);
      }
    }
  }; //end trackHomePagePromos

  //run tracking modules
  exports.trackSchedulePageSponsors();
  exports.trackSidebar();
  exports.trackHomePagePromos();
  exports.trackHomePageSlider();
})(klrn); //end namespace to add modules to klrn object
