import { IssnForm, addItemCallbackFactory, handleChangeCallbackFactory, resetFormCallbackFactory } from './IssnForm';

function setup(testProps = {}, args = { isShallow: true }) {
    const props = {
        locale: {},
        onAdd: jest.fn(),
        ...testProps,
    };

    return getElement(IssnForm, props, args);
}

describe('IssnForm component', () => {
    it('should render the default view', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render with id', () => {
        const wrapper = setup({ locale: { id: '100' } });
        expect(wrapper.find('TextField').get(0).props.id).toBe('100');
        // expect(wrapper.find('TextField').get(1).props.id).toBe('100');
    });
});

describe('IssnForm callback factories', () => {
    it('should create handleChange callback for link', () => {
        const issnValue = {};
        const setIssn = jest.fn();
        const setErrorText = jest.fn();
        const event = {
            target: {
                name: 'key',
                value: 'http://test.com',
            },
        };
        const callback = handleChangeCallbackFactory(issnValue, setIssn, setErrorText)[0];
        callback(event);
        expect(setIssn).toHaveBeenCalledWith({
            key: 'http://test.com',
        });
    });

    it('should create handleChange callback for description', () => {
        const issnValue = { link: 'test link' };
        const setIssn = jest.fn();
        const setErrorText = jest.fn();
        const event = {
            target: {
                name: 'description',
                value: 'Test description',
            },
        };
        const callback = handleChangeCallbackFactory(issnValue, setIssn, setErrorText)[0];
        callback(event);
        expect(setIssn).toHaveBeenCalledWith({
            link: 'test link',
            description: 'Test description',
        });
    });

    it('should create resetForm callback', () => {
        const issnInput = { current: { value: 'test1' } };
        const setIssn = jest.fn();

        const result = resetFormCallbackFactory(issnInput, setIssn);
        const callback = result[0];
        const updatedIssnInput = result[1][0];

        callback();
        expect(setIssn).toHaveBeenCalledWith({ key: null, value: null });
        expect(updatedIssnInput).toEqual({ current: { value: null } });
    });

    it('should create addItem callback', () => {
        const testFn = jest.fn();
        const descriptionInput = { current: { focus: testFn } };
        const disabled = false;
        const errorText = null;
        const issnValue = {
            key: 'test1',
            value: 'test2',
        };
        const onAdd = jest.fn();
        const resetForm = jest.fn();

        const callback = addItemCallbackFactory(descriptionInput, disabled, errorText, issnValue, onAdd, resetForm)[0];

        callback();
        expect(onAdd).toHaveBeenCalledWith(issnValue);
        expect(resetForm).toHaveBeenCalledTimes(1);
        expect(testFn).toHaveBeenCalledTimes(1);

        testFn.mockClear();
        onAdd.mockClear();
        resetForm.mockClear();
        callback({ key: 'test3' });
        expect(onAdd).toHaveBeenCalledTimes(0);
        expect(resetForm).toHaveBeenCalledTimes(0);
        expect(testFn).toHaveBeenCalledTimes(0);
    });
});
