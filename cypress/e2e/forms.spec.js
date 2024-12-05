import { myRecordsList } from '../../src/mock/data/records';

const record = myRecordsList.data[0];
context('forms', () => {
    /**
     * This test asserts that the data submitted by forms will not include corrupted files.
     * How does it work? We intercept PUT requests made to S3 pre-signed URLs using api mock
     * (axios-mock-adapter instance). In this middleware, we assert that the request's payload is an instance of
     * WebApi/File. If the data submitted by a form is malformed, the mocked endpoint will throw an exception making
     * the form submission and the test below to fail.
     *
     * Notes:
     * - in order for this to work, we have to assert that the form has been submitted correctly. e.g. check for a
     * submission confirmation message. For this, we need to make sure the form properly handles failed
     * uploads. e.g. displays an error message.
     * - we use FixRecords component here for the sake of simplicity. Should this form be removed in the future, please
     * refactor this test to use another form that has a field based on FileUploader component and uses
     * repositories/files::putUploadFile() for uploading files.
     */
    it('should not upload corrupted files', () => {
        // fill up form
        cy.visit(`/records/${record.rek_pid}/fix`);
        cy.data('fix-action-select').click();
        cy.data('fix-action-options')
            .contains('I am the author')
            .click();
        cy.data('fez-datastream-info-input').attachFile('test.jpg', {
            subjectType: 'drag-n-drop',
        });
        cy.data('dsi-open-access-0-select').click();
        cy.data('dsi-open-access-0-option-2')
            .contains('Closed Access')
            .click();

        // submit form and make sure dialog message is shown
        cy.contains('button', 'Submit').click();
        cy.contains(/Your request has been submitted/i).should('be.visible');
    });
});
