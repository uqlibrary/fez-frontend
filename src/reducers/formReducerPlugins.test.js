import * as plugins from './formReducerPlugins';
import {actionTypes} from 'redux-form';
import {Map} from 'immutable';

describe('Form reducer plugin', () => {
    it('resetValue should reset field value', () => {
        const state = Map({
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

        let nextState = plugins.resetValue(state, {type: 'SOME_OTHER_TYPE'});
        expect(nextState).toEqual(state);

        let action = {
            type: actionTypes.UNREGISTER_FIELD,
            payload: {
                name: 'currentAuthor.0.nameAsPublished'
            }
        };
        nextState = plugins.resetValue(nextState, action);
        expect(nextState).toEqual(state);

        action = {
            type: actionTypes.UNREGISTER_FIELD,
            payload: {
                name: 'rek_title'
            }
        };
        nextState = plugins.resetValue(nextState, action);
        expect(nextState).toEqual(state);

        action = {
            type: actionTypes.UNREGISTER_FIELD,
            payload: {
                name: 'fez_record_search_key_a.a'
            }
        };
        nextState = plugins.resetValue(nextState, action);

        expect(nextState.get('values').has(action.payload.name.split('.').shift())).toBeFalsy();
        expect(nextState.get('registeredFields').has(action.payload.name)).toBeFalsy();
        expect(nextState.get('fields').has(action.payload.name.split('.').shift())).toBeFalsy();
    });
});
