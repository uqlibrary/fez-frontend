import { InlineLoader } from './InlineLoader';

function setup(testProps, isShallow = true) {
    const props = {
        ...testProps,
        classes: {
            text: {
                fontWeight: 200,
                margin: '24px 0',
            },
        },
    };
    return getElement(InlineLoader, props, isShallow);
}

describe('Component InlineLoader', () => {
    it('should render as expected', () => {
        const props = {
            message: 'This is a tst',
        };
        const wrapper = setup({ ...props });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
