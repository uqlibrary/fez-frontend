// import { default as componentsLocale } from '../../src/locale/components';
// import internalTitleSearchList from '../../src/mock/data/records/internalTitleSearchList.js';

context('Scroll to top module', () => {
    beforeEach(() => {
        cy.visit('/');
        cy.closeUnsupported();
    });

    it('Scroll to the bottom of the homepage, then click the scroll to top and the tabs should be visible', () => {
        // Have to work out how to return the current Y scroll value for a div container
        cy.get('button#scrolltopbtn')
            .should('have.css', 'opacity', '0');
        cy.wait(1000);
        cy.get('#content-container')
            .scrollTo('bottom');
        cy.get('button#scrolltopbtn')
            .should('have.css', 'opacity', '0.5');
        cy.wait(1000);
        cy.get('button#scrolltopbtn')
            .click();
        cy.wait(1000);
        cy.get('button#scrolltopbtn')
            .should('have.css', 'opacity', '0');
    });
});
