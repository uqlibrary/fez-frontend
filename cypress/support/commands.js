// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

/**
 * Visual snapshots with Percy.io (hosted)
 * https://docs.cypress.io/guides/tooling/visual-testing.html#Percy
 *
 * Breakpoints for the project are at these widths: 600, 960, 1280.
 * Percy uses an uploaded DOM snapshot to test different widths, but can only account for
 * CSS media query changes to the layout depending on resolution. So to take screenshots of
 * non-CSS changes between resolutions, you must set the viewport resolution as in the example:
 *     cy.viewport(1280)
 *       .percySnapshot('Desktop - Home', { widths: [1280] })
 *       .viewport(480)
 *       .percySnapshot('Mobile - Home', { widths: [480] })
 * The default resolution for Cypress is 1000 x 660.
 */
import '@percy/cypress';

// Allows the targeting of CKEditors
// CKeditor dynamically names instances as "editor1", "editor2" etc.
// USAGE : cy.type_ckeditor('editor1', '<p>This is some text</p>');
Cypress.Commands.add('type_ckeditor', (element, content) => {
    cy.window()
        .then(win => {
            win.CKEDITOR.instances[element].setData(content);
        });
});

// Read text from CKEditor instance
// Usage example:
// cy.read_ckeditor('editor1')
//     .then(text => {
//         cy.wrap(text)
//             .should('eq', expected);
//     });
Cypress.Commands.add('read_ckeditor', element => {
    cy.window()
        .then(win => {
            return win.CKEDITOR.instances[element].getData();
        });
});

Cypress.Commands.add('closeUnsupported', () => {
    cy.get('#unsupportedBrowser.card button')
        .then($button => {
        // Button is only visible if browser is unsupported.
            if ($button.filter(':visible').length) {
                cy.wrap($button)
                    .click();
            }
        });
});

Cypress.Commands.add('navToHomeFromMenu', locale => {
    const baseUrl = Cypress.config('baseUrl');

    // Navigate away to trigger 'Are you sure' dialogue about unsaved changes
    cy.get('button[title="Main navigation"]')
        .should('not.be.empty')
        .click();
    cy.get('#mainMenu .menu-item-container')
        .should('not.be.empty')
        .contains('Home')
        .click();
    // Say yes to 'Are you sure' if it does trigger
    cy.url()
        .then($url => {
            if ($url !== `${baseUrl}/`) {
                cy.contains(locale.confirmationTitle)
                    .closest('[role="document"]')
                    .contains(locale.confirmButtonLabel)
                    .click();
            }
        });
});

/**
 * ckeditor takes a moment to load, making tests fail randomly
 * Call this after a page with a rich editor loads, to make sure at least the first editor has loaded,
 * before you start looking for elements
 * note: the first test in admin-edit where we check the tabs are present, does NOT like this test!
 */
Cypress.Commands.add('waitForCkeditorToHaveLoaded', () => {
    cy.get('#cke_editor1 iframe')
        .should($iframe => {
            const body = $iframe
                .contents()
                .find('body')
                .get(0);
            expect(body).to.be.ok;
        });

Cypress.Commands.add('percyDeviceSnapshot', (type, title = 'Snapshot', options = {}) => {
    const widths = {
        mobile: 480,
        tablet: 600,
        desktop: 960,
        wide: 1280,
    };
    const viewportHeight = 2000;
    const viewportWidth = widths[type];
    cy.viewport(viewportWidth, viewportHeight);
    cy.wait(1000); // Allow time for resize handlers to fire
    cy.percySnapshot(`${title} - ${type}`, {
        ...options,
        widths: [viewportWidth],
    });
});
