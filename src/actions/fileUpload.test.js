import * as actions from './actionTypes';
import { markCompletedUpload } from './fileUpload';

describe('File Upload actions creators', () => {
    beforeEach(() => {
        mockActionsStore = setupStoreForActions();
    });

    it('should dispatch expected actions', () => {
        const expectedActions = [`${actions.FILE_UPLOAD_COMPLETE}@test.txt`];
        mockActionsStore.dispatch(markCompletedUpload('form', 'test.txt'));
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });
});
