import { PartialDateForm } from './PartialDateForm';

function setup(testProps, isShallow = true) {
    const props = {
        ...testProps,
        partialDateFormId: 'test',
        classes: testProps.classes || {
            hideLabel: 'hidden',
        },
    };
    return getElement(PartialDateForm, props, isShallow);
}

describe('PartialDateForm component', () => {
    it('should not call _setDate if props.onChange is not defined', () => {
        const wrapper = setup({});
        wrapper.instance()._setDate = jest.fn();
        wrapper.instance().UNSAFE_componentWillUpdate();
        expect(wrapper.instance()._setDate).not.toBeCalled();
    });

    it('should display errors correctly', () => {
        const wrapper = setup({
            floatingTitleRequired: true,
            allowPartial: true,
            onChange: jest.fn(),
        });
        wrapper.setState({
            day: '',
            month: '',
            year: '',
        });
        wrapper.update();
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should handle partial values', () => {
        const wrapper = setup({
            floatingTitleRequired: true,
            allowPartial: true,
            onChange: jest.fn(),
        });
        wrapper.setState({
            day: 1,
            month: null,
            year: null,
        });
        wrapper.update();
        expect(toJson(wrapper)).toMatchSnapshot();
        wrapper.setState({
            day: 1,
            month: 2,
            year: null,
        });
        wrapper.update();
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should load existing values', () => {
        const wrapper = setup({
            floatingTitleRequired: true,
            allowPartial: true,
            onChange: jest.fn(),
            meta: {
                initial: '2020-02-02',
            },
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    describe('with clearable flag', () => {
        let wrapper;
        beforeEach(() => {
            wrapper = setup({
                floatingTitleRequired: true,
                allowPartial: false,
                onChange: jest.fn(),
                meta: {
                    initial: '2020-02-02',
                },
                clearable: true,
            });
        });

        it('should display an error on clearing one partial date field', () => {
            // delete date and check for an error
            wrapper.find('#test-day').simulate('change', { target: { value: '' } });
            wrapper.update();
            expect(toJson(wrapper)).toMatchSnapshot();
        });

        it('should not display an error on clearing whole partial date field', () => {
            // clear whole date and check for not an error
            wrapper.find('#test-day').simulate('change', { target: { value: '' } });
            wrapper.find('#test-year').simulate('change', { target: { value: '' } });
            wrapper.find('#test-month').simulate('change', { target: { value: -1 } });
            wrapper.update();
            expect(toJson(wrapper)).toMatchSnapshot();
        });

        it('should not display an error on entering valid date', () => {
            // enter valid date and check for not an error
            wrapper.find('#test-day').simulate('change', { target: { value: '12' } });
            wrapper.find('#test-year').simulate('change', { target: { value: '1990' } });
            wrapper.find('#test-month').simulate('change', { target: { value: 3 } });
            wrapper.update();
            expect(toJson(wrapper)).toMatchSnapshot();
        });

        it('should display an error on entering future date', () => {
            // enter future date and check for an error
            wrapper.find('#test-year').simulate('change', { target: { value: '2010' } });
            wrapper.update();
            expect(toJson(wrapper)).toMatchSnapshot();

            // enter invalid date and check for an error
            wrapper.find('#test-month').simulate('change', { target: { value: 1 } });
            wrapper.find('#test-day').simulate('change', { target: { value: '29' } });
            expect(toJson(wrapper)).toMatchSnapshot();
        });

        it('should display an error on entering invalid date', () => {
            // enter invalid date and check for an error
            wrapper.find('#test-month').simulate('change', { target: { value: 1 } });
            wrapper.find('#test-day').simulate('change', { target: { value: '29' } });
            expect(toJson(wrapper)).toMatchSnapshot();
        });
    });
});
