import fs from 'fs';
import mustache from 'mustache';
import build from './src/build';

/**
 * // Result of running
 * console.log(
	JSON.stringify(
		Object.assign(
			{},
			LEGACY_TEMPLATE_DATA,
			NAVIGATION_TEMPLATE_DATA.loggedOutWithVariants
		),
		null,
		2)
	);
 *in Vector storybook instance.
 */
import templateData from './templateData.json';
import templateDataLoggedIn from './templateDataLoggedIn.json';

const NAME_ID = 'skinomatic.title';
const IMAGES_ID = 'skinomatic.images';
const MUSTACHE_ID = 'skinomatic.mustache';
const TEMPLATE_CHOOSER_ID = 'skinomatic.templates';
const CSS_ID = 'skinomatic.css';
const RESET_ID = 'skinomatic.reset';
const CONTENT_SOURCE_ID = 'skinomatic.content';

import { placeholder,
    IPSUM_LOREM,
    printtail, headelement } from './src/common';

const SKIN_FEATURES = {
    elements: fs.readFileSync(`${__dirname}/skin-module-features/elements.css`).toString(),
    content: fs.readFileSync(`${__dirname}/skin-module-features/content.css`).toString(),
    logo: fs.readFileSync(`${__dirname}/skin-module-features/logo.css`).toString(),
    interface: fs.readFileSync(`${__dirname}/skin-module-features/interface.css`).toString()
};

let isLoggedIn = false;
let currentSkin = {};
let defaultTemplate = '';
let defaultCSS = '';
let defaultImages = [];
let currentContent = {
    'html-title': 'New Skinomatic skin',
    'html-bodycontent': placeholder( 'Article content goes here' )
};
let localSkinOption;

const getSVGDataURI = (text) => `data:image/svg+xml;utf8,${encodeURIComponent(text)}`;

function getThemeDirectory( skinName ) {
    return `/themes/${skinName}`;
}

const localImages = JSON.parse(localStorage.getItem(IMAGES_ID) || '[]');

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
    const partials = currentSkin.partials || {};
    document.getElementById(MUSTACHE_ID).value = value;
    const select = document.getElementById(TEMPLATE_CHOOSER_ID);
    // will be editable later.
    select.disabled = true;
    Object.keys( partials ).forEach((key) =>
        addOption(select, `${key}.mustache`, key));
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
    localStorage.setItem(IMAGES_ID, JSON.stringify(localImages));
    localStorage.setItem(NAME_ID, document.getElementById(NAME_ID).value);
}

function preview() {
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
        mustache.render(`{{{html-headelement}}}${template}{{{html-printtail}}}`,
            Object.assign(
                {},
                templateData,
                isLoggedIn ? templateDataLoggedIn : {},
                currentContent, {
                'html-headelement': headelement(css, [
                    'site.styles',
                    'mediawiki.legacy.shared'
                ] ),
                'html-printtail': printtail(),
            } ),
            currentSkin.partials
        )
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
                    currentContent['html-title'] = 'Salvador Dalí';
                    currentContent['html-bodycontent'] = html;
                    preview();
                });
        case '3':
            return getarticlehtml('Akira_Kurosawa')
                .then((html) => {
                    currentContent['html-title'] = 'Akira Kurosawa';
                    currentContent['html-bodycontent'] = html;
                    preview();
                });
        case '2':
            currentContent['html-title'] = 'Ipsum Lorem';
            currentContent['html-bodycontent'] = IPSUM_LOREM;
            break;
        default:
            currentContent['html-title'] = 'Title';
            currentContent  ['html-bodycontent'] = placeholder( 'Article content goes here' );
            break;
    }
    preview();
}

function setLoginData(checked) {
    isLoggedIn = checked;
    preview();
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

function saveLocallyAndPreview() {
    saveLocally();
    preview();
}

function getLocalName() {
    return localStorage.getItem(NAME_ID)
        || 'SkinomaticSkin';
}

function loadLocalSkin() {
    if(!localStorage.getItem(IMAGES_ID)) {
        resetImages();
    }
    const localData = [
        localStorage.getItem(MUSTACHE_ID),
        localStorage.getItem(CSS_ID)
    ];
    if (localData[0]) {
        setmustache(localData[0]);
        setcssWithImgSubstitutions(localData[1]);
        document.getElementById(NAME_ID).value = getLocalName();
    }
    preview();
    return Promise.resolve();
}

function init() {
    const mustacheInput = document.getElementById(MUSTACHE_ID);
    const cssInput =  document.getElementById(CSS_ID);
    const contentSelector = document.getElementById(CONTENT_SOURCE_ID);
    const loggedin = document.getElementById('skinomatic.loggedin');
    const imagesInput = document.getElementById(IMAGES_ID);
    const nameInput = document.getElementById(NAME_ID);

    // set up event listeners
    cssInput.addEventListener('input', debounce(saveLocallyAndPreview));
    mustacheInput.addEventListener('input', debounce(saveLocallyAndPreview));
    contentSelector.addEventListener('change', function (ev) {
        setContentAndPreview(this.value);
    });
    nameInput.addEventListener('input',
        debounce( function () {
            if (!this.value) {
                this.value = 'Skinomatic';
            }
            this.value = this.value.replace(/ /, '_');
            localSkinOption.textContent = this.value;
            saveLocally();
        } )
    );
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
        const name = document.getElementById(NAME_ID).value;
        const uppercaseName = name.charAt(0).toUpperCase() + name.substr(1);
        build(uppercaseName,
            `{{{html-headelement}}}${mustacheInput.value}{{{html-printtail}}}`,
            cssInput.value, getfeaturenames(), localImages, currentSkin.partials)
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
    if (name === 'local') {
        return loadLocalSkin();
    }
    const root = getThemeDirectory(name);
    return Promise.all( [
        fetch(`${root}/index.json`).then(
            (r) => r.json(),
            () => {
                return Promise.resolve({
                    images: []
                })
            }
        )
            .then((r) => {
                document.getElementById(NAME_ID).value = r.name || name;
                return Promise.all( [ Promise.all(
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
                ), Promise.all(
                    (r && r.partials || []).map((name) => {
                        return fetch(`${root}/${name}.mustache`).then((r) => r.text())
                            .then((text) => {
                                return {
                                    name,
                                    text
                                };
                            });
                    })
                ) ] );
            }),
        fetch(`${root}/skin.mustache`).then((r) => r.text()),
        fetch(`${root}/skin.css`).then((r) => r.text())
    ] ).then((res) => {
        const assets = res[0];
        defaultImages = assets[0];
        const partials = {};
        assets[1].forEach((p) => {
            partials[p.name] = p.text;
        });
        currentSkin.partials = partials;
        defaultTemplate = res[1];
        defaultCSS = res[2];
        setmustache(defaultTemplate);
        setcssWithImgSubstitutions(defaultCSS);
        preview();
    });
}

function addOption(select, text, value) {
    const o = document.createElement('option');
    o.value = value;
    o.textContent = text;
    select.append(o);
    return o;
}

fetch('/themes/index.json').then((r) => r.json())
    .then(( skins ) => {
        const select = document.createElement('select');
        localSkinOption = addOption(select, getLocalName(), 'local');
        skins.forEach((s) => {
            addOption(select, s, s)
        });
        select.addEventListener('change', function () {
            loadSkin(this.value);
            localStorage.setItem('skin', this.value);
        });
        const localSkin = localStorage.getItem('skin');
        if ( localSkin ) {
            select.value = localSkin;
            loadSkin(localSkin).then(init);
        } else {
            loadSkin(skins[0]).then(init);
        }
        document.querySelector('.skinomatic__buttons').prepend( select );
    })

