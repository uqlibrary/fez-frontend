/**
 * CKEditor-specific
 */

const waitForCKEditorInstance = instanceName =>
    cy.window()
        .should('have.deep.property', `CKEDITOR.instances.${instanceName}.status`, 'ready');

// Allows the targeting of CKEditors
// CKeditor dynamically names instances as "editor1", "editor2" etc.
// USAGE : cy.typeCKEditor('editor1', '<p>This is some text</p>');
Cypress.Commands.add('typeCKEditor', (element, content) => {
    waitForCKEditorInstance(element);
    cy.log(`Found #cke_${element}`);
    cy.window()
        .its(`CKEDITOR.instances.${element}`)
        .invoke('setData', content)
        .then(() => cy.log(`Typed "${content}"`));
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
    return cy
        .window()
        .its(`CKEDITOR.instances.${element}`)
        .invoke('getData');
});

Cypress.Commands.add('killCKEditor', () => {
    cy.window()
        .its('CKEDITOR.instances')
        .then(instances =>
            Object.keys(instances)
                .forEach(instance => {
                    instances[instance].removeAllListeners();
                    instances[instance].destroy(false);
                }),
        )
        .then(() =>
            cy
                .window()
                .its('CKEDITOR')
                .invoke('removeAllListeners'),
        );
});
