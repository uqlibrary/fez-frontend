jest.mock('file-saver', ()=>({saveAs: jest.fn((data, filename) => [data, filename])}));

import FileSaver from 'file-saver';
import {exportSearchToExcel as exportSearchToExcelResponse} from '../mock/data/testing/searchRecords';
import * as transformers from './exportPublicationsDataTransformers';
import {exportFormatToExtension} from '../config/general';

beforeEach(() => {
    FileSaver.saveAs.mockClear();
});

describe('Publication data transformers ', () => {
    describe('promptForDownload test', () => {
        it('should trigger a file download', () => {
            for (const format in exportFormatToExtension) {
                const expected = ['data', transformers.getFileName(exportFormatToExtension[format])];

                transformers.promptForDownload(format, 'data');
                expect(FileSaver.saveAs).toHaveBeenCalledWith(...expected);
            }
        });

        it('should not trigger a file download for a unknown type', () => {
            const expected = 'unknown';
            expect(() => {
                transformers.promptForDownload('unknown', exportSearchToExcelResponse);
            }).toThrow(new Error(transformers.getExceptionMessage(expected)));
        });
    });
});
