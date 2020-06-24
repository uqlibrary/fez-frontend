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
        hideSeries: false,
        hideGrants: false,
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
        const wrapper = setup({ showContributionStatement: true });
        const tree = toJson(wrapper);
        expect(tree).toMatchSnapshot();
    });

    it('should render all fields as disabled', () => {
        const wrapper = setup({ showContributionStatement: true, submitting: true });
        const tree = toJson(wrapper);
        expect(tree).toMatchSnapshot();
    });

    it('should render with grants component hidden', () => {
        const wrapper = setup({ showContributionStatement: true, hideGrants: true });
        const tree = toJson(wrapper);
        expect(tree).toMatchSnapshot();
    });

    it('should call UNSAFE_componentWillReceiveProps', () => {
        const wrapper = setup({});
        const UNSAFE_componentWillReceiveProps = jest.spyOn(wrapper.instance(), 'UNSAFE_componentWillReceiveProps');
        wrapper.setProps({
            hideVolume: true,
            hideStartPage: true,
            hideAudienceSize: true,
        });
        expect(UNSAFE_componentWillReceiveProps).toHaveBeenCalled();
    });

    it('should normalize ISRC value', () => {
        const wrapper = setup({});
        const expected = wrapper.instance().normalizeIsrc('CD-abc2323423');
        expect(expected).toEqual('CD-ABC-23-23423');
    });

    it('should transform ISRC value', () => {
        const wrapper = setup({});
        const expected = wrapper.instance().transformIsrc(
            {
                value: 'fez_test',
                order: 'fez_test_order',
            },
            'ISRC TE-EST-23-12343',
            1,
        );
        expect(expected).toEqual({
            fez_test: 'TE-EST-23-12343',
            fez_test_order: 2,
        });
    });

    it('should transform ISMN value', () => {
        const wrapper = setup({});
        const expected = wrapper.instance().transformIsmn(
            {
                value: 'fez_test',
                order: 'fez_test_order',
            },
            'ISMN TE-EST-23-12343',
            1,
        );
        expect(expected).toEqual({
            fez_test: 'TE-EST-23-12343',
            fez_test_order: 2,
        });
    });

    // cc - in reality, signif and contrib always appear together
    it('should show significance field even if contribution field isnt empty', () => {
        const wrapper = setup({
            showContributionStatement: false,
            showSignificance: true,
        });
        const tree = toJson(wrapper);
        expect(tree).toMatchSnapshot();
    });

    it('should not show NTRO data card in the Ntro fields', () => {
        const wrapper = setup({
            showContributionStatement: false,
            showSignificance: true,
            hideAbstract: true,
            hidePeerReviewActivity: true,
            hideLanguage: true,
            hideAudienceSize: true,
            hideOriginalFormat: true,
            hideExtent: true,
            hideEndPage: true,
            hideStartPage: true,
            hideIssue: true,
            hideVolume: true,
            hideSeries: true,
            hideIsrc: true,
            hideIsmn: true,
        });

        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
