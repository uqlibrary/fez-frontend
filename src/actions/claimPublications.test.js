import * as claim  from './claimPublications';
import * as actions from './actionTypes';

describe('Claim publication actions tests ', () => {
    it('setClaimPublication dispatches action with a record object', () => {
        const input = {rek_pid: 'PID:11111'};
        const expectedOutput = {type: actions.PUBLICATION_TO_CLAIM_SET, payload: {...input}};
        const store = setupStoreForActions();
        store.dispatch(claim.setClaimPublication(input));
        const expectedActions = store.getActions();
        expect(expectedActions.length).toBe(1);
        expect(expectedActions).toContainEqual(expectedOutput);
    });

    it('clearClaimPublication dispatches action to clear object', () => {
        const expectedOutput = {type: actions.PUBLICATION_TO_CLAIM_CLEAR};
        const store = setupStoreForActions();
        store.dispatch(claim.clearClaimPublication());
        const expectedActions = store.getActions();
        expect(expectedActions.length).toBe(1);
        expect(expectedActions).toContainEqual(expectedOutput);
    });
});