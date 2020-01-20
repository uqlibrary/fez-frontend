import React from 'react';
import { ContributorForm } from './ContributorForm';
import { rtlRender, withRedux, fireEvent, waitForElement } from 'test-utils';
import * as repositories from 'repositories';

describe('ContributorForm', () => {
    describe('For Researchers adding non-NTRO work', () => {
        it('should display only Name field for non-NTRO work (except datasets)', () => {
            const { getByTestId } = rtlRender(<ContributorForm onSubmit={jest.fn()} />);
            const contributorForm = getByTestId('contributorForm');
            expect(contributorForm.children.length).toBe(1);
            expect(getByTestId('nameAsPublishedField')).toHaveAttribute('aria-invalid', 'false');
        });

        it('should display only Name field highlighted with error when required', () => {
            const { getByTestId } = rtlRender(<ContributorForm onSubmit={jest.fn()} required />);
            const contributorForm = getByTestId('contributorForm');
            expect(contributorForm.children.length).toBe(1);
            expect(getByTestId('nameAsPublishedField')).toHaveAttribute('aria-invalid', 'true');
        });

        it('should display Name and Role fields for datasets', () => {
            const { getByTestId } = rtlRender(
                withRedux()(<ContributorForm onSubmit={jest.fn()} showRoleInput required />),
            );
            const contributorForm = getByTestId('contributorForm');
            expect(contributorForm.children.length).toBe(2);
            expect(getByTestId('nameAsPublishedField')).toHaveAttribute('aria-invalid', 'true');
            expect(getByTestId('Creatorrole-input')).toHaveAttribute('disabled');
        });

        it('should enable role input as soon as user types into name field for dataset', () => {
            const { getByTestId } = rtlRender(
                withRedux()(<ContributorForm onSubmit={jest.fn()} showRoleInput required />),
            );

            fireEvent.change(getByTestId('nameAsPublishedField'), { target: { value: 'Test name' } });
            expect(getByTestId('Creatorrole-input')).not.toHaveAttribute('disabled');
        });
    });

    describe('For researchers adding NTRO work', () => {
        it('should initially display affiliation picker and name as published fields only', () => {
            const { getByTestId } = rtlRender(<ContributorForm onSubmit={jest.fn()} isNtro />);
            const contributorForm = getByTestId('contributorForm');
            expect(contributorForm.children.length).toBe(2);

            // assert name as published field is initially disabled
            expect(getByTestId('nameAsPublishedField')).toHaveAttribute('disabled');
            expect(getByTestId('nameAsPublishedField')).toHaveAttribute('aria-invalid', 'false');
        });

        it('should enable and display error for name as published field as soon as affiliation is changed', () => {
            const { getByTestId, getByRole, getByText } = rtlRender(
                withRedux()(<ContributorForm onSubmit={jest.fn()} isNtro />),
            );

            fireEvent.click(getByRole('button'));
            const menu = waitForElement(getByRole('presentation'));
            fireEvent.click(getByText(/UQ/), menu);

            // assert name as published field is enabled and displayed in error state
            expect(getByTestId('nameAsPublishedField')).not.toHaveAttribute('disabled');
            expect(getByTestId('nameAsPublishedField')).toHaveAttribute('aria-invalid', 'true');
        });

        it('should display UQ identifier as soon as affiliation is changed to "UQ"', () => {
            const { getByTestId, getByRole, getByText } = rtlRender(
                withRedux()(<ContributorForm onSubmit={jest.fn()} isNtro />),
            );

            const contributorForm = getByTestId('contributorForm');
            expect(contributorForm.children.length).toBe(2);

            fireEvent.click(getByRole('button'));
            const menu = waitForElement(getByRole('presentation'));
            fireEvent.click(getByText(/UQ/), menu);

            expect(contributorForm.children.length).toBe(3);
            expect(getByTestId('UQAuthorID-input')).toHaveAttribute('disabled');

            // assert 'Add author' button is not disabled
            expect(getByTestId('submit-author')).toHaveAttribute('disabled', '');
        });

        it('should display org affiliation fields as soon as affiliation is changed to "Not UQ"', () => {
            const { getByTestId, getByRole, getByText } = rtlRender(
                withRedux()(<ContributorForm onSubmit={jest.fn()} isNtro />),
            );

            const contributorForm = getByTestId('contributorForm');
            expect(contributorForm.children.length).toBe(2);

            fireEvent.click(getByRole('button'));
            const menu = waitForElement(getByRole('presentation'));
            fireEvent.click(getByText(/Not UQ/), menu);

            try {
                getByTestId('UQAuthorID-input');
            } catch (e) {
                expect(e).toBeInstanceOf(Error);
            }

            expect(getByTestId('org-affiliation-name')).toHaveAttribute(
                'placeholder',
                'Enter the primary affiliated organisation',
            );

            expect(getByTestId('org-affiliation-type')).toHaveAttribute('role', 'button');

            // assert 'Add author' button is disabled as well
            expect(getByTestId('submit-author')).toHaveAttribute('disabled');
        });
    });

    describe('For Admin users adding work', () => {
        it('should display affiliation selector, name and UQ identifier', () => {
            const { getByTestId } = rtlRender(
                withRedux()(<ContributorForm onSubmit={jest.fn()} canEdit showIdentifierLookup displayCancel />),
            );

            const contributorForm = getByTestId('contributorForm');
            expect(contributorForm.children.length).toBe(3);
            expect(getByTestId('UQAuthorID-input')).not.toHaveAttribute('disabled');

            // assert 'Add author' button is disabled
            expect(getByTestId('submit-author')).toHaveAttribute('disabled', '');
            expect(getByTestId('cancel-submit-author')).toHaveAttribute('disabled', '');
        });

        it('should hide UQ identifier as soon as affiliation is changed to "Not UQ"', () => {
            const { getByTestId, getByRole, getByText } = rtlRender(
                withRedux()(<ContributorForm onSubmit={jest.fn()} canEdit showIdentifierLookup displayCancel />),
            );

            const contributorForm = getByTestId('contributorForm');
            expect(contributorForm.children.length).toBe(3);

            fireEvent.click(getByRole('button'));
            const menu = waitForElement(getByRole('presentation'));
            fireEvent.click(getByText(/Not UQ/), menu);

            try {
                getByTestId('UQAuthorID-input');
            } catch (e) {
                expect(e).toBeInstanceOf(Error);
            }

            expect(getByTestId('org-affiliation-name')).toHaveAttribute(
                'placeholder',
                'Enter the primary affiliated organisation',
            );

            expect(getByTestId('org-affiliation-type')).toHaveAttribute('role', 'button');

            // assert 'Add author' button is disabled
            expect(getByTestId('submit-author')).toHaveAttribute('disabled', '');
            expect(getByTestId('cancel-submit-author')).toHaveAttribute('disabled', '');
        });

        it('should display affiliation selector, name as published, UQ identifier and creator role fields for dataset', () => {
            const { getByTestId } = rtlRender(
                withRedux()(
                    <ContributorForm onSubmit={jest.fn()} canEdit showIdentifierLookup displayCancel showRoleInput />,
                ),
            );

            const contributorForm = getByTestId('contributorForm');
            expect(contributorForm.children.length).toBe(4);
            expect(getByTestId('UQAuthorID-input')).not.toHaveAttribute('disabled');

            // assert 'Add author' button is disabled
            expect(getByTestId('submit-author')).toHaveAttribute('disabled', '');
            expect(getByTestId('cancel-submit-author')).toHaveAttribute('disabled', '');
        });
    });
});
