module.exports = {
    name: 'ES5 Checker',
    version: '0.1.0',
    icons: {
        [32]: 'icon.png',
    },
    permissions: [
        '*://*/*.js',
        'webRequest',
    ],
    manifest_version: 2,
    devtools_page: 'devtools.html',
};
