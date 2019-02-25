import UnpublishedStatusField from './UnpublishedStatusField';

function setup(testProps, isShallow = false) {
    const props = {
        onChange: jest.fn(),
        ...testProps
    };

    return getElement(UnpublishedStatusField, props, isShallow);
};

describe('UnpublishedStatusField component', () => {

    it('should render default view', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render with value selected from redux form Field', () => {
        const wrapper = setup({
            input: {
                value: 'test'
            }
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render error message from redux form field', () => {
        const wrapper = setup({
            meta: {
                error: 'This field is required'
            }
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render error text', () => {
        const wrapper = setup({
            errorText: 'This field is required'
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
