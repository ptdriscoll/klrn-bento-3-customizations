/*
Event tracking module for specific pages, using ga4-event-tracking module and 
Google Tag Manager. GTM variables = eventCategory, eventAction, eventLabel, linkUrl.
*/

(function (exports) {
  exports.ga4trackSchedulePageSponsors = function () {
    //return if not TV schedule page
    if (!location.pathname.includes('/schedule')) return;

    const query =
      '#layout-4936e49d-c107-4949-bca0-f3d50f08c84f a, \
                   #layout-13f8bdb5-76bd-431a-b240-627aaa2439ed a';
    const sponsors = document.querySelectorAll(query);
    if (!sponsors) return;

    let i,
      img,
      tilePosition,
      eventInfo,
      isDisplayed,
      viewsNotTracked = [];

    for (i = 0; i < sponsors.length; i++) {
      img = sponsors[i].querySelector('img');
      if (!img) break;
      tilePosition = i < 4 ? (i % 4) + 1 : i - 1;

      //first set up as sponsor_impression event
      eventInfo = {
        event: 'sponsor_impression',
        eventCategory: 'Schedule Page ' + tilePosition,
        eventLabel: img.alt,
        linkUrl: sponsors[i].href,
        target: sponsors[i],
      };

      //track impressions if ad is displayed at top, else when it enters into view
      isDisplayed =
        getComputedStyle(sponsors[i].parentNode.parentNode.parentNode.parentNode)
          .display !== 'none';      
      if (i < 4 && isDisplayed) exports.ga4trackEvent(eventInfo);
      else viewsNotTracked.push(Object.assign({}, eventInfo));

      //now set up as sponsor_click event
      eventInfo['event'] = 'sponsor_click';
      exports.ga4trackEvent(eventInfo); //track clicks of sponsor ad
    }

    //if page opened in mobile, then two ads (or their duplicates) have not been seen
    if (viewsNotTracked.length === 4) {
      exports.ga4trackWhenInView(viewsNotTracked, 'schedulePage');
    }
  };

  exports.ga4trackSidebar = function () {
    //return if home page
    if (location.pathname === '/') return;

    //return if there is no sidebar on page
    const sidebar = document.querySelector('.rail-wrapper');
    if (!sidebar) return;

    const sponsor_selectors =
      '#component-487eb930-f29a-11e8-ac11-cf036755f6fe a, \
       #component-19fb5ee0-f369-11e8-90bb-7b9969ce1070 a';

    const sponsors = sidebar.querySelectorAll(sponsor_selectors);
    const buttons = sidebar.querySelectorAll(
      '#component-18114b10-e795-11e8-bc4d-edfdc25f8ca9 a'
    );

    let eventInfo = {
      event: undefined,
      eventCategory: 'Sidebar',
      eventLabel: undefined,
      linkUrl: undefined,
      target: undefined,
    };

    let i, img, imgAlt;

    //sidebar buttons = internal_click event
    eventInfo['event'] = 'internal_click';

    for (i = 0; i < buttons.length; i++) {
      eventInfo['eventLabel'] = buttons[i].textContent.trim();
      eventInfo['linkUrl'] = buttons[i].href;
      eventInfo['target'] = buttons[i];
      exports.ga4trackEvent(eventInfo);
    }

    //sidebar sponsors
    for (i = 0; i < sponsors.length; i++) {
      //don't track tile if overall parent display = none
      if (
        window.getComputedStyle(sponsors[i].parentNode.parentNode.parentNode)
          .display === 'none'
      ) {
        continue;
      }

      img = sponsors[i].querySelector('img');
      if (img) imgAlt = sponsors[i].querySelector('img').alt.trim();
      eventInfo['eventLabel'] = imgAlt ? imgAlt : 'image alt tag not set';
      eventInfo['linkUrl'] = sponsors[i].href;
      eventInfo['target'] = sponsors[i];

      //sidebar sponsors impression = sponsor_impression event
      eventInfo['event'] = 'sponsor_impression';
      if (exports.inView(img, 0.5)) {
        exports.ga4trackEvent(eventInfo);
      } else {
        exports.ga4trackWhenInView(Object.assign({}, eventInfo), 'singleTile');
      }

      //sidebar sponsors clicks = sponsor_click event
      eventInfo['event'] = 'sponsor_click';
      exports.ga4trackEvent(eventInfo);
    }
  };

  exports.ga4trackHomePageSlider = function () {
    //return if not home page
    if (location.pathname !== '/') return;

    const slides = document.querySelectorAll(
      '#component-1a1b52f0-d9f6-11e7-a670-7f78010a7152 a'
    );
    if (!slides) return;

    let i,
      len = slides.length,
      eventLabel;

    let eventInfo = {
      event: 'internal_click',
      eventCategory: 'Home Page Slider',
      eventLabel: undefined,
      linkUrl: undefined,
      target: undefined,
    };

    for (i = 0; i < len; i += 1) {
      if (i % 3 === 0) eventLabel = slides[i].textContent;
      eventInfo['eventLabel'] = eventLabel;
      eventInfo['linkUrl'] = slides[i].href;
      eventInfo['target'] = slides[i];
      exports.ga4trackEvent(eventInfo);
    }
  };

  exports.ga4trackHomePagePromos = function () {
    //return if not home page
    if (location.pathname !== '/') return;

    const donateButtons = document.querySelectorAll(
      '#ba1fa733-e1c9-4d23-9e01-41a36b51a5a5 a, \
       #component-f400eb40-c8ef-11e8-9eca-19d38845041f a'
    );
    const topPromos = document.querySelectorAll(
      '#column-224b9950-b60d-11e8-8b93-9145e1056ee0 .promo'
    );
    const whatsOnNow = document.querySelectorAll(
      '#column-0fa9631a-e8ba-4117-adae-751046aae720 a'
    );
    const sponsorTiles = document.querySelectorAll(
      '#column-cef6f81b-94e3-4973-8b54-64598726ce08 a'
    );
    const programTiles = document.querySelectorAll(
      '#layout-d44bc274-ff76-4587-a53a-844ddf1c15db a'
    );
    const bottomPromos = document.querySelectorAll(
      '#layout-733a72c0-588a-4c4c-8056-3368cc38f06e .promo'
    );

    let eventInfo = {
      event: 'internal_click',
      eventCategory: undefined,
      eventLabel: undefined,
      linkUrl: undefined,
      target: undefined,
    };

    let i, j, links, link, img, eventLabel, imgAlt, headline;

    //Donate Buttons
    eventInfo['eventCategory'] = 'Home Page Donate Buttons';

    for (i = 0; i < donateButtons.length; i++) {
      eventInfo['eventLabel'] = donateButtons[i].textContent.trim();
      eventInfo['linkUrl'] = donateButtons[i].href;
      eventInfo['target'] = donateButtons[i];
      exports.ga4trackEvent(eventInfo);
    }

    //Top Promos
    eventInfo['eventCategory'] = 'Home Page Top Promos';

    for (i = 0; i < topPromos.length; i++) {
      links = topPromos[i].querySelectorAll('a');
      if (!links) break;

      img = topPromos[i].querySelector('img');
      link = topPromos[i].querySelector('.read-more__link');

      if (img) eventLabel = img.alt.trim();
      if (!eventLabel) {
        eventLabel = link
          ? link.textContent.trim()
          : 'image or link text not set';
      }

      eventInfo['eventLabel'] = eventLabel;
      eventInfo['linkUrl'] = link.href;

      //set click tracking for each link in promo
      for (j = 0; j < links.length; j++) {
        eventInfo['target'] = links[j];
        exports.ga4trackEvent(eventInfo);
      }
    }

    //What's On Now
    eventInfo['eventCategory'] = "Home Page What's On Now";

    for (i = 0; i < whatsOnNow.length; i++) {
      eventInfo['eventLabel'] =
        i === 0 ? 'On Primetime | On Now' : whatsOnNow[i].textContent;
      eventInfo['linkUrl'] = whatsOnNow[i].href;
      eventInfo['target'] = whatsOnNow[i];
      exports.ga4trackEvent(eventInfo);
    }

    //Sponsor Tiles
    eventInfo['eventCategory'] = 'Home Page';

    for (i = 0; i < sponsorTiles.length; i++) {
      img = sponsorTiles[i].querySelector('img');
      if (img) imgAlt = img.alt.trim();
      eventInfo['eventLabel'] = imgAlt ? imgAlt : 'image alt tag not set';
      eventInfo['linkUrl'] = sponsorTiles[i].href;
      eventInfo['target'] = sponsorTiles[i];

      //track sponsor_impression events
      eventInfo['event'] = 'sponsor_impression';
      if (exports.inView(img, 0.5)) {
        exports.ga4trackEvent(eventInfo);
      } else {
        exports.ga4trackWhenInView(Object.assign({}, eventInfo), 'singleTile');
      }

      //track clicks as a sponsor ad
      eventInfo['event'] = 'sponsor_click';
      exports.ga4trackEvent(eventInfo);

      //revert event back to internal_click for rest of module
      eventInfo['event'] = 'internal_click';
    }

    //Program Tiles
    eventInfo['eventCategory'] = 'Home Page Program Tiles';

    for (i = 0; i < programTiles.length; i++) {
      img = programTiles[i].querySelector('img');
      if (img) imgAlt = img.alt.trim();
      eventInfo['eventLabel'] = imgAlt ? imgAlt : 'image alt tag not set';
      eventInfo['linkUrl'] = programTiles[i].href;
      eventInfo['target'] = programTiles[i];
      exports.ga4trackEvent(eventInfo);
    }

    //Bottom Promos
    eventInfo['eventCategory'] = 'Home Page Bottom Promos';

    for (i = 0; i < bottomPromos.length; i++) {
      links = bottomPromos[i].querySelectorAll('a');
      if (!links) break;

      headline = bottomPromos[i].querySelector('h3');
      if (headline) eventLabel = headline.textContent.trim();
      if (!eventLabel) {
        img = bottomPromos[i].querySelector('img');
        eventLabel = img ? img.alt.trim() : 'headline or image text not set';
      }
      eventInfo['eventLabel'] = eventLabel;

      //set click tracking for each link in promo
      for (j = 0; j < links.length; j++) {
        eventInfo['linkUrl'] = links[j].href;
        eventInfo['target'] = links[j];
        exports.ga4trackEvent(eventInfo);
      }
    }
  }; //end ga4trackHomePagePromos

  //run tracking modules
  exports.ga4trackSchedulePageSponsors();
  exports.ga4trackSidebar();
  exports.ga4trackHomePagePromos();
  exports.ga4trackHomePageSlider();
})(klrn); //end namespace to add modules to klrn object
