import fs from 'fs';
import mustache from 'mustache';
import build from './src/build';

const MUSTACHE_ID = 'skinomatic.mustache';
const CSS_ID = 'skinomatic.css';
const RESET_ID = 'skinomatic.reset';
const CONTENT_SOURCE_ID = 'skinomatic.content';

import { HTML_INDICATORS, htmluserlangattributes, placeholder,
    htmllogoattributes, htmlloggedin,
    htmlpersonaltoolsloggedin, htmlpersonaltools,
    IPSUM_LOREM,
    portals, datasearch, FOOTER_ROWS,
    htmlviews, htmlnamespaces, htmlvariants,
    printtail, headelement, datamore } from './src/common';

const SKIN_FEATURES = {
    elements: fs.readFileSync(`${__dirname}/skin-module-features/elements.css`).toString(),
    content: fs.readFileSync(`${__dirname}/skin-module-features/content.css`).toString(),
    logo: fs.readFileSync(`${__dirname}/skin-module-features/logo.css`).toString(),
    interface: fs.readFileSync(`${__dirname}/skin-module-features/interface.css`).toString()
};

let defaultTemplate = fs.readFileSync(`${__dirname}/vector.mustache` ).toString();
let defaultCSS = fs.readFileSync(`${__dirname}/styles.css` ).toString();
let localData = {
    'html-title': 'New Skinomatic skin',
    'html-bodycontent': placeholder( 'Article content goes here' ),
    'data-personal': {
        'msg-label': 'Personal tools',
        'html-userlangattributes': htmluserlangattributes,
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

    // not sanitized. If user puts `</style><script>alert(1);</script>` JS will run.
    // This is consistent with codepen and JSFiddle.
    return `${skinfeaturecss} ${document.getElementById(CSS_ID).value}`;
}

function getmustache() {
    return document.getElementById(MUSTACHE_ID).value;
}

function saveLocally() {
    localStorage.setItem(MUSTACHE_ID,  document.getElementById(MUSTACHE_ID).value);
    localStorage.setItem(CSS_ID, document.getElementById(CSS_ID).value);
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

    doc.open('');
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
            'data-views': {
                'tabs-id': 'p-views',
                'empty-portlet': '',
                'label-id': 'p-views-label',
                'msg-label': 'Views',
                'html-userlangattributes': htmluserlangattributes,
                'html-items': htmlviews
            },        
            'data-namespaces': {
                'tabs-id': 'p-namespaces',
                'empty-portlet': '',
                'label-id': 'p-namespaces-label',
                'msg-label': 'Namespaces',
                'html-userlangattributes': htmluserlangattributes,
                'html-items': htmlnamespaces
            },
            'data-actions': datamore,
            'data-variants': {
                'msg-label': '新加坡简体',
                'menu-id': 'p-variants',
                'menu-label-id': 'p-variants-label',
                'html-userlangattributes': htmluserlangattributes,
                'html-items': htmlvariants
            },
            'data-views': {
                'tabs-id': 'p-views',
                'empty-portlet': '',
                'label-id': 'p-views-label',
                'msg-label': 'Views',
                'html-userlangattributes': htmluserlangattributes,
                'html-items': htmlviews
            },
            'data-search': datasearch,
            'array-portals': portals,
            'html-navigation-heading': 'Navigation menu',
            'html-logo-attributes': htmllogoattributes,
    
            // site specific
            'html-hook-vector-before-footer': placeholder( 'output of VectorBeforeFooter hook (deprecated 1.35)', 20 ),
            'array-footer-rows': FOOTER_ROWS,
            'html-sitenotice': placeholder( 'a site notice or central notice banner may go here', 70 ),
            'html-printfooter': `Retrieved from ‘<a dir="ltr" href="#">#?title=this&oldid=blah</a>’`,
            'html-catlinks': placeholder( 'Category links component from mediawiki core', 50 ),

            // extension dependent..
            'html-hook-vector-before-footer': placeholder( 'VectorBeforeFooter hook output', 100 ),
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
        localData['data-personal']['html-personal-tools'] = htmlpersonaltoolsloggedin;
        localData['data-personal']['html-loggedin'] = '';
    } else {
        localData['data-personal']['html-personal-tools'] = htmlpersonaltools;
        localData['data-personal']['html-loggedin'] = htmlloggedin;
    }
}

function reset() {
    const mustacheInput = document.getElementById(MUSTACHE_ID);
    const cssInput =  document.getElementById(CSS_ID);
    cssInput.value = '';
    mustacheInput.value = defaultTemplate;
}

function init() {
    const mustacheInput = document.getElementById(MUSTACHE_ID);
    const cssInput =  document.getElementById(CSS_ID);
    const contentSelector = document.getElementById(CONTENT_SOURCE_ID);
    const loggedin = document.getElementById('skinomatic.loggedin');

    setmustache(localStorage.getItem(MUSTACHE_ID) || defaultTemplate);
    setcss(
        ( localStorage.getItem(CSS_ID) || defaultCSS )
            .replace(/\url\(\/static\/images\//g, 'url(https://en.wikipedia.org/static/images/')
            .replace(/\url\(\/w\//g, 'url(https://en.wikipedia.org/w/')
    );

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
            cssInput.value, getfeaturenames())
    });
}

init();
