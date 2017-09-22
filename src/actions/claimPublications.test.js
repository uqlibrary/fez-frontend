import * as claim  from './claimPublications';
import * as actions from './actionTypes';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

jest.mock('repositories');
import * as repositories from 'repositories';


const mockResponse = (status, statusText, response) => {
    return new window.Response(response, {
        status: status,
        statusText: statusText,
        headers: {
            'Content-type': 'application/json'
        }
    });
};
const getMockStore = () => {
    const middlewares = [ thunk ];
    const mockStore = configureStore(middlewares);
    return mockStore({});
};

describe('Claim publication actions tests ', () => {
    it('setClaimPublication dispatches action with a record object', () => {
        const input = {rek_pid: 'PID:11111'};
        const expectedOutput = {type: actions.PUBLICATION_TO_CLAIM_SET, payload: {...input}};
        const store = getMockStore();
        store.dispatch(claim.setClaimPublication(input));
        const expectedActions = store.getActions();
        expect(expectedActions.length).toBe(1);
        expect(expectedActions).toContainEqual(expectedOutput);
    });

    it('clearClaimPublication dispatches action to clear object', () => {
        const expectedOutput = {type: actions.PUBLICATION_TO_CLAIM_CLEAR};
        const store = getMockStore();
        store.dispatch(claim.clearClaimPublication());
        const expectedActions = store.getActions();
        expect(expectedActions.length).toBe(1);
        expect(expectedActions).toContainEqual(expectedOutput);
    });

    it('countPossiblyYourPublications successful call', async () => {
        const input = 'authorId';
        const response =  {
            "data": {
            "most_likely_match_count": 5,
                "automatically_match_count": 0,
                "new_match_count": 0
            }
        };

        const expectedOutput = [
            {type: actions.COUNT_POSSIBLY_YOUR_PUBLICATIONS_LOADING},
            {type: actions.COUNT_POSSIBLY_YOUR_PUBLICATIONS_COMPLETED, payload: response.data}
            ];

        repositories.getCountPossibleUnclaimedPublications = jest.fn((input) => {
            return Promise.resolve(response);
        });

        const middlewares = [ thunk ];
        const mockStore = configureStore(middlewares);
        const store = mockStore({});

        await store.dispatch(claim.countPossiblyYourPublications(input));
        const expectedActions = store.getActions();
        expect(expectedActions.length).toBe(2);
        expect(expectedActions).toEqual(expectedOutput);
    });

    it('countPossiblyYourPublications failed call', async () => {
        const input = 'authorId';

        const expectedOutput = [
            {type: actions.COUNT_POSSIBLY_YOUR_PUBLICATIONS_LOADING},
            {type: actions.COUNT_POSSIBLY_YOUR_PUBLICATIONS_FAILED, payload: 'Request failed'}
        ];

        repositories.getCountPossibleUnclaimedPublications = jest.fn((input) => {
            return Promise.reject('Request failed');
        });

        const middlewares = [ thunk ];
        const mockStore = configureStore(middlewares);
        const store = mockStore({});

        await store.dispatch(claim.countPossiblyYourPublications(input));
        const expectedActions = store.getActions();
        expect(expectedActions.length).toBe(2);
        expect(expectedActions).toEqual(expectedOutput);
    });

    it('claimPublication from internal repository', async () => {
        const input = {
            publication: {},
            files: { queue: [] },
            author: { aut_id: 1000 },
            authorLinking: { authors: [] }
        };

        const expectedOutput = [
            {"type": "CLAIM_PUBLICATION_CREATE_PROCESSING"},
            {"payload": undefined, "type": "CLAIM_PUBLICATION_CREATE_COMPLETED"}];

        repositories.postRecord = jest.fn(data => {
            const response  = { data: {...data}};
            response.data.rek_pid = 'PID:10000';
            return Promise.resolve(response);
        });

        // TODO: mock these functions
        // postClaimPossiblePublication
        // putUploadFiles
        // patchRecord

        const middlewares = [ thunk ];
        const mockStore = configureStore(middlewares);
        const store = mockStore({});

        await store.dispatch(claim.claimPublication(input));
        const expectedActions = store.getActions();
        expect(expectedActions.length).toBe(2);
        expect(expectedActions).toEqual(expectedOutput);
    });

});