context('Thesis', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000/rhdsubmission?user=s2222222');
        cy.wait(2000);
    });

    afterEach(() => {
        cy.killWindowUnloadHandler();
    });

    it('Submitting a thesis successfully', () => {
        cy.get('button#submit-thesis')
            .should('to.have.attr', 'disabled');
        cy.get('.Alert')
            .find('ul')
            .children()
            .should('have.length', 8);

        // Title
        cy.typeCKEditor('editor1', '<p>This is a thesis title</p>');
        cy.get('.Alert')
            .find('ul')
            .children()
            .should('have.length', 7);
        // Abstract
        cy.typeCKEditor('editor2', '<p>This is the thesis abstract</p>');
        cy.get('.Alert')
            .find('ul')
            .children()
            .should('have.length', 6);

        // Thesis subtype
        cy.get('#thesis-subtype')
            .click();
        cy.get('li[data-value="MPhil Thesis"]')
            .click();
        cy.get('div[id="menu-"]')
            .get('div[aria-hidden="true"]')
            .click({ force: true, multiple: true });
        cy.get('.Alert')
            .find('ul')
            .children()
            .should('have.length', 5);
        cy.get('button#submit-thesis')
            .should('to.have.attr', 'disabled');

        // Enrolling unit
        cy.get('#org-unit-name-field')
            .type('a');
        cy.clickAutoSuggestion('org-unit-name-field', 0);
        cy.get('.Alert')
            .find('ul')
            .children()
            .should('have.length', 4);
        cy.get('button#submit-thesis')
            .should('to.have.attr', 'disabled');

        // Supervisors
        cy.get('input[id="supervisors-name-as-published-field"]')
            .type('Ky Lane', { delay: 30 });
        cy.get('.Alert')
            .find('ul')
            .children()
            .should('have.length', 4);
        cy.get('button#submit-thesis')
            .should('to.have.attr', 'disabled');
        cy.get('input[id="supervisors-name-as-published-field"]')
            .type('{enter}', { delay: 30 });
        cy.get('.Alert')
            .find('ul')
            .children()
            .should('have.length', 3);
        cy.get('button#submit-thesis')
            .should('to.have.attr', 'disabled');
        cy.get('button[aria-label="Remove this item"]')
            .click();
        cy.get('button')
            .contains('Yes')
            .click();
        cy.get('.Alert')
            .find('ul')
            .children()
            .should('have.length', 4);
        cy.get('button#submit-thesis')
            .should('to.have.attr', 'disabled');
        cy.get('input[id="supervisors-name-as-published-field"]')
            .type('Vishal Asai{enter}', { delay: 30 });
        cy.get('.Alert')
            .find('ul')
            .children()
            .should('have.length', 3);
        cy.get('button#submit-thesis')
            .should('to.have.attr', 'disabled');
        cy.get('input[id="supervisors-name-as-published-field"]')
            .type('Ky Lane{enter}', { delay: 30 });
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
        cy.get('button[aria-label="Move item up the order"]')
            .click();
        cy.get('ul.ContributorList')
            .children()
            .last()
            .should('contain', 'Vishal Asai');
        cy.get('ul.ContributorList')
            .children()
            .first()
            .should('contain', 'Ky Lane');
        cy.get('button[aria-label="Remove all items')
            .click();
        cy.get('button')
            .contains('Yes')
            .click();
        cy.get('.Alert')
            .find('ul')
            .children()
            .should('have.length', 4);
        cy.get('input[id="supervisors-name-as-published-field"]')
            .type('Ky Lane{enter}', { delay: 30 });
        cy.get('.Alert')
            .find('ul')
            .children()
            .should('have.length', 3);

        // Field of Research
        cy.get('#filtered-field-of-research-input')
            .type('a');
        cy.clickAutoSuggestion('filtered-field-of-research-input', 0);
        cy.get('.Alert')
            .find('ul')
            .children()
            .should('have.length', 2);
        cy.get('button#submit-thesis')
            .should('to.have.attr', 'disabled');
        cy.get('#filtered-field-of-research-list-row-0')
            .should('contain.text', '0101 Pure Mathematics')
            .get('#filtered-field-of-research-list-row-0-delete')
            .click();
        cy.get('button')
            .contains('Yes')
            .click();
        cy.get('.Alert')
            .find('ul')
            .children()
            .should('have.length', 3);
        cy.get('#filtered-field-of-research-input')
            .type('b');
        cy.clickAutoSuggestion('filtered-field-of-research-input', 0);
        cy.get('.Alert')
            .find('ul')
            .children()
            .should('have.length', 2);
        cy.get('#delete-all-filtered-field-of-research')
            .click();
        cy.get('button')
            .contains('Yes')
            .click();
        cy.get('.Alert')
            .find('ul')
            .children()
            .should('have.length', 3);
        cy.get('button#submit-thesis')
            .should('to.have.attr', 'disabled');
        cy.get('#filtered-field-of-research-input')
            .type('a');
        cy.clickAutoSuggestion('filtered-field-of-research-input', 0);
        cy.get('.Alert')
            .find('ul')
            .children()
            .should('have.length', 2);
        cy.get('button#submit-thesis')
            .should('to.have.attr', 'disabled');

        // Keywords
        cy.get('input#keywords-input')
            .type('First Keyword{enter}', {
                delay: 30,
            });
        cy.get('.Alert')
            .find('ul')
            .children()
            .should('have.length', 1);
        cy.get('button#submit-thesis')
            .should('to.have.attr', 'disabled');
        cy.get('#keywords-list-row-0-delete')
            .click();
        cy.get('button')
            .contains('Yes')
            .click();
        cy.get('.Alert')
            .find('ul')
            .children()
            .should('have.length', 2);
        cy.get('input#keywords-input')
            .type('Second Keyword{enter}', {
                delay: 30,
            });
        cy.get('.Alert')
            .find('ul')
            .children()
            .should('have.length', 1);
        cy.get('#delete-all-keywords')
            .click();
        cy.get('button')
            .contains('Yes')
            .click();
        cy.get('.Alert')
            .find('ul')
            .children()
            .should('have.length', 2);
        cy.get('input#keywords-input')
            .type('Third Keyword{enter}', {
                delay: 30,
            });
        cy.get('#keywords-list')
            .should('have.length', 1);
        cy.get('.Alert')
            .find('ul')
            .children()
            .should('have.length', 1);
        cy.get('input#keywords-input')
            .type('Fourth Keyword|Fifth Keyword|Sixth Keyword{enter}', {
                delay: 30,
            });
        cy.get('#keywords-list')
            .children()
            .should('have.length', 4);

        // Files?
        const fileName = 'test.jpg';
        cy.fixture(fileName)
            .then(fileContent => {
                cy.get('div#FileUploadDropZone')
                    .upload(
                        { fileContent, fileName: fileName, mimeType: 'image/jpg' },
                        { subjectType: 'drag-n-drop' },
                    );
            });
        cy.get('button[title="Remove this file"]')
            .click();
        cy.get('button')
            .contains('Yes')
            .click();
        cy.get('.Alert')
            .find('ul')
            .children()
            .should('have.length', 1);

        const fileNameTwo = 'test_two.jpg';
        cy.fixture(fileNameTwo)
            .then(fileContent => {
                cy.get('div#FileUploadDropZone')
                    .upload(
                        { fileContent, fileName: fileNameTwo, mimeType: 'image/jpg' },
                        { subjectType: 'drag-n-drop' },
                    );
            });
        cy.get('button[title="Remove all files from the upload queue"]')
            .click();
        cy.get('button')
            .contains('Yes')
            .click();
        cy.get('.Alert')
            .find('ul')
            .children()
            .should('have.length', 1);

        const fileNameThree = 'test three.jpg';
        cy.fixture(fileNameThree)
            .then(fileContent => {
                cy.get('div#FileUploadDropZone')
                    .upload(
                        { fileContent, fileName: fileNameThree, mimeType: 'image/jpg' },
                        { subjectType: 'drag-n-drop' },
                    );
            });
        cy.get('div.Alert')
            .should('have.length', 2);
        cy.fixture(fileName)
            .then(fileContent => {
                cy.get('div#FileUploadDropZone')
                    .upload(
                        { fileContent, fileName, mimeType: 'image/jpg' },
                        { subjectType: 'drag-n-drop' },
                    );
            });
        cy.fixture(fileNameTwo)
            .then(fileContent => {
                cy.get('div#FileUploadDropZone')
                    .upload(
                        { fileContent, fileName: fileNameTwo, mimeType: 'image/jpg' },
                        { subjectType: 'drag-n-drop' },
                    );
            });
        // Ready to submit
        cy.get('button#submit-thesis')
            .should('not.have.attr', 'disabled');
    });
});
