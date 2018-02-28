import RichEditor from './RichEditor';
import 'ckeditor';

window.CKEDITOR = {
    appendTo: () => ({
        setReadOnly: jest.fn(),
        on: jest.fn()
    })
};

jest.mock('ckeditor', () => ({
}));

function setup(testProps, isShallow = true) {
    const props = {
        ...testProps,
        // value: PropTypes.any,
        // className: PropTypes.string,
        onChange: testProps.onChange || jest.fn(), // PropTypes.func.isRequired,
        disabled: testProps.disabled || false,
        // height: PropTypes.number
    };

    return getElement(RichEditor, props, isShallow);
}


describe('RichEditor tests ', () => {
    it('should render component', () => {
        const wrapper = setup({}, false);
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
