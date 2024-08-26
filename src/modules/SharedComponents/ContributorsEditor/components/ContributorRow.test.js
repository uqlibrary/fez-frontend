import React from 'react';
import ContributorRow from './ContributorRow';
import { createMatchMedia } from 'test-utils';
import { authorsSearch } from 'mock/data';
import { AFFILIATION_TYPE_NOT_UQ } from 'config/general';
import { rtlRender, fireEvent, waitFor } from 'test-utils';

function setup(testProps = {}) {
    // build full props list required by the component
    const props = {
        index: 0,
        contributor: { nameAsPublished: 'A. Smith' },
        canMoveUp: false,
        canMoveDown: false,
        showIdentifierLookup: false,
        showRoleInput: false,
        showContributorAssignment: false,
        disabledContributorAssignment: false,
        disabled: false,
        width: 'md',
        required: false,
        canEdit: false,
        locale: {
            suffix: ' listed contributor',
            moveUpHint: 'Move record up the order',
            moveDownHint: 'Move record down the order',
            deleteHint: 'Remove this record',
            editHint: 'Edit this record',
            selectHint: 'Select this record ([name]) to assign it to you',
            lockedTooltip: 'You are not able to edit this row',
            deleteRecordConfirmation: {
                confirmationTitle: 'Delete record',
                confirmationMessage: 'Are you sure you want to delete this record?',
                cancelButtonLabel: 'No',
                confirmButtonLabel: 'Yes',
            },
        },
        contributorRowId: 'test-list-row',
        ...testProps,
    };
    return rtlRender(<ContributorRow {...props} />);
}

describe('Component ContributorRow', () => {
    beforeAll(() => {
        window.matchMedia = createMatchMedia(window.innerWidth);
    });

    it('should render with default props', () => {
        const props = {
            contributor: { nameAsPublished: 'A. Smith' },
            contributorRowId: 'test-list-row',
            index: 0,
        };
        const { container } = rtlRender(<ContributorRow {...props} />);
        expect(container).toMatchSnapshot();
    });

    it('a row with index and contributor set, renders only name and delete button', () => {
        const { container } = setup({
            index: 0,
        });
        expect(container).toMatchSnapshot();
    });

    it('should render with missing aria label if selectHint prop is falsy', () => {
        const { container } = setup({
            locale: {
                selectHint: '',
            },
        });
        expect(container).toMatchSnapshot();
    });

    it('a row with index and contributor set, renders only name and delete button for mobile view', () => {
        const { container } = setup({
            index: 0,
            width: 'xs',
        });
        expect(container).toMatchSnapshot();
    });

    it('a row with index and contributor with author details set and set as selected', () => {
        const { container } = setup({
            ...authorsSearch.data[0],
            index: 0,
            showIdentifierLookup: true,
            contributor: {
                nameAsPublished: 'J. Smith',
                selected: true,
            },
        });
        expect(container).toMatchSnapshot();
    });

    it('should render a row with a disabled contributor', () => {
        const { container } = setup({
            contributor: {
                disabled: true,
            },
        });
        expect(container).toMatchSnapshot();
    });

    it('a row with index and creator with creator role set and set as selected', () => {
        const { container } = setup({
            ...authorsSearch.data[0],
            index: 0,
            showRoleInput: true,
            contributor: {
                nameAsPublished: 'J. Smith',
                selected: true,
                creatorRole: 'Investigator',
            },
        });
        expect(container).toMatchSnapshot();
    });

    it('a row with index and contributor with author details set and set as selected for mobile view', () => {
        const { container } = setup({
            ...authorsSearch.data[0],
            index: 0,
            showIdentifierLookup: true,
            contributor: {
                nameAsPublished: 'J. Smith',
                selected: true,
            },
        });
        expect(container).toMatchSnapshot();
    });

    it('a row with index and creator with creator role set and set as selected for mobile view', () => {
        const { container } = setup({
            ...authorsSearch.data[0],
            index: 0,
            showRoleInput: true,
            contributor: {
                nameAsPublished: 'J. Smith',
                selected: true,
                creatorRole: 'Investigator',
            },
        });
        expect(container).toMatchSnapshot();
    });

    it('a row with index and contributor with author details set, contributor author details & delete button', () => {
        const contributor = {
            nameAsPublished: 'J. Smith',
            ...authorsSearch.data[0],
        };
        const { container } = setup({
            contributor,
            index: 0,
            showIdentifierLookup: true,
        });
        expect(container).toMatchSnapshot();
    });

    it('a row with index and contributor set, renders reorder buttons, contributor assignment & delete button', () => {
        const contributor = {
            nameAsPublished: 'J. Smith',
            ...authorsSearch.data[0],
        };
        const { container } = setup({
            contributor,
            index: 0,
            canMoveUp: true,
            canMoveDown: true,
            showContributorAssignment: true,
        });
        expect(container).toMatchSnapshot();
    });

    it('a row with index and contributor set calls move up function', () => {
        const testFunction = jest.fn();
        const contributor = {
            nameAsPublished: 'J. Smith',
            ...authorsSearch.data[0],
        };
        const { queryByRole } = setup({
            contributor,
            index: 0,
            canMoveUp: true,
            onMoveUp: testFunction,
        });

        expect(queryByRole('button', { name: 'Move record up the order' })).toBeInTheDocument();
        expect(queryByRole('button', { name: 'Move record down the order' })).not.toBeInTheDocument();
        fireEvent.click(queryByRole('button', { name: 'Move record up the order' }));
        expect(testFunction).toBeCalled();
    });

    it('a row with index and contributor set calls move down function', () => {
        const testFunction = jest.fn();
        const { queryByRole } = setup({
            index: 0,
            canMoveDown: true,
            onMoveDown: testFunction,
        });

        expect(queryByRole('button', { name: 'Move record down the order' })).toBeInTheDocument();
        fireEvent.click(queryByRole('button', { name: 'Move record down the order' }));

        expect(testFunction).toBeCalled();
        expect(queryByRole('button', { name: 'Move record up the order' })).not.toBeInTheDocument();
        testFunction.mockReset();
    });

    it('a row with index and contributor set calls assignment function', () => {
        const testFunction = jest.fn();
        const { getByRole } = setup({
            index: 0,
            showContributorAssignment: true,
            onSelect: testFunction,
        });

        fireEvent.click(getByRole('listitem', { name: 'Select this record (A. Smith) to assign it to you' }));
        expect(testFunction).toBeCalled;
    });

    it('a row with index and contributor set calls delete function', () => {
        const testFunction = jest.fn();
        const { getByRole } = setup({
            index: 0,
            onDelete: testFunction,
        });

        fireEvent.click(getByRole('button', { name: 'Remove this record' }));
        expect(testFunction).toBeCalled;
    });

    it('should select when it is not yet selected enabled', () => {
        const testFunction = jest.fn();

        const { getByRole } = setup({
            index: 0,
            disabled: false,
            contributor: {
                selected: false,
                nameAsPublished: 'J. Smith',
            },
            enableSelect: true,
            onSelect: testFunction,
        });

        fireEvent.click(getByRole('listitem', { name: 'Select this record (J. Smith) to assign it to you' }));
        expect(testFunction).toBeCalledWith(0);
    });

    it('should select when it is not yet selected disabled', () => {
        const testFunction = jest.fn();

        const { getByTestId } = setup({
            index: 0,
            disabled: true,
            contributor: {
                selected: false,
                nameAsPublished: 'J. Smith',
            },
            enableSelect: true,
            onSelect: testFunction,
        });

        fireEvent.click(getByTestId('test-list-row-0'));
        expect(testFunction).not.toBeCalled();
    });

    it('should deselect when it is already selected', () => {
        const testFunction = jest.fn();
        const testObj = {
            index: 0,
            disabled: false,
            enableSelect: true,
            contributor: {
                selected: true,
                nameAsPublished: 'J. Smith',
            },
            onSelect: testFunction,
        };

        const { getByTestId } = setup(testObj);
        fireEvent.click(getByTestId('test-list-row-0'));
        expect(testFunction).toBeCalledWith(testObj.index);
    });

    it('should attempt to assign the current author when keyboard submit', () => {
        const testFn = jest.fn();
        const contributor = {
            ...authorsSearch.data[0],
            nameAsPublished: 'J. Smith',
        };
        const { getByTestId } = setup({ contributor, index: 0, enableSelect: true, onSelect: testFn });

        fireEvent.keyDown(getByTestId('test-list-row-0'), { key: 'Enter', keyCode: 13 });
        expect(testFn).toBeCalled();

        testFn.mockClear();
        fireEvent.keyDown(getByTestId('test-list-row-0'), { key: 'A' });
        expect(testFn).not.toBeCalled();
    });

    it('should not attempt to assign the current author when keyboard submit for disabled contributor', () => {
        const testFn = jest.fn();
        const contributor = {
            ...authorsSearch.data[0],
            nameAsPublished: 'J. Smith',
            disabled: true,
        };
        const { getByTestId } = setup({ contributor, index: 0, enableSelect: true, onSelect: testFn });

        fireEvent.keyDown(getByTestId('test-list-row-0'), { key: 'Enter', keyCode: 13 });
        expect(testFn).not.toBeCalled();
    });

    it('should handle edits', () => {
        const testFn = jest.fn();
        const { container, getByTestId } = setup({
            index: 2,
            canEdit: true,
            onEdit: testFn,
        });

        expect(container).toMatchSnapshot();
        fireEvent.click(getByTestId('test-list-row-2-edit'));
        expect(testFn).toHaveBeenCalledWith(2);
    });

    it('should get row icon', () => {
        const { getByTestId } = setup({
            contributor: {
                uqIdentifier: 123,
            },
        });

        expect(getByTestId('HowToRegIcon')).toBeInTheDocument();
    });

    it('should get row lock icon', () => {
        const { getByTestId } = setup({
            locale: {},
            disabled: true,
        });
        expect(getByTestId('LockIcon')).toBeInTheDocument();
    });

    it('Row should be clickable when showContributorAssignment set to true', () => {
        const contributor = {
            nameAsPublished: 'J. Smith',
            ...authorsSearch.data[0],
        };
        const { container } = setup({
            showContributorAssignment: true,
            contributor,
            index: 0,
        });
        expect(container).toMatchSnapshot();
    });

    it('Row should not be clickable when showContributorAssignment set to false', () => {
        const contributor = {
            nameAsPublished: 'J. Smith',
            ...authorsSearch.data[0],
        };
        const { container } = setup({
            showContributorAssignment: false,
            contributor,
            index: 0,
        });
        expect(container).toMatchSnapshot();
    });

    it('triggers the confirmation box and delete record', async () => {
        const onDeleteFn = jest.fn();
        const { getByRole, getByTestId } = setup({ onDelete: onDeleteFn });

        fireEvent.click(getByRole('button', { name: 'Remove this record' }));
        await waitFor(() => getByTestId('confirm-test-list-row-0-delete'));

        fireEvent.click(getByTestId('confirm-test-list-row-0-delete'));
        expect(onDeleteFn).toBeCalled();
    });

    it('should not call certain prop methods if disabled prop is set', async () => {
        const onDeleteFn = jest.fn();
        const onMoveUpFn = jest.fn();
        const onMoveDownFn = jest.fn();

        const { getByRole, queryByTestId } = setup({
            disabled: true,
            index: 0,
            onDelete: onDeleteFn,
            onMoveUp: onMoveUpFn,
            onMoveDown: onMoveDownFn,
            canMoveUp: true,
            canMoveDown: true,
        });

        fireEvent.click(getByRole('button', { name: 'Move record up the order' }));
        expect(onMoveUpFn).not.toBeCalled();

        fireEvent.click(getByRole('button', { name: 'Move record down the order' }));
        expect(onMoveDownFn).not.toBeCalled();

        fireEvent.click(getByRole('button', { name: 'Remove this record' }));
        await waitFor(() => queryByTestId('confirm-test-list-row-0-delete'));
        expect(queryByTestId('confirm-test-list-row-0-delete')).not.toBeInTheDocument();
    });

    it('should render row as required', () => {
        const { container } = setup({
            contributor: {
                nameAsPublished: 'Test',
                orgaff: 'Test',
                affilication: AFFILIATION_TYPE_NOT_UQ,
                orgtype: 'NGO',
            },
            required: true,
        });

        expect(container).toMatchSnapshot();
    });

    it('should render contributor row linked class for admin users', () => {
        const { container } = setup({
            contributor: {
                nameAsPublished: 'Test',
                orgaff: 'Test',
                affilication: AFFILIATION_TYPE_NOT_UQ,
                orgtype: 'NGO',
                uqIdentifier: '123456',
            },
            canEdit: true,
            required: true,
        });

        expect(container).toMatchSnapshot();
    });
});
