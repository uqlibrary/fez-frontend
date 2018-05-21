jest.mock('file-saver', ()=>({saveAs: jest.fn((data, filename) => [data, filename])}));

import * as transformers from './publicationDataTransformers';
import FileSaver from 'file-saver';

beforeEach(() => {
    FileSaver.saveAs.mockClear();
});

describe('Publication data transformers ', () => {
    describe('promptForDownload test', () => {
        it('should trigger a file download', () => {
            for (const format in transformers.formatToFilenameMap) {
                const expected = ['data', transformers.formatToFilenameMap[format]];

                transformers.promptForDownload(format, 'data');
                expect(FileSaver.saveAs).toHaveBeenCalledWith(...expected);
            }
        });

        it('should not trigger a file download for a unknown type', () => {
            expect(() => {
                transformers.promptForDownload('unknown', exportSearchToExcel);
            }).toThrow();
        });
    });
});
