import {ContributorRow} from './ContributorRow';

import {authorsSearch} from 'mock/data';

function setup(testProps, isShallow = true) {
    // build full props list requied by the component
    const props = {
        index: 0,
        contributor: { nameAsPublished: 'A. Smith'},
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
            identifierSubtitle: 'identifierSubtitle'
        },
        width: 'md',
        ...testProps,
    };
    return getElement(ContributorRow, props, isShallow);
}

describe('Component ContributorRow ', () => {

    it('a row with index and contributor set, renders only name and delete button', () => {
        const wrapper = setup({index: 0});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('a row with index and contributor set, renders only name and delete button for mobile view', () => {
        const wrapper = setup({index: 0, width: 'xs'});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('a row with index and contributor with author details set and set as selected', () => {
        const wrapper = setup({...authorsSearch.data[0], index: 0, showIdentifierLookup: true, contributor: {nameAsPublished: "J. Smith", selected: true}});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('a row with index and creator with creator role set and set as selected', () => {
        const wrapper = setup({...authorsSearch.data[0], index: 0, showRoleInput: true, contributor: {nameAsPublished: "J. Smith", selected: true, creatorRole: 'Investigator'}});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('a row with index and contributor with author details set and set as selected for mobile view', () => {
        const wrapper = setup({...authorsSearch.data[0], index: 0, showIdentifierLookup: true, contributor: {nameAsPublished: "J. Smith", selected: true}});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('a row with index and creator with creator role set and set as selected for mobile view', () => {
        const wrapper = setup({...authorsSearch.data[0], index: 0, showRoleInput: true, contributor: {nameAsPublished: "J. Smith", selected: true, creatorRole: 'Investigator'}});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('a row with index and contributor with author details set, contributor author details, and delete button', () => {
        const contributor = {
            nameAsPublished: "J. Smith",
            ...authorsSearch.data[0]
        };
        const wrapper = setup({contributor, index: 0, showIdentifierLookup: true});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('a row with index and contributor set, renders reorder buttons, contributor assignment, and delete button', () => {
        const contributor = {
            nameAsPublished: "J. Smith",
            ...authorsSearch.data[0]
        };
        const wrapper = setup({contributor, index: 0, canMoveUp: true, canMoveDown: true, showContributorAssignment: true});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('a row with index and contributor set calls move up function', () => {
        const testFunction = jest.fn();
        const contributor = {
            nameAsPublished: "J. Smith",
            ...authorsSearch.data[0]
        };
        const wrapper = setup({contributor, index: 0, canMoveUp: true, onMoveUp: testFunction}, false);

        const button = wrapper.find('pure(KeyboardArrowUpIcon)');
        expect(button.length).toBe(1);

        const buttonDown = wrapper.find('pure(KeyboardArrowDownIcon)');
        expect(buttonDown.length).toBe(0);

        wrapper.find('pure(KeyboardArrowUpIcon)').simulate('click');
        expect(testFunction).toBeCalled();
    });

    it('a row with index and contributor set calls move down function', () => {
        const testFunction = jest.fn();
        const wrapper = setup({index: 0, canMoveDown: true, onMoveDown: testFunction}, false);

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
        const wrapper = setup({index: 0, showContributorAssignment: true, onContributorAssigned: testFunction}, false);
        wrapper.find('ListItem').simulate('click');
        expect(testFunction).toBeCalled;
    });

    it('a row with index and contributor set calls delete function', () => {
        const testFunction = jest.fn();
        const wrapper = setup({index: 0, onDelete: testFunction}, false);
        const button = wrapper.find('pure(DeleteIcon)');
        expect(button.length).toBe(1);
        wrapper.find('pure(DeleteIcon)').simulate('click');
        expect(testFunction).toBeCalled;
    });

    it('should add the contributor when it is not yet selected', () => {
        const testFunction = jest.fn();

        const wrapper = setup({index: 0, disabled: false, contributor: {selected: false, nameAsPublished: "J. Smith"}, onContributorAssigned: testFunction});
        wrapper.instance()._assignContributor();
        expect(testFunction).toBeCalledWith({selected: false, nameAsPublished: "J. Smith"}, 0);
    });

    it('should remove the contributor assigned when it is already selected', () => {
        const testFunction = jest.fn();

        const wrapper = setup({index: 0, disabled: false, contributor: {selected: true, nameAsPublished: "J. Smith"}, onContributorAssigned: testFunction});
        wrapper.instance()._assignContributor();
        expect(testFunction).toBeCalledWith(null, null);
    });


    it('should call the lifecycle method of the component if props change', () => {
        const testFunction = jest.fn();
        const contributor = {nameAsPublished: "J. Smith", ...authorsSearch.data[0]};
        const wrapper = setup({contributor, index: 0});
        wrapper.instance().shouldComponentUpdate = testFunction;
        wrapper.setProps({nameAsPublished: "Ky Lane"});
        expect(testFunction).toBeCalled();
    });

    it('should attempt to assign the current author when keyboard submit', () => {
        const testFunction = jest.fn();
        const contributor = {nameAsPublished: "J. Smith", ...authorsSearch.data[0]};
        const wrapper = setup({contributor, index: 0});
        wrapper.instance()._assignContributor = testFunction;
        wrapper.instance()._onContributorAssignedKeyboard({key: 'Enter'});
        expect(testFunction).toBeCalled();
    });

    it('Row should be clickable when showContributorAssignment set to true', () => {
        const contributor = {nameAsPublished: "J. Smith", ...authorsSearch.data[0]};
        const wrapper = setup({showContributorAssignment: true, contributor, index: 0});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('Row should not be clickable when showContributorAssignment set to false', () => {
        const contributor = {nameAsPublished: "J. Smith", ...authorsSearch.data[0]};
        const wrapper = setup({showContributorAssignment: false, contributor, index: 0});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should call shouldComponentUpdate when something changes', () => {
        const testFunction = jest.fn();
        const wrapper = setup({contributor: {nameAsPublished: "J. Smith"}});
        wrapper.instance().shouldComponentUpdate = testFunction;
        wrapper.setProps({contributor: {nameAsPublished: "K. Lane"}});
        expect(testFunction).toBeCalledWith({"canMoveDown": false, "canMoveUp": false, "classes": {"hideIcon": "hideIcon", "identifierName": "identifierName", "identifierSubtitle": "identifierSubtitle", "listItem": "listItem", "primary": "primary", "selected": "selected"}, "contributor": {"nameAsPublished": "K. Lane"}, "disabled": false, "disabledContributorAssignment": false, "index": 0, "locale": {"deleteHint": "Remove this record", "deleteRecordConfirmation": {"cancelButtonLabel": "No", "confirmButtonLabel": "Yes", "confirmationMessage": "Are you sure you want to delete this record?", "confirmationTitle": "Delete record"}, "moveDownHint": "Move record down the order", "moveUpHint": "Move record up the order", "selectHint": "Select this record ([name]) to assign it to you", "suffix": " listed contributor"}, "showContributorAssignment": false, "showIdentifierLookup": false, "showRoleInput": false, "width": "md"}, {}, {});
    });

    it('triggers the confirmation box', () => {
        const testFunction = jest.fn();
        const wrapper = setup({});
        wrapper.instance().confirmationBox = {showConfirmation: testFunction};
        wrapper.instance()._showConfirmation();
        expect(testFunction).toBeCalled();
    });
});
