import {
    stringToColour,
    abbreviateNumber,
    arrayMove,
    reorderArray,
    filterObjectProps,
    exportReportToExcel,
    isEmptyStr,
} from './utils';

describe('utils', () => {
    describe('stringToColour', () => {
        it('should return expected hex colour strings', () => {
            const input = ['one', 'two', 'three four', 'five is a long title'];
            const expected = ['#66ae01', '#4cc201', '#682a7c', '#9b36fd'];
            input.forEach((value, index) => expect(stringToColour(value)).toEqual(expected[index]));
        });
    });

    describe('abbreviateNumber', () => {
        it('should return expected abbreviated string for input number', () => {
            expect(abbreviateNumber(1, 1)).toBe('1');
            expect(abbreviateNumber(12, 1)).toBe('12');
            expect(abbreviateNumber(999, 1)).toBe('999');
            expect(abbreviateNumber(1000, 1)).toBe('1k'); // only numbers > 1000 are abbreviated
            expect(abbreviateNumber(1234, 1)).toBe('1.2k'); // only numbers > 1000 are abbreviated
            expect(abbreviateNumber(1234567, 2)).toBe('1.23m');
            expect(abbreviateNumber(987654321, 3)).toBe('987.654m');
            expect(abbreviateNumber(1000, 0)).toBe('1k');
            expect(abbreviateNumber(1000000, 0)).toBe('1m');
            expect(abbreviateNumber(1000000000, 0)).toBe('1b');
            expect(abbreviateNumber(1000000000000, 0)).toBe('1t');
        });
    });

    describe('arrayMove', () => {
        it('should move an element within the array', () => {
            expect(arrayMove([1, 2, 3, 4, 5], 1, 3)).toEqual([1, 3, 4, 2, 5]);
            expect(arrayMove([10, 20, 30], 0, 2)).toEqual([20, 30, 10]);
            expect(arrayMove(['a', 'b', 'c'], 2, 1)).toEqual(['a', 'c', 'b']);
            expect(arrayMove(['x', 'y', 'z'], 1, 1)).toEqual(['x', 'y', 'z']);
        });

        it('should handle edge cases', () => {
            expect(arrayMove([], 0, 1)).toEqual([]);
            expect(arrayMove(['single'], 0, 0)).toEqual(['single']);
            expect(arrayMove([100, 200, 300], -1, -2)).toEqual([100, 200, 300]);
            expect(arrayMove(['A', 'B', 'C'], 1, 10)).toEqual(['A', 'C', 'B']);
        });
    });

    describe('reorderArray', () => {
        it('should reorder elements within the array', () => {
            // Test case 1: Move an element from index 1 to index 3
            expect(reorderArray([{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }], 1, 3)).toEqual([
                { id: 1, order: 0 },
                { id: 3, order: 1 },
                { id: 4, order: 2 },
                { id: 2, order: 3 },
                { id: 5, order: 4 },
            ]);

            // Test case 2: Move an element from index 0 to the end
            expect(
                reorderArray(
                    [
                        { id: 1, order: 1 },
                        { id: 2, order: 0 },
                        { id: 3, order: 2 },
                    ],
                    0,
                    2,
                ),
            ).toEqual([
                { id: 2, order: 0 },
                { id: 3, order: 1 },
                { id: 1, order: 2 },
            ]);

            // Test case 3: Move an element from the end to index 1
            expect(
                reorderArray(
                    [
                        { id: 1, order: 1 },
                        { id: 2, order: 0 },
                        { id: 3, order: 2 },
                    ],
                    2,
                    1,
                ),
            ).toEqual([
                { id: 1, order: 0 },
                { id: 3, order: 1 },
                { id: 2, order: 2 },
            ]);

            // Test case 4: Move an element within the array (same indices)
            expect(
                reorderArray(
                    [
                        { id: 1, order: 1 },
                        { id: 2, order: 0 },
                        { id: 3, order: 2 },
                    ],
                    1,
                    1,
                ),
            ).toEqual([
                { id: 1, order: 0 },
                { id: 2, order: 1 },
                { id: 3, order: 2 },
            ]);
        });
    });

    describe('filterObjectProps', () => {
        it('should filter object properties correctly', () => {
            const inputObj = { a: 1, b: 2, c: 3 };
            const propsToKeep1 = ['a', 'c'];
            expect(filterObjectProps(inputObj, propsToKeep1)).toEqual({ a: 1, c: 3 });

            const propsToKeep2 = [];
            expect(filterObjectProps(inputObj, propsToKeep2)).toEqual({});

            const propsToKeep3 = ['b'];
            expect(filterObjectProps(inputObj, propsToKeep3)).toEqual({ b: 2 });
        });

        it('should handle edge cases', () => {
            const emptyObj = {};
            const propsToKeep4 = ['x', 'y'];
            expect(filterObjectProps(emptyObj, propsToKeep4)).toEqual({});

            const singlePropObj = { foo: 'bar' };
            const propsToKeep5 = ['foo'];
            expect(filterObjectProps(singlePropObj, propsToKeep5)).toEqual({ foo: 'bar' });

            const nestedObj = { a: 1, b: { x: 10, y: 20 }, c: 3 };
            const propsToKeep6 = ['b', 'c'];
            expect(filterObjectProps(nestedObj, propsToKeep6)).toEqual({ b: { x: 10, y: 20 }, c: 3 });
        });
    });

    describe('exportReportToExcel', () => {
        const TEST_MODE = true; // neccessary to prevent file being written
        it('should return error result', () => {
            expect(() => exportReportToExcel()).toThrow("Cannot read properties of undefined (reading 'length')");
        });
        it('should return true result for partial params', async () => {
            expect(exportReportToExcel('test.xslx', 'test', null, [{ id: 1 }], TEST_MODE)).toBe(true);
        });
        it('should return true result for all params', () => {
            expect(exportReportToExcel('test.xslx', 'test', ['id'], [{ id: 1 }], TEST_MODE)).toBe(true);
        });
    });

    describe('isEmptyStr', () => {
        it('returns expected results', () => {
            expect(isEmptyStr('test')).toEqual(false);
            expect(isEmptyStr('')).toEqual(true);
            expect(isEmptyStr(null)).toEqual(true);
            expect(isEmptyStr(undefined)).toEqual(true);
            expect(isEmptyStr([])).toEqual(true);
            expect(isEmptyStr({})).toEqual(true);
            expect(isEmptyStr(['a'])).toEqual(true);
            expect(isEmptyStr({ a: 'a' })).toEqual(true);
        });
    });
});
