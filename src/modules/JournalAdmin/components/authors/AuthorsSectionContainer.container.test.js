import { AuthorsSectionContainer } from './AuthorsSectionContainer';

function setup(testProps = {}, args = { isShallow: true }) {
    const props = {
        formValues: {
            toJS: jest.fn(() => ({})),
        },
        ...testProps,
    };

    return renderComponent(AuthorsSectionContainer, props, args);
}

describe('AuthorsSectionContainer component', () => {
    it('should render default view', () => {
        const render = setup();
        expect(render.getRenderOutput()).toMatchSnapshot();
    });

    it('should render disabled view', () => {
        const render = setup({ disabled: true });
        expect(render.getRenderOutput()).toMatchSnapshot();
    });
});
