import { pathConfig } from '../../config';

describe('useColumns', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('createListSharingUrl', () => {
        it('with hash', () => {
            jest.resetModules();
            jest.doMock('../../config', () => ({
                APP_URL: 'https://example.com/#/',
                pathConfig,
            }));
            const { createListSharingUrl } = require('./useColumns');
            expect(createListSharingUrl(1)).toBe(
                'https://example.com/journals/search/?activeFacets%5Bfilters%5D%5BShowFavouritedOnly%5D=1&keywords%5BKeyword-all-journals%5D%5Btype%5D=Keyword&keywords%5BKeyword-all-journals%5D%5Btext%5D=all+journals&keywords%5BKeyword-all-journals%5D%5Bid%5D=Keyword-all-journals&keywords%5BKeyword-all-journals%5D%5Boperand%5D=AND#/journals/search/?activeFacets%5Bfilters%5D%5BShowFavouritedOnly%5D=true&page=1&keywords%5BKeyword-all-journals%5D%5Btype%5D=Keyword&keywords%5BKeyword-all-journals%5D%5Btext%5D=all+journals&keywords%5BKeyword-all-journals%5D%5Bid%5D=Keyword-all-journals&keywords%5BKeyword-all-journals%5D%5Boperand%5D=AND',
            );
        });

        it('without hash', () => {
            jest.resetModules();
            jest.doMock('../../config', () => ({
                APP_URL: 'https://example.com/',
                pathConfig,
            }));
            const { createListSharingUrl } = require('./useColumns');
            expect(createListSharingUrl(1)).toBe(
                'https://example.com/journals/search/?activeFacets%5Bfilters%5D%5BShowFavouritedOnly%5D=1&keywords%5BKeyword-all-journals%5D%5Btype%5D=Keyword&keywords%5BKeyword-all-journals%5D%5Btext%5D=all+journals&keywords%5BKeyword-all-journals%5D%5Bid%5D=Keyword-all-journals&keywords%5BKeyword-all-journals%5D%5Boperand%5D=AND#/journals/search/?activeFacets%5Bfilters%5D%5BShowFavouritedOnly%5D=true&page=1&keywords%5BKeyword-all-journals%5D%5Btype%5D=Keyword&keywords%5BKeyword-all-journals%5D%5Btext%5D=all+journals&keywords%5BKeyword-all-journals%5D%5Bid%5D=Keyword-all-journals&keywords%5BKeyword-all-journals%5D%5Boperand%5D=AND',
            );
        });
    });
});
