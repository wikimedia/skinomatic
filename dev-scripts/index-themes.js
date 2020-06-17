const fs = require('fs');
const THEME_DIR = `${__dirname}/../dist/themes`;

/**
 * 
 * @param {string} path to directory
 */
function getDirectoryAssets(path, prefix, ignore) {
    let partials = [];
    let styles = [];

    fs.readdirSync(path, {
        withFileTypes: true
    }).forEach((file) => {
        const assets = getFileAssets(path, file, prefix, ignore);
        partials = partials.concat(assets.partials);
        styles = styles.concat(assets.styles);
    } );
    return { partials, styles };
}

function getFileAssets(path, file, prefix, ignore) {
    const split = file.name.split('.');
    const ext = split[1];
    let partials = [];
    let styles = [];

    if (ignore.includes(file.name)) {
        // nothing to do.
    } else if (file.isDirectory()) {
        const assets = getDirectoryAssets(`${path}/${file.name}`,
            `${prefix}/${file.name}/`,
            ignore
        );
        partials = partials.concat(assets.partials );
        styles = styles.concat(assets.styles);
    } else if (ext === 'mustache') {
        partials.push(prefix + split[0]);
    } else if (ext === 'css' || ext === 'less') {
        styles.push(prefix + file.name);
    }
    return { partials, styles };
}

function createThemeIndex(name) {
    const KNOWN_ASSETS = [
        'index.json', 'skin.css', 'skin.mustache', 'README.md', 'images'
    ];
    const THEME_DIR_PATH = `${THEME_DIR}/${name}`;
    const IMAGE_DIR = `${THEME_DIR_PATH}/images`;
    const THEME_INDEX_PATH = `${THEME_DIR_PATH}/index.json`;
    const index = fs.existsSync(THEME_INDEX_PATH) ?
        JSON.parse(fs.readFileSync(THEME_INDEX_PATH).toString()) : {};
    const assets = getDirectoryAssets(THEME_DIR_PATH, '', KNOWN_ASSETS);
    const images = fs.existsSync(IMAGE_DIR) ? fs.readdirSync(IMAGE_DIR) : []; 

    if (images.length) {
        index.images = images;
    }
    if (assets.partials.length) {
        index.partials = assets.partials;
    }
    if (assets.styles.length) {
        index.styles = assets.styles;
    }
    fs.writeFileSync(THEME_INDEX_PATH, JSON.stringify(index, null, 4));
}

const availableThemes = [];

fs.readdirSync(THEME_DIR, {
    withFileTypes: true
}).forEach((fileOrDirectory) => {
    if (fileOrDirectory.isDirectory()) {
        const theme = fileOrDirectory.name;
        createThemeIndex(theme)
        availableThemes.push(theme);
    }
})
fs.writeFileSync(`${THEME_DIR}/index.json`, JSON.stringify(availableThemes));
