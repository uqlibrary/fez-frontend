import { useJournal } from './hooks';
import { renderHook } from 'test-utils';

import { journalDoaj as mockJournal } from '../../mock/data';

const mockSelector = jest.fn(() => {
    return {
        journalToView: { ...mockJournal.data },
        isJournalLocked: false,
        loadingJournalToView: false,
        journalToViewError: null,
        journalLoadingError: null,
        error: null,
        authorDetails: { aut_id: 1 },
        author: { name: 'Test author' },
    };
});

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(() => mockSelector()),
}));

describe('hooks', () => {
    it('useJournal', () => {
        const { result, rerender } = renderHook(useJournal);
        expect(result.current).toStrictEqual(
            expect.objectContaining({
                journalToViewLoading: false,
                authorDetails: { aut_id: 1 },
                author: { name: 'Test author' },
                journalToView: expect.objectContaining({
                    jnl_jid: 12,
                }),
                initialValues: expect.objectContaining({
                    id: 12,
                    adminSection: expect.objectContaining({ jnl_title: 'Advanced Nonlinear Studies' }),
                    bibliographicSection: expect.objectContaining({ issns: expect.any(Array) }),
                    readAndPublishSection: expect.objectContaining({ readAndPublishPublisher: 'De Gruyter' }),
                    uqDataSection: expect.objectContaining({ authors: { count: 0, id: 12 } }),
                    doajSection: expect.objectContaining({ jnl_doaj_title: 'Advanced Nonlinear Studies' }),
                    indexedSection: expect.objectContaining({ scopus: true, pubmed: false }),
                }),
                locked: false,
            }),
        );

        rerender({ error: 'Test error' });
        // should fire 4 times in total - 2 selector calls first, then
        // another 2 when the rerender is called.
        expect(mockSelector).toHaveBeenCalledTimes(4);
    });
});
