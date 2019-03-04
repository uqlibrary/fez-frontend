import {PublicationCitation} from './PublicationCitation';
import PublicationCitationWithStyles from './PublicationCitation';
import {mockRecordToFix} from 'mock/data/testing/records';

const getProps = (testProps = {}) => ({
    classes: {},
    publication: mockRecordToFix,
    history: {push: jest.fn()},
    actions: {
        setFixRecord: jest.fn(),
        setRecordToView: jest.fn()
    },
    hideLinks: false,
    ...testProps
});

function setup(testProps, isShallow = true){
    return getElement(PublicationCitation, getProps(testProps), isShallow);
}

describe('PublicationCitation ', () => {
    it('should render component with default item', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render with styles', () => {
        const wrapper = getElement(PublicationCitationWithStyles, getProps());
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with default item without links to title and doi', () => {
        const wrapper = setup({hideLinks: true});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with default list hiding the difference count', () => {
        const wrapper = setup({hideCountDiff: true});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with default list hiding the total count', () => {
        const wrapper = setup({hideCountTotal: true});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with default actions', () => {
        const wrapper = setup({showDefaultActions: true});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with custom actions', () => {
        const wrapper = setup({
            customActions: [
                {
                    label: 'Claim now',
                    handleAction: jest.fn()
                },
                {
                    label: 'Not mine',
                    handleAction: jest.fn()
                },
                {
                    label: 'View stats',
                    handleAction: jest.fn()
                }
            ]});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with publication from multiple sources', () => {
        const publicationWithSources = {...mockRecordToFix, "sources": [{source: "espace", id: "UQ:224457"}]};
        const wrapper = setup({publication: publicationWithSources, showSources: true});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component without a title', () => {
        const publicationWithSources = {...mockRecordToFix, "sources": [{source: "espace", id: "UQ:224457"}]};
        const wrapper = setup({publication: publicationWithSources, showSources: true, hideTitle: true});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should handle default actions', () => {
        const wrapper = setup({showDefaultActions: true});
        wrapper.instance()._handleDefaultActions('fixRecord');
        expect(wrapper.instance().props.history.push).toHaveBeenCalled();
        expect(wrapper.instance().props.actions.setFixRecord).toHaveBeenCalled();

        wrapper.instance()._handleDefaultActions('shareRecord');
        // TODO
        wrapper.instance()._handleDefaultActions('NAN');
        // TODO
        wrapper.find('WithStyles(Button)').get(0).props.onClick();
    });

    it('should render publication with citation metric', () => {
        const publicationWithMetricData = {...mockRecordToFix, metricData: {count: 23, difference: 5, citation_url: 'http://www.test.com', source: 'altmetric'}};
        const wrapper = setup({publication: publicationWithMetricData, showMetrics: true});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render publication with unpublished buffer', () => {
        const wrapper = setup({publication: mockRecordToFix, showUnpublishedBufferFields: true});
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
