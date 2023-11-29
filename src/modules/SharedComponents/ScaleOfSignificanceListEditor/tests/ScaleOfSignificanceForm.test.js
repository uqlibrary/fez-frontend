import {
    ScaleOfSignificanceForm,
    handleContributionStatementCallbackFactory,
    handleSignificanceCallbackFactory,
    resetFormCallbackFactory,
    saveCallbackFactory,
} from '../ScaleOfSignificanceForm';

function setup(testProps = {}, args = { isShallow: true }) {
    const props = {
        locale: {},
        onAdd: jest.fn(),
        buttonLabel: 'label',
        showForm: jest.fn(),
        saveChangeToItem: jest.fn(),
        ...testProps,
    };

    return renderComponent(ScaleOfSignificanceForm, props, args);
}

describe('ScaleOfSignificanceForm component', () => {
    it('should render the default view', () => {
        const renderer = setup({});
        expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('should render with id', () => {
        const renderer = setup({ locale: { id: '100' } });
        expect(renderer.getRenderOutput()).toMatchSnapshot();
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
        const showScaleAdditionForm = jest.fn();
        const callback = resetFormCallbackFactory(
            contributionStatementEditor,
            setSignificance,
            showScaleAdditionForm,
        )[0];
        callback();
        expect(setSignificance).toHaveBeenCalledWith(null);
        expect(testFn).toHaveBeenCalledWith(null);
    });

    it('should create addItem callback', () => {
        const disabled = false;
        const significance = 'test 1';
        const contributionStatement = 'test 2';
        const emptySignificance = false;
        const onAdd = jest.fn();
        const resetForm = jest.fn();
        const callback = saveCallbackFactory(
            disabled,
            emptySignificance,
            significance,
            contributionStatement,
            onAdd,
            resetForm,
        )[0];
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
