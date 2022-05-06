import { PublicationCitation, styles } from './PublicationCitation';
import { mockRecordToFix, journalArticle } from 'mock/data/testing/records';

function setup(testProps = {}) {
    const props = {
        classes: {},
        publication: mockRecordToFix,
        history: { push: jest.fn() },
        actions: {
            setRecordToView: jest.fn(),
        },
        hideLinks: false,
        citationStyle: 'header',
        ...testProps,
    };
    return getElement(PublicationCitation, props);
}

describe('PublicationCitation ', () => {
    it('should render component with default item', () => {
        const wrapper = setup();
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with default item with image support', () => {
        const wrapper = setup({
            showImageThumbnails: true,
            publication: { ...journalArticle, rek_display_type_lookup: 'Image' },
            security: { isAdmin: true, isAuthor: true },
        });

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with default item without image, if not set to show thumbs', () => {
        const wrapper = setup({ publication: { ...journalArticle, rek_display_type_lookup: 'Image' } });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component without image if whitelisted, but no datastream', () => {
        const wrapper = setup({
            showImageThumbnails: true,
            publication: { ...journalArticle, rek_display_type_lookup: 'Image', fez_datastream_info: [] },
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should have a proper style generator', () => {
        const theme = {
            typography: {
                caption: 'test1',
                body2: {
                    color: 'test2',
                },
            },
            breakpoints: {
                down: jest.fn(() => '@media (max-width:959.95px)'),
                up: jest.fn(() => '@media (min-width:959.95px)'),
            },
        };
        expect(styles(theme)).toMatchSnapshot();
    });

    it('should render component with default item without links to title and doi', () => {
        const wrapper = setup({ hideLinks: true });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with default list hiding the difference count', () => {
        const wrapper = setup({ hideCountDiff: true });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with default list hiding the total count', () => {
        const wrapper = setup({ hideCountTotal: true });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with default actions', () => {
        const wrapper = setup({ showDefaultActions: true });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render primary action button', () => {
        const wrapper = setup();
        expect(wrapper.instance().renderActions([])).toBe(null);
        expect(
            wrapper.instance().renderActions([
                {
                    primary: true,
                },
            ]),
        ).toMatchSnapshot();
    });

    it('should render component with custom actions', () => {
        const customActions = [
            {
                label: 'Claim now',
                handleAction: jest.fn(),
            },
            {
                label: 'Not mine',
                handleAction: jest.fn(),
            },
            {
                label: 'View stats',
                handleAction: jest.fn(),
            },
        ];
        const wrapper = setup({
            showDefaultActions: false,
            customActions: customActions,
        });

        wrapper.find('WithStyles(Button).publicationAction').forEach((button, index) => {
            expect(button.getElement().props.children).toEqual([customActions[index].label, false]);
            button.getElement().props.onClick();
            expect(customActions[index].handleAction).toBeCalled();
        });
    });

    it('should render button disabled with spinners on action buttons while loading', () => {
        const customActions = [
            {
                label: 'Claim now',
                primary: true,
                handleAction: jest.fn(),
            },
            {
                label: 'Not mine',
                handleAction: jest.fn(),
            },
            {
                label: 'View stats',
                handleAction: jest.fn(),
            },
        ];
        const wrapper = setup({
            showDefaultActions: false,
            customActions: customActions,
            publicationsLoading: true,
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render button disabled on action buttons for publication without any authors metadata from crossref', () => {
        const customActions = [
            {
                label: 'Claim now',
                primary: true,
                handleAction: jest.fn(),
            },
            {
                label: 'Not mine',
                handleAction: jest.fn(),
            },
            {
                label: 'View stats',
                handleAction: jest.fn(),
            },
        ];
        const wrapper = setup({
            showDefaultActions: false,
            customActions: customActions,
            publicationsLoading: true,
            publication: {
                rek_display_type: 179,
                rek_date: '2019-07-01T00:00:00Z',
                fez_record_search_key_doi: { rek_doi: '10.1111/1440-1630.12585' },
                fez_record_search_key_ismemberof: [{ rek_ismemberof: 'UQ:639325', rek_ismemberof_order: 1 }],
                fez_record_search_key_issn: [
                    { rek_issn: '0045-0766', rek_issn_order: 1 },
                    { rek_issn: '1440-1630', rek_issn_order: 2 },
                ],
                fez_record_search_key_keywords: [{ rek_keywords: 'Occupational Therapy', rek_keywords_order: 1 }],
                rek_object_type: 3,
                fez_record_search_key_start_page: { rek_start_page: '39' },
                fez_record_search_key_end_page: { rek_end_page: '82' },
                fez_record_search_key_publisher: { rek_publisher: 'Wiley' },
                rek_status: 2,
                rek_title: 'Oral Presentations \u2013 Thursday 11 July 2019',
                fez_record_search_key_issue_number: { rek_issue_number: 'S1' },
                fez_record_search_key_journal_name: { rek_journal_name: 'Australian Occupational Therapy Journal' },
                fez_record_search_key_volume_number: { rek_volume_number: '66' },
            },
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with publication from multiple sources', () => {
        const publicationWithSources = { ...mockRecordToFix, sources: [{ source: 'espace', id: 'UQ:224457' }] };
        const wrapper = setup({ publication: publicationWithSources, showSources: true });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component without a title', () => {
        const publicationWithSources = { ...mockRecordToFix, sources: [{ source: 'espace', id: 'UQ:224457' }] };
        const wrapper = setup({ publication: publicationWithSources, showSources: true, hideTitle: true });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should handle default actions', () => {
        const wrapper = setup({
            showDefaultActions: true,
        });
        const test = jest.spyOn(wrapper.instance(), '_handleDefaultActions');
        wrapper.find('WithStyles(ForwardRef(Button)).publicationAction').forEach((button, index) => {
            expect(button.getElement().props.children).toEqual(
                // wrapper.instance().defaultActions[index].label
                [wrapper.instance().defaultActions[index].label, false],
            );

            const actionKey = wrapper.instance().defaultActions[index].key;
            button.getElement().props.onClick();
            expect(test).toBeCalledWith(actionKey);

            switch (actionKey) {
                case 'fixRecord':
                    expect(wrapper.instance().props.history.push).toHaveBeenCalled();
                    break;

                case 'shareRecord':
                    // TODO
                    console.log('Test missing');
                    break;

                case 'NAN':
                    // TODO
                    console.log('Test missing');
                    break;

                default:
                    console.log('Unsupported default action');
                    break;
            }
        });
        wrapper.instance()._handleDefaultActions('shareRecord');
        wrapper.instance()._handleDefaultActions('');
    });

    it('should handle custom actions', () => {
        const handleAction = jest.fn();
        const customActions = [
            {
                label: 'Claim now',
                primary: true,
                handleAction,
            },
            {
                label: 'Not mine',
                handleAction,
            },
            {
                label: 'View stats',
                handleAction,
            },
        ];
        const wrapper = setup({
            showDefaultActions: false,
            customActions: customActions,
        });

        wrapper.find('WithStyles(ForwardRef(Button)).publicationAction').forEach(button => {
            button.simulate('click');
        });

        expect(handleAction).toHaveBeenCalledTimes(3);
    });

    it('should render publication with citation metric', () => {
        const publicationWithMetricData = {
            ...mockRecordToFix,
            metricData: {
                count: 23,
                difference: 5,
                citation_url: 'http://www.test.com',
                source: 'altmetric',
            },
        };
        const wrapper = setup({
            publication: publicationWithMetricData,
            showMetrics: true,
            showSourceCountIcon: true,
        });
        expect(toJson(wrapper.find('.citationMetrics ExternalLink'))).toMatchSnapshot();

        // Display count without icon
        wrapper.setProps({
            showSourceCountIcon: false,
        });
        expect(toJson(wrapper.find('.citationMetrics WithStyles(Typography).count'))).toMatchSnapshot();
    });

    it('should render publication with unpublished buffer', () => {
        const wrapper = setup({ publication: mockRecordToFix, showUnpublishedBufferFields: true });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should return message indicating unavailability of citation display', () => {
        const wrapper = setup();
        expect(wrapper.instance().renderCitation(null)).toMatchSnapshot();
    });

    it('should set referral URL for admin edit links with or without url fragments', () => {
        const expectedRefUrl =
            '/records/search?searchQueryParams%5Ball%5D=&page=1&pageSize=20&sortBy=score&sortDirection=Desc';
        const wrapper = setup({
            showAdminActions: true,
            hideCitationCounts: true,
            location: {
                hash: '#/records/search?searchQueryParams%5Ball%5D=&page=1&pageSize=20&sortBy=score&sortDirection=Desc',
                search: '',
                pathname: '/espace/feature-example/', // hosted feature branch
            },
        });
        expect(wrapper.find('Memo(AdminActions)').props().navigatedFrom).toBe(expectedRefUrl);

        const wrapper2 = setup({
            showAdminActions: true,
            hideCitationCounts: true,
            location: {
                hash: '',
                pathname: '/records/search',
                search: '?searchQueryParams%5Ball%5D=&page=1&pageSize=20&sortBy=score&sortDirection=Desc',
            },
            publication: {
                ...mockRecordToFix,
                rek_object_type_lookup: 'Record',
            },
        });
        expect(wrapper2.find('Memo(AdminActions)').props().navigatedFrom).toBe(expectedRefUrl);
    });

    it('should render component with content indicators', () => {
        const publicationWithContentIndicators = {
            ...mockRecordToFix,
            fez_record_search_key_content_indicator: [
                {
                    rek_content_indicator_id: 1,
                    rek_content_indicator: 454079,
                    rek_ismemberof: 'UQ:152266',
                    rek_content_indicator_order: 1,
                    rek_content_indicator_lookup: 'a content indicator',
                },
                {
                    rek_content_indicator_id: 2,
                    rek_content_indicator: 454080,
                    rek_ismemberof: 'UQ:152266',
                    rek_content_indicator_order: 2,
                    rek_content_indicator_lookup: 'another content indicator',
                },
            ],
        };
        const wrapper = setup({
            publication: {
                ...publicationWithContentIndicators,
                rek_object_type_lookup: 'Record',
            },
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with default list hiding the citation text', () => {
        const wrapper = setup({ hideCitationText: true });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
