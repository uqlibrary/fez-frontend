import ContributorRow from './ContributorRow';

import { authorsSearch } from 'mock/data';
import { AFFILIATION_TYPE_NOT_UQ } from 'config/general';
import mediaQuery from 'css-mediaquery';
import { act } from '@testing-library/react';

function createMatchMedia(width) {
    return query => ({
        matches: mediaQuery.match(query, { width }),
        addListener: () => {},
        removeListener: () => {},
    });
}

function setup(testProps = {}, args = {}) {
    // build full props list requied by the component
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
    return getElement(ContributorRow, props, args);
}

describe('Component ContributorRow', () => {
    beforeAll(() => {
        window.matchMedia = createMatchMedia(window.innerWidth);
    });

    it('a row with index and contributor set, renders only name and delete button', () => {
        const wrapper = setup({
            index: 0,
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render with missing aria label if selectHint prop is falsy', () => {
        const wrapper = setup({
            locale: {
                selectHint: '',
            },
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('a row with index and contributor set, renders only name and delete button for mobile view', () => {
        const wrapper = setup({
            index: 0,
            width: 'xs',
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('a row with index and contributor with author details set and set as selected', () => {
        const wrapper = setup({
            ...authorsSearch.data[0],
            index: 0,
            showIdentifierLookup: true,
            contributor: {
                nameAsPublished: 'J. Smith',
                selected: true,
            },
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render a row with a disabled contributor', () => {
        const wrapper = setup({
            contributor: {
                disabled: true,
            },
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('a row with index and creator with creator role set and set as selected', () => {
        const wrapper = setup({
            ...authorsSearch.data[0],
            index: 0,
            showRoleInput: true,
            contributor: {
                nameAsPublished: 'J. Smith',
                selected: true,
                creatorRole: 'Investigator',
            },
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('a row with index and contributor with author details set and set as selected for mobile view', () => {
        const wrapper = setup({
            ...authorsSearch.data[0],
            index: 0,
            showIdentifierLookup: true,
            contributor: {
                nameAsPublished: 'J. Smith',
                selected: true,
            },
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('a row with index and creator with creator role set and set as selected for mobile view', () => {
        const wrapper = setup({
            ...authorsSearch.data[0],
            index: 0,
            showRoleInput: true,
            contributor: {
                nameAsPublished: 'J. Smith',
                selected: true,
                creatorRole: 'Investigator',
            },
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('a row with index and contributor with author details set, contributor author details & delete button', () => {
        const contributor = {
            nameAsPublished: 'J. Smith',
            ...authorsSearch.data[0],
        };
        const wrapper = setup({
            contributor,
            index: 0,
            showIdentifierLookup: true,
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('a row with index and contributor set, renders reorder buttons, contributor assignment & delete button', () => {
        const contributor = {
            nameAsPublished: 'J. Smith',
            ...authorsSearch.data[0],
        };
        const wrapper = setup({
            contributor,
            index: 0,
            canMoveUp: true,
            canMoveDown: true,
            showContributorAssignment: true,
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('a row with index and contributor set calls move up function', () => {
        const testFunction = jest.fn();
        const contributor = {
            nameAsPublished: 'J. Smith',
            ...authorsSearch.data[0],
        };
        const wrapper = setup(
            {
                contributor,
                index: 0,
                canMoveUp: true,
                onMoveUp: testFunction,
            },
            { isShallow: true },
        );

        const button = wrapper.find('KeyboardArrowUpIcon');
        expect(button.length).toBe(1);

        const buttonDown = wrapper.find('KeyboardArrowDownIcon');
        expect(buttonDown.length).toBe(0);

        wrapper.find('#test-list-row-move-up-0').simulate('click');
        expect(testFunction).toBeCalled();
    });

    it('a row with index and contributor set calls move down function', () => {
        const testFunction = jest.fn();
        const wrapper = setup(
            {
                index: 0,
                canMoveDown: true,
                onMoveDown: testFunction,
            },
            { isShallow: true },
        );

        const button = wrapper.find('KeyboardArrowDownIcon');
        expect(button.length).toBe(1);

        wrapper.find('#test-list-row-move-down-0').simulate('click');
        expect(testFunction).toBeCalled();

        const buttonUp = wrapper.find('KeyboardArrowUpIcon');
        expect(buttonUp.length).toBe(0);
        testFunction.mockReset();
    });

    it('a row with index and contributor set calls assignment function', () => {
        const testFunction = jest.fn();
        const wrapper = setup(
            {
                index: 0,
                showContributorAssignment: true,
                onSelect: testFunction,
            },
            { isShallow: true },
        );
        wrapper.find('WithStyles(ForwardRef(ListItem))').simulate('click');
        expect(testFunction).toBeCalled;
    });

    it('a row with index and contributor set calls delete function', () => {
        const testFunction = jest.fn();
        const wrapper = setup(
            {
                index: 0,
                onDelete: testFunction,
            },
            { isShallow: true },
        );
        const button = wrapper.find('DeleteIcon');
        expect(button.length).toBe(1);
        wrapper.find('DeleteIcon').simulate('click');
        expect(testFunction).toBeCalled;
    });

    it('should select when it is not yet selected', () => {
        const testFunction = jest.fn();

        const wrapper = setup({
            index: 0,
            disabled: false,
            contributor: {
                selected: false,
                nameAsPublished: 'J. Smith',
            },
            enableSelect: true,
            onSelect: testFunction,
        });
        wrapper.find('WithStyles(ForwardRef(ListItem))').simulate('click');
        expect(testFunction).toBeCalledWith(0);

        // no-op if disabled
        wrapper.setProps({ disabled: true });
        testFunction.mockClear();
        wrapper.find('WithStyles(ForwardRef(ListItem))').simulate('click');
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

        const wrapper = setup(testObj);
        wrapper.find('WithStyles(ForwardRef(ListItem))').simulate('click');
        expect(testFunction).toBeCalledWith(testObj.index);
    });

    it('should attempt to assign the current author when keyboard submit', () => {
        const testFn = jest.fn();
        const contributor = {
            ...authorsSearch.data[0],
            nameAsPublished: 'J. Smith',
        };
        const wrapper = setup({ contributor, index: 0, enableSelect: true, onSelect: testFn });

        wrapper
            .find('WithStyles(ForwardRef(ListItem))')
            .props()
            .onKeyDown({ key: 'Enter' });
        expect(testFn).toBeCalled();

        testFn.mockClear();
        wrapper.find('WithStyles(ForwardRef(ListItem))').simulate('keydown', { key: 'A' });
        expect(testFn).not.toBeCalled();
    });

    it('should not attempt to assign the current author when keyboard submit for disabled contributor', () => {
        const testFn = jest.fn();
        const contributor = {
            ...authorsSearch.data[0],
            nameAsPublished: 'J. Smith',
            disabled: true,
        };
        const wrapper = setup({ contributor, index: 0, enableSelect: true, onSelect: testFn });

        wrapper
            .find('WithStyles(ForwardRef(ListItem))')
            .props()
            .onKeyDown({ key: 'Enter' });
        expect(testFn).not.toBeCalled();
    });

    it('should handle edits', () => {
        const testFn = jest.fn();
        const wrapper = setup({
            index: 2,
            canEdit: true,
            onEdit: testFn,
        });
        expect(toJson(wrapper)).toMatchSnapshot();
        wrapper
            .find('WithStyles(ForwardRef(IconButton))')
            .first()
            .simulate('click');
        expect(testFn).toHaveBeenCalledWith(2);
    });

    it('should get row icon', () => {
        const wrapper = setup({
            contributor: {
                uqIdentifier: 123,
            },
        });
        expect(wrapper.find('HowToRegIcon').length).toBe(1);

        const wrapper2 = setup({
            locale: {},
            disabled: true,
        });
        expect(wrapper2.find('LockIcon').length).toBe(1);
    });

    it('Row should be clickable when showContributorAssignment set to true', () => {
        const contributor = {
            nameAsPublished: 'J. Smith',
            ...authorsSearch.data[0],
        };
        const wrapper = setup({
            showContributorAssignment: true,
            contributor,
            index: 0,
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('Row should not be clickable when showContributorAssignment set to false', () => {
        const contributor = {
            nameAsPublished: 'J. Smith',
            ...authorsSearch.data[0],
        };
        const wrapper = setup({
            showContributorAssignment: false,
            contributor,
            index: 0,
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('triggers the confirmation box and delete record', () => {
        const onDeleteFn = jest.fn();
        const wrapper = setup({ onDelete: onDeleteFn });

        act(() => {
            wrapper.find('WithStyles(ForwardRef(IconButton))').simulate('click');
        });

        wrapper.update();

        wrapper
            .find('ConfirmationBox')
            .props()
            .onAction();
        expect(onDeleteFn).toBeCalled();
    });

    it('should not call certain prop methods if disabled prop is set', () => {
        const onDeleteFn = jest.fn();
        const onMoveUpFn = jest.fn();
        const onMoveDownFn = jest.fn();

        const wrapper = setup({
            disabled: true,
            index: 0,
            onDelete: onDeleteFn,
            onMoveUp: onMoveUpFn,
            onMoveDown: onMoveDownFn,
            canMoveUp: true,
            canMoveDown: true,
        });

        wrapper.find('#test-list-row-move-up-0').simulate('click');
        expect(onMoveUpFn).not.toBeCalled();

        wrapper.find('#test-list-row-move-down-0').simulate('click');
        expect(onMoveDownFn).not.toBeCalled();

        wrapper.find('#test-list-row-delete-0').simulate('click');
        wrapper
            .find('ConfirmationBox')
            .props()
            .onAction();
        expect(onDeleteFn).not.toBeCalled();
    });

    it('should assign contributor', () => {
        const wrapper = setup({
            showContributorAssignment: true,
            disabledContributorAssignment: false,
            contributor: {
                nameAsPublished: 'test',
                selected: true,
                affiliation: AFFILIATION_TYPE_NOT_UQ,
                orgaff: 'Somewhere',
                orgtype: '453983',
            },
        });

        const blurFn = jest.fn();
        wrapper
            .find('WithStyles(ForwardRef(ListItem))')
            .props()
            .onClick({
                currentTarget: {
                    blur: blurFn,
                },
            });
        expect(blurFn).toHaveBeenCalled();

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should call callback functions on ListItem', () => {
        const wrapper = setup({
            showIdentifierLookup: true,
            showContributorAssignment: false,
            showRoleInput: true,
            disabledContributorAssignment: false,
            contributor: {
                nameAsPublished: 'test',
                selected: true,
                affiliation: AFFILIATION_TYPE_NOT_UQ,
                orgaff: 'Somewhere',
                orgtype: '453983',
            },
            width: 'xs',
            classes: {
                identifierName: 'test-class-1',
                identifierSubtitle: 'test-class-2',
            },
        });

        wrapper
            .find('WithStyles(ForwardRef(ListItem))')
            .props()
            .onClick();
        wrapper
            .find('WithStyles(ForwardRef(ListItem))')
            .props()
            .onKeyDown({ key: 'Enter' });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render row as required', () => {
        const wrapper = setup({
            contributor: {
                nameAsPublished: 'Test',
                orgaff: 'Test',
                affilication: AFFILIATION_TYPE_NOT_UQ,
                orgtype: 'NGO',
            },
            classes: {
                highlighted: 'highlighted',
            },
            required: true,
        });

        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
