import {UnpublishedBufferCitationView} from './UnpublishedBufferCitationView';

function setup(testProps, isShallow = true) {
    // build full props list required by the component
    const props = {
        ...testProps,
        publication: testProps.publication || {},
    };
    return getElement(UnpublishedBufferCitationView, props, isShallow);
}

describe('UnpublishedBufferCitationView test button click sets value', () => {
    it('should render empty component with no date', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
