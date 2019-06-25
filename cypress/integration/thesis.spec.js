context('Thesis', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000/rhdsubmission?user=s2222222');
        // cy.visit('http://localhost:3000/rhdsubmission?user=s2222222');
        cy.get('#unsupportedBrowser.card button').then($button => {
            // Button is only visible if browser is unsupported.
            if ($button.filter(':visible')) {
                $button.click();
            }
        });
        cy.wait(2000);
    });

    afterEach(() => {
        // Add this when we have a dialog when navigating away from a form
        cy.window().then(win => (win.onbeforeunload = undefined));
    });

    it('Submitting a thesis successfully', () => {
        cy.viewport(1000,800);
        cy.get('button#submit-thesis').should('to.have.attr', 'disabled');
        cy.get('.alert-text')
            .find('ul')
            .children()
            .should('have.length', 8);


        // Title
        cy.type_ckeditor('editor1', '<p>This is a thesis title</p>');
        cy.wait(1000);
        cy.get('.alert-text')
            .find('ul')
            .children()
            .should('have.length', 7);
        // Abstract
        cy.type_ckeditor('editor2', '<p>This is the thesis abstract</p>');
        cy.wait(1000);
        cy.get('.alert-text')
            .find('ul')
            .children()
            .should('have.length', 6);


        // Thesis subtype
        cy.get('#thesis-subtype').click();
        cy.get('li[data-value="MPhil Thesis"]').click();
        cy.get('div[id="menu-"]')
            .get('div[aria-hidden="true"]')
            .click({force: true, multiple: true});
        cy.wait(1000);
        cy.get('.alert-text')
            .find('ul')
            .children()
            .should('have.length', 5);
        cy.get('button#submit-thesis').should('to.have.attr', 'disabled');


        // Enrolling unit
        cy.get('input[label="Enrolling unit"]').type('a');
        cy.get('li[id="Enrollingunit-item-0"]').click();
        cy.wait(1000);
        cy.get('.alert-text')
            .find('ul')
            .children()
            .should('have.length', 4);
        cy.get('button#submit-thesis').should('to.have.attr', 'disabled');


        // Supervisors
        cy.get('input[id="supervisors-name-as-published-field"]').type('Ky Lane', {delay: 200});
        cy.get('.alert-text')
            .find('ul')
            .children()
            .should('have.length', 4);
        cy.get('button#submit-thesis').should('to.have.attr', 'disabled');
        cy.get('input[id="supervisors-name-as-published-field"]').type('{enter}', {delay: 200});
        cy.get('.alert-text')
            .find('ul')
            .children()
            .should('have.length', 3);
        cy.get('button#submit-thesis').should('to.have.attr', 'disabled');
        cy.get('button[aria-label="Remove this item"]').click();
        cy.get('button')
            .contains('Yes')
            .click();
        cy.get('.alert-text')
            .find('ul')
            .children()
            .should('have.length', 4);
        cy.get('button#submit-thesis').should('to.have.attr', 'disabled');
        cy.get('input[id="supervisors-name-as-published-field"]').type('Vishal Asai{enter}', {delay: 100});
        cy.get('.alert-text')
            .find('ul')
            .children()
            .should('have.length', 3);
        cy.get('button#submit-thesis').should('to.have.attr', 'disabled');
        cy.get('input[id="supervisors-name-as-published-field"]').type('Ky Lane{enter}', {delay: 100});
        cy.get('ul.ContributorList')
            .children()
            .should('have.length', 2);
        cy.get('ul.ContributorList')
            .children()
            .first()
            .should('contain', 'Vishal Asai');
        cy.get('ul.ContributorList')
            .children()
            .last()
            .should('contain', 'Ky Lane');
        cy.get('button[aria-label="Move item up the order"]').click();
        cy.get('ul.ContributorList')
            .children()
            .last()
            .should('contain', 'Vishal Asai');
        cy.get('ul.ContributorList')
            .children()
            .first()
            .should('contain', 'Ky Lane');
        cy.get('button[aria-label="Remove all items').click();
        cy.get('button').contains('Yes').click();
        cy.get('.alert-text')
            .find('ul')
            .children()
            .should('have.length', 4);
        cy.get('input[id="supervisors-name-as-published-field"]').type('Ky Lane{enter}', {delay: 100});
        cy.get('.alert-text')
            .find('ul')
            .children()
            .should('have.length', 3);


        // Field of Research
        cy.get('input[label="Field of research"]').type('a');
        cy.get('li[id="Fieldofresearch-item-0"]').click();
        cy.get('.alert-text')
            .find('ul')
            .children()
            .should('have.length', 2);
        cy.get('button#submit-thesis').should('to.have.attr', 'disabled');
        cy.get('div[class="ListRow-Field of research-0101 Pure Mathematics"]')
            .get('button[title="Remove this item"]')
            .click();
        cy.get('button')
            .contains('Yes')
            .click();
        cy.get('.alert-text')
            .find('ul')
            .children()
            .should('have.length', 3);
        cy.get('input[label="Field of research"]').type('a');
        cy.get('.alert-text')
            .find('ul')
            .children()
            .should('have.length', 3);
        cy.get('li[id="Fieldofresearch-item-0"]').click();
        cy.get('.alert-text')
            .find('ul')
            .children()
            .should('have.length', 2);
        cy.get('button[title="Remove all items"]')
            .click();
        cy.get('button')
            .contains('Yes')
            .click();
        cy.get('.alert-text')
            .find('ul')
            .children()
            .should('have.length', 3);
        cy.get('button#submit-thesis').should('to.have.attr', 'disabled');
        cy.get('input[label="Field of research"]').type('a');
        cy.get('li[id="Fieldofresearch-item-0"]').click();
        cy.get('.alert-text')
            .find('ul')
            .children()
            .should('have.length', 2);
        cy.get('button#submit-thesis').should('to.have.attr', 'disabled');


        // Keywords
        cy.get('input#keywords-input').type('First Keyword{enter}', {
            delay: 100,
        });
        cy.get('.alert-text')
            .find('ul')
            .children()
            .should('have.length', 1);
        cy.get('button#submit-thesis').should('to.have.attr', 'disabled');
        cy.get('button[title="Remove this keyword"]').click();
        cy.get('button')
            .contains('Yes')
            .click();
        cy.get('.alert-text')
            .find('ul')
            .children()
            .should('have.length', 2);
        cy.get('input#keywords-input').type('Second Keyword{enter}', {
            delay: 100,
        });
        cy.get('.alert-text')
            .find('ul')
            .children()
            .should('have.length', 1);
        cy.get('button[title="Remove all keywords"]').click();
        cy.get('button')
            .contains('Yes')
            .click();
        cy.wait(5000);
        cy.get('.alert-text')
            .find('ul')
            .children()
            .should('have.length', 2);
        cy.get('input#keywords-input').type('Third Keyword{enter}', {
            delay: 100,
        });
        cy.get('.alert-text')
            .find('ul')
            .children()
            .should('have.length', 1);


        // Files?
        // const fileName = '../Assets/test.jpg';
        // cy.fixture(fileName).then(fileContent => {
        //     cy.get('[data-cy="dropzone"]').upload(
        //         { fileContent, fileName, mimeType: 'image/jpg' },
        //         { subjectType: 'drag-n-drop' },
        //     );
        // });

        cy.wait(60000);
    });
});
