import NtroFields from './NtroFields';

function setup(testProps, isShallow = true) {
    const props = {
        submitting: false,
        hideIsmn: false,
        hideIsrc: false,
        hideVolume: false,
        hideIssue: false,
        hideStartPage: false,
        hideEndPage: false,
        hideExtent: false,
        hideOriginalFormat: false,
        hideAudienceSize: false,
        hidePeerReviewActivity: false,
        hideNotes: false,
        hideSeries: false,
        showContributionStatement: false,
        ...testProps,
    };
    return getElement(NtroFields, props, isShallow);
}

describe('Component NtroFields', () => {
    it('should render default view', () => {
        const wrapper = setup({});
        const tree = toJson(wrapper);
        expect(tree).toMatchSnapshot();
    });

    it('should render contribution statement fields as well', () => {
        const wrapper = setup({showContributionStatement: true});
        const tree = toJson(wrapper);
        expect(tree).toMatchSnapshot();
    });

    it('should render all fields as disabled', () => {
        const wrapper = setup({showContributionStatement: true, submitting: true});
        const tree = toJson(wrapper);
        expect(tree).toMatchSnapshot();
    });
});
