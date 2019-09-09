import { UnpublishedBufferCitationView } from './UnpublishedBufferCitationView';

function setup(testProps = {}) {
    // build full props list required by the component
    const props = {
        ...testProps,
        publication: testProps.publication || {},
    };
    return getElement(UnpublishedBufferCitationView, props);
}

describe('UnpublishedBufferCitationView test button click sets value', () => {
    it('should render empty component with no date', () => {
        const wrapper = setup();
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
