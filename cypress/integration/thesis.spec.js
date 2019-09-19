context('Thesis', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000/rhdsubmission?user=s2222222');
        cy.closeUnsupported();
        cy.wait(2000);
    });

    afterEach(() => {
        // Add this when we have a dialog when navigating away from a form
        cy.window()
            .then(win => (win.onbeforeunload = undefined));
    });

    it('Submitting a thesis successfully', () => {
        cy.get('button#submit-thesis')
            .should('to.have.attr', 'disabled');
        cy.get('.alert-text')
            .find('ul')
            .children()
            .should('have.length', 8);

        // Title
        cy.type_ckeditor('editor1', '<p>This is a thesis title</p>');
        cy.get('.alert-text')
            .find('ul')
            .children()
            .should('have.length', 7);
        // Abstract
        cy.type_ckeditor('editor2', '<p>This is the thesis abstract</p>');
        cy.get('.alert-text')
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
        cy.get('.alert-text')
            .find('ul')
            .children()
            .should('have.length', 5);
        cy.get('button#submit-thesis')
            .should('to.have.attr', 'disabled');

        // Enrolling unit
        cy.get('input[label="Enrolling unit"]')
            .type('a');
        cy.get('li[id="Enrollingunit-item-0"]')
            .click();
        cy.get('.alert-text')
            .find('ul')
            .children()
            .should('have.length', 4);
        cy.get('button#submit-thesis')
            .should('to.have.attr', 'disabled');

        // Supervisors
        cy.get('input[id="supervisors-name-as-published-field"]')
            .type('Ky Lane', { delay: 30 });
        cy.get('.alert-text')
            .find('ul')
            .children()
            .should('have.length', 4);
        cy.get('button#submit-thesis')
            .should('to.have.attr', 'disabled');
        cy.get('input[id="supervisors-name-as-published-field"]')
            .type('{enter}', { delay: 30 });
        cy.get('.alert-text')
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
        cy.get('.alert-text')
            .find('ul')
            .children()
            .should('have.length', 4);
        cy.get('button#submit-thesis')
            .should('to.have.attr', 'disabled');
        cy.get('input[id="supervisors-name-as-published-field"]')
            .type('Vishal Asai{enter}', { delay: 30 });
        cy.get('.alert-text')
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
        cy.get('.alert-text')
            .find('ul')
            .children()
            .should('have.length', 4);
        cy.get('input[id="supervisors-name-as-published-field"]')
            .type('Ky Lane{enter}', { delay: 30 });
        cy.get('.alert-text')
            .find('ul')
            .children()
            .should('have.length', 3);

        // Field of Research
        cy.get('input[label="Field of research"]')
            .type('a');
        cy.wait(1000); // Wait for suggestions
        cy.get('li[id="Fieldofresearch-item-0"]')
            .click();
        cy.get('.alert-text')
            .find('ul')
            .children()
            .should('have.length', 2);
        cy.get('button#submit-thesis')
            .should('to.have.attr', 'disabled');
        cy.get('div[class="ListRow-Fieldofresearch ListRow-Fieldofresearch-0101 Pure Mathematics"]')
            .get('button[title="Remove this item"]')
            .click();
        cy.get('button')
            .contains('Yes')
            .click();
        cy.get('.alert-text')
            .find('ul')
            .children()
            .should('have.length', 3);
        cy.get('input[label="Field of research"]')
            .type('a');
        cy.wait(1000); // Wait for suggestions
        cy.get('.alert-text')
            .find('ul')
            .children()
            .should('have.length', 3);
        cy.get('li[id="Fieldofresearch-item-0"]')
            .click();
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
        cy.get('button#submit-thesis')
            .should('to.have.attr', 'disabled');
        cy.get('input[label="Field of research"]')
            .type('a');
        cy.wait(1000); // Wait for suggestions
        cy.get('li[id="Fieldofresearch-item-0"]')
            .click();
        cy.get('.alert-text')
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
        cy.get('.alert-text')
            .find('ul')
            .children()
            .should('have.length', 1);
        cy.get('button#submit-thesis')
            .should('to.have.attr', 'disabled');
        cy.get('button[title="Remove this keyword"]')
            .click();
        cy.get('button')
            .contains('Yes')
            .click();
        cy.get('.alert-text')
            .find('ul')
            .children()
            .should('have.length', 2);
        cy.get('input#keywords-input')
            .type('Second Keyword{enter}', {
                delay: 30,
            });
        cy.get('.alert-text')
            .find('ul')
            .children()
            .should('have.length', 1);
        cy.get('button[title="Remove all keywords"]')
            .click();
        cy.get('button')
            .contains('Yes')
            .click();
        cy.get('.alert-text')
            .find('ul')
            .children()
            .should('have.length', 2);
        cy.get('input#keywords-input')
            .type('Third Keyword{enter}', {
                delay: 30,
            });
        cy.get('.ListRow-Keywords')
            .should('have.length', 1);
        cy.get('.alert-text')
            .find('ul')
            .children()
            .should('have.length', 1);
        cy.get('input#keywords-input')
            .type('Fourth Keyword, Fifth Keyword, Sixth Keyword{enter}', {
                delay: 30,
            });
        cy.get('.ListRow-Keywords')
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
        cy.get('.alert-text')
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
        cy.get('.alert-text')
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
        cy.get('div.alert-text')
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
