import ContributorRow from './ContributorRow';

import {authorsSearch} from 'mock/data';

function setup(testProps, isShallow = true) {
    // build full props list requied by the component
    const props = {
        ...testProps,
        index: testProps.index,
        contributor: testProps.contributor || { nameAsPublished: 'A. Smith'},
        canMoveUp: testProps.canMoveUp || false,
        canMoveDown: testProps.canMoveDown || false,
        showIdentifierLookup: testProps.showIdentifierLookup || false,
        showContributorAssignment: testProps.showContributorAssignment || false,
        disabledContributorAssignment: testProps.disabledContributorAssignment || false,
        disabled: testProps.disabled || false
    };
    return getElement(ContributorRow, props, isShallow);
}

beforeAll(() => {
    
});

describe('Component ContributorRow ', () => {

    it('a row with index and contributor set, renders only name and delete button', () => {
        const wrapper = setup({index: 0});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('a row with index and contributor with author details set and set as selected', () => {
        const wrapper = setup({nameAsPublished: "J. Smith", ...authorsSearch.data[0], index: 0, showIdentifierLookup: true, contributor: {selected: true}});
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
        const wrapper = setup({contributor, index: 0, canMoveUp: true, onMoveUp: testFunction, isShallow: false});

        const button = wrapper.find('IconButton .reorderUp');
        expect(button.length).toBe(1);

        const buttonDown = wrapper.find('IconButton .reorderDown');
        expect(buttonDown.length).toBe(0);

        wrapper.instance()._onMoveUp();
        expect(testFunction).toBeCalled();
    });

    it('a row with index and contributor set calls move down function', () => {
        const testFunction = jest.fn();
        const wrapper = setup({index: 0, canMoveDown: true, onMoveDown: testFunction, isShallow: false});

        const button = wrapper.find('IconButton .reorderDown');
        expect(button.length).toBe(1);

        wrapper.instance()._onMoveDown();
        expect(testFunction).toBeCalled;

        const buttonUp = wrapper.find('IconButton .reorderUp');
        expect(buttonUp.length).toBe(0);
        testFunction.mockReset();
    });

    it('a row with index and contributor set calls assignment function', () => {
        const testFunction = jest.fn();
        const wrapper = setup({index: 0, showContributorAssignment: true, onContributorAssigned: testFunction, isShallow: false});
        wrapper.instance()._onContributorAssigned();
        expect(testFunction).toBeCalled;
    });

    it('a row with index and contributor set calls delete function', () => {
        const testFunction = jest.fn();
        const wrapper = setup({index: 0, onDelete: testFunction, isShallow: false});
        wrapper.instance()._deleteRecord();
        const button = wrapper.find('IconButton .contributorDelete');
        expect(button.length).toBe(1);
        expect(testFunction).toBeCalled;
    });
    it('should add the contributor when it is not yet selected', () => {
        const testFunction = jest.fn();

        const wrapper = setup({nameAsPublished: "J. Smith", index: 0, disabled: false, contributor: {selected: false}, onContributorAssigned: testFunction});
        wrapper.instance()._assignContributor();
        expect(testFunction).toBeCalledWith({selected: false}, 0);
    });

    it('should remove the contributor assigned when it is already selected', () => {
        const testFunction = jest.fn();

        const wrapper = setup({nameAsPublished: "J. Smith", index: 0, disabled: false, contributor: {selected: true}, onContributorAssigned: testFunction});
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
        expect(testFunction).toBeCalledWith({"canMoveDown": false, "canMoveUp": false, "contributor": {"nameAsPublished": "K. Lane"}, "disabled": false, "disabledContributorAssignment": false, "index": undefined, "locale": {"deleteHint": "Remove this record", "deleteRecordConfirmation": {"cancelButtonLabel": "No", "confirmButtonLabel": "Yes", "confirmationMessage": "Are you sure you want to delete this record?", "confirmationTitle": "Delete record"}, "moveDownHint": "Move record down the order", "moveUpHint": "Move record up the order", "ordinalData": ["First", "Second", "Third", "Fourth", "Fifth", "Sixth", "Seventh", "Eighth", "Ninth", "Tenth"], "selectHint": "Select this record ([name]) to assign it to you", "suffix": " listed contributor"}, "showContributorAssignment": false, "showIdentifierLookup": false}, null, {});
    });

    it('triggers the confirmation box', () => {
        const testFunction = jest.fn();
        const wrapper = setup({});
        wrapper.instance().confirmationBox = {showConfirmation: testFunction};
        wrapper.instance()._showConfirmation();
        expect(testFunction).toBeCalled();
    });


});
