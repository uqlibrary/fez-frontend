import * as plugins from './formReducerPlugins';
import { actionTypes } from 'redux-form';
import { Map, List } from 'immutable';
import { ADMIN_DELETE_ATTACHED_FILE, ADMIN_RENAME_ATTACHED_FILE } from 'actions/actionTypes';

describe('Form reducer plugin', () => {
    describe('resetValue: ', () => {
        it('returns null if state is falsy', () => {
            const falsies = [false, null, undefined, ''];
            falsies.forEach(falsy => {
                const nextState = plugins.resetValue(falsy, {
                    type: actionTypes.UNREGISTER_FIELD,
                    payload: {
                        name: 'test',
                    },
                });
                expect(nextState).toBeNull;
            });
        });

        it('returns state if name is undefined', () => {
            const falsies = [false, null, undefined, ''];
            falsies.forEach(falsy => {
                const nextState = plugins.resetValue(falsy, {
                    type: actionTypes.UNREGISTER_FIELD,
                    payload: {
                        name: undefined,
                    },
                });
                expect(nextState).toBeNull;
            });
        });

        const initialState = Map({
            values: Map({
                rek_title: 'ABC',
                fez_record_search_key_a: Map({
                    a: 'some value',
                }),
            }),
            registeredFields: Map({
                rek_title: Map({
                    name: 'rek_title',
                }),
                'fez_record_search_key_a.a': Map({
                    name: 'fez_record_search_key_a.a',
                }),
            }),
            fields: Map({
                rek_title: Map({
                    touched: true,
                    visited: true,
                }),
                fez_record_search_key_a: Map({
                    a: Map({
                        touched: true,
                        visited: true,
                    }),
                }),
            }),
            initial: Map({
                rek_title: 'Initial value',
                currentAuthor: [
                    {
                        nameAsPublished: 'Test user',
                        authorId: 123,
                    },
                ],
            }),
        });

        it('leaves state unchanged if unsupported action is specified', () => {
            const nextState = plugins.resetValue(initialState, { type: 'SOME_OTHER_TYPE' });
            expect(nextState).toEqual(initialState);
        });

        it('leaves state unchanged if field to be unregistered is present in initial initialState', () => {
            const action1 = {
                type: actionTypes.UNREGISTER_FIELD,
                payload: {
                    name: 'currentAuthor.0.nameAsPublished',
                },
            };
            const nextState1 = plugins.resetValue(initialState, action1);
            expect(nextState1).toEqual(initialState);

            const action2 = {
                type: actionTypes.UNREGISTER_FIELD,
                payload: {
                    name: 'rek_title',
                },
            };
            const nextState2 = plugins.resetValue(initialState, action2);
            expect(nextState2).toEqual(initialState);
        });

        it('unregisters valid field', () => {
            const expectedState = Map({
                values: Map({
                    rek_title: 'ABC',
                }),
                registeredFields: Map({
                    rek_title: Map({
                        name: 'rek_title',
                    }),
                }),
                fields: Map({
                    rek_title: Map({
                        touched: true,
                        visited: true,
                    }),
                }),
                initial: Map({
                    rek_title: 'Initial value',
                    currentAuthor: [
                        {
                            authorId: 123,
                            nameAsPublished: 'Test user',
                        },
                    ],
                }),
            });

            const action = {
                type: actionTypes.UNREGISTER_FIELD,
                payload: {
                    name: 'fez_record_search_key_a.a',
                },
            };

            const nextState = plugins.resetValue(initialState, action);

            expect(nextState.get('values').has(action.payload.name.split('.').shift())).toBeFalsy();
            expect(nextState.get('registeredFields').has(action.payload.name)).toBeFalsy();
            expect(nextState.get('fields').has(action.payload.name.split('.').shift())).toBeFalsy();
            expect(nextState).toEqual(expectedState);
        });

        const simpleInitialState = Map({
            values: Map({
                rek_title: 'ABC',
                rek_subtype: 'EFG',
            }),
        });

        it('unsets subtype if display type is updated via code', () => {
            const expectedState = Map({
                values: Map({
                    rek_title: 'ABC',
                }),
            });

            const nextState = plugins.resetValue(simpleInitialState, {
                type: actionTypes.CHANGE,
                meta: {
                    field: 'rek_display_type',
                    touch: false,
                },
            });

            expect(nextState).toEqual(expectedState);
        });

        it('leaves state unchanged if display type is updated by user', () => {
            const nextState = plugins.resetValue(simpleInitialState, {
                type: actionTypes.CHANGE,
                meta: {
                    field: 'rek_display_type',
                    touch: true,
                },
            });
            expect(nextState).toEqual(simpleInitialState);
        });
    });

    describe('adminReduxFormPlugin: ', () => {
        let initialState;
        beforeEach(() => {
            initialState = Map({
                values: Map({
                    rek_display_type: 179,
                    securitySection: Map({
                        dataStreams: List([
                            Map({
                                dsi_dsid: 'test.mp4',
                            }),
                            Map({
                                dsi_dsid: 'testing.jpg',
                            }),
                        ]),
                    }),
                    publication: Map({
                        fez_record_search_key_file_attachment_name: List([
                            Map({
                                rek_file_attachment_name: 'test.mp4',
                                rek_file_attachment_name_order: 1,
                            }),
                            Map({
                                rek_file_attachment_name: 'testing.jpg',
                                rek_file_attachment_name_order: 2,
                            }),
                        ]),
                        fez_record_search_key_file_attachment_access_condition: List([
                            Map({
                                rek_file_attachment_access_condition: '1',
                                rek_file_attachment_access_condition_order: 1,
                            }),
                            Map({
                                rek_file_attachment_access_condition: '1',
                                rek_file_attachment_access_condition_order: 2,
                            }),
                        ]),
                        fez_record_search_key_file_attachment_embargo_date: List([
                            Map({
                                rek_file_attachment_embargo_date: '2020-11-30T00:00:00Z',
                                rek_file_attachment_embargo_date_order: 1,
                            }),
                            Map({
                                rek_file_attachment_embargo_date: '2020-11-30T00:00:00Z',
                                rek_file_attachment_embargo_date_order: 2,
                            }),
                        ]),
                    }),
                    bibliographicSection: Map({
                        issns: List([
                            Map({
                                rek_value: {
                                    key: '1111-1111',
                                    value: {},
                                },
                                rek_order: 1,
                            }),
                        ]),
                    }),
                }),
            });
        });

        it('should remove file provided in action payload from security section datastreams', () => {
            const nextState = plugins.adminReduxFormPlugin(initialState, {
                type: ADMIN_DELETE_ATTACHED_FILE,
                payload: {
                    dsi_dsid: 'test.mp4',
                },
            });

            const dataStreams = nextState
                .get('values')
                .get('securitySection')
                .get('dataStreams')
                .toJS();
            expect(dataStreams.length).toEqual(1);
            expect(
                nextState
                    .get('values')
                    .get('publication')
                    .get('fez_record_search_key_file_attachment_name')
                    .toJS().length,
            ).toEqual(1);

            expect(dataStreams).toEqual([{ dsi_dsid: 'testing.jpg' }]);
        });

        it('should not delete any file if the file provided in action payload is not present in security section', () => {
            const nextState = plugins.adminReduxFormPlugin(initialState, {
                type: ADMIN_DELETE_ATTACHED_FILE,
                payload: {
                    dsi_dsid: 'testing.mp4',
                },
            });

            const dataStreams = nextState
                .get('values')
                .get('securitySection')
                .get('dataStreams')
                .toJS();
            expect(dataStreams.length).toEqual(2);

            expect(dataStreams).toEqual([{ dsi_dsid: 'test.mp4' }, { dsi_dsid: 'testing.jpg' }]);
        });

        it('should rename file provided in action payload', () => {
            const nextState = plugins.adminReduxFormPlugin(initialState, {
                type: ADMIN_RENAME_ATTACHED_FILE,
                payload: {
                    prev: 'testing.mp4',
                    next: 'rename.mp4',
                },
            });

            const attachment = nextState
                .get('values')
                .get('publication')
                .get('fez_record_search_key_file_attachment_name')
                .toJS();
            expect(attachment.length).toEqual(2);
            expect(
                nextState
                    .get('values')
                    .get('publication')
                    .get('fez_record_search_key_file_attachment_name')
                    .get(1)
                    .get('rek_file_attachment_name'),
            ).toEqual('rename.mp4');
        });

        it('should return given state as it is for action not listed in the plugin', () => {
            const nextState = plugins.adminReduxFormPlugin(initialState, {
                type: 'SOME_OTHER_ACTION',
                payload: {
                    dsi_dsid: 'testing.mp4',
                },
            });

            const dataStreams = nextState
                .get('values')
                .get('securitySection')
                .get('dataStreams')
                .toJS();
            expect(dataStreams.length).toEqual(2);

            expect(dataStreams).toEqual([{ dsi_dsid: 'test.mp4' }, { dsi_dsid: 'testing.jpg' }]);
        });

        it('should update issns from the selected journal object in the journal ID field', () => {
            const nextState = plugins.adminReduxFormPlugin(initialState, {
                type: actionTypes.CHANGE,
                meta: {
                    field: 'bibliographicSection.fez_matched_journals',
                    touch: false,
                },
                payload: {
                    value: 'Testing update from form reducer',
                    fez_journal_issn: [
                        {
                            jnl_issn: '2222-2222',
                        },
                        {
                            jnl_issn: '3333-3333',
                        },
                    ],
                },
            });

            expect(
                nextState
                    .get('values')
                    .get('bibliographicSection')
                    .get('fez_record_search_key_journal_name')
                    .get('rek_journal_name'),
            ).toEqual('Testing update from form reducer');

            expect(
                nextState
                    .get('values')
                    .get('bibliographicSection')
                    .get('issns')
                    .toJS(),
            ).toEqual([
                {
                    rek_value: {
                        key: '1111-1111',
                        value: {},
                    },
                    rek_order: 1,
                },
                {
                    rek_value: {
                        key: '2222-2222',
                        value: {
                            sherpaRomeo: { link: false },
                            ulrichs: { link: false, linkText: '' },
                        },
                    },
                },
                {
                    rek_value: {
                        key: '3333-3333',
                        value: {
                            sherpaRomeo: { link: false },
                            ulrichs: { link: false, linkText: '' },
                        },
                    },
                },
            ]);

            const nextStateWithoutUpdate = plugins.adminReduxFormPlugin(initialState, {
                type: actionTypes.CHANGE,
                meta: {
                    field: 'bibliographicSection.fez_record_search_key_journal_name.rek_journal_name',
                    touch: false,
                },
                payload: {
                    value: 'Testing update from form reducer',
                    fez_journal_issn: [
                        {
                            jnl_issn: '2222-2222',
                        },
                        {
                            jnl_issn: '3333-3333',
                        },
                    ],
                },
            });

            expect(
                nextStateWithoutUpdate
                    .get('values')
                    .get('bibliographicSection')
                    .get('issns')
                    .toJS(),
            ).toEqual([
                {
                    rek_value: {
                        key: '1111-1111',
                        value: {},
                    },
                    rek_order: 1,
                },
            ]);
        });

        it('should leave state unchanged if fez_matched_journals is set to empty', () => {
            const nextState = plugins.adminReduxFormPlugin(initialState, {
                type: actionTypes.CHANGE,
                meta: {
                    field: 'bibliographicSection.fez_matched_journals',
                    touch: false,
                },
                payload: null,
            });
            expect(nextState).toEqual(initialState);
        });
    });
});
