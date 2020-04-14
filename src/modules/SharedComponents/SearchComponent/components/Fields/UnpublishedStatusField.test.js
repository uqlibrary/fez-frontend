import { UnpublishedStatusField, mapStateToProps } from './UnpublishedStatusField';

function setup(testProps = {}, args = { isShallow: false }) {
    const props = {
        onChange: jest.fn(),
        ...testProps,
    };

    return getElement(UnpublishedStatusField, props, args);
}

describe('UnpublishedStatusField component', () => {
    it('should render default view', () => {
        const wrapper = setup();
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render with value selected from redux form Field', () => {
        const wrapper = setup({
            input: {
                value: 'Any unpublished',
            },
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render error message from redux form field', () => {
        const wrapper = setup({
            meta: {
                error: 'This field is required',
            },
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render error text', () => {
        const wrapper = setup({
            errorText: 'This field is required',
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should have working helper which sets errorText state', () => {
        const props = {
            error: true,
            errorText: 'test1',
        };
        const state = {};
        expect(mapStateToProps(state, props)).toMatchSnapshot();
    });
});
