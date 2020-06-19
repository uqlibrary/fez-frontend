import { Map } from 'immutable';
import { SubmissionError } from 'redux-form';
import { onSubmit } from './Doi';

jest.mock('actions', () => ({
    updateDoi: () => Promise.reject(),
}));

describe('Doi container', () => {
    it('should throw SubmissionError on submission failure', async () => {
        const testValue = new Map({});
        const dispatch = jest.fn(promise => promise);
        const props = {};

        await expect(onSubmit(testValue, dispatch, props)).rejects.toThrow(new SubmissionError());
    });
});
