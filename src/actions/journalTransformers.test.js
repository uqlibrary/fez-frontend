import * as transformers from './journalTransformers';
import * as actions from './actionTypes';
import * as repositories from 'repositories';
import * as journalActions from './journals';

import { journalDoaj } from 'mock/data';
import moment from 'moment/moment';

describe('transformers', () => {
    beforeEach(() => {
        mockActionsStore = setupStoreForActions();
        mockApi = setupMockAdapter();
    });

    afterEach(() => {
        mockApi.reset();
    });
    describe('getBibliographicSectionSearchKeys', () => {
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
    });

    describe('getAdminSectionSearchKeys', () => {
        it('should get correct object', () => {
            expect(transformers.getAdminSectionSearchKeys()).toEqual({
                jnl_advisory_statement: null,
                jnl_advisory_statement_type: null,
            });
        });

        it('should transform all search keys for admin section', () => {
            const data = {
                advisoryStatement: {
                    text: {
                        htmlText: 'test advisory statement',
                    },
                },
                other_key: {
                    test: 'test',
                },
            };

            expect(transformers.getAdminSectionSearchKeys(data)).toEqual({
                jnl_advisory_statement: 'test advisory statement',
                jnl_advisory_statement_type: null,
                other_key: {
                    test: 'test',
                },
            });
        });

        it('should transform plainText advisory statement admin section', () => {
            const data = {
                advisoryStatement: {
                    text: {
                        plainText: 'test advisory statement',
                    },
                    type: 1234,
                },
            };

            expect(transformers.getAdminSectionSearchKeys(data)).toEqual({
                jnl_advisory_statement: 'test advisory statement',
                jnl_advisory_statement_type: 1234,
            });
        });

        it('should handle no advisoryStatement value for admin section', () => {
            const data = {
                advisoryStatement: {},
            };

            expect(transformers.getAdminSectionSearchKeys(data)).toEqual({
                jnl_advisory_statement: null,
                jnl_advisory_statement_type: null,
            });

            expect(transformers.getAdminSectionSearchKeys({ advisoryStatement: { text: 'test' } })).toEqual({
                jnl_advisory_statement: null,
                jnl_advisory_statement_type: null,
            });

            expect(transformers.getAdminSectionSearchKeys({ advisoryStatement: { text: null, type: 1234 } })).toEqual({
                jnl_advisory_statement: null,
                jnl_advisory_statement_type: null,
            });
        });

        it('should not transform unused search keys for admin section', () => {
            const data = {
                collections: [],
                contentIndicators: [],
            };

            expect(transformers.getAdminSectionSearchKeys(data)).toEqual({
                jnl_advisory_statement: null,
                jnl_advisory_statement_type: null,
                collections: [],
                contentIndicators: [],
            });
        });
    });

    describe('getReadAndPublishSectionSearchKeys', () => {
        it('should get all read and publish section search keys', () => {
            const issn = '1111-1111';
            const data = {
                journal: { fez_journal_read_and_publish: null },
                adminSection: { jnl_title: 'Journal' },
                bibliographicSection: { issns: [{ rek_value: { key: issn }, rek_order: 1 }] },
                readAndPublishSection: {
                    capped: 'Approaching',
                    discounted: true,
                    readAndPublishLastUpdated: '2023-07-19',
                    readAndPublishPublisher: 'Publisher',
                    s2o: undefined,
                },
            };

            expect(transformers.getReadAndPublishSectionSearchKeys(data)).toEqual({
                fez_journal_read_and_publish: {
                    jnl_read_and_publish_issn: issn,
                    jnl_read_and_publish_title: 'Journal',
                    jnl_read_and_publish_publisher: 'Publisher',
                    jnl_read_and_publish_is_capped: 'Approaching',
                    jnl_read_and_publish_is_discounted: true,
                    jnl_read_and_publish_is_s2o: null,
                    jnl_read_and_publish_source_date: moment().format('YYYY-MM-DD'),
                },
            });
        });

        it('should not update read and publish source date', () => {
            const issn = '1111-1111';
            const readAndPublish = {
                fez_journal_read_and_publish: {
                    jnl_read_and_publish_issn: issn,
                    jnl_read_and_publish_title: 'Journal',
                    jnl_read_and_publish_publisher: 'Publisher',
                    jnl_read_and_publish_is_capped: 'Approaching',
                    jnl_read_and_publish_is_discounted: true,
                    jnl_read_and_publish_is_s2o: 'N',
                    jnl_read_and_publish_source_date: '2020-01-01',
                },
            };
            const data = {
                journal: {
                    fez_journal_read_and_publish: { ...readAndPublish.fez_journal_read_and_publish },
                },
                adminSection: { jnl_title: 'Journal' },
                bibliographicSection: { issns: [{ rek_value: { key: issn }, rek_order: 1 }] },
                readAndPublishSection: {
                    capped: 'Approaching',
                    discounted: true,
                    readAndPublishLastUpdated: '2020-01-01',
                    readAndPublishPublisher: 'Publisher',
                    s2o: 'N',
                },
            };

            expect(transformers.getReadAndPublishSectionSearchKeys(data)).toEqual(readAndPublish);
        });

        it('should not update read and publish issn', () => {
            const issn = '1111-1111';
            const readAndPublish = {
                fez_journal_read_and_publish: {
                    jnl_read_and_publish_issn: issn,
                    jnl_read_and_publish_title: 'Journal',
                    jnl_read_and_publish_publisher: 'Publisher',
                    jnl_read_and_publish_is_capped: 'Approaching',
                    jnl_read_and_publish_is_discounted: true,
                    jnl_read_and_publish_is_s2o: 'N',
                    jnl_read_and_publish_source_date: '2020-01-01',
                },
            };
            const data = {
                journal: {
                    fez_journal_read_and_publish: { ...readAndPublish.fez_journal_read_and_publish },
                },
                adminSection: { jnl_title: 'Journal', jnl_publisher: 'Journal Publisher' },
                bibliographicSection: { issns: [{ rek_value: { key: issn }, rek_order: 1 }] },
                readAndPublishSection: {
                    capped: 'Y',
                    discounted: false,
                    readAndPublishLastUpdated: '2020-01-01',
                    readAndPublishPublisher: '',
                    s2o: 'S2O',
                },
            };

            expect(transformers.getReadAndPublishSectionSearchKeys(data)).toEqual({
                fez_journal_read_and_publish: {
                    jnl_read_and_publish_issn: issn,
                    jnl_read_and_publish_title: 'Journal',
                    jnl_read_and_publish_publisher: 'Journal Publisher',
                    jnl_read_and_publish_is_capped: 'Y',
                    jnl_read_and_publish_is_discounted: false,
                    jnl_read_and_publish_is_s2o: 'S2O',
                    jnl_read_and_publish_source_date: moment().format('YYYY-MM-DD'),
                },
            });
        });

        it('should handle no data for bibliographic section search keys', () => {
            expect(transformers.getReadAndPublishSectionSearchKeys()).toEqual({ fez_journal_read_and_publish: null });

            // no issn
            expect(
                transformers.getReadAndPublishSectionSearchKeys({
                    bibliographicSection: {},
                    readAndPublishSection: {
                        capped: 'Approaching',
                        discounted: true,
                        readAndPublishLastUpdated: '2023-07-19',
                        readAndPublishPublisher: 'Publisher',
                        s2o: 'S2O',
                    },
                }),
            ).toEqual({ fez_journal_read_and_publish: null });

            // no read and publish data
            expect(
                transformers.getReadAndPublishSectionSearchKeys({
                    bibliographicSection: { issns: [{ rek_value: '1111-1111', rek_order: 1 }] },
                    readAndPublishSection: {
                        capped: undefined,
                        discounted: undefined,
                        readAndPublishLastUpdated: undefined,
                        readAndPublishPublisher: '',
                        s2o: undefined,
                    },
                }),
            ).toEqual({ fez_journal_read_and_publish: null });
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
    describe('adminUnlockJournal()', () => {
        it('dispatches expected actions', async () => {
            const expectedActions = [actions.ADMIN_JOURNAL_UNLOCK];

            await mockActionsStore.dispatch(journalActions.adminUnlockJournal());
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });
    });
});
