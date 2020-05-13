import * as plugins from './formReducerPlugins';
import { actionTypes } from 'redux-form';
import { Map, List } from 'immutable';
import { ADMIN_DELETE_ATTACHED_FILE } from 'actions/actionTypes';

describe('Form reducer plugin', () => {
    describe('resetValue: ', () => {
        it('returns null if state is falsy', () => {
            const falsies = [false, null, undefined, ''];
            falsies.forEach(falsy => {
                const nextState = plugins.resetValue(falsy, {
                    type: actionTypes.UNREGISTER_FIELD,
                    payload: {
                        name: '',
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

    describe('deleteFileFromSecuritySection: ', () => {
        let initialState;
        beforeEach(() => {
            initialState = Map({
                values: Map({
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
                }),
            });
        });

        it('should remove file provided in action payload from security section datastreams', () => {
            const nextState = plugins.deleteFileFromSecuritySection(initialState, {
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

            expect(dataStreams).toEqual([{ dsi_dsid: 'testing.jpg' }]);
        });

        it('should not delete any file if the file provided in action payload is not present in security section', () => {
            const nextState = plugins.deleteFileFromSecuritySection(initialState, {
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

        it('should return given state as it is for action not listed in the plugin', () => {
            const nextState = plugins.deleteFileFromSecuritySection(initialState, {
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
    });
});
