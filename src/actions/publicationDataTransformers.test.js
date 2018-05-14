import * as transformers from './publicationDataTransformers';

describe('Publication data transformers ', () => {
    describe('promptForDownload test', () => {
        it('should not trigger a file download', () => {
            const data = [
                {
                    rule: 'mine',
                    export_to: 'unknown',
                    page: '1',
                    per_page: '20',
                    sort: 'published_date',
                    order_by: 'desc'
                },
            ];

            expect(() => {
                transformers.promptForDownload(data);
            }).toThrow();
        });
    });
});
