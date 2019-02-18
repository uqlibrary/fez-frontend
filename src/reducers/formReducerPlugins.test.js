import * as plugins from './formReducerPlugins';
import {actionTypes} from 'redux-form';
import {Map} from 'immutable';

describe('Form reducer plugin', () => {
    const initialState = Map({
        values: Map({
            'rek_title': 'ABC',
            'fez_record_search_key_a': Map({
                'a': 'some value'
            })
        }),
        registeredFields: Map({
            'rek_title': Map({
                name: 'rek_title'
            }),
            'fez_record_search_key_a.a': Map({
                name: 'fez_record_search_key_a.a'
            })
        }),
        fields: Map({
            rek_title: Map({
                touched: true,
                visited: true
            }),
            fez_record_search_key_a: Map({
                a: Map({
                    touched: true,
                    visited: true
                })
            })
        }),
        initial: Map({
            rek_title: 'Initial value',
            currentAuthor: [
                {
                    nameAsPublished: 'Test user',
                    authorId: 123
                }
            ]
        })
    });

    it('leaves initialState unchanged if unsupported action is specified', () => {
        const nextState = plugins.resetValue(initialState, {type: 'SOME_OTHER_TYPE'});
        expect(nextState).toEqual(initialState);
    });

    it('leaves initialState unchanged if field to be unregistered is present in initial initialState', () => {
        const action1 = {
            type: actionTypes.UNREGISTER_FIELD,
            payload: {
                name: 'currentAuthor.0.nameAsPublished'
            }
        };
        const nextState1 = plugins.resetValue(initialState, action1);
        expect(nextState1).toEqual(initialState);

        const action2 = {
            type: actionTypes.UNREGISTER_FIELD,
            payload: {
                name: 'rek_title'
            }
        };
        const nextState2 = plugins.resetValue(initialState, action2);
        expect(nextState2).toEqual(initialState);
    });

    it('unregisters valid field', () =>  {

        const expectedState = Map({
            "values": Map({
                "rek_title": "ABC"
            }),
            "registeredFields": Map({
                "rek_title": Map({
                    "name": "rek_title"
                })
            }),
            "fields": Map({
                "rek_title": Map({
                    "touched": true,
                    "visited": true
                })
            }),
            "initial": Map({
                "rek_title": "Initial value",
                "currentAuthor": [{
                    "authorId": 123, 
                    "nameAsPublished": "Test user"
                }]
            })
        });
        
        const action = {
            type: actionTypes.UNREGISTER_FIELD,
            payload: {
                name: 'fez_record_search_key_a.a'
            }
        };

        const nextState = plugins.resetValue(initialState, action);

        expect(nextState.get('values').has(action.payload.name.split('.').shift())).toBeFalsy();
        expect(nextState.get('registeredFields').has(action.payload.name)).toBeFalsy();
        expect(nextState.get('fields').has(action.payload.name.split('.').shift())).toBeFalsy();
        expect(nextState).toEqual(expectedState);
    });
});
