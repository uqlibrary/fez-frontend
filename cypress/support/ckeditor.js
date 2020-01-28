/**
 * CKEditor-specific
 */

/**
 * Allows waiting until certain conditions are satisfied.
 * https://www.npmjs.com/package/cypress-wait-until
 */
import 'cypress-wait-until';

const waitForCKEditorInstance = instanceName =>
    cy.waitUntil(() =>
        cy.window()
            .then(win => (((win.CKEDITOR || {}).instances || {})[instanceName] || {}).status === 'ready'),
    );

// Allows the targeting of CKEditors
// CKeditor dynamically names instances as "editor1", "editor2" etc.
// USAGE : cy.typeCKEditor('editor1', '<p>This is some text</p>');
Cypress.Commands.add('typeCKEditor', (element, content) => {
    waitForCKEditorInstance(element);
    cy.log(`Found #cke_${element}`);
    cy.window()
        .then(win => {
            win.CKEDITOR.instances[element].setData(content);
            cy.log(`Typed "${content}"`);
        });
});

// Read text from CKEditor instance
// Usage example:
// cy.readCKEditor('editor1')
//     .then(text => {
//         cy.wrap(text)
//             .should('eq', expected);
//     });
Cypress.Commands.add('readCKEditor', element => {
    waitForCKEditorInstance(element);
    cy.window()
        .then(win => {
            return win.CKEDITOR.instances[element].getData();
        });
});

Cypress.Commands.add('killCKEditor', () => {
    cy.window()
        .then(win => {
            Object.keys((win.CKEDITOR || {}).instances || {})
                .forEach(instance => {
                    win.CKEDITOR.instances[instance].removeAllListeners();
                    win.CKEDITOR.instances[instance].destroy(false);
                });
            (win.CKEDITOR || {}).removeAllListeners && win.CKEDITOR.removeAllListeners();
        });
});
