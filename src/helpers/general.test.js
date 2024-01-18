import {
    hydrateMockSearchList,
    leftJoin,
    stripHtml,
    sanitiseId,
    formatUrlTextWithWbrTags,
    handleKeyboardPressActivate,
} from './general';

describe('general helpers', () => {
    describe('debugging helpers', () => {
        const args = [true, false, 1, 0, -1, [], {}];
        it('dd should given args using console.dir', () => {
            const mock = jest.spyOn(console, 'dir').mockImplementation(() => {});
            dd(...args);
            args.forEach(arg => expect(mock).toBeCalledWith(arg, { depth: null }));
            mock.mockRestore();
        });

        it('dc should given args using console.log', () => {
            const mock = jest.spyOn(console, 'log').mockImplementation(() => {});
            dc(...args);
            args.forEach(arg => expect(mock).toBeCalledWith(arg));
            mock.mockRestore();
        });

        it('dj should given args using console.log', () => {
            const mock = jest.spyOn(console, 'log').mockImplementation(() => {});
            dj(...args);
            args.forEach(arg => expect(mock).toBeCalledWith(JSON.stringify(arg)));
            mock.mockRestore();
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
});
