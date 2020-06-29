import { GrantListEditorHeader, styles } from './GrantListEditorHeader';

function setup(testProps = {}) {
    const props = {
        onDeleteAll: jest.fn(),
        locale: {},
        disabled: false,
        classes: {},
        width: '',
        hideType: false,
        ...testProps,
    };
    return getElement(GrantListEditorHeader, props);
}

describe('GrantListEditorHeader', () => {
    it('should render default view', () => {
        const wrapper = setup();
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render default mobile view', () => {
        const wrapper = setup({ width: 'xs' });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should hide grant agency type input', () => {
        const wrapper = setup({ hideType: true });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should have a proper style generator', () => {
        expect(styles()).toMatchSnapshot();
    });

    it('should set confirmation box ref', () => {
        const wrapper = setup();
        wrapper.instance().handleConfirmationBoxRef('test');
        expect(wrapper.instance().confirmationBox).toEqual('test');
    });

    it('should show confirmation box', () => {
        const showConfirmationFn = jest.fn();
        const wrapper = setup();
        wrapper.instance().confirmationBox = {
            showConfirmation: showConfirmationFn,
        };

        expect(toJson(wrapper)).toMatchSnapshot();

        wrapper.find('WithStyles(ForwardRef(IconButton))').simulate('click');
        expect(showConfirmationFn).toHaveBeenCalled();
    });
});
