import { onSubmit } from './Doi';
import * as actions from 'actions';

jest.mock('actions', () => ({
    ...jest.requireActual('actions'),
    updateDoi: jest.fn(() => Promise.resolve({})),
}));

describe('Doi containers', () => {
    it('should call action on submit', async () => {
        const record = {
            rek_pid: 'UQ:123456',
            fez_record_search_key_doi: {
                rek_doi: 'testing',
            },
        };
        const dispatch = jest.fn(() => Promise.resolve({}));
        await onSubmit(record, dispatch);
        const updatedRecord = {
            ...record,
            _source: 'doi_preview',
        };
        expect(actions.updateDoi).toHaveBeenCalledWith(updatedRecord);
    });

    it('should log error on submission failure', async () => {
        const record = {
            rek_pid: 'UQ:123456',
        };
        const failureMessage = 'Error: DOI update failed';
        const dispatch = jest.fn(() => Promise.reject(failureMessage));
        const test = jest.spyOn(console, 'log').mockImplementation(() => {});

        await onSubmit(record, dispatch);
        expect(test).toHaveBeenCalledWith(failureMessage);
    });
});
