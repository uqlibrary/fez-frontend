import { PartialDateForm } from './PartialDateForm';

function setup(testProps, isShallow = true) {
    const props = {
        ...testProps,
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
        wrapper.instance().componentWillUpdate();
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
                initial: {
                    date: () => 2,
                    month: () => 1,
                    year: () => 2020,
                    isValid: () => true,
                },
            },
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
