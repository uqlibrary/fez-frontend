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
// USAGE : cy.type_ckeditor('editor1', '<p>This is some text</p>');
Cypress.Commands.add('type_ckeditor', (element, content) => {
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
// cy.read_ckeditor('editor1')
//     .then(text => {
//         cy.wrap(text)
//             .should('eq', expected);
//     });
Cypress.Commands.add('read_ckeditor', element => {
    waitForCKEditorInstance(element);
    cy.window()
        .then(win => {
            return win.CKEDITOR.instances[element].getData();
        });
});
