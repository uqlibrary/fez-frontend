export const initialState = {
};

const handlers = {
};

export default function DigiTeamBatchImportReducer(state = initialState, action) {
    const handler = handlers[action.type];
    /* istanbul ignore else */
    if (!handler) {
        return state;
    }
    /* istanbul ignore next */
    return handler(state, action);
}
