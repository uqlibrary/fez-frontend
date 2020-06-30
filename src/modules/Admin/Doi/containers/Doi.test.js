import { Map } from 'immutable';
import { SubmissionError } from 'redux-form';
import { onSubmit } from './Doi';
import Immutable from 'immutable';

jest.mock('actions', () => ({
    updateDoi: () => Promise.reject(),
}));

describe('Doi container', () => {
    it('should throw SubmissionError on submission failure', async () => {
        const testValue = new Map({});
        const dispatch = jest.fn(promise => promise);
        const props = {
            initialValues: Immutable.Map({
                record: {
                    rek_pid: 'UQ:123456',
                },
            }),
        };

        await expect(onSubmit(testValue, dispatch, props)).rejects.toThrow(new SubmissionError());
    });
});
