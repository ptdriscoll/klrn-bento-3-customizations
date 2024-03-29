(function () {
  // return if not sponsor page
  if (location.pathname.indexOf('/support/sponsor') === -1) return;

  const csv =
    'https://pbs.klrn.org/bento/data/get-data.php?file=sponsors&type=csv';
  const images = 'https://pbs.klrn.org/bento/images/sponsors/';
  const target = document.querySelector('#klrn_sponsors');
  let level = 0;
  if (!target) return;

  //add everything to this, then make 1 insertion
  const fragment = document.createDocumentFragment();

  //subheads and html wrappers
  const subheads = [
    '',
    'American Master',
    'SuperNOVA',
    'Great Performer',
    'Media Allies',
  ];

  const createSubhead = (level) => {
    const subhead = document.createElement('h2');
    subhead.style.cssText = 'text-align:center;margin-top:16px;';
    subhead.innerHTML = subheads[level];
    return subhead;
  };

  const createLogoContainer = () => {
    const ul = document.createElement('ul');
    ul.className = 'logos';
    return ul;
  };

  const createLogoWrapper = (logoContainer) => {
    const div = document.createElement('div');
    const article = document.createElement('article');
    div.className = 'sponsor-logos-component bento-component center';
    article.appendChild(logoContainer);
    div.appendChild(article);
    return div;
  };

  const createTextSponsorContainer = () => {
    const div = document.createElement('div');
    div.className = 'text-container text-background-color text-padding';
    div.style.cssText = 'text-align:center;padding:0 16px;';
    return div;
  };

  const createTextSponsorRow = () => {
    const div = document.createElement('div');
    div.style.cssText = 'max-width:100%;clear:left;';
    return div;
  };

  const createLogo = (row) => {
    const li = document.createElement('li');
    li.className = 'logo-container';

    const img = document.createElement('img');
    img.className = 'logo-img';
    img.setAttribute('loading', 'lazy');
    img.setAttribute('role', 'img');
    img.src = images + row.LOGO;
    img.alt = row.SPONSOR;
    img.style.cssText = 'max-width:170px;';
    img.setAttribute(
      'sizes',
      `(min-width: 1200px) 1440px,
        ((min-width: 992px) and (max-width: 1199px)) 899px,
        ((min-width: 768px) and (max-width: 991px)) 743px,
        ((min-width: 576px) and (max-width: 767px)) 767px,
        (max-width: 575px) 575px`
    );

    if (row.LINK) {
      const aTag = document.createElement('a');
      aTag.className = 'logo-link';
      aTag.href = row.LINK;
      aTag.setAttribute('target', '_blank');
      aTag.appendChild(img);
      li.appendChild(aTag);
    } else li.appendChild(img);

    return li;
  };

  const createTextSponsor = (row) => {
    const pTag = document.createElement('p');
    pTag.className = 'span4 column-4';
    pTag.style.cssText = 'margin-bottom:16px;';
    if (row.LINK) {
      const aTag = document.createElement('a');
      aTag.href = row.LINK;
      aTag.setAttribute('target', '_blank');
      aTag.innerHTML = row.SPONSOR;
      pTag.appendChild(aTag);
    } else pTag.innerHTML = row.SPONSOR;
    return pTag;
  };

  //callback for fetch
  const parse = (text) => {
    if (!text) return; //if there's no content, forget about it
    let data = klrn.parseCSV(text);

    //sort data by category levels
    data.sort((a, b) => a.CATEGORY - b.CATEGORY);

    //testing
    //data = data.filter(row => row.CATEGORY !== '3');
    //data = data.filter(row => row.SPONSOR !== 'Big Bend Conservancy');
    //data = data.filter(row =>  row.SPONSOR !== 'Our Kids Magazine' &&
    //                           row.SPONSOR !== 'San Antonio Magazine');
    //console.log(data);

    //driver loop to put elements together
    let container = null;
    let textRow = null;
    let count = 0;
    data.forEach((row) => {
      //skip row if any required data is missing
      if (
        row.SPONSOR === '' ||
        row.CATEGORY === '' ||
        row.CATEGORY === '0' ||
        (row.CATEGORY <= 2 && row.LOGO === '')
      ) {
        return;
      }

      //handle first occurance of each category to set level,
      //then add existing category container, add next subhead, and create next container
      const category = parseInt(row.CATEGORY);
      if (category !== level) {
        //handle previous container
        if (container) {
          if (level <= 2) fragment.appendChild(createLogoWrapper(container));
          else {
            if (textRow && textRow.children.length > 0) {
              container.appendChild(textRow);
            }
            fragment.appendChild(container);
            textRow = null;
            count = 0;
          }
          container = null;
        }

        //create next subhead and container
        level = category;

        fragment.appendChild(createSubhead(level)); //next subhead
        if (level <= 2) container = createLogoContainer(); //next logo container
        else container = createTextSponsorContainer(); //next text sponsor container
      }

      //add sponsors to current container
      if (category <= 2) container.appendChild(createLogo(row));
      else {
        //add textRow wrap for every 3 text sponsors
        if (count % 3 === 0) {
          if (textRow) {
            container.appendChild(textRow);
            textRow = null;
          }
          textRow = createTextSponsorRow();
        }
        textRow.appendChild(createTextSponsor(row));
        count++;
      }
    });

    //append last container
    if (container) {
      if (data[data.length - 1].CATEGORY <= 2) {
        fragment.appendChild(createLogoWrapper(container));
      } else {
        if (textRow && textRow.children.length > 0) {
          container.appendChild(textRow);
        }
        fragment.appendChild(container);
      }
    }

    //add everything to dom target
    target.appendChild(fragment);
  };

  //klrn.ajaxLoad(csv, parse)

  fetch(csv)
    .then((resp) => resp.text())
    .then((text) => parse(text));
})();
