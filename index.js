import fs from 'fs';
import mustache from 'mustache';
import build from './src/build';

const IMAGES_ID = 'skinomatic.images';
const MUSTACHE_ID = 'skinomatic.mustache';
const CSS_ID = 'skinomatic.css';
const RESET_ID = 'skinomatic.reset';
const CONTENT_SOURCE_ID = 'skinomatic.content';

import { HTML_INDICATORS, htmluserlangattributes, placeholder,
    htmllogoattributes, htmlloggedin,
    htmlpersonaltoolsloggedin, htmlpersonaltools,
    IPSUM_LOREM,
    portals, datasearch, FOOTER_ROWS, FOOTER_ICONS,
    htmlviews, htmlnamespaces, htmlvariants,
    printtail, headelement, datamore } from './src/common';

const SKIN_FEATURES = {
    elements: fs.readFileSync(`${__dirname}/skin-module-features/elements.css`).toString(),
    content: fs.readFileSync(`${__dirname}/skin-module-features/content.css`).toString(),
    logo: fs.readFileSync(`${__dirname}/skin-module-features/logo.css`).toString(),
    interface: fs.readFileSync(`${__dirname}/skin-module-features/interface.css`).toString()
};

let defaultTemplate = '';
let defaultCSS = '';
let defaultImages = [];

const getSVGDataURI = (text) => `data:image/svg+xml;utf8,${encodeURIComponent(text)}`;

function getThemeDirectory( skinName ) {
    return `/themes/${skinName}`;
}

const localImages = JSON.parse(localStorage.getItem(IMAGES_ID) || '[]');

let localData = {
    'html-title': 'New Skinomatic skin',
    'html-bodycontent': placeholder( 'Article content goes here' ),
    'data-personal-menu': {
        'label': 'Personal tools',
        'html-loggedin': htmlloggedin,
        'html-personal-tools': htmlpersonaltools
    },
};

const articlecache = JSON.parse( localStorage.getItem( 'skinomatic.articlecache' ) || '{}' );

function getarticlehtml(title) {
    if (articlecache[title]) {
        return Promise.resolve(articlecache[title]);
    } else {
        const uri = `https://en.wikipedia.org/w/api.php?action=parse&origin=*&format=json&page=${title}`;
        return fetch(uri)
            .then((r) => r.json()).then((json) => {
                articlecache[title] = json.parse.text['*'];
                localStorage.setItem('skinomatic.articlecache', JSON.stringify(articlecache));
                return articlecache[title];
            });
    }
}

function setcss(value) {
    document.getElementById(CSS_ID).value = value;
}

function setmustache(value) {
    document.getElementById(MUSTACHE_ID).value = value;
}

function getfeaturenames() {
    return Array.from(document.querySelectorAll('.skin__features:checked'))
        .map(n=>n.value);
}
function getcss() {
    const skinfeaturecss = getfeaturenames()
            .map(feature=>SKIN_FEATURES[feature]).join('\n')
        // In future maybe we can use LESS variables?
        .replace(/{{{logo}}}/g, document.getElementById('skinomatic.logo').getAttribute('src'));

    let css = document.getElementById(CSS_ID).value;

    // substitute the images
    localImages.forEach((img) => {
        css = css.replace( new RegExp( `/\(\/images\/${img.name}\)/g` ),
            `${getSVGDataURI(img.text)}` );
    });

    // not sanitized. If user puts `</style><script>alert(1);</script>` JS will run.
    // This is consistent with codepen and JSFiddle.
    return `${skinfeaturecss} ${css}`;
}

function getmustache() {
    return document.getElementById(MUSTACHE_ID).value;
}

function saveLocally() {
    localStorage.setItem(MUSTACHE_ID,  document.getElementById(MUSTACHE_ID).value);
    localStorage.setItem(CSS_ID, document.getElementById(CSS_ID).value);
    localStorage.setItem(IMAGES_ID , JSON.stringify(localImages));
}

function preview() {
    saveLocally();
    const css = getcss();
    const template = getmustache();
    let doc;
    const iframe = document.getElementById( 'skinomatic__preview__iframe' );

    if (iframe.contentDocument) {
        doc = iframe.contentDocument;
    } else if(iframe.contentWindow) {
        doc = iframe.contentWindow.document;
    } else {
        doc = iframe.document;
    }

    doc.open('/loading.html');
    doc.writeln(
        mustache.render(`{{{html-headelement}}}${template}{{{html-printtail}}}`, Object.assign( localData, {
            'html-headelement': headelement(css, [
                'site.styles',
                'mediawiki.legacy.shared'
            ] ),
            'html-printtail': printtail(),
            'page-isarticle': true,
            'msg-tagline': 'From Wikipedia, the free encyclopedia',
            'html-userlangattributes': htmluserlangattributes,
            'msg-jumptonavigation': 'Jump to navigation',
            'msg-jumptosearch': 'Jump to search',
            'data-page-actions': {
                'id': 'p-views',
                'empty-portlet': '',
                'label-id': 'p-views-label',
                'msg-label': 'Views',
                'html-items': htmlviews
            },        
            'data-namespaces': {
                'id': 'p-namespaces',
                'empty-portlet': '',
                'label-id': 'p-namespaces-label',
                'label': 'Namespaces',
                'html-items': htmlnamespaces
            },
            'data-page-actions-more': datamore,
            'data-variants': {
                'id': 'p-variants',
                'msg-label': '新加坡简体',
                'label-id': 'p-variants-label',
                'html-items': htmlvariants
            },
            'data-views': {
                'id': 'p-views',
                'empty-portlet': '',
                'label-id': 'p-views-label',
                'label': 'Views',
                'html-items': htmlviews
            },
            'data-search-box': datasearch,
            'data-sidebar': {
                'array-portals-rest': portals
            },
            'html-navigation-heading': 'Navigation menu',
            'html-logo-attributes': htmllogoattributes,
    
            // site specific
            'data-footer-links': FOOTER_ROWS,
            'data-footer-icons': FOOTER_ICONS,
            'html-sitenotice': placeholder( 'a site notice or central notice banner may go here', 70 ),
            'html-printfooter': `Retrieved from ‘<a dir="ltr" href="#">#?title=this&oldid=blah</a>’`,
            'html-catlinks': placeholder( 'Category links component from mediawiki core', 50 ),

            // messages
            'msg-search': 'Search',

            // extension dependent..
            'html-dataAfterContent': placeholder( 'Extensions can add here e.g. Related Articles.', 100 ),
            'html-indicators': HTML_INDICATORS,
            'html-subtitle': placeholder( 'Extensions can configure subtitle', 20 )
        } ) )
    );
    doc.close();
}

const debounce = (func) => {
    let inDebounce
    return function() {
      clearTimeout(inDebounce)
      inDebounce = setTimeout(() => func.apply(this, arguments), 300)
    }
}

function setContentAndPreview(type) {
    switch(type) {
        case '4':
            return getarticlehtml('Salvador_Dalí')
                .then((html) => {
                    localData['html-title'] = 'Salvador Dalí';
                    localData['html-bodycontent'] = html;
                    preview();
                });
        case '3':
            return getarticlehtml('Akira_Kurosawa')
                .then((html) => {
                    localData['html-title'] = 'Akira Kurosawa';
                    localData['html-bodycontent'] = html;
                    preview();
                });
        case '2':
            localData['html-title'] = 'Ipsum Lorem';
            localData['html-bodycontent'] = IPSUM_LOREM;
            break;
        default:
            localData['html-title'] = 'Title';
            localData['html-bodycontent'] = placeholder( 'Article content goes here' );
            break;
    }
    preview();
}

function setLoginData(checked) {
    if (checked) {
        localData['data-personal-menu']['html-items'] = htmlpersonaltoolsloggedin;
        localData['data-personal-menu']['html-loggedin'] = '';
    } else {
        localData['data-personal-menu']['html-items'] = htmlpersonaltools;
        localData['data-personal-menu']['html-loggedin'] = htmlloggedin;
    }
}

function resetImages() {
    while(localImages.length){
        localImages.pop();
    }
    defaultImages.forEach((img) => localImages.push(img));
}

function reset() {
    const mustacheInput = document.getElementById(MUSTACHE_ID);
    const cssInput =  document.getElementById(CSS_ID);
    cssInput.value = defaultCSS;
    mustacheInput.value = defaultTemplate;
    resetImages();
}

function setcssWithImgSubstitutions(css) {
    setcss(
        css.replace(/\url\(\/static\/images\//g, 'url(https://en.wikipedia.org/static/images/')
            .replace(/\url\(\/w\//g, 'url(https://en.wikipedia.org/w/')
    )
}

function init() {
    const mustacheInput = document.getElementById(MUSTACHE_ID);
    const cssInput =  document.getElementById(CSS_ID);
    const contentSelector = document.getElementById(CONTENT_SOURCE_ID);
    const loggedin = document.getElementById('skinomatic.loggedin');
    const imagesInput = document.getElementById(IMAGES_ID);
    if(!localStorage.getItem(IMAGES_ID)) {
        resetImages();
    }
    const localData = [localStorage.getItem(MUSTACHE_ID), localStorage.getItem(CSS_ID)];
    if (localData[0]) {
        setmustache(localData[0]);
        setcssWithImgSubstitutions(localData[1]);
    }

    // set up event listeners
    cssInput.addEventListener('input', debounce(preview));
    mustacheInput.addEventListener('input', debounce(preview));
    contentSelector.addEventListener('change', function (ev) {
        setContentAndPreview(this.value);
    });
    loggedin.addEventListener('change', function () {
        setLoginData(loggedin.checked);
        preview();
    });
    contentSelector.addEventListener('change', function (ev) {
        setContentAndPreview(this.value);
    });
    Array.from(document.querySelectorAll('.skin__features')).forEach((node) =>
        node.addEventListener('change', debounce(preview))
    );
    document.getElementById(RESET_ID).addEventListener('click', function (ev) {
        reset();
        setContentAndPreview(this.value);
    });
    setLoginData(loggedin.checked);
    setContentAndPreview(contentSelector.value);
    document.getElementById('skinomatic.build').addEventListener('click', function () {
        const name = document.getElementById('skinomatic.title').value;
        const uppercaseName = name.charAt(0).toUpperCase() + name.substr(1);
        build(uppercaseName,
            `{{{html-headelement}}}${mustacheInput.value}{{{html-printtail}}}`,
            cssInput.value, getfeaturenames(), localImages)
    });
    imagesInput.addEventListener('change', function () {
        const p = [];
        this.disabled = true;
        Array.from(this.files).forEach((f) => {
            const name = f.name;
            if (localImages.findIndex((img) => img.name === name) === -1) {
                p.push(
                    f.text().then((text) => {
                        localImages.push( { text, name, src: getSVGDataURI(text) } );
                    })
                );
            }
        });
        return Promise.all(p).then(() => {
            imagesInput.value = '';
            this.disabled = false;
            preview();
        })
    });

    // setup reactive elements
      var app = new Vue({
        el: '#skinomatic-vue',
        data: {
          images: localImages
        },
        methods: {
            removeImage: function (name) {
                localImages.splice(localImages.findIndex(obj => obj.name === name), 1);
                preview();
            }
        }
      })
}

function loadSkin(name) {
    const root = getThemeDirectory(name);
    return Promise.all( [
        fetch(`${root}/index.json`).then(
            (r) => r.json(),
            () => {
                console.log('a');
                return Promise.resolve({
                    images: []
                })
            }
        )
            .then((r) => {
                return Promise.all(
                    (r && r.images || []).map((name) => {
                        return fetch(`${root}/images/${name}`).then((r) => r.text())
                            .then((text) => {
                                return {
                                    name,
                                    text,
                                    text: getSVGDataURI(text)
                                };
                            });
                    })
                )
            }),
        fetch(`${root}/skin.mustache`).then((r) => r.text()),
        fetch(`${root}/styles.css`).then((r) => r.text())
    ] ).then((res) => {
        defaultImages = res[0];
        defaultTemplate = res[1];
        defaultCSS = res[2];
        setmustache(defaultTemplate);
        setcssWithImgSubstitutions(defaultCSS);
        preview();
    });
}

fetch('/themes/index.json').then((r) => r.json())
    .then(( skins ) => {
        const select = document.createElement('select');
        skins.forEach((s) => {
            const o = document.createElement('option');
            o.value = s;
            o.textContent = s;
            select.append(o);
        });
        loadSkin(skins[0]).then(init);
        select.addEventListener('change', function () {
            loadSkin(this.value);
        });
        document.querySelector('.skinomatic__buttons').prepend( select );
    })

