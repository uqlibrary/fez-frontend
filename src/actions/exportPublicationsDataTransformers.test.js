jest.mock('file-saver', () => ({ saveAs: jest.fn((data, filename) => [data, filename]) }));

import FileSaver from 'file-saver';
import { exportSearchToExcel as exportSearchToExcelResponse } from 'mock/data/testing/searchRecords';
import * as transformers from './exportPublicationsDataTransformers';
import { EXPORT_FORMAT_TO_EXTENSION } from 'config/general';

beforeEach(() => {
    FileSaver.saveAs.mockClear();
});

describe('Publication data transformers ', () => {
    describe('promptForDownload test', () => {
        it('should trigger a file download', () => {
            Object.keys(EXPORT_FORMAT_TO_EXTENSION).map(format => {
                const expected = ['data', transformers.getFileName(EXPORT_FORMAT_TO_EXTENSION[format])];

                transformers.promptForDownload(format, 'data');
                expect(FileSaver.saveAs).toHaveBeenCalledWith(...expected);
            });
        });

        it('should not trigger a file download for a unknown type', () => {
            const expected = 'unknown';
            expect(() => {
                transformers.promptForDownload('unknown', exportSearchToExcelResponse);
            }).toThrow(new Error(transformers.getExceptionMessage(expected)));
        });
    });
});
