import JSZip from 'jszip';
import saveAs from './FileSaver';
import fs from 'fs';

const SkinMustache = fs.readFileSync(`${__dirname}/../scaffolding/SkinMustache.php`).toString();
const MustacheTemplate = fs.readFileSync(`${__dirname}/../scaffolding/MustacheTemplate.php`).toString();

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
namespace Skin${name};
use SkinTemplate;
use MwException;
use BaseTemplate;
use Profiler;
use TemplateParser;
use Linker;
use Hooks;
use Html;
use Xml;
use Skin;
`;
    includesfolder.file(`SkinMustache.php`, SkinMustache.replace('<?php', IMPORTS) );
    includesfolder.file(`MustacheTemplate.php`, MustacheTemplate.replace('<?php', IMPORTS) );
}

function skinjson(name, features) {
    const skinKey = name.toLowerCase();

    return stringifyjson(
        {
            name,
            namemsg: `skinname-${skinKey}`,
            descriptionmsg: `${skinKey}-skin-desc`,
            url: `https://www.mediawiki.org/wiki/Skin:${name}   `,
            author: [ 'Skinomatic' ],
            type: 'skin',
            'manifest_version': 2,
            ValidSkinNames: {
                [skinKey]: `${name}\\SkinMustache`
            },
            MessagesDirs: {
                [name]: [ 'i18n']
            },
            ResourceFileModulePaths: {
                localBasePath: '',
                remoteSkinPath: name
            },
            AutoloadNamespaces: {
                [`Skin${name}\\`]: 'includes/'
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
 */
function build(name, template, css, features, images) {
    const zip = new JSZip();
    const rootfolder = zip.folder(name);
    const srcfolder = rootfolder.folder('src');
    const templatefolder = rootfolder.folder('templates');
    const imagesfolder = srcfolder.folder('images');
    const includesfolder = rootfolder.folder('includes');
    rootfolder.file('skin.json', skinjson(name, features))
    srcfolder.file('skin.css', css);
    templatefolder.file(`${name.toLowerCase()}.mustache`, template);
    addi18n(name, rootfolder);
    addphp(name, includesfolder);
    images.forEach((image) => {
        imagesfolder.file(image.name, image.text);
    })
    zip.generateAsync({ type: 'blob' } )
        .then((content) => saveAs(content, `${name}.zip`))
}

export default build;
