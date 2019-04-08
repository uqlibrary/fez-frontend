import {
    DownshiftMultiple,
    styles
} from './DownshiftMultiple';

const setup = (testProps, isShallow = true) => {
    const props = {
        classes: {},
        optionsList: [],
        ...testProps
    }
    return getElement(DownshiftMultiple, props, isShallow);
};

describe('DownshiftMultiple component', () => {
    it('should render properly', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.find('Downshift').props().itemToString()).toBe('');
    });

    it('should handleKeyDown(event)', () => {
        const wrapper = setup({});
        wrapper.setState({
            inputValue: '',
            selectedItems: ['test1', 'test2']
        });
        wrapper.instance().handleKeyDown({ which: 8 });
        expect(wrapper.state().selectedItems).toEqual(['test1']);
        wrapper.instance().handleKeyDown({ which: 65 });
        expect(wrapper.state().selectedItems).toEqual(['test1']);
    });

    it('should handleInputChange(event)', () => {
        const testFn = jest.fn();
        const testArr = [{}];
        const wrapper = setup({
            onChange: testFn
        });
        const event = {
            target: {
                value: 'test'
            }
        };
        wrapper.setState({
            selectedItems: testArr
        });
        wrapper.instance().handleInputChange(event);
        expect(testFn).toBeCalledWith(testArr);
    });

    it('should handleChange()', () => {
        const testFn = jest.fn();
        const wrapper = setup({
            onChange: testFn
        });
        wrapper.setState({
            inputValue: 'something',
            selectedItems: ['test1']
        });
        wrapper.instance().handleChange('test2');
        expect(wrapper.state().selectedItems).toEqual(['test1', 'test2']);
        expect(wrapper.state().inputValue).toBe('');
        expect(testFn).toBeCalledWith(['test1', 'test2']);

        testFn.mockClear();
        wrapper.setState({
            inputValue: 'something'
        });
        wrapper.instance().handleChange('test2');
        expect(wrapper.state().selectedItems).toEqual(['test1', 'test2']);
        expect(wrapper.state().inputValue).toBe('');
        expect(testFn).toBeCalledWith(['test1', 'test2']);
    });

    it('should handleDelete()', () => {
        const testFn = jest.fn();
        const wrapper = setup({
            onChange: testFn
        });
        wrapper.setState({
            selectedItems: ['test1', 'test2']
        });
        wrapper.instance().handleDelete('test2')();
        expect(wrapper.state().selectedItems).toEqual(['test1']);
        expect(testFn).toBeCalledWith(['test1']);
    });

    it('should handleClearAll()', () => {
        const testFn = jest.fn();
        const wrapper = setup({
            onChange: testFn
        });
        wrapper.setState({
            selectedItems: ['test1', 'test2']
        });
        wrapper.instance().handleClearAll();
        expect(wrapper.state().selectedItems).toEqual([]);
        expect(testFn).toBeCalledWith([]);
    });

    it('should sendData()', () => {
        const testFn = jest.fn();
        const wrapper = setup({
            onChange: testFn
        });
        const test = {};
        wrapper.instance().sendData(test);
        expect(testFn).toBeCalledWith(test);

        testFn.mockClear();
        wrapper.instance().sendData();
        expect(testFn).not.toBeCalled();
    });
});

describe('styles helper', () => {
    it('should return styles object as expected', () => {
        const test = styles({
            spacing: {
                unit: 4
            }
        });
        expect(test).toMatchSnapshot();
    });
});

