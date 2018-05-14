jest.mock('js-file-download');

import * as transformers from './publicationDataTransformers';

describe('Publication data transformers ', () => {
    describe('promptForDownload test', () => {
        const fileDownload = require('js-file-download');
        beforeEach(() => {
            fileDownload.mockClear();
        });
        // mock fileDownload
        fileDownload.mockImplementation((data, filename, mimeType) => [data, filename, mimeType]);

        it('should trigger a file download', () => {
            for (const format in transformers.formatToFileInfoMap) {
                const fileInfo = transformers.formatToFileInfoMap[format];
                const expected = ['data', fileInfo.filename, fileInfo.mimeType];

                transformers.promptForDownload(format, 'data');
                expect(fileDownload).toHaveBeenCalledWith(...expected);
            }
        });

        it('should not trigger a file download for a unknown type', () => {
            expect(() => {
                transformers.promptForDownload('unknown', exportSearchToExcel);
            }).toThrow();
        });
    });
});
