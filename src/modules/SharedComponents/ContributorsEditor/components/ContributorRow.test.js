import { ContributorRow, styles } from './ContributorRow';

import { authorsSearch } from 'mock/data';

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
        classes: {
            listItem: 'listItem',
            selected: 'selected',
            hideIcon: 'hideIcon',
            primary: 'primary',
            identifierName: 'identifierName',
            identifierSubtitle: 'identifierSubtitle',
        },
        width: 'md',
        required: false,
        canEdit: false,
        ...testProps,
    };
    return getElement(ContributorRow, props, args);
}

describe('Component ContributorRow', () => {
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
                deleteButtonId: () => 'delete-record-0',
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
            { isShallow: false },
        );

        const button = wrapper.find('pure(KeyboardArrowUpIcon)');
        expect(button.length).toBe(1);

        const buttonDown = wrapper.find('pure(KeyboardArrowDownIcon)');
        expect(buttonDown.length).toBe(0);

        wrapper.find('pure(KeyboardArrowUpIcon)').simulate('click');
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
            { isShallow: false },
        );

        const button = wrapper.find('pure(KeyboardArrowDownIcon)');
        expect(button.length).toBe(1);

        wrapper.find('pure(KeyboardArrowDownIcon)').simulate('click');
        expect(testFunction).toBeCalled;

        const buttonUp = wrapper.find('pure(KeyboardArrowUpIcon)');
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
            { isShallow: false },
        );
        wrapper.find('ListItem').simulate('click');
        expect(testFunction).toBeCalled;
    });

    it('a row with index and contributor set calls delete function', () => {
        const testFunction = jest.fn();
        const wrapper = setup(
            {
                index: 0,
                onDelete: testFunction,
            },
            { isShallow: false },
        );
        const button = wrapper.find('pure(DeleteIcon)');
        expect(button.length).toBe(1);
        wrapper.find('pure(DeleteIcon)').simulate('click');
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
        wrapper.instance()._select();
        expect(testFunction).toBeCalledWith(0);

        // no-op if disabled
        wrapper.setProps({ disabled: true });
        testFunction.mockClear();
        wrapper.instance()._select();
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
        wrapper.instance()._select();
        expect(testFunction).toBeCalledWith(testObj.index);
    });

    it('should call the lifecycle method of the component if props change', () => {
        const testFunction = jest.fn();
        const contributor = {
            nameAsPublished: 'J. Smith',
            ...authorsSearch.data[0],
        };
        const wrapper = setup({ contributor, index: 0 });
        wrapper.instance().shouldComponentUpdate = testFunction;
        wrapper.setProps({ nameAsPublished: 'Ky Lane' });
        expect(testFunction).toBeCalled();
    });

    it('should attempt to assign the current author when keyboard submit', () => {
        const testFunction = jest.fn();
        const contributor = {
            nameAsPublished: 'J. Smith',
            ...authorsSearch.data[0],
        };
        const wrapper = setup({ contributor, index: 0 });
        wrapper.instance()._select = testFunction;
        wrapper.instance()._onSelectKeyboard({ key: 'Enter' });
        expect(testFunction).toBeCalled();

        testFunction.mockClear();
        wrapper.instance()._onSelectKeyboard({ key: 'A' });
        expect(testFunction).not.toBeCalled();
    });

    it('should handle edits', () => {
        const testFn = jest.fn();
        const wrapper = setup({
            index: 2,
            canEdit: true,
            onEdit: testFn,
        });
        wrapper.instance()._handleEdit();
        expect(testFn).toHaveBeenCalledWith(2);
    });

    it('should get row icon', () => {
        const wrapper = setup({
            contributor: {
                uqIdentifier: 123,
            },
        });
        expect(wrapper.instance().getRowIcon()).toMatchSnapshot();
        const wrapper2 = setup({
            locale: {},
            disabled: true,
        });
        expect(wrapper2.instance().getRowIcon()).toMatchSnapshot();
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

    it('triggers the confirmation box', () => {
        const testFunction = jest.fn();
        const wrapper = setup();
        wrapper.instance().confirmationBox = {
            showConfirmation: testFunction,
        };
        wrapper.instance()._showConfirmation();
        expect(testFunction).toBeCalled();
    });

    it('should delete record', () => {
        const onDeleteFn = jest.fn();
        const wrapper = setup({
            disabled: false,
            onDelete: onDeleteFn,
            contributor: {
                nameAsPublished: 'test',
            },
            index: 0,
        });
        wrapper.instance()._onDelete();
        expect(onDeleteFn).toHaveBeenCalled();
    });

    it('should not call certain prop methods if disabled prop is set', () => {
        const wrapper = setup({
            disabled: true,
            onDelete: jest.fn(),
            onMoveUp: jest.fn(),
            onMoveDown: jest.fn(),
        });
        wrapper.instance()._onDelete();
        expect(wrapper.instance().props.onDelete).not.toBeCalled();
        wrapper.instance()._onMoveUp();
        expect(wrapper.instance().props.onMoveUp).not.toBeCalled();
        wrapper.instance()._onMoveDown();
        expect(wrapper.instance().props.onMoveDown).not.toBeCalled();
    });

    it('should assign contributor', () => {
        const wrapper = setup({
            showContributorAssignment: true,
            disabledContributorAssignment: false,
            contributor: {
                nameAsPublished: 'test',
                selected: true,
                affiliation: 'NotUQ',
                orgaff: 'Somewhere',
                orgtype: '453983',
            },
        });

        const blurFn = jest.fn();
        wrapper
            .find('WithStyles(ListItem)')
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
                affiliation: 'NotUQ',
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
            .find('WithStyles(ListItem)')
            .props()
            .onClick();
        wrapper
            .find('WithStyles(ListItem)')
            .props()
            .onKeyDown();
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should have a proper style generator', () => {
        const theme = {
            palette: {
                accent: {
                    light: 'test1',
                },
            },
            typography: {
                fontWeightMedium: 'test2',
                body2: {
                    fontSize: 'test3',
                },
                caption: {
                    fontSize: 'test4',
                },
            },
        };
        expect(styles(theme)).toMatchSnapshot();

        delete theme.palette.accent;
        expect(styles(theme)).toMatchSnapshot();

        delete theme.palette;
        expect(styles(theme)).toMatchSnapshot();
    });

    it('should render row as required', () => {
        const wrapper = setup({
            contributor: {
                nameAsPublished: 'Test',
                orgaff: 'Test',
                affilication: 'NotUQ',
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
