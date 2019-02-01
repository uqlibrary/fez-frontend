'use strict';

let url = 'http://localhost:9000/#/';

module.exports = {
    before(browser) {
        url = browser.launch_url;
    },
    'Browser checks and noscript tags are added to the page'(browser) {
        browser.url(url);

        browser.expect.element('noscript').to.be.present;
        browser.expect.element('#unsupportedBrowser').to.be.present;
        browser.expect.element('#unsupportedBrowser').not.to.be.visible;

        browser.end();
    },
};
