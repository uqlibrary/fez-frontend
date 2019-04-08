import React from 'react';
import {
    renderInput,
    renderSuggestion,
    renderSuggestions,
    getSuggestions,
    MultiSelectWithChip,
} from './MultiSelectWithChip';


const setup = (testProps, isShallow = true) => {
    const props = {
        classes: {},
        optionsList: [],
        ...testProps
    }
    return getElement(MultiSelectWithChip, props, isShallow);
};

describe('MultiSelectWithChip component', () => {
    it('should render properly', () => {
        const testProps = {
            classes: {
                container: 'test1',
                clearAll: 'test2'
            },
            getInputProps: jest.fn(),
            getItemProps: jest.fn({}),
            handleClearAll: jest.fn(),
            handleDelete: jest.fn(),
            handleInputChange: jest.fn(),
            handleKeyDown: jest.fn(),
            highlightedIndex: 0,
            inputValue: 'test3',
            isOpen: true,
            label: 'test4',
            optionsList: [],
            placeholder: 'test3',
            selectedItems: ['item1'],
        };
        const wrapper1 = setup(testProps);
        expect(toJson(wrapper1)).toMatchSnapshot();

        testProps.isOpen = false;
        const wrapper2 = setup(testProps);
        expect(toJson(wrapper2)).toMatchSnapshot();

        delete testProps.selectedItems;
        const wrapper3 = setup(testProps);
        expect(toJson(wrapper3)).toMatchSnapshot();
    });
});

describe('renderInput helper', () => {
    it('should return html as expected', () => {
        const test = renderInput({
            InputProps: {
                testProp: 'test1'
            },
            classes: {
                inputRoot: 'test2',
                inputInput: 'test3'
            },
            ref: 'test4',
            testAttr: 'test5'
        });

        expect(test).toMatchSnapshot();
    });
});

describe('renderSuggestion helper', () => {
    it('should return html as expected', () => {
        const testProps = {
            suggestion: {
                label: 'test1'
            },
            index: 1,
            itemProps: {
                prop1: 'test2',
                prop2: 'test3'
            },
            highlightedIndex: 1,
            selectedItems: false
        };
        const test1 = renderSuggestion(testProps);
        expect(test1).toMatchSnapshot();

        const test2 = renderSuggestion({
            ...testProps,
            selectedItems: 'This is test1'
        });
        expect(test2).toMatchSnapshot();
    });
});

describe('renderSuggestions helper', () => {
    it('should render properly', () => {
        const inputValue = 'test';
        const optionsList = [
            { label: 'test1' },
            { label: 'test2' }
        ];
        const getItemProps = jest.fn();
        const highlightedIndex = 1;
        const selectedItems = [];
        const render = shallow(
            <div>
                {renderSuggestions({
                    inputValue,
                    optionsList,
                    getItemProps,
                    highlightedIndex,
                    selectedItems
                })}
            </div>
        );
        expect(toJson(render)).toMatchSnapshot();
        expect(getItemProps).toBeCalledTimes(optionsList.length);
    });

});

describe('getSuggestions helper', () => {
    it('should return html as expected', () => {
        const value = 'test';
        const suggestions = [
            { label: 'test1' },
            { label: 'test2' },
            { label: 'test3' },
            { label: 'test4' },
            { label: 'test5' },
            { label: 'test6' }
        ];
        const test1 = getSuggestions(value, suggestions);
        expect(test1).toMatchSnapshot();

        const test2 = getSuggestions('', suggestions);
        expect(test2).toMatchSnapshot();
    });
});
