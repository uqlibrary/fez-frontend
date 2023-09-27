/**
 * CKEditor-specific
 */

// USAGE : cy.typeCKEditor('editor1', '<p>This is some text</p>');
Cypress.Commands.add('typeCKEditor', (element, content) => {
    return cy
        .get('[data-testid="' + element + '"] .ck-editor__main p')
        .should('exist')
        .type(content);
});

// Read text from CKEditor instance
// Usage example:
// cy.readCKEditor('editor1')
//     .then(text => {
//         expect(text).to.contain(expected);
//     });
Cypress.Commands.add('readCKEditor', element => {
    return cy.get(`[data-testid="${element}"] .ck-editor__main p`).should('exist');
    // .should('be.visible')
});

// check content of from CKEditor instance
// Usage example:
// cy.checkCKEditor('rek-title', 'words);
Cypress.Commands.add('checkCKEditor', (element, content = null) => {
    if (content !== null) {
        return cy
            .get('[data-testid="' + element + '"] .ck-editor__main p')
            .should('exist')
            .then(text => {
                expect(text).to.contain(content);
            });
    } else {
        return cy
            .get('[data-testid="' + element + '"] .ck-editor__main p')
            .should('exist')
            .find('[data-cke-filler="true"]')
            .should('exist');
    }
});

Cypress.Commands.add('assertCKEditorEmpty', element => {
    return cy
        .get('[data-testid="' + element + '"] .ck-editor__main p')
        .should('exist')
        .find('[data-cke-filler="true"]')
        .should('exist');
});
