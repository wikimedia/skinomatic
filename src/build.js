import JSZip from 'jszip';
import saveAs from './FileSaver';
import fs from 'fs';

const ScaffoldingTemplate = fs.readFileSync(`${__dirname}/../scaffolding/ScaffoldingTemplate.php.txt`).toString();
const SkinScaffolding = fs.readFileSync(`${__dirname}/../scaffolding/SkinScaffolding.php.txt`).toString();

function addi18n(name, rootfolder) {
    const skinKey = name.toLowerCase();
    const i18nfolder = rootfolder.folder('i18n');
    const en = {
        [`skinname-${skinKey}`]: name,
        [`${name}-desc`]: 'A skin created by mediawiki skinomatic'
    };
    const qqq = {
        [`skinname-${skinKey}`]: '{{optional}}',
        [`${name}-desc`]: `{{desc|what=skin|name=${name}|url=https://www.mediawiki.org/wiki/Skin:${name}}}`
    }
    i18nfolder.file('en.json', JSON.stringify(en));
    i18nfolder.file('qqq.json', JSON.stringify(qqq));
}

function addphp(name, includesfolder) {
    const skinkey = name.toLowerCase();
    includesfolder.file(`${name}Template.php`,
        ScaffoldingTemplate.replace(
            /{{skin}}/g, name
        ).replace(
            /{{skinkey}}/g, skinkey
        )
    );
    includesfolder.file(`Skin${name}.php`,
    SkinScaffolding.replace(
        /{{skin}}/g, name
    ).replace(
        /{{skinkey}}/g, skinkey
    )
);
}

function skinjson(name, features) {
    const skinKey = name.toLowerCase();

    return JSON.stringify(
        {
            name,
            namemsg: `skinname-${skinKey}`,
            descriptionmsg: `${skinKey}-skin-desc`,
            url: `https://www.mediawiki.org/wiki/Skin:${name}   `,
            author: [ 'Skinomatic' ],
            type: 'skin',
            ValidSkinNames: {
                [skinKey]: name
            },
            MessagesDirs: {
                [name]: [ 'i18n']
            },
            ResourceFileModulePaths: {
                localBasePath: '',
                remoteSkinPath: name
            },
            AutoloadClasses: {
                [`${name}Template`]: `${name}Template.php`,
                [`Skin${name}`]: `Skin${name}.php`
            },
            ResourceModules: {
                [`skins.${skinKey}.styles`]: {
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
function build(name, template, css, features) {
    const zip = new JSZip();
    const rootfolder = zip.folder(name);
    const srcfolder = rootfolder.folder('src');
    rootfolder.file('skin.json', skinjson(name, features))
    srcfolder.file('skin.css', css);
    srcfolder.file('skin.mustache', template);
    addi18n(name, rootfolder);
    addphp(name, rootfolder);
    zip.generateAsync({ type: 'blob' } )
        .then((content) => saveAs(content, `${name}.zip`))
}

export default build;
