import saveReducerOnSessionExpired from './saveReducerOnSessionExpired';
import {
    CURRENT_ACCOUNT_SESSION_EXPIRED
} from 'actions/actionTypes';
import Immutable from 'immutable';

describe('middleware saveReducerOnSessionExpired', () => {
    it('should save given reducer (form) in action payload to a local storage', () => {
        const action = {
            type: CURRENT_ACCOUNT_SESSION_EXPIRED,
            payload: 'form'
        };

        const next = jest.fn();

        const formData = Immutable.Map({
            ThesisSubmission: {
                values: {
                    currentAuthor: [{
                        nameAsPublished: 'HDR Student, N',
                        authorId: 44444
                    }],
                    fez_record_search_key_ismemberof: [{
                        rek_ismemberof: 'UQ:152694'
                    }],
                    supervisors: [{
                        nameAsPublished: 'test',
                        disabled: false
                    }],
                    fieldOfResearch: [{
                        rek_value: {
                            key: 451814,
                            value: '0102 Applied Mathematics'
                        },
                        rek_order: 1
                    }],
                    thesisTitle: {
                        htmlText: '<p>test</p>',
                        plainText: 'test'
                    },
                    thesisAbstract: {
                        htmlText: '<p>test</p>',
                        plainText: 'test'
                    },
                    fez_record_search_key_org_name: {
                        rek_org_name: 'The University of Queensland'
                    },
                    rek_object_type: 3,
                    rek_date: '2018-7-11',
                    fez_record_search_key_keywords: [{
                        rek_keywords: 'test',
                        rek_keywords_order: 1
                    }],
                    files: {
                        queue: [],
                        isValid: true
                    },
                    rek_status: 2,
                    fileAccessId: 3,
                    rek_genre_type: 'PhD Thesis',
                    rek_display_type: 187,
                    fez_record_search_key_org_unit_name: {
                        rek_org_unit_name: 'School of Economics'
                    }
                },
                initial: {
                    rek_date: '2018-7-11',
                    currentAuthor: [{
                        nameAsPublished: 'HDR Student, N',
                        authorId: 44444
                    }],
                    fez_record_search_key_org_name: {
                        rek_org_name: 'The University of Queensland'
                    },
                    rek_object_type: 3,
                    rek_status: 2,
                    fez_record_search_key_ismemberof: [{
                        rek_ismemberof: 'UQ:152694'
                    }],
                    rek_display_type: 187,
                    fileAccessId: 3
                },
                registeredFields: {
                    'currentAuthor.0.nameAsPublished': {
                        name: 'currentAuthor.0.nameAsPublished',
                        type: 'Field',
                        count: 1
                    },
                    supervisors: {
                        name: 'supervisors',
                        type: 'Field',
                        count: 1
                    },
                    fieldOfResearch: {
                        name: 'fieldOfResearch',
                        type: 'Field',
                        count: 1
                    },
                    thesisTitle: {
                        name: 'thesisTitle',
                        type: 'Field',
                        count: 1
                    },
                    thesisAbstract: {
                        name: 'thesisAbstract',
                        type: 'Field',
                        count: 1
                    },
                    'fez_record_search_key_org_unit_name.rek_org_unit_name': {
                        name: 'fez_record_search_key_org_unit_name.rek_org_unit_name',
                        type: 'Field',
                        count: 1
                    },
                    fez_record_search_key_keywords: {
                        name: 'fez_record_search_key_keywords',
                        type: 'Field',
                        count: 1
                    },
                    files: {
                        name: 'files',
                        type: 'Field',
                        count: 1
                    },
                    rek_genre_type: {
                        name: 'rek_genre_type',
                        type: 'Field',
                        count: 1
                    }
                },
                syncErrors: {
                    files: 'Add at least one file to upload'
                }
            }
        });

        const store = {
            getState: () => ({
                get: () => formData
            })
        };

        const expectedValueInLocalStorage = JSON.stringify(Array.from(formData));

        saveReducerOnSessionExpired(store)(next)(action);
        expect(localStorage.setItem).toHaveBeenLastCalledWith('form', expectedValueInLocalStorage);
    });

    it('should save give reducer in action payload to a local storage', () => {
        const action = {
            type: CURRENT_ACCOUNT_SESSION_EXPIRED,
            payload: 'someReducer'
        };

        const next = jest.fn();

        const someReducerData = Immutable.Map({
            examples: [
                'test',
                'session',
                'expired',
                'middleware'
            ]
        });

        const store = {
            getState: () => ({
                get: () => someReducerData
            })
        };

        const expectedValueInLocalStorage = JSON.stringify(Array.from(someReducerData));

        saveReducerOnSessionExpired(store)(next)(action);
        expect(localStorage.setItem).toHaveBeenLastCalledWith('someReducer', expectedValueInLocalStorage);
    });
});