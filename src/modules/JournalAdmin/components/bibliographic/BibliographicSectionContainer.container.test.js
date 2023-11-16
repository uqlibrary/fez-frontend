import { BibliographicSectionContainer, mapStateToProps } from './BibliographicSectionContainer';
import Immutable from 'immutable';

function setup(testProps = {}, args = { isShallow: true }) {
    const props = {
        formValues: {
            toJS: jest.fn(() => ({})),
        },
        ...testProps,
    };

    return renderComponent(BibliographicSectionContainer, props, args);
}

describe('BibliographicSectionContainer component', () => {
    it('should render default view', () => {
        const render = setup();
        expect(render.getRenderOutput()).toMatchSnapshot();
    });

    it('should render disabled view', () => {
        const render = setup({ disabled: true });
        expect(render.getRenderOutput()).toMatchSnapshot();
    });

    it('should map state to props', () => {
        expect(mapStateToProps({}, {})).toEqual({
            formValues: Immutable.Map({}),
        });
    });
});
