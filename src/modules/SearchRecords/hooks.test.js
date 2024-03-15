import { parseSearchQueryStringFromUrl } from './hooks';
import { PUB_SEARCH_BULK_EXPORT_SIZE } from 'config/general';

describe('parseSearchQueryStringFromUrl helper', () => {
    it('should correctly parse search query string from location search (default filters + title', () => {
        const result = parseSearchQueryStringFromUrl(
            'page=1&pageSize=20&sortBy=published_date&sortDirection=Desc&searchQueryParams%5Btitle%5D=sometestdata',
        );

        expect(result).toEqual({
            activeFacets: { filters: {}, ranges: {} },
            page: 1,
            pageSize: 20,
            searchQueryParams: { title: 'sometestdata' },
            sortBy: 'published_date',
            sortDirection: 'Desc',
        });
    });

    it('should parse properly when activeFacets.showOpenAccessOnly is not present in url', () => {
        const result = parseSearchQueryStringFromUrl('activeFacets%5Btest1%5D=test2');
        expect(result).toEqual({
            activeFacets: { filters: {}, ranges: {} },
            page: 1,
            pageSize: 20,
            sortBy: 'score',
            sortDirection: 'Desc',
        });
    });

    it(
        'should correctly parse search query string from location search ' +
            '(default filters + publication type facet + title',
        () => {
            const result = parseSearchQueryStringFromUrl(
                'page=1&pageSize=20&sortBy=published_date&sortDirection=Desc&activeFacets%5Bfilters%5D%5B' +
                    'Display+type%5D=130&activeFacets%5BshowOpenAccessOnly%5D=false&searchQueryParams%5B' +
                    'title%5D=some+test+data',
            );

            expect(result).toEqual({
                activeFacets: { filters: { 'Display type': '130' }, ranges: {}, showOpenAccessOnly: false },
                page: 1,
                pageSize: 20,
                searchQueryParams: { title: 'some test data' },
                sortBy: 'published_date',
                sortDirection: 'Desc',
            });
        },
    );

    it(
        'should correctly parse search query string from location search ' +
            '(changed filters + publication type + open access)',
        () => {
            const result = parseSearchQueryStringFromUrl(
                'page=2&pageSize=50&sortBy=published_date&sortDirection=Desc&activeFacets%5Bfilters%5D%5B' +
                    'Display+type%5D=130&activeFacets%5BshowOpenAccessOnly%5D=true&searchQueryParams%5B' +
                    'title%5D=some+test+data',
            );

            expect(result).toEqual({
                activeFacets: { filters: { 'Display type': '130' }, ranges: {}, showOpenAccessOnly: true },
                page: 2,
                pageSize: 50,
                searchQueryParams: { title: 'some test data' },
                sortBy: 'published_date',
                sortDirection: 'Desc',
            });
        },
    );

    it('should correctly parse search query string from location search (published year)', () => {
        const result = parseSearchQueryStringFromUrl(
            'page=1&pageSize=20&sortBy=published_date&sortDirection=Desc&activeFacets%5B' +
                'ranges%5D%5BYear+published%5D%5Bfrom%5D=2008&activeFacets%5Branges%5D%5B' +
                'Year+published%5D%5Bto%5D=2023&activeFacets%5BshowOpenAccessOnly%5D=false&' +
                'searchQueryParams%5Btitle%5D=some+test+data',
        );

        expect(result).toEqual({
            activeFacets: {
                filters: {},
                ranges: { 'Year published': { from: '2008', to: '2023' } },
                showOpenAccessOnly: false,
            },
            page: 1,
            pageSize: 20,
            searchQueryParams: { title: 'some test data' },
            sortBy: 'published_date',
            sortDirection: 'Desc',
        });
    });

    it(
        'should correctly parse search query string from location search and ' +
            'reset pageSize if not in valid values (20, 50, 100)',
        () => {
            const result = parseSearchQueryStringFromUrl(
                'page=1&pageSize=2000&sortBy=published_date&sortDirection=Desc&activeFacets%5Branges%5D%5B' +
                    'Year+published%5D%5Bfrom%5D=2008&activeFacets%5Branges%5D%5BYear+published%5D%5Bto%5D' +
                    '=2023&activeFacets%5BshowOpenAccessOnly%5D=false&searchQueryParams%5Btitle%5D=some+test+data',
            );

            expect(result).toEqual({
                activeFacets: {
                    filters: {},
                    ranges: { 'Year published': { from: '2008', to: '2023' } },
                    showOpenAccessOnly: false,
                },
                page: 1,
                pageSize: 20,
                searchQueryParams: { title: 'some test data' },
                sortBy: 'published_date',
                sortDirection: 'Desc',
            });
        },
    );

    it(
        'should correctly parse search query string from location search and ' +
            'reset sortDirection if not in valid values (Desc, Asc)',
        () => {
            const result = parseSearchQueryStringFromUrl(
                'page=1&pageSize=20&sortBy=published_date&sortDirection=esc&activeFacets%5Branges%5D%5B' +
                    'Year+published%5D%5Bfrom%5D=2008&activeFacets%5Branges%5D%5BYear+published%5D%5Bto%5D' +
                    '=2023&activeFacets%5BshowOpenAccessOnly%5D=false&searchQueryParams%5Btitle%5D=some+test+data',
            );

            expect(result).toEqual({
                activeFacets: {
                    filters: {},
                    ranges: { 'Year published': { from: '2008', to: '2023' } },
                    showOpenAccessOnly: false,
                },
                page: 1,
                pageSize: 20,
                searchQueryParams: { title: 'some test data' },
                sortBy: 'published_date',
                sortDirection: 'Desc',
            });
        },
    );

    it('should correctly parse search query string from location search & reset sortBy if not in valid values', () => {
        const result = parseSearchQueryStringFromUrl(
            'page=1&pageSize=100&sortBy=published_date&sortDirection=Asc&activeFacets%5Branges%5D%5B' +
                'Year+published%5D%5Bfrom%5D=2008&activeFacets%5Branges%5D%5BYear+published%5D%5Bto%5D' +
                '=2023&activeFacets%5BshowOpenAccessOnly%5D=false&searchQueryParams%5Btitle%5D=some+test+data',
        );

        expect(result).toEqual({
            activeFacets: {
                filters: {},
                ranges: { 'Year published': { from: '2008', to: '2023' } },
                showOpenAccessOnly: false,
            },
            page: 1,
            pageSize: 100,
            searchQueryParams: { title: 'some test data' },
            sortBy: 'published_date',
            sortDirection: 'Asc',
        });
    });

    it('should handle empty search query string', () => {
        const expected = {};
        const result = parseSearchQueryStringFromUrl('');
        expect(result).toEqual(expected);
    });

    it('sets bulkExportSelected to true if specific page size is detected', () => {
        const searchQuery = `pageSize=${PUB_SEARCH_BULK_EXPORT_SIZE}&page=1&activeFacets`;
        const canBulkExport = true;
        const isUnpublishedBufferPage = false;
        expect(parseSearchQueryStringFromUrl(searchQuery, canBulkExport, isUnpublishedBufferPage)).toStrictEqual({
            activeFacets: { filters: {}, ranges: {} },
            bulkExportSelected: true,
            page: 1,
            pageSize: PUB_SEARCH_BULK_EXPORT_SIZE,
            sortBy: 'score',
            sortDirection: 'Desc',
        });
    });
});
