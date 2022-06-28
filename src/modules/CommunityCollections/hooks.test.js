import { parseSearchQueryStringFromUrl } from './hooks';
import { PUB_SEARCH_BULK_EXPORT_SIZE } from 'config/general';

describe('parseSearchQueryStringFromUrl helper', () => {
    it('should correctly parse search query string from  querystring', () => {
        const result = parseSearchQueryStringFromUrl('page=1&pageSize=20&sortBy=published_date&sortDirection=Desc');

        expect(result).toEqual({
            page: 1,
            pageSize: 20,
            sortBy: 'published_date',
            sortDirection: 'Desc',
        });
    });

    it(
        'should correctly parse search query string from location search and ' +
            'reset pageSize if not in valid values (20, 50, 100)',
        () => {
            const result = parseSearchQueryStringFromUrl(
                'page=1&pageSize=2000&sortBy=published_date&sortDirection=Desc',
            );

            expect(result).toEqual({
                page: 1,
                pageSize: 20,
                sortBy: 'published_date',
                sortDirection: 'Desc',
            });
        },
    );

    it(
        'should correctly parse search query string from location search and ' +
            'reset sortDirection if not in valid values (Desc, Asc)',
        () => {
            const result = parseSearchQueryStringFromUrl('page=1&pageSize=20&sortBy=published_date&sortDirection=esc');

            expect(result).toEqual({
                page: 1,
                pageSize: 20,
                sortBy: 'published_date',
                sortDirection: 'Desc',
            });
        },
    );

    it('should correctly parse search query string from location search & reset sortBy if not in valid values', () => {
        const result = parseSearchQueryStringFromUrl('page=1&pageSize=100&sortBy=published_date&sortDirection=Asc');

        expect(result).toEqual({
            page: 1,
            pageSize: 100,
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
        const searchQuery = `pageSize=${PUB_SEARCH_BULK_EXPORT_SIZE}&page=1`;
        const canBulkExport = true;
        expect(parseSearchQueryStringFromUrl(searchQuery, canBulkExport)).toStrictEqual({
            bulkExportSelected: true,
            page: 1,
            pageSize: PUB_SEARCH_BULK_EXPORT_SIZE,
            sortBy: 'score',
            sortDirection: 'Desc',
        });
    });

    it('should correctly parse search query string from  querystring and include pid when provided', () => {
        const result = parseSearchQueryStringFromUrl(
            'page=1&pageSize=20&sortBy=published_date&sortDirection=Desc&pid=UQ:12345',
        );

        expect(result).toEqual({
            page: 1,
            pageSize: 20,
            sortBy: 'published_date',
            sortDirection: 'Desc',
            pid: 'UQ:12345',
        });
    });
});
