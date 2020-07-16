jest.dontMock('./ThesisHdrRedirect');

import ThesisHdrRedirect from './ThesisHdrRedirect';
import { routes } from 'config';

function setup(testProps = {}) {
    const props = {
        ...testProps,
        submitting: testProps.submitting || false, // : PropTypes.bool,
        vocabId: testProps.vocabId || 0, // : PropTypes.number
    };
    return getElement(ThesisHdrRedirect, props);
}

describe('ThesisHdrRedirect ', () => {
    it('should render component', () => {
        const wrapper = setup();
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with 0 input fields', () => {
        const wrapper = setup();
        expect(wrapper.find('Field').length).toEqual(0);
    });

    it('should redirect to Thesis submission page', () => {
        const { location } = window;
        delete window.location;
        window.location = { assign: jest.fn() };
        setup({})
            .instance()
            ._handleAction();
        expect(window.location.assign).toBeCalledWith(expect.stringContaining(routes.pathConfig.hdrSubmission));
        window.location = location;
    });
});
