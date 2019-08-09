import saveReducerOnSessionExpired from './saveReducerOnSessionExpired';
import { CURRENT_ACCOUNT_SESSION_EXPIRED } from 'actions/actionTypes';
import Immutable from 'immutable';
import { thesisFormData } from 'mock/data/testing/localStorageData';

describe('middleware saveReducerOnSessionExpired', () => {
    it('should save given reducer (form) in action payload to a local storage', () => {
        const action = {
            type: CURRENT_ACCOUNT_SESSION_EXPIRED,
            payload: 'form',
        };

        const next = jest.fn();

        const formData = Immutable.Map(thesisFormData);

        const store = {
            getState: () => ({
                get: () => formData,
            }),
        };

        const expectedValueInLocalStorage = JSON.stringify(Array.from(formData));

        saveReducerOnSessionExpired(store)(next)(action);
        expect(localStorage.setItem).toHaveBeenLastCalledWith('form', expectedValueInLocalStorage);

        const nullAction = {};
        saveReducerOnSessionExpired(store)(next)(nullAction);
        expect(next).toBeCalledWith(nullAction);
    });

    it('should save give reducer in action payload to a local storage', () => {
        const action = {
            type: CURRENT_ACCOUNT_SESSION_EXPIRED,
            payload: 'someReducer',
        };

        const next = jest.fn();

        const someReducerData = Immutable.Map({
            examples: ['test', 'session', 'expired', 'middleware'],
        });

        const store = {
            getState: () => ({
                get: () => someReducerData,
            }),
        };

        const expectedValueInLocalStorage = JSON.stringify(Array.from(someReducerData));

        saveReducerOnSessionExpired(store)(next)(action);
        expect(localStorage.setItem).toHaveBeenLastCalledWith('someReducer', expectedValueInLocalStorage);
    });
});
