import helpDrawerReducer from './reducer';
import { HIDE, SHOW } from './actions';
import Immutable from 'immutable';

describe('HelpDrawer reducer tests ', () => {
    it('it should update state when drawer is open', () => {
        const initialState = Immutable.fromJS({
            open: false,
            title: '',
            text: '',
            buttonLabel: 'OK',
        });

        const newState = helpDrawerReducer(initialState, { type: SHOW, payload: initialState });
        expect(newState.get('open')).toEqual(true);
    });

    it('it should update state when drawer is closed', () => {
        const initialState = Immutable.fromJS({
            open: true,
            title: '',
            text: '',
            buttonLabel: 'OK',
        });

        const newState = helpDrawerReducer(initialState, { type: HIDE, payload: initialState });
        expect(newState.get('open')).toEqual(false);
    });
});
