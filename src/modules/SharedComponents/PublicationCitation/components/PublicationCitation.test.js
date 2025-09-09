import React from 'react';
import { PublicationCitation } from './PublicationCitation';
import { mockRecordToFix, journalArticle } from 'mock/data/testing/records';
import { render, WithReduxStore, WithRouter, fireEvent, userEvent } from 'test-utils';
const mockUseNavigate = jest.fn();
import { useLocation } from 'react-router-dom';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockUseNavigate,
    useLocation: jest.fn(() => ({ pathname: '/', search: '', state: {} })),
}));

function setup(testProps = {}, testState = {}) {
    const props = {
        publication: mockRecordToFix,
        hideLinks: false,
        citationStyle: 'header',
        ...testProps,
    };
    const state = {
        accountReducer: { account: {} },
        ...testState,
    };
    return render(
        <WithReduxStore initialState={state}>
            <WithRouter>
                <PublicationCitation {...props} />
            </WithRouter>
        </WithReduxStore>,
    );
}

describe('PublicationCitation ', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render component with default item', () => {
        const { container } = setup();
        expect(container).toMatchSnapshot();
    });

    it('should render component with default item with image support', () => {
        const { container } = setup({
            showImageThumbnails: true,
            publication: { ...journalArticle, rek_display_type_lookup: 'Image' },
            security: { isAdmin: true, isAuthor: true },
        });

        expect(container).toMatchSnapshot();
    });

    it('should render component with default item without image, if not set to show thumbs', () => {
        const { container } = setup({ publication: { ...journalArticle, rek_display_type_lookup: 'Image' } });
        expect(container).toMatchSnapshot();
    });

    it('should render component with default item with image support, if item not in the whitelist but has an advisory', () => {
        const { container } = setup({
            showImageThumbnails: true,
            publication: {
                ...journalArticle,
                rek_display_type_lookup: 'Invalid',
                fez_record_search_key_advisory_statement: { rek_advisory_statement: 'advisory' },
            },
            security: { isAdmin: false, isAuthor: false },
        });
        expect(container).toMatchSnapshot();
    });

    it('should render component without image if whitelisted, but no datastream', () => {
        const { container } = setup({
            showImageThumbnails: true,
            publication: { ...journalArticle, rek_display_type_lookup: 'Image', fez_datastream_info: [] },
        });
        expect(container).toMatchSnapshot();
    });

    it('should render component with default item without links to title and doi', () => {
        const { container } = setup({ hideLinks: true });
        expect(container).toMatchSnapshot();
    });

    it('should render component with default list hiding the difference count', () => {
        const { container } = setup({ hideCountDiff: true });
        expect(container).toMatchSnapshot();
    });

    it('should render component with default list hiding the total count', () => {
        const { container } = setup({ hideCountTotal: true });
        expect(container).toMatchSnapshot();
    });

    it('should render component with default actions', () => {
        const { container } = setup({ showDefaultActions: true });
        expect(container).toMatchSnapshot();
    });

    it('should render component with empty custom actions', () => {
        const { container } = setup({ customActions: [] });
        expect(container).toMatchSnapshot();
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
        const { getAllByRole } = setup({
            showDefaultActions: false,
            customActions: customActions,
        });

        getAllByRole('button')
            .filter(button => !button.getAttribute('data-testid')?.startsWith('publication-citation-copy-button-'))
            .forEach((button, index) => {
                expect(button).toHaveTextContent(customActions[index].label);
                fireEvent.click(button);
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
        const { container } = setup({
            showDefaultActions: false,
            customActions: customActions,
            publicationsLoading: true,
        });
        expect(container).toMatchSnapshot();
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
        const { container } = setup({
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
        expect(container).toMatchSnapshot();
    });

    it('should render component with publication from multiple sources', () => {
        const publicationWithSources = { ...mockRecordToFix, sources: [{ source: 'espace', id: 'UQ:224457' }] };
        const { container } = setup({ publication: publicationWithSources, showSources: true });
        expect(container).toMatchSnapshot();
    });

    it('should render component without a title', () => {
        const publicationWithSources = { ...mockRecordToFix, sources: [{ source: 'espace', id: 'UQ:224457' }] };
        const { container } = setup({ publication: publicationWithSources, showSources: true, hideTitle: true });
        expect(container).toMatchSnapshot();
    });

    it('should handle default actions', () => {
        const { getByRole } = setup({
            showDefaultActions: true,
        });

        fireEvent.click(getByRole('button', { name: 'Request Correction' }));
        expect(mockUseNavigate).toHaveBeenCalledWith('/records/UQ:41878/fix');
    });

    it('should render primary action button', () => {
        const handleAction = jest.fn();
        const customActions = [
            {
                label: 'Claim now',
                primary: true,
                handleAction,
            },
        ];
        const { container } = setup({
            showDefaultActions: false,
            customActions: customActions,
        });

        expect(container).toMatchSnapshot();
    });

    it('should render publication citation metric with count', () => {
        const publicationWithMetricData = {
            ...mockRecordToFix,
            metricData: {
                count: 23,
                difference: 5,
                citation_url: 'http://www.test.com',
                source: 'altmetric',
            },
        };
        const { container } = setup({
            publication: publicationWithMetricData,
            showMetrics: true,
            showSourceCountIcon: true,
        });

        expect(container).toMatchSnapshot();
    });

    it('should render publication citation metric without count', () => {
        const publicationWithMetricData = {
            ...mockRecordToFix,
            metricData: {
                count: 23,
                difference: 5,
                citation_url: 'http://www.test.com',
                source: 'altmetric',
            },
        };
        const { container } = setup({
            publication: publicationWithMetricData,
            showMetrics: true,
            showSourceCountIcon: false,
        });

        expect(container).toMatchSnapshot();
    });

    it('should render publication with unpublished buffer', () => {
        const { container } = setup({ publication: mockRecordToFix, showUnpublishedBufferFields: true });
        expect(container).toMatchSnapshot();
    });

    it('should set referral URL for admin edit links with url fragments', () => {
        const openFn = jest.spyOn(window, 'open');
        openFn.mockImplementation(jest.fn());

        useLocation.mockImplementation(() => ({
            pathname: '/espace/feature-example/',
            search: '',
            hash: '#/records/search?searchQueryParams%5Ball%5D=&page=1&pageSize=20&sortBy=score&sortDirection=Desc',
        }));

        const expectedRefUrl =
            'https://fez-staging.library.uq.edu.au/admin/edit/UQ:41878?navigatedFrom=%2Frecords%2Fsearch%3FsearchQueryParams%255Ball%255D%3D%26page%3D1%26pageSize%3D20%26sortBy%3Dscore%26sortDirection%3DDesc';
        const { getByTestId, getByRole } = setup({
            showAdminActions: true,
            hideCitationCounts: true,
        });

        fireEvent.click(getByTestId('admin-actions-button'));
        fireEvent.click(getByRole('menuitem', { name: 'Edit selected record' }));

        expect(openFn).toHaveBeenCalledWith(expectedRefUrl, '_self', null);
    });

    it('should set referral URL for admin edit links without url fragments', () => {
        const openFn = jest.spyOn(window, 'open');
        openFn.mockImplementation(jest.fn());

        useLocation.mockImplementation(() => ({ pathname: '/espace/feature-example/', search: '' }));

        const expectedRefUrl =
            'https://fez-staging.library.uq.edu.au/admin/edit/UQ:41878?navigatedFrom=%2Fespace%2Ffeature-example%2F';

        const { getByTestId, getByRole } = setup({
            showAdminActions: true,
            hideCitationCounts: true,
        });

        fireEvent.click(getByTestId('admin-actions-button'));
        fireEvent.click(getByRole('menuitem', { name: 'Edit selected record' }));

        expect(openFn).toHaveBeenLastCalledWith(expectedRefUrl, '_self', null);
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
        const { container } = setup({
            publication: {
                ...publicationWithContentIndicators,
                rek_object_type_lookup: 'Record',
            },
        });
        expect(container).toMatchSnapshot();
    });

    it('should render component with default list hiding the citation text', () => {
        const { container } = setup({ hideCitationText: true });
        expect(container).toMatchSnapshot();
    });

    it('should render component with citation unavailable message on non support publication type', () => {
        const { container } = setup({ publication: { ...journalArticle, rek_display_type: 111 } });
        expect(container).toMatchSnapshot();
    });

    it('should render component with citation unavailable message when theres no publication type id', () => {
        const { container } = setup({ publication: { ...journalArticle, rek_display_type: null } });
        expect(container).toMatchSnapshot();
    });

    it('should allow users to copy citation text', async () => {
        Object.assign(navigator, {
            clipboard: {
                writeText: () => Promise.resolve(),
            },
        });
        jest.spyOn(navigator.clipboard, 'writeText');

        const { getByTestId } = setup();
        await userEvent.click(getByTestId(`publication-citation-copy-button-${mockRecordToFix.rek_pid}`));

        expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
            'Brown, M. A., He, Y., Rothnagel, J. A., Saunders, N. A.,  and Smith, R. (2004). Roles of heterogeneous nuclear ribonucleoproteins A/B in cell growth. Molecular Biology of The Cell  15 252A-253A.',
        );
    });

    it('should disable copy citation button when clipboard is not available', async () => {
        Object.assign(navigator, {
            clipboard: undefined,
        });
        const { getByTestId } = setup();
        expect(getByTestId(`publication-citation-copy-button-${mockRecordToFix.rek_pid}`)).toHaveAttribute('disabled');
    });
});
