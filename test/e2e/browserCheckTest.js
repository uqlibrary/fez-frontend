/* eslint-disable dot-location */
/* eslint-disable import/no-commonjs */
/* eslint-disable strict */
/* eslint-disable fp/no-let */
/* eslint-disable fp/no-mutation */

'use strict';

let url = 'http://dev-espace.library.uq.edu.au:9000/#/';

module.exports = {
  before(browser) {
    url = browser.launch_url;
  },
  'Browser checks and noscript tags are added to the page'(browser) {
    browser.url(url);

    browser.expect.element('noscript').to.be.present
    browser.expect.element('#unsupportedBrowser').to.be.present
    browser.expect.element('#unsupportedBrowser').not.to.be.visible;

    browser.end();
  },
};