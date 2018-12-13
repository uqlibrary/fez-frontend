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
        locale: {
            contributionStatement: {
                title: 'Author/Creator contribution statement',
                fields: {
                    scaleOfWork: {
                        label: 'Scale/Significance of work'
                    },
                    impactStatement: {
                        label: 'Creator contribution statement',
                        placeholder: 'Type or cut and paste your impact statement here'
                    },
                }
            },
            metadata: {
                title: 'Non-traditional research output metadata',
                fields: {
                    volume: {
                        label: 'Volume',
                    },
                    issue: {
                        label: 'Issue',
                    },
                    startPage: {
                        label: 'Start page',
                    },
                    endPage: {
                        label: 'End page',
                    },
                    extent: {
                        label: 'Extent',
                        placeholder: 'Enter total pages, size or duration of work'
                    },
                    physicalDescription: {
                        label: 'Physical description',
                    },
                    audienceSize: {
                        label: 'Audience size',
                    },
                    peerReviewActivity: {
                        label: 'Peer review activity',
                    },
                    notes: {
                        label: 'Notes',
                    },
                }
            }
        },
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
