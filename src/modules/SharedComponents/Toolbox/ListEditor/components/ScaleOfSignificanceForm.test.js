import {
    ScaleOfSignificanceForm,
    handleContributionStatementCallbackFactory,
    handleSignificanceCallbackFactory,
    resetFormCallbackFactory,
    addItemCallbackFactory,
} from './ScaleOfSignificanceForm';

function setup(testProps = {}, args = { isShallow: true }) {
    const props = {
        locale: {},
        onAdd: jest.fn(),
        ...testProps,
    };

    return getElement(ScaleOfSignificanceForm, props, args);
}

describe('ScaleOfSignificanceForm component', () => {
    it('should render the default view', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render with id', () => {
        const wrapper = setup({ locale: { id: '100' } });
        expect(wrapper.find('RichEditor').props().id).toBe('100');
    });
});

describe('ScaleOfSignificanceForm callback factories', () => {
    it('should create handleContributionStatement callback', () => {
        const setContributionStatement = jest.fn();
        const callback = handleContributionStatementCallbackFactory(setContributionStatement)[0];
        const test = {};
        callback(test);
        expect(setContributionStatement).toHaveBeenCalledWith(test);
    });

    it('should create handleSignificance callback', () => {
        const setSignificance = jest.fn();
        const callback = handleSignificanceCallbackFactory(setSignificance)[0];
        const test = {};
        callback(test);
        expect(setSignificance).toHaveBeenCalledWith(test);
    });

    it('should create resetForm callback', () => {
        const testFn = jest.fn();
        const contributionStatementEditor = {
            current: {
                setData: testFn,
            },
        };
        const setSignificance = jest.fn();
        const callback = resetFormCallbackFactory(contributionStatementEditor, setSignificance)[0];
        callback();
        expect(setSignificance).toHaveBeenCalledWith(null);
        expect(testFn).toHaveBeenCalledWith(null);
    });

    it('should create addItem callback', () => {
        const disabled = false;
        const significance = 'test 1';
        const contributionStatement = 'test 2';
        const onAdd = jest.fn();
        const resetForm = jest.fn();
        const callback = addItemCallbackFactory(disabled, significance, contributionStatement, onAdd, resetForm)[0];
        callback({ key: 'Enter' });
        expect(onAdd).toHaveBeenCalledWith({ key: 'test 1', value: 'test 2' });
        expect(resetForm).toHaveBeenCalledTimes(1);

        onAdd.mockClear();
        resetForm.mockClear();
        callback({ key: 'test' });
        expect(onAdd).toHaveBeenCalledTimes(0);
        expect(resetForm).toHaveBeenCalledTimes(0);
    });
});
