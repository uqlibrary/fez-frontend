import * as Utils from './utils';
import * as General from 'config/general';

jest.mock('./utils', () => ({
    ...jest.requireActual('./utils'),
    exportReportToExcel: jest.fn(() => Promise.resolve(true)),
}));

describe('utils', () => {
    describe('stringToColour', () => {
        it('should return expected hex colour strings', () => {
            const input = ['one', 'two', 'three four', 'five is a long title'];
            const expected = ['#66ae01', '#4cc201', '#682a7c', '#9b36fd'];
            input.forEach((value, index) => expect(Utils.stringToColour(value)).toEqual(expected[index]));
        });
    });

    describe('abbreviateNumber', () => {
        it('should return expected abbreviated string for input number', () => {
            expect(Utils.abbreviateNumber(1, 1)).toBe('1');
            expect(Utils.abbreviateNumber(12, 1)).toBe('12');
            expect(Utils.abbreviateNumber(999, 1)).toBe('999');
            expect(Utils.abbreviateNumber(1000, 1)).toBe('1k'); // only numbers > 1000 are abbreviated
            expect(Utils.abbreviateNumber(1234, 1)).toBe('1.2k'); // only numbers > 1000 are abbreviated
            expect(Utils.abbreviateNumber(1234567, 2)).toBe('1.23m');
            expect(Utils.abbreviateNumber(987654321, 3)).toBe('987.654m');
            expect(Utils.abbreviateNumber(1000, 0)).toBe('1k');
            expect(Utils.abbreviateNumber(1000000, 0)).toBe('1m');
            expect(Utils.abbreviateNumber(1000000000, 0)).toBe('1b');
            expect(Utils.abbreviateNumber(1000000000000, 0)).toBe('1t');
        });
    });

    describe('arrayMove', () => {
        it('should move an element within the array', () => {
            expect(Utils.arrayMove([1, 2, 3, 4, 5], 1, 3)).toEqual([1, 3, 4, 2, 5]);
            expect(Utils.arrayMove([10, 20, 30], 0, 2)).toEqual([20, 30, 10]);
            expect(Utils.arrayMove(['a', 'b', 'c'], 2, 1)).toEqual(['a', 'c', 'b']);
            expect(Utils.arrayMove(['x', 'y', 'z'], 1, 1)).toEqual(['x', 'y', 'z']);
        });

        it('should handle edge cases', () => {
            expect(Utils.arrayMove([], 0, 1)).toEqual([]);
            expect(Utils.arrayMove(['single'], 0, 0)).toEqual(['single']);
            expect(Utils.arrayMove([100, 200, 300], -1, -2)).toEqual([100, 200, 300]);
            expect(Utils.arrayMove(['A', 'B', 'C'], 1, 10)).toEqual(['A', 'C', 'B']);
        });
    });

    describe('reorderArray', () => {
        it('should reorder elements within the array', () => {
            // Test case 1: Move an element from index 1 to index 3
            expect(Utils.reorderArray([{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }], 1, 3)).toEqual([
                { id: 1, qlk_order: 0 },
                { id: 3, qlk_order: 1 },
                { id: 4, qlk_order: 2 },
                { id: 2, qlk_order: 3 },
                { id: 5, qlk_order: 4 },
            ]);

            // Test case 2: Move an element from index 0 to the end
            expect(
                Utils.reorderArray(
                    [
                        { id: 1, qlk_order: 1 },
                        { id: 2, qlk_order: 0 },
                        { id: 3, qlk_order: 2 },
                    ],
                    0,
                    2,
                ),
            ).toEqual([
                { id: 2, qlk_order: 0 },
                { id: 3, qlk_order: 1 },
                { id: 1, qlk_order: 2 },
            ]);

            // Test case 3: Move an element from the end to index 1
            expect(
                Utils.reorderArray(
                    [
                        { id: 1, qlk_order: 1 },
                        { id: 2, qlk_order: 0 },
                        { id: 3, qlk_order: 2 },
                    ],
                    2,
                    1,
                ),
            ).toEqual([
                { id: 1, qlk_order: 0 },
                { id: 3, qlk_order: 1 },
                { id: 2, qlk_order: 2 },
            ]);

            // Test case 4: Move an element within the array (same indices)
            expect(
                Utils.reorderArray(
                    [
                        { id: 1, qlk_order: 1 },
                        { id: 2, qlk_order: 0 },
                        { id: 3, qlk_order: 2 },
                    ],
                    1,
                    1,
                ),
            ).toEqual([
                { id: 1, qlk_order: 0 },
                { id: 2, qlk_order: 1 },
                { id: 3, qlk_order: 2 },
            ]);
        });
    });

    describe('filterObjectProps', () => {
        it('should filter object properties correctly', () => {
            const inputObj = { a: 1, b: 2, c: 3 };
            const propsToKeep1 = ['a', 'c'];
            expect(Utils.filterObjectProps(inputObj, propsToKeep1)).toEqual({ a: 1, c: 3 });

            const propsToKeep2 = [];
            expect(Utils.filterObjectProps(inputObj, propsToKeep2)).toEqual({});

            const propsToKeep3 = ['b'];
            expect(Utils.filterObjectProps(inputObj, propsToKeep3)).toEqual({ b: 2 });
        });

        it('should handle edge cases', () => {
            const emptyObj = {};
            const propsToKeep4 = ['x', 'y'];
            expect(Utils.filterObjectProps(emptyObj, propsToKeep4)).toEqual({});

            const singlePropObj = { foo: 'bar' };
            const propsToKeep5 = ['foo'];
            expect(Utils.filterObjectProps(singlePropObj, propsToKeep5)).toEqual({ foo: 'bar' });

            const nestedObj = { a: 1, b: { x: 10, y: 20 }, c: 3 };
            const propsToKeep6 = ['b', 'c'];
            expect(Utils.filterObjectProps(nestedObj, propsToKeep6)).toEqual({ b: { x: 10, y: 20 }, c: 3 });
        });
    });

    describe('filterObjectPropsByKey', () => {
        it('should return expected results', () => {
            const key = 'id';
            const actual = { allowed1: 1, disallowed1: 2, allowed2: 3, disallowed2: 4 };
            const propsToKeep = [
                {
                    id: 'allowed1',
                },
                {
                    id: 'allowed2',
                },
            ];
            const expected = { allowed1: 1, allowed2: 3 };
            expect(Utils.filterObjectPropsByKey(key, actual, propsToKeep)).toEqual(expected);
        });
    });

    describe('exportReportToExcel', () => {
        it('should resolve with true for partial params', async () => {
            const exportReportToExcelFn = jest.spyOn(Utils, 'exportReportToExcel').mockResolvedValue(true);

            const result = await Utils.exportReportToExcel({
                filename: 'test.xlsx',
                sheetLabel: 'test',
                data: [{ id: 1 }],
            });

            expect(result).toBe(true);
            expect(exportReportToExcelFn).toHaveBeenCalled();

            exportReportToExcelFn.mockRestore();
        });

        it('should resolve with true for all params', async () => {
            const exportReportToExcelFn = jest.spyOn(Utils, 'exportReportToExcel').mockResolvedValue(true);

            const result = await Utils.exportReportToExcel({
                filename: 'test.xlsx',
                sheetLabel: 'test',
                colHeaders: ['id'],
                data: [{ id: 1 }],
            });

            expect(result).toBe(true);
            expect(exportReportToExcelFn).toHaveBeenCalled();

            exportReportToExcelFn.mockRestore();
        });
    });

    describe('isEmptyStr', () => {
        it('returns expected results', () => {
            expect(Utils.isEmptyStr('test')).toEqual(false);
            expect(Utils.isEmptyStr('')).toEqual(true);
            expect(Utils.isEmptyStr(null)).toEqual(true);
            expect(Utils.isEmptyStr(undefined)).toEqual(true);
            expect(Utils.isEmptyStr([])).toEqual(true);
            expect(Utils.isEmptyStr({})).toEqual(true);
            expect(Utils.isEmptyStr(['a'])).toEqual(true);
            expect(Utils.isEmptyStr({ a: 'a' })).toEqual(true);
        });
    });

    describe('getPlatformUrl', () => {
        it('returns expected results', () => {
            const oldVal = General.IS_PRODUCTION;
            General.IS_PRODUCTION = true;
            expect(Utils.getPlatformUrl()).toEqual(Utils.trimTrailingSlash(General.PRODUCTION_URL));
            General.IS_PRODUCTION = false;
            expect(Utils.getPlatformUrl()).toEqual(Utils.trimTrailingSlash(General.STAGING_URL));
            General.IS_PRODUCTION = oldVal;
        });
    });

    describe('trimTrailingSlash', () => {
        it('returns expected results', () => {
            expect(Utils.trimTrailingSlash('https://library.espace.uq.edu.au/')).toEqual(
                'https://library.espace.uq.edu.au',
            );
            // will remove all trailing chars in case of >1
            expect(Utils.trimTrailingSlash('https://library.espace.uq.edu.au///')).toEqual(
                'https://library.espace.uq.edu.au',
            );
            // wont remove a char when not present
            expect(Utils.trimTrailingSlash('https://library.espace.uq.edu.au')).toEqual(
                'https://library.espace.uq.edu.au',
            );
            // not just for urls
            expect(Utils.trimTrailingSlash('/ Test / text /')).toEqual('/ Test / text ');
        });
    });
});
