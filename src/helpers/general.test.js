import {
    hydrateMockSearchList,
    leftJoin,
    stripHtml,
    sanitiseId,
    formatUrlTextWithWbrTags,
    handleKeyboardPressActivate,
    reorderObjectKeys,
    isEmptyObject,
    filterObjectKeys,
    combineObjects,
    isArrayDeeplyEqual,
    isFezRecordRelationKey,
    hasAtLeastOneFezRecordField,
    isFezRecordOneToOneRelation,
    isFezRecordOneToManyRelation,
    filterObject,
    numbersOnly,
    hasAtLeastOneItemSelected,
    tryCatch,
} from './general';
import { mockWebApiFile } from 'test-utils';

describe('general helpers', () => {
    describe('debugging helpers', () => {
        const args = [true, false, 1, 0, -1, [], {}];
        it('dd should given args using console.dir', () => {
            const mock = jest.spyOn(console, 'dir').mockImplementation(() => {});
            dd(...args);
            args.forEach(arg => expect(mock).toBeCalledWith(arg, { depth: null }));
            mock.mockRestore();
        });

        it('dj should given args using console.log', () => {
            const mock = jest.spyOn(console, 'log').mockImplementation(() => {});
            dj(...args);
            args.forEach(arg => expect(mock).toBeCalledWith(JSON.stringify(arg)));
            mock.mockRestore();
        });
    });

    describe('tryCatch', () => {
        it('it should call and return given closure return value', () => {
            const returnValue = 'abc';
            const mock = jest.fn().mockReturnValue('abc');
            expect(tryCatch(mock)).toEqual(returnValue);
        });
        it('it should call and return default value in case of failures', () => {
            const defaultValue = 'abc';
            const mock = jest.fn().mockImplementation(() => {
                throw new Error('test');
            });
            expect(tryCatch(mock, defaultValue)).toEqual(defaultValue);
        });
    });

    it('leftJoin', () => {
        const objArrA = [
            { nameA: 'test1', testA: 'testA1' },
            { nameA: 'test2', testA: 'testA2' },
            { nameA: 'test3', testA: 'testA3' },
        ];
        const objArrB = [
            { nameB: 'test1', testB: 'testB1' },
            { nameB: 'test2', testB: 'testB2' },
            { nameB: 'test3', testB: 'testB3' },
        ];
        const actual = leftJoin(objArrA, objArrB, 'nameA', 'nameB');
        const expected = [
            { nameA: 'test1', testA: 'testA1', nameB: 'test1', testB: 'testB1' },
            { nameA: 'test2', testA: 'testA2', nameB: 'test2', testB: 'testB2' },
            { nameA: 'test3', testA: 'testA3', nameB: 'test3', testB: 'testB3' },
        ];
        expect(actual).toEqual(expected);
        expect(leftJoin(objArrA)).toBe(objArrA);
    });

    it('stripHtml should return string when non string is given', () => {
        expect(stripHtml(null)).toEqual('');
    });

    it('should strip HTML from a string containing HTML', () => {
        expect(stripHtml('hello<br/> there')).toEqual('hello there');
    });

    it('should hydrate mock data properly', () => {
        const testdata = {
            total: 2,
            took: 1,
            per_page: 999,
            current_page: 1,
            from: 1,
            to: 2,
            data: [
                {
                    rek_pid: 'UQ:358319',
                    rek_title: 'Translation of "north"',
                    fez_record_search_key_alternate_genre: [
                        {
                            rek_alternate_genre: '453668',
                            rek_alternate_genre_lookup: 'Traditional language word',
                        },
                    ],
                    fez_record_search_key_assigned_user_id: [4379],
                    fez_record_search_key_contributor: ['Elwyn Flint', 'Alice Gilbert'],
                    fez_record_search_key_ismemberof: [
                        {
                            rek_ismemberof: 'UQ:357493',
                            parent: {
                                rek_pid: 'UQ:357493',
                                rek_security_policy: 5,
                                rek_datastream_policy: 1,
                            },
                            rek_ismemberof_lookup:
                                'Indigenous Languages recorded in the Queensland Speech Survey (secure)',
                        },
                    ],
                    fez_record_search_key_length: '12.08sec',
                    fez_record_search_key_license: {
                        rek_license: 453611,
                        rek_license_lookup:
                            'Creative Commons Attribution-NonCommercial 3.0 International (CC BY-NC 3.0) no derivatives',
                    },
                    fez_record_search_key_subject: [
                        {
                            rek_subject: 453670,
                            rek_subject_lookup: 'Yukulta / Ganggalidda language G34',
                        },
                        {
                            rek_subject: 999,
                            rek_subject_lookup: 'language name',
                        },
                    ],
                },
            ],
        };
        const data = hydrateMockSearchList(testdata).data[0];

        expect(data.rek_pid).toEqual('UQ:358319');
        expect(data.rek_title).toEqual('Translation of "north"');
        // the different structures of FRSK

        // array with extra fields
        expect(data.fez_record_search_key_alternate_genre).toEqual([
            {
                rek_alternate_genre_id: 547492,
                rek_alternate_genre_pid: 'UQ:358319',
                rek_alternate_genre_xsdmf_id: null,
                rek_alternate_genre: '453668',
                rek_alternate_genre_lookup: 'Traditional language word',
                rek_alternate_genre_order: 1,
            },
        ]);

        // simple array
        expect(data.fez_record_search_key_assigned_user_id).toEqual([
            {
                rek_assigned_user_id_id: 345324,
                rek_assigned_user_id_pid: 'UQ:358319',
                rek_assigned_user_id_xsdmf_id: null,
                rek_assigned_user_id: 4379,
                rek_assigned_user_id_order: 1,
            },
        ]);

        // simple array with multiple entries
        expect(data.fez_record_search_key_contributor).toEqual([
            {
                rek_contributor_id: 345324,
                rek_contributor_pid: 'UQ:358319',
                rek_contributor_xsdmf_id: null,
                rek_contributor: 'Elwyn Flint',
                rek_contributor_order: 1,
            },
            {
                rek_contributor_id: 345324,
                rek_contributor_pid: 'UQ:358319',
                rek_contributor_xsdmf_id: null,
                rek_contributor: 'Alice Gilbert',
                rek_contributor_order: 2,
            },
        ]);

        // complex array
        expect(data.fez_record_search_key_ismemberof).toEqual([
            {
                rek_ismemberof_id: 547492,
                rek_ismemberof_pid: 'UQ:358319',
                rek_ismemberof_xsdmf_id: null,
                rek_ismemberof: 'UQ:357493',
                parent: {
                    rek_pid: 'UQ:357493',
                    rek_security_policy: 5,
                    rek_datastream_policy: 1,
                },
                rek_ismemberof_lookup: 'Indigenous Languages recorded in the Queensland Speech Survey (secure)',
                rek_ismemberof_order: 1,
            },
        ]);

        // simple object (non array)
        expect(data.fez_record_search_key_length).toEqual({
            rek_length_id: 8967845,
            rek_length_pid: 'UQ:358319',
            rek_length_xsdmf_id: null,
            rek_length: '12.08sec',
        });

        // extended object
        expect(data.fez_record_search_key_license).toEqual({
            rek_license_id: 6753442,
            rek_license_pid: 'UQ:358319',
            rek_license_xsdmf_id: null,
            rek_license: 453611,
            rek_license_lookup:
                'Creative Commons Attribution-NonCommercial 3.0 International (CC BY-NC 3.0) no derivatives',
        });

        // array of extended object
        expect(data.fez_record_search_key_subject).toEqual([
            {
                rek_subject_id: 547492,
                rek_subject_pid: 'UQ:358319',
                rek_subject_xsdmf_id: null,
                rek_subject: 453670,
                rek_subject_lookup: 'Yukulta / Ganggalidda language G34',
                rek_subject_order: 1,
            },
            {
                rek_subject_id: 547492,
                rek_subject_pid: 'UQ:358319',
                rek_subject_xsdmf_id: null,
                rek_subject: 999,
                rek_subject_lookup: 'language name',
                rek_subject_order: 2,
            },
        ]);
    });

    it('should handle hydration of bad mock data properly', () => {
        const testdata = {
            total: 2,
            took: 1,
            per_page: 999,
            current_page: 1,
            from: 1,
            to: 2,
            data: [
                {
                    rek_title: 'I dont have a PID',
                },
            ],
        };
        expect(() => hydrateMockSearchList(testdata)).toThrow('missing PID in data {"rek_title":"I dont have a PID"}');
    });

    it('should sanitise the given id/testid', () => {
        expect(sanitiseId('subject, testing & code')).toEqual('subject-testing-code');
        expect(sanitiseId('subject--code')).toEqual('subject-code');
        expect(sanitiseId('subject-code abc')).toEqual('subject-code-abc');
        expect(sanitiseId('search-subject-1111 Abc-0')).toEqual('search-subject-1111-abc-0');
        expect(sanitiseId('help-icon-fez_journal_doaj')).toEqual('help-icon-fez-journal-doaj');
        expect(sanitiseId('UQ:1', 'cats.png')).toEqual('uq1-catspng');
    });

    it('should insert WBR tags in to a URL', () => {
        const expectedStr =
            '["http:",{"type":"wbr","key":"1","ref":null,"props":{"children":null},"_owner":null,"_store":{}},"//",{"type":"wbr","key":"3","ref":null,"props":{"children":null},"_owner":null,"_store":{}},"www",{"type":"wbr","key":"5","ref":null,"props":{"children":null},"_owner":null,"_store":{}},".test",{"type":"wbr","key":"7","ref":null,"props":{"children":null},"_owner":null,"_store":{}},".com",{"type":"wbr","key":"9","ref":null,"props":{"children":null},"_owner":null,"_store":{}},"/"]';
        const actualStr = JSON.stringify(formatUrlTextWithWbrTags('http://www.test.com/'));
        expect(expectedStr).toEqual(actualStr);
    });

    describe('handleKeyboardPressActivate', () => {
        it('should fire callback function if Space key pressed', () => {
            const testFn = jest.fn();
            const mockKey = { code: 'SPACE', preventDefault: jest.fn() };
            handleKeyboardPressActivate(mockKey, testFn);
            expect(testFn).toHaveBeenCalled();
        });
        it('should fire callback function if Enter key pressed', () => {
            const testFn = jest.fn();
            const mockKey = { code: 'ENTER', preventDefault: jest.fn() };
            handleKeyboardPressActivate(mockKey, testFn);
            expect(testFn).toHaveBeenCalled();
        });
        it('should fire callback function if NumPad Enter key pressed', () => {
            const testFn = jest.fn();
            const mockKey = { code: 'NUMPADENTER', preventDefault: jest.fn() };
            handleKeyboardPressActivate(mockKey, testFn);
            expect(testFn).toHaveBeenCalled();
        });
        it('should not fire callback function if a key other than Space, Enter or NumPad Enter is pressed', () => {
            const testFn = jest.fn();
            const mockKey = { code: 'A', preventDefault: jest.fn() };
            handleKeyboardPressActivate(mockKey, testFn);
            expect(testFn).not.toHaveBeenCalled();
        });
    });

    describe('reorderObjectKeys', () => {
        it('should return new object with keys in given order', () => {
            expect(reorderObjectKeys({ a: 1, b: 2, c: 3 }, ['a', 'b', 'c'])).toEqual({ a: 1, b: 2, c: 3 });
            expect(reorderObjectKeys({ a: 1, b: 2, c: 3 }, ['b', 'c', 'a'])).toEqual({ b: 2, c: 3, a: 1 });
            expect(reorderObjectKeys({ a: 1, b: 2, c: 3 }, ['c', 'a', 'b'])).toEqual({ c: 3, a: 1, b: 2 });
        });

        it('should return new object with keys in given order, ignoring unexisting keys', () => {
            expect(reorderObjectKeys({ a: 1, b: 2, c: 3 }, ['a', 'e', 'c'])).toEqual({ a: 1, c: 3 });
            expect(reorderObjectKeys({ a: 1, b: 2, c: 3 }, ['e', 'b'])).toEqual({ b: 2 });
            expect(reorderObjectKeys({ a: 1, b: 2, c: 3 }, ['e'])).toEqual({});
        });
    });

    describe('isEmptyObject', () => {
        it('should return true for empty object', () => {
            expect(isEmptyObject({})).toEqual(true);
        });

        it('should return false for non-empty objects', () => {
            expect(isEmptyObject({ a: 0 })).toEqual(false);
            expect(isEmptyObject({ a: '' })).toEqual(false);
            expect(isEmptyObject({ a: false })).toEqual(false);
            expect(isEmptyObject({ a: true })).toEqual(false);
            expect(isEmptyObject({ a: null })).toEqual(false);
            expect(isEmptyObject({ a: undefined })).toEqual(false);
        });

        it('should return false for non-objects', () => {
            expect(isEmptyObject(0)).toEqual(false);
            expect(isEmptyObject('')).toEqual(false);
            expect(isEmptyObject(false)).toEqual(false);
            expect(isEmptyObject(true)).toEqual(false);
            expect(isEmptyObject(null)).toEqual(false);
            expect(isEmptyObject(undefined)).toEqual(false);
            expect(isEmptyObject([])).toEqual(false);
        });
    });

    describe('filterObjectKeys', () => {
        it('should return empty object for given non-object', () => {
            expect(filterObjectKeys(null, ['a'])).toEqual({});
            expect(filterObjectKeys(undefined, ['a'])).toEqual({});
            expect(filterObjectKeys(1, ['a'])).toEqual({});
            expect(filterObjectKeys(false, ['a'])).toEqual({});
            expect(filterObjectKeys('abcdef', ['a'])).toEqual({});
            expect(filterObjectKeys([], ['a'])).toEqual({});
            expect(filterObjectKeys(new Error('error'), ['a'])).toEqual({});
        });

        it('should return object with selected keys', () => {
            expect(filterObjectKeys({ a: 1, b: 2, c: 3 }, ['a'])).toEqual({ b: 2, c: 3 });
            expect(filterObjectKeys({ a: 1, b: 2, c: 3 }, ['b'])).toEqual({ a: 1, c: 3 });
            expect(filterObjectKeys({ a: 1, b: 2, c: 3 }, ['c'])).toEqual({ a: 1, b: 2 });
            expect(filterObjectKeys({ a: 1, b: 2, c: 3 }, ['a', 'b'])).toEqual({ c: 3 });
            expect(filterObjectKeys({ a: 1, b: 2, c: 3 }, ['b', 'c'])).toEqual({ a: 1 });
            expect(filterObjectKeys({ a: 1, b: 2, c: 3 }, ['a', 'c'])).toEqual({ b: 2 });
        });

        it('should ignore non-existing keys', () => {
            expect(filterObjectKeys({ a: 1, b: 2, c: 3 }, [])).toEqual({ a: 1, b: 2, c: 3 });
            expect(filterObjectKeys({ a: 1, b: 2, c: 3 }, ['d'])).toEqual({ a: 1, b: 2, c: 3 });
            expect(filterObjectKeys({ a: 1, b: 2, c: 3 }, ['a', 'd'])).toEqual({ b: 2, c: 3 });
        });

        it('should keep object with selected keys when inclusive=true', () => {
            expect(filterObjectKeys({ a: 1, b: 2, c: 3 }, ['a'], true)).toEqual({ a: 1 });
            expect(filterObjectKeys({ a: 1, b: 2, c: 3 }, ['b'], true)).toEqual({ b: 2 });
            expect(filterObjectKeys({ a: 1, b: 2, c: 3 }, ['c'], true)).toEqual({ c: 3 });
            expect(filterObjectKeys({ a: 1, b: 2, c: 3 }, ['a', 'b'], true)).toEqual({ a: 1, b: 2 });
            expect(filterObjectKeys({ a: 1, b: 2, c: 3 }, ['b', 'c'], true)).toEqual({ b: 2, c: 3 });
            expect(filterObjectKeys({ a: 1, b: 2, c: 3 }, ['a', 'c'], true)).toEqual({ a: 1, c: 3 });
        });
    });

    describe('combineObjects', () => {
        it('should return empty object for empty object list', () => {
            expect(combineObjects({})).toEqual({});
            expect(combineObjects({}, {})).toEqual({});
        });

        it('should return a single object from given objects', () => {
            expect(combineObjects({ a: 1 }, { b: 2 }, { c: 3 })).toEqual({ a: 1, b: 2, c: 3 });
        });

        it('should ignore non-object and undefined object keys', () => {
            expect(
                combineObjects(
                    { a: 1 },
                    { b: null },
                    null,
                    undefined,
                    1,
                    'a',
                    'abc',
                    true,
                    false,
                    { c: 3 },
                    { d: undefined },
                ),
            ).toEqual({
                a: 1,
                b: null,
                c: 3,
            });
        });
    });

    describe('isArrayDeeplyEqual', () => {
        it('should return true for equal arrays', () => {
            expect(isArrayDeeplyEqual([], [])).toBeTruthy();
            expect(isArrayDeeplyEqual([1], [1])).toBeTruthy();
            expect(isArrayDeeplyEqual([1, 2], [1, 2])).toBeTruthy();
            expect(isArrayDeeplyEqual([0.1], [0.1])).toBeTruthy();
            expect(isArrayDeeplyEqual([undefined], [undefined])).toBeTruthy();
            expect(isArrayDeeplyEqual([null], [null])).toBeTruthy();
            expect(isArrayDeeplyEqual([false], [false])).toBeTruthy();
            expect(isArrayDeeplyEqual([''], [''])).toBeTruthy();
            expect(isArrayDeeplyEqual(['str'], ['str'])).toBeTruthy();
            expect(isArrayDeeplyEqual([{}], [{}])).toBeTruthy();
            expect(isArrayDeeplyEqual([{ a: 1 }], [{ a: 1 }])).toBeTruthy();
            expect(isArrayDeeplyEqual([{ a: 1, b: 2 }], [{ a: 1, b: 2 }])).toBeTruthy();
        });

        it('should return false for non-equal arrays', () => {
            expect(isArrayDeeplyEqual([1], [])).toBeFalsy();
            expect(isArrayDeeplyEqual([1], [1, 2])).toBeFalsy();
            expect(isArrayDeeplyEqual([1, 2], [2, 1])).toBeFalsy();
            expect(isArrayDeeplyEqual([0.1], [0.2])).toBeFalsy();
            expect(isArrayDeeplyEqual([undefined], [null])).toBeFalsy();
            expect(isArrayDeeplyEqual([true], [false])).toBeFalsy();
            expect(isArrayDeeplyEqual([''], ['a'])).toBeFalsy();
            expect(isArrayDeeplyEqual(['string'], ['str'])).toBeFalsy();
            expect(isArrayDeeplyEqual([{ a: 1 }], [{}])).toBeFalsy();
            expect(isArrayDeeplyEqual([{ a: 1, b: 2 }], [{ b: 2, a: 1 }])).toBeFalsy();
        });
    });

    describe('isFezRecordRelationKey', () => {
        it('should return true for alike fez record relation keys', () => {
            expect(isFezRecordRelationKey('fez_record_search_key_doi')).toBeTruthy();
        });

        it('should return false for non alike fez record relation keys', () => {
            expect(isFezRecordRelationKey(undefined)).toBeFalsy();
            expect(isFezRecordRelationKey('abc')).toBeFalsy();
            expect(isFezRecordRelationKey('test_fez_record_search_key_doi')).toBeFalsy();
            expect(isFezRecordRelationKey(' fez_record_search_key_doi')).toBeFalsy();
            expect(isFezRecordRelationKey('fez_record_search_key_doi ')).toBeFalsy();
            expect(isFezRecordRelationKey(' fez_record_search_key_doi ')).toBeFalsy();
        });
    });

    describe('hasAtLeastOneFezRecordField', () => {
        it('should return true for objects with at least one alike fez record field', () => {
            expect(hasAtLeastOneFezRecordField({ rek_doi: '10.000/abc.def' })).toBeTruthy();
            expect(hasAtLeastOneFezRecordField({ a: 1, rek_doi: '10.000/abc.def' })).toBeTruthy();
        });

        it('should return false for objects with none alike fez record field', () => {
            expect(hasAtLeastOneFezRecordField(undefined)).toBeFalsy();
            expect(hasAtLeastOneFezRecordField('abc')).toBeFalsy();
            expect(hasAtLeastOneFezRecordField({ a: '10.000/abc.def' })).toBeFalsy();
            expect(hasAtLeastOneFezRecordField({ 'rek_doi ': '10.000/abc.def' })).toBeFalsy();
        });
    });

    describe('isFezRecordOneToOneRelation', () => {
        it('should return true when given object has a fez record alike one-to-one relation', () => {
            expect(
                isFezRecordOneToOneRelation(
                    { fez_record_search_key_doi: { rek_doi: '10.000/abc.def' } },
                    'fez_record_search_key_doi',
                ),
            ).toBeTruthy();
        });

        it('should return false for objects with none alike fez record field', () => {
            expect(isFezRecordOneToOneRelation(undefined, undefined)).toBeFalsy();
            expect(isFezRecordOneToOneRelation('abc', 'abc')).toBeFalsy();
            expect(
                isFezRecordOneToOneRelation(
                    { fez_record_search_key_author: [{ rek_author: 'author 1' }] },
                    'fez_record_search_key_author',
                ),
            ).toBeFalsy();
        });
    });

    describe('isFezRecordOneToManyRelation', () => {
        it('should return true when given object has a fez record alike one-to-one relation', () => {
            expect(
                isFezRecordOneToManyRelation(
                    { fez_record_search_key_author: [{ rek_author: 'author 1' }] },
                    'fez_record_search_key_author',
                ),
            ).toBeTruthy();
        });

        it('should return false for objects with none alike fez record field', () => {
            expect(isFezRecordOneToManyRelation(undefined, undefined)).toBeFalsy();
            expect(isFezRecordOneToManyRelation('abc', 'abc')).toBeFalsy();
            expect(
                isFezRecordOneToManyRelation(
                    { fez_record_search_key_doi: { rek_doi: '10.000/abc.def' } },
                    'fez_record_search_key_doi',
                ),
            ).toBeFalsy();
        });
    });

    describe('filterObject', () => {
        it('should return given object if any args are invalid', () => {
            expect(filterObject(undefined, value => value === 1)).toEqual(undefined);
            expect(filterObject([1, 2], value => value === 1)).toEqual([1, 2]);
            expect(filterObject({ a: 1 }, true)).toEqual({ a: 1 });
        });

        it('should filter values according to given filter function', () => {
            mockWebApiFile();
            const mockFile = new File(['test'], 'test.jpg');

            expect(
                filterObject(
                    {
                        a: 1,
                        b: 2,
                        c: { a: 1, b: 2, c: 3 },
                        d: [
                            { a: 1, b: 2 },
                            { a: 1, b: 2, c: [{ a: 1 }] },
                        ],
                        e: { b: 2 },
                        f: [{ b: 2 }, { c: 2 }, { d: { b: 2 } }],
                        g: mockFile,
                        h: { a: mockFile },
                        i: [mockFile],
                        j: [{ b: mockFile }],
                    },
                    value => value === 1,
                ),
            ).toEqual({
                a: 1,
                c: { a: 1 },
                d: [{ a: 1 }, { a: 1, c: [{ a: 1 }] }],
                g: mockFile,
                h: { a: mockFile },
                i: [mockFile],
                j: [{ b: mockFile }],
            });
        });
    });

    describe('numbersOnly', () => {
        it('should return original value for non-replaceable', () => {
            expect(numbersOnly()).toEqual(undefined);
            expect(numbersOnly(null)).toEqual(null);
            expect(numbersOnly(false)).toEqual(false);
            expect(numbersOnly(true)).toEqual(true);
            expect(numbersOnly([])).toEqual([]);
            expect(numbersOnly({})).toEqual({});
            expect(numbersOnly('')).toEqual('');
            expect(numbersOnly('a')).toEqual('a');
            expect(numbersOnly(1)).toEqual(1);
            expect(numbersOnly(1.1)).toEqual(1.1);
        });

        it('should return numbers only', () => {
            expect(numbersOnly('10a20b30')).toEqual('102030');
        });
    });

    describe('hasAtLeastOneItemSelected', () => {
        it('should return false', () => {
            expect(hasAtLeastOneItemSelected()).toBeFalsy();
            expect(hasAtLeastOneItemSelected(null)).toBeFalsy();
            expect(hasAtLeastOneItemSelected(false)).toBeFalsy();
            expect(hasAtLeastOneItemSelected(true)).toBeFalsy();
            expect(hasAtLeastOneItemSelected([])).toBeFalsy();
            expect(hasAtLeastOneItemSelected([1])).toBeFalsy();
            expect(hasAtLeastOneItemSelected([{ a: 1 }, { b: 2 }])).toBeFalsy();
            expect(hasAtLeastOneItemSelected({})).toBeFalsy();
            expect(hasAtLeastOneItemSelected('')).toBeFalsy();
            expect(hasAtLeastOneItemSelected('a')).toBeFalsy();
            expect(hasAtLeastOneItemSelected(1)).toBeFalsy();
            expect(hasAtLeastOneItemSelected(1.1)).toBeFalsy();
        });

        it('should return true', () => {
            expect(hasAtLeastOneItemSelected([{ a: 1 }, { b: 2, selected: true }])).toBeTruthy();
            expect(hasAtLeastOneItemSelected([{ a: 1 }, { b: 2, custom: true }], 'custom')).toBeTruthy();
        });
    });
});
