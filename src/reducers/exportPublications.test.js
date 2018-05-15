import * as actions from '../actions/actionTypes';
import exportPublicationsReducer from './exportPublications';
import {formatToFileInfoMap} from "../actions/publicationDataTransformers";

export const initialState = {
    exportingPublications: false,
    exportPublicationsFormat: null,
};

describe('export publications reducer', () => {
    it('returns the correct state while publications are being exported', () => {
        const test = exportPublicationsReducer(initialState, {type: actions.EXPORT_PUBLICATIONS_LOADING});
        expect(test.exportingPublications).toEqual(true);
    });

    it('returns the correct state when publications have been exported', () => {
        const format = Object.keys(formatToFileInfoMap)[0];
        const test = exportPublicationsReducer(initialState, {
            type: actions.EXPORT_PUBLICATIONS_LOADED,
            payload: format
        });

        expect(test.exportingPublications).toEqual(false);
        expect(test.exportPublicationsFormat).toEqual(format);
    });

    it('returns the correct state when exporting publications fails to load data', () => {
        const test = exportPublicationsReducer(initialState, {type: actions.EXPORT_PUBLICATIONS_FAILED});
        expect(test.exportingPublications).toEqual(false);
    });
});

describe('General export publications reducer', () => {
    it('returns the state when an invalid action type is supplied', () => {
        const test = exportPublicationsReducer(initialState, {type: 'INVALID_ACTION_TYPE'});
        expect(test).toEqual(initialState);
    });
});
