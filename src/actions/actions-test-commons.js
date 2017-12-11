import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

export const getMockStore = () => {
    const middlewares = [thunk];
    const mockStore = configureMockStore(middlewares);
    return mockStore({});
};

export const expectStoreHasExpectedActions = (store, expectedActions) => {
    expect(store.getActions().map(action => ({type: action.type}))).toEqual(expectedActions);
    expect(store.getActions().length).toEqual(expectedActions.length);
};
