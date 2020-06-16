import JSZip from 'jszip';
import saveAs from './FileSaver';
import fs from 'fs';

const SkinomaticMustache = fs.readFileSync(`${__dirname}/../scaffolding/SkinomaticMustache.php`).toString();

function stringifyjson(json) {
    return JSON.stringify(json, null, 2);
}

function addi18n(name, rootfolder) {
    const skinKey = name.toLowerCase();
    const i18nfolder = rootfolder.folder('i18n');
    const en = {
        [`skinname-${skinKey}`]: name,
        [`${name}-desc`]: 'A skin created by mediawiki skinomatic'
    };
    const qqq = {
        [`skinname-${skinKey}`]: '{{optional}}',
        [`${skinKey}-desc`]: `{{desc|what=skin|name=${name}|url=https://www.mediawiki.org/wiki/Skin:${name}}}`
    }
    i18nfolder.file('en.json', stringifyjson(en));
    i18nfolder.file('qqq.json', stringifyjson(qqq));
}

function addphp(name, includesfolder) {
    const IMPORTS = `<?php

/** DONOT EDIT THIS FILE UNDER ANY CIRCUMSTANCES */
namespace ${name};
use SkinMustache;
use ResourceLoaderSkinModule;
use SpecialPage;
use Skin;
use Hooks;
use Linker;
use Html;
use Xml;
`;
    includesfolder.file(`SkinomaticMustache.php`, SkinomaticMustache.replace('<?php', IMPORTS));
}

function skinjson(name, features) {
    const skinKey = name.toLowerCase();

    return stringifyjson(
        {
            name,
            namemsg: `skinname-${skinKey}`,
            descriptionmsg: `${skinKey}-skin-desc`,
            url: `https://www.mediawiki.org/wiki/Skin:${name}`,
            author: [ 'Skinomatic' ],
            type: 'skin',
            requires: {
                // Require updates every release
                MediaWiki: '>= 1.35.0, <= 1.35.0'
            },
            'manifest_version': 2,
            ValidSkinNames: {
                [skinKey]: {
                    "class": `${name}\\SkinomaticMustache`,
                    "args": [
                        {
                            "styles": `skins.${skinKey}`,
                            "name": name,
                            "templateDirectory": `skins/${name}/templates/`
                        }
                    ]
                }
            },
            MessagesDirs: {
                [name]: [ 'i18n']
            },
            ResourceFileModulePaths: {
                localBasePath: '',
                remoteSkinPath: name
            },
            AutoloadNamespaces: {
                [`${name}\\`]: 'includes/'
            },
            ResourceModules: {
                [`skins.${skinKey}`]: {
                    class: "ResourceLoaderSkinModule",
                    features,
                    styles: [
                        "src/skin.css"
                    ]
                }
            }
        }
    );
}

/**
 * 
 * @param {string} name (uppercase)
 * @param {string} template 
 * @param {string} css 
 * @param {array} features
 * @param {Object} partials where key is the name of the template minus
 * the mustache suffix and the text is its content
 */
function build(name, template, css, features, images, partials) {
    const zip = new JSZip();
    const rootfolder = zip.folder(name);
    const srcfolder = rootfolder.folder('src');
    const templatefolder = rootfolder.folder('templates');
    const imagesfolder = srcfolder.folder('images');
    const includesfolder = rootfolder.folder('includes');
    rootfolder.file('skin.json', skinjson(name, features));
    srcfolder.file('skin.css', css);
    Object.keys(partials).forEach((template) => {
        templatefolder.file(`${template}.mustache`, partials[template]);
    });
    templatefolder.file('skin.mustache', template);
    addi18n(name, rootfolder);
    addphp(name, includesfolder);
    images.forEach((image) => {
        imagesfolder.file(image.name, image.text);
    })
    zip.generateAsync({ type: 'blob' } )
        .then((content) => saveAs(content, `${name}.zip`))
}

export default build;
