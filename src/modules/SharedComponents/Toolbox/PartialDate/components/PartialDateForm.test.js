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
});
