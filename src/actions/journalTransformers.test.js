import * as transformers from './journalTransformers';
import * as actions from './actionTypes';
import * as repositories from 'repositories';
import * as journalActions from './journals';

import { journalDoaj } from 'mock/data';

describe('transformers', () => {
    beforeEach(() => {
        mockActionsStore = setupStoreForActions();
        mockApi = setupMockAdapter();
    });

    afterEach(() => {
        mockApi.reset();
    });
    it('should get all bibliographic section search keys', () => {
        const data = {
            issns: [
                { rek_value: '1212-1212', rek_order: 1 },
                { rek_value: '2323-2323', rek_order: 2 },
            ],
        };

        expect(transformers.getBibliographicSectionSearchKeys(data)).toEqual({
            fez_journal_issn: [
                {
                    jnl_issn: '1212-1212',
                    jnl_issn_order: 1,
                },
                {
                    jnl_issn: '2323-2323',
                    jnl_issn_order: 2,
                },
            ],
        });
    });
    it('should handle no data for bibliographic section search keys', () => {
        expect(transformers.getBibliographicSectionSearchKeys()).toEqual({});
    });

    describe('getAdminSectionSearchKeys', () => {
        it('should get correct object', () => {
            expect(transformers.getAdminSectionSearchKeys()).toEqual({ jnl_advisory_statement: null });
        });

        it('should transform all search keys for admin section', () => {
            const data = {
                advisoryStatement: {
                    htmlText: 'test advisory statement',
                },
                other_key: {
                    test: 'test',
                },
            };

            expect(transformers.getAdminSectionSearchKeys(data)).toEqual({
                jnl_advisory_statement: 'test advisory statement',
                other_key: {
                    test: 'test',
                },
            });
        });

        it('should transform plainText advisory statement admin section', () => {
            const data = {
                advisoryStatement: {
                    plainText: 'test advisory statement',
                },
            };

            expect(transformers.getAdminSectionSearchKeys(data)).toEqual({
                jnl_advisory_statement: 'test advisory statement',
            });
        });

        it('should handle no advisoryStatement value for admin section', () => {
            const data = {
                advisoryStatement: {},
            };

            expect(transformers.getAdminSectionSearchKeys(data)).toEqual({
                jnl_advisory_statement: null,
            });

            expect(transformers.getAdminSectionSearchKeys({ advisoryStatement: 'test' })).toEqual({
                jnl_advisory_statement: null,
            });

            expect(transformers.getAdminSectionSearchKeys({ advisoryStatement: null })).toEqual({
                jnl_advisory_statement: null,
            });
        });

        it('should not transform unused search keys for admin section', () => {
            const data = {
                collections: [],
                contentIndicators: [],
            };

            expect(transformers.getAdminSectionSearchKeys(data)).toEqual({
                jnl_advisory_statement: null,
                collections: [],
                contentIndicators: [],
            });
        });
    });

    describe('adminJournalUpdate()', () => {
        const testInput = {
            id: 12,
        };
        it('dispatches expected actions on successful update', async () => {
            const url = repositories.routes.JOURNAL_API(testInput).apiUrl;

            mockApi.onPut(url).reply(200, { data: journalDoaj });

            const expectedActions = [actions.ADMIN_UPDATE_JOURNAL_PROCESSING, actions.ADMIN_UPDATE_JOURNAL_SUCCESS];

            await mockActionsStore.dispatch(
                journalActions.adminJournalUpdate({
                    jnl_jid: 12,
                }),
            );
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('dispatches expected actions on missing data in response', async () => {
            const url = repositories.routes.JOURNAL_API(testInput).apiUrl;
            mockApi.onPut(url).reply(200, {});

            const expectedActions = [actions.ADMIN_UPDATE_JOURNAL_PROCESSING, actions.ADMIN_UPDATE_JOURNAL_SUCCESS];

            await mockActionsStore.dispatch(journalActions.adminJournalUpdate({ jnl_jid: 12 }));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('dispatches expected actions on network failure', async () => {
            mockApi.onAny().reply(500);

            const expectedActions = [
                actions.ADMIN_UPDATE_JOURNAL_PROCESSING,
                actions.APP_ALERT_SHOW,
                actions.ADMIN_UPDATE_JOURNAL_FAILED,
            ];

            let requestFailed = false;
            try {
                await mockActionsStore.dispatch(
                    journalActions.adminJournalUpdate({
                        jnl_jid: 12,
                    }),
                );
            } catch (exception) {
                expect(exception.status).toBe(500);
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
                requestFailed = true;
            }
            expect(requestFailed).toBe(true);
        });
    });
    describe('adminJournalClear()', () => {
        it('dispatches expected actions', async () => {
            const expectedActions = [actions.ADMIN_JOURNAL_CLEAR];

            await mockActionsStore.dispatch(journalActions.adminJournalClear());
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });
    });
});
