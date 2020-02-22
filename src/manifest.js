module.exports = {
    name: 'ES5 Checker',
    version: '0.1.0',
    icons: {
        [32]: 'icon.png',
    },
    manifest_version: 2,
    devtools_page: 'devtools.html',
    background: {
        scripts: ['background.js'],
        persistent: false,
    },
    permissions: [
        'tabs',
    ],
};
