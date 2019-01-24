'use strict';

let url = 'http://localhost:9000/#/';

module.exports = {
    before(browser) {
        url = browser.launch_url;
    },
    'Home page test'(browser) {
        browser.url(url);

        browser.expect.element('h1').to.be.present;
        browser.expect.element('h1').text.to.match(/UQ eSpace/);

        browser.end();
    },
};
